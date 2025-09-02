from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import logging
from .db import engine, get_session, SQLModel
from .models import *  # Import all models to ensure they're registered with SQLAlchemy

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager."""
    logger.info("Starting up...")
    
    # Create database tables
    logger.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    
    yield
    
    logger.info("Shutting down...")

app = FastAPI(
    title="Playground API",
    description="API for ML Experimentation Playground",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Database session dependency
async def get_db():
    """Dependency to get DB session."""
    async with get_session() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database error: {str(e)}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            await session.close()

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok", 
        "version": "0.1.0",
        "database": "connected"
    }

# Import and include routers
from . import datasets, experiments, runs, artifacts  # noqa: E402

app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
app.include_router(experiments.router, prefix="/api/experiments", tags=["experiments"])
app.include_router(runs.router, prefix="/api/runs", tags=["runs"])
app.include_router(artifacts.router, prefix="/api/artifacts", tags=["artifacts"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
