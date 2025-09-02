from sqlmodel import SQLModel, create_engine, Session, Field, select
from typing import Optional, List, Type, TypeVar, Generic, Any
from datetime import datetime
from pathlib import Path
import json
from typing import Dict, Any as AnyType

# Database URL - using SQLite for simplicity
DATABASE_URL = "sqlite:///./experiments.db"

# Create engine
engine = create_engine(
    DATABASE_URL, 
    echo=True,  # Set to False in production
    connect_args={"check_same_thread": False}  # SQLite specific
)

def get_session():
    """Dependency to get DB session."""
    with Session(engine) as session:
        yield session

# Base model with common fields
class BaseModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    def update(self, **kwargs):
        """Update model attributes."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow()

# JSON field for SQLModel
class JSONEncodedDict(Generic[AnyType], Field):
    ""
    Field that stores a dictionary as a JSON string in the database.
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def validate(self, value: Any, values: dict) -> Any:
        if value is None:
            return None
        if not isinstance(value, (dict, list)):
            raise ValueError("Value must be a dictionary or list")
        return json.dumps(value)
    
    def process_bind_param(self, value: Any, dialect) -> str:
        if value is None:
            return None
        if isinstance(value, str):
            return value
        return json.dumps(value)
    
    def process_result_value(self, value: Any, dialect) -> Dict:
        if value is None:
            return {}
        if isinstance(value, (dict, list)):
            return value
        return json.loads(value) if value else {}

# Import models here to avoid circular imports
from .models import Dataset, Experiment, Run, Artifact

# Create all tables
def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)
    
    # Create necessary directories
    Path("datasets").mkdir(exist_ok=True)
    Path("runs").mkdir(exist_ok=True)
    Path("artifacts").mkdir(exist_ok=True)

# Run this when the module is imported
create_db_and_tables()
