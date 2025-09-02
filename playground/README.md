# ML Playground

A local-first "VS Code for ML experiments" that ingests small/medium datasets, auto-profiles them, and lets you build quick ML pipelines with zero boilerplate.

## Features

- **Dataset Management**: Import CSV, JSON, and Parquet files with automatic schema inference
- **Auto-Profiling**: Get instant insights with automatic data profiling and visualization
- **Pipeline Builder**: Create ML pipelines with a simple YAML configuration
- **Experiment Tracking**: Track and compare model performance across runs
- **Local-First**: Everything runs on your machine with no cloud dependencies

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or pnpm
- (Optional) Docker

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playground
   ```

2. **Set up Python environment**
   ```bash
   # Create and activate a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   
   # Install backend dependencies
   cd apps/api
   pip install -r requirements.txt
   
   # Install core package in development mode
   cd ../../packages/core
   pip install -e .
   ```

3. **Set up the frontend**
   ```bash
   cd ../../apps/web
   npm install
   ```

### Running the Application

1. **Start the backend API**
   ```bash
   cd apps/api
   uvicorn main:app --reload
   ```

2. **Start the frontend**
   ```bash
   cd ../web
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
playground/
├── apps/
│   ├── api/           # FastAPI backend
│   └── web/           # Next.js frontend
├── packages/
│   └── core/          # Core Python package
├── data/              # Example datasets
├── datasets/          # User-uploaded datasets
├── runs/              # Experiment runs and artifacts
└── tests/             # Tests
```

## Development

### Backend

- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Code Style**: Black, isort, flake8
- **Testing**: pytest

### Frontend

- **Framework**: Next.js 14 with TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod

## License

MIT
