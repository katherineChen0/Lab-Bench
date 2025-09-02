from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from .db import BaseModel, JSONEncodedDict

# Enums
class TaskType(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    NLP = "nlp"

class DatasetStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    READY = "ready"
    ERROR = "error"

class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

# Models
class Dataset(BaseModel, table=True):
    """Dataset model for storing information about uploaded datasets."""
    __tablename__ = "datasets"
    
    name: str = Field(index=True)
    description: Optional[str] = None
    file_path: str  # Path to the dataset file
    file_type: str  # csv, json, parquet
    file_size: int  # Size in bytes
    num_rows: int
    num_columns: int
    status: DatasetStatus = Field(default=DatasetStatus.UPLOADING)
    
    # Schema information stored as JSON
    schema_info: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    
    # Relationships
    experiments: List["Experiment"] = Relationship(back_populates="dataset")
    
    class Config:
        arbitrary_types_allowed = True

class Experiment(BaseModel, table=True):
    """Experiment model for grouping related runs."""
    __tablename__ = "experiments"
    
    name: str = Field(index=True)
    description: Optional[str] = None
    task_type: TaskType
    dataset_id: int = Field(foreign_key="datasets.id")
    target_column: Optional[str] = None  # Target variable for supervised learning
    config: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    
    # Relationships
    dataset: Dataset = Relationship(back_populates="experiments")
    runs: List["Run"] = Relationship(back_populates="experiment")

class Run(BaseModel, table=True):
    """Run model for tracking individual pipeline executions."""
    __tablename__ = "runs"
    
    name: str = Field(index=True)
    description: Optional[str] = None
    status: RunStatus = Field(default=RunStatus.PENDING)
    experiment_id: int = Field(foreign_key="experiments.id")
    pipeline_config: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    metrics: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    parameters: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    tags: Dict[str, str] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    error: Optional[str] = None
    git_commit: Optional[str] = None
    
    # Relationships
    experiment: Experiment = Relationship(back_populates="runs")
    artifacts: List["Artifact"] = Relationship(back_populates="run")

class ArtifactType(str, Enum):
    MODEL = "model"
    PLOT = "plot"
    DATA = "data"
    OTHER = "other"

class Artifact(BaseModel, table=True):
    """Artifact model for storing files and objects related to runs."""
    __tablename__ = "artifacts"
    
    run_id: int = Field(foreign_key="runs.id")
    name: str
    type: ArtifactType
    uri: str  # Path to the artifact file
    content_type: str = "application/octet-stream"
    metadata: Dict[str, Any] = Field(sa_type=JSONEncodedDict, default_factory=dict)
    
    # Relationships
    run: Run = Relationship(back_populates="artifacts")
