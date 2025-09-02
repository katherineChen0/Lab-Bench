from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from typing import List, Optional, Dict, Any
import pandas as pd
import json
from pathlib import Path
import uuid
import shutil
from datetime import datetime
from sqlmodel import Session, select
import logging

from .db import get_session
from .models import Dataset as DBDataset, DatasetStatus

router = APIRouter()
logger = logging.getLogger(__name__)

# Helper functions
async def save_upload_file(upload_file: UploadFile, destination: Path) -> None:
    """Save an uploaded file to the specified path."""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        logger.error(f"Error saving file {upload_file.filename}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    finally:
        await upload_file.seek(0)

def infer_schema(df: pd.DataFrame) -> Dict[str, Any]:
    """Infer schema from a pandas DataFrame."""
    return {
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

# API Endpoints
@router.post("/ingest", response_model=DBDataset, status_code=status.HTTP_201_CREATED)
async def ingest_dataset(
    *,
    session: Session = Depends(get_session),
    file: UploadFile = File(...),
    name: str = Form(...),
    description: Optional[str] = Form(None),
    target: Optional[str] = Form(None),
    sample_limit: Optional[int] = Form(10000)  # Default sample limit
):
    """
    Ingest a new dataset from a file upload.
    
    Supports CSV, JSON, JSONL, and Parquet files.
    """
    try:
        # Validate file type
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ['.csv', '.json', '.jsonl', '.parquet']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type. Supported formats: CSV, JSON, JSONL, Parquet"
            )
            
        # Read the file with pandas
        try:
            if file_ext == '.csv':
                df = pd.read_csv(file.file, nrows=sample_limit)
            elif file_ext in ['.json', '.jsonl']:
                df = pd.read_json(file.file, lines=(file_ext == '.jsonl'))
            elif file_ext == '.parquet':
                df = pd.read_parquet(file.file)
                if sample_limit and len(df) > sample_limit:
                    df = df.sample(sample_limit)
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error reading file: {str(e)}"
            )
        
        # Generate unique ID and file path
        dataset_id = str(uuid.uuid4())
        file_name = f"{dataset_id}{file_ext}"
        file_path = Path("datasets") / file_name
        
        # Save the file
        file_path.parent.mkdir(parents=True, exist_ok=True)
        await save_upload_file(file, file_path)
        
        # Create dataset record
        dataset = DBDataset(
            name=name,
            description=description,
            file_path=str(file_path),
            file_type=file_ext[1:],  # Remove the dot
            file_size=file_path.stat().st_size,
            num_rows=len(df),
            num_columns=len(df.columns),
            status=DatasetStatus.READY,
            schema_info=infer_schema(df)
        )
        
        # Save to database
        session.add(dataset)
        session.commit()
        session.refresh(dataset)
        
        return dataset
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@router.get("", response_model=List[DBDataset])
async def list_datasets(
    *, 
    session: Session = Depends(get_session),
    skip: int = 0, 
    limit: int = 100
):
    """List all available datasets with pagination."""
    result = session.exec(select(DBDataset).offset(skip).limit(limit)).all()
    return result

@router.get("/{dataset_id}", response_model=DBDataset)
async def get_dataset(
    *,
    session: Session = Depends(get_session),
    dataset_id: int
):
    """Get details for a specific dataset."""
    dataset = session.get(DBDataset, dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    return dataset

@router.get("/{dataset_id}/preview")
async def preview_dataset(
    *,
    session: Session = Depends(get_session),
    dataset_id: int,
    n_rows: int = 100
):
    """Preview the first n rows of a dataset."""
    dataset = session.get(DBDataset, dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    
    file_path = Path(dataset.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data file not found at {file_path}"
        )
    
    try:
        if dataset.file_type == 'csv':
            df = pd.read_csv(file_path, nrows=n_rows)
        elif dataset.file_type == 'parquet':
            df = pd.read_parquet(file_path).head(n_rows)
        else:  # json or jsonl
            df = pd.read_json(file_path, lines=(dataset.file_type == 'jsonl'), nrows=n_rows)
            
        return json.loads(df.to_json(orient='records'))
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reading file: {str(e)}"
        )

@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    *,
    session: Session = Depends(get_session),
    dataset_id: int
):
    """Delete a dataset and its associated file."""
    dataset = session.get(DBDataset, dataset_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    
    try:
        # Delete the file
        file_path = Path(dataset.file_path)
        if file_path.exists():
            file_path.unlink()
        
        # Delete the database record
        session.delete(dataset)
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Error deleting dataset {dataset_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting dataset: {str(e)}"
        )
