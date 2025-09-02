from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Playground API",
    description="API for ML Experimentation Playground",
    version="0.1.0",
)

# CORS middleware to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}

# Import and include routers
from . import datasets, experiments, runs, artifacts  # noqa: E402

app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])
app.include_router(experiments.router, prefix="/api/experiments", tags=["experiments"])
app.include_router(runs.router, prefix="/api/runs", tags=["runs"])
app.include_router(artifacts.router, prefix="/api/artifacts", tags=["artifacts"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
