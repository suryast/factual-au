# factual.au backend

FastAPI + FastMCP scaffold for the `factual.au` verification service.

## Goals of this scaffold

- provide stable API boundaries for frontend integration
- model the ingestion → extraction → retrieval → verification → clustering pipeline
- ship deterministic demo behaviour before live Anthropic, Voyage, D1, KV, R2, and pgvector integrations are turned on

## Local setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
uvicorn factual_au.main:app --reload
```

## Endpoints

- `GET /healthz`
- `GET /api/v1/fact-checks`
- `GET /api/v1/fact-checks/{submission_id}`
- `GET /api/v1/clusters`
- `POST /api/v1/submissions`

The `POST /api/v1/submissions` endpoint currently uses a deterministic heuristic pipeline with seeded primary-source references. It is intended as the contract to preserve when live model and retrieval integrations land.

