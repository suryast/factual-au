from factual_au.models import SubmissionCreate, VerdictType
from factual_au.pipeline import DemoVerificationPipeline


def test_submission_generates_claims() -> None:
    pipeline = DemoVerificationPipeline()
    result = pipeline.submit(
        SubmissionCreate(
            raw_text=(
                "The Budget 2026 CGT changes double the tax on founder exits. "
                "Australia will become uninvestable."
            )
        )
    )

    assert result.claims
    assert result.claims[0].verdict == VerdictType.requires_assumptions
