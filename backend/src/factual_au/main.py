from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from factual_au.models import SubmissionCreate
from factual_au.pipeline import DemoVerificationPipeline
from factual_au.settings import settings


pipeline = DemoVerificationPipeline()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get(f"{settings.api_prefix}/fact-checks")
def list_fact_checks() -> list[dict]:
    return [item.model_dump(mode="json") for item in pipeline.list_fact_checks()]


@app.get(f"{settings.api_prefix}/fact-checks/{{submission_id}}")
def get_fact_check(submission_id: str) -> dict | None:
    item = pipeline.get_fact_check(submission_id)
    return item.model_dump(mode="json") if item else None


@app.get(f"{settings.api_prefix}/clusters")
def list_clusters() -> list[dict]:
    return [item.model_dump(mode="json") for item in pipeline.list_clusters()]


@app.post(f"{settings.api_prefix}/submissions")
def create_submission(payload: SubmissionCreate) -> dict:
    result = pipeline.submit(payload)
    return result.model_dump(mode="json")

