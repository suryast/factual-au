from fastmcp import FastMCP

from factual_au.pipeline import DemoVerificationPipeline


pipeline = DemoVerificationPipeline()
mcp = FastMCP("factual-au-verification")


@mcp.tool()
def list_claim_clusters() -> list[dict]:
    """Return the current seeded cluster summaries."""
    return [item.model_dump(mode="json") for item in pipeline.list_clusters()]


@mcp.tool()
def get_fact_check(submission_id: str) -> dict | None:
    """Return a single fact-check record by submission id."""
    item = pipeline.get_fact_check(submission_id)
    return item.model_dump(mode="json") if item else None

