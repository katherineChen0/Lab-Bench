from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
import pandas as pd
import json
from pathlib import Path
import uuid
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# In-memory storage for demo (replace with database in production)
DATASETS = {}

class Dataset(BaseModel):
    id: str
    name: str
    file_path: str
    file_type: str
    n_rows: int
    n_cols: int
    target: Optional[str] = None
    created_at: str
    schema_json: dict

@router.post("/ingest", response_model=Dataset)
async def ingest_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    target: Optional[str] = Form(None),
    sample_limit: Optional[int] = Form(None)
):
    """Ingest a new dataset from a file upload."""
    try:
        # Read file based on content type
        file_type = file.filename.split('.')[-1].lower()
        
        if file_type == 'csv':
            df = pd.read_csv(file.file, nrows=sample_limit)
        elif file_type in ['json', 'jsonl']:
            df = pd.read_json(file.file, lines=(file_type == 'jsonl'))
        elif file_type == 'parquet':
            df = pd.read_parquet(file.file)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_type}")
        
        # Generate dataset ID and save path
        dataset_id = str(uuid.uuid4())
        save_dir = Path("../../datasets") / dataset_id
        save_dir.mkdir(parents=True, exist_ok=True)
        save_path = save_dir / f"data.{file_type}"
        
        # Save the file
        df.to_csv(save_path, index=False)
        
        # Infer schema
        schema = {
            "columns": [
                {
                    "name": col,
                    "dtype": str(df[col].dtype),
                    "is_numeric": pd.api.types.is_numeric_dtype(df[col]),
                    "is_categorical": pd.api.types.is_categorical_dtype(df[col]),
                    "is_datetime": pd.api.types.is_datetime64_any_dtype(df[col]),
                    "n_unique": int(df[col].nunique()),
                    "missing": int(df[col].isna().sum()),
                }
                for col in df.columns
            ]
        }
        
        # Create dataset record
        dataset = Dataset(
            id=dataset_id,
            name=name,
            file_path=str(save_path),
            file_type=file_type,
            n_rows=len(df),
            n_cols=len(df.columns),
            target=target,
            created_at=datetime.utcnow().isoformat(),
            schema_json=schema
        )
        
        # Store dataset (in-memory for now)
        DATASETS[dataset_id] = dataset.dict()
        
        return dataset
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Dataset])
async def list_datasets():
    """List all available datasets."""
    return list(DATASETS.values())

@router.get("/{dataset_id}", response_model=Dataset)
async def get_dataset(dataset_id: str):
    """Get details for a specific dataset."""
    if dataset_id not in DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return DATASETS[dataset_id]

@router.get("/{dataset_id}/preview")
async def preview_dataset(dataset_id: str, n_rows: int = 100):
    """Preview the first n rows of a dataset."""
    if dataset_id not in DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    dataset = DATASETS[dataset_id]
    file_path = Path(dataset['file_path'])
    
    try:
        if file_path.suffix == '.csv':
            df = pd.read_csv(file_path, nrows=n_rows)
        elif file_path.suffix == '.parquet':
            df = pd.read_parquet(file_path).head(n_rows)
        else:
            df = pd.read_json(file_path, lines=True, nrows=n_rows)
            
        return json.loads(df.to_json(orient='records'))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
