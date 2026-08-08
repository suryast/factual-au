from __future__ import annotations

from collections import Counter
from re import findall, split
from uuid import uuid4

from factual_au.demo_data import seeded_clusters, seeded_fact_checks
from factual_au.models import (
    ClaimRecord,
    ClaimType,
    ClusterSummary,
    PrimarySource,
    SubmissionCreate,
    SubmissionResult,
    VerdictType,
    VerificationMethod,
)

PRIMARY_SOURCE_LIBRARY = {
    "budget_cgt": PrimarySource(
        title="Budget Paper 2 2026-27",
        publisher="Australian Government",
        section="Tax Reform – Boosting Home Ownership",
        page=21,
        url="https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
        supports="partially_supports",
        relevant_passage=(
            "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount "
            "to indexation plus a 30 per cent minimum tax on net capital gains."
        ),
    ),
    "budget_vc": PrimarySource(
        title="Budget Paper 2 2026-27",
        publisher="Australian Government",
        section="Expanding venture capital tax incentives",
        page=18,
        url="https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
        supports="partially_supports",
        relevant_passage=(
            "The Budget expands ESVCLP and VCLP thresholds to encourage investment in "
            "high-growth firms."
        ),
    ),
    "pbo_cgt": PrimarySource(
        title="PBO: Operation of the CGT discount",
        publisher="Parliamentary Budget Office",
        section="Distribution tables",
        page=1,
        url="https://www.pbo.gov.au/publications-and-data/publications/costings/operation-CGT-discount",
        supports="supports",
        relevant_passage=(
            "The top decile receives the large majority of CGT discount benefits in the "
            "distributional tables."
        ),
    ),
}


class DemoVerificationPipeline:
    """Deterministic MVP pipeline that preserves the product contracts."""

    def __init__(self) -> None:
        self._fact_checks = {item.id: item for item in seeded_fact_checks()}
        self._clusters = {item.id: item for item in seeded_clusters()}

    def list_fact_checks(self) -> list[SubmissionResult]:
        return list(self._fact_checks.values())

    def list_clusters(self) -> list[ClusterSummary]:
        return list(self._clusters.values())

    def get_fact_check(self, submission_id: str) -> SubmissionResult | None:
        return self._fact_checks.get(submission_id)

    def submit(self, payload: SubmissionCreate) -> SubmissionResult:
        submission_id = str(uuid4())
        sentences = [
            sentence.strip()
            for sentence in split(r"(?<=[.!?])\s+", payload.raw_text.strip())
            if sentence.strip()
        ]
        claims = [self._extract_claim(sentence, submission_id) for sentence in sentences[:4]]

        verdict_mix = Counter(claim.verdict for claim in claims)
        result = SubmissionResult(
            id=submission_id,
            title=self._build_title(payload.raw_text),
            source_url=payload.source_url,
            raw_text=payload.raw_text,
            poster_label=payload.poster_identifier or "Anonymous submission",
            poster_named_publicly=payload.poster_named_publicly,
            summary=self._build_summary(claims),
            overall_verdict_mix={verdict: verdict_mix.get(verdict, 0) for verdict in VerdictType},
            claims=claims,
        )
        self._fact_checks[result.id] = result
        return result

    def _extract_claim(self, sentence: str, submission_id: str) -> ClaimRecord:
        lowered = sentence.lower()
        figures = findall(r"\b\d+(?:\.\d+)?%?\b", sentence)
        claim_type = self._classify_claim_type(lowered, figures)
        subject_domain = self._classify_domain(lowered)
        verdict, reasoning, assumptions, framings, method, sources = self._verify(lowered)

        return ClaimRecord(
            submission_id=submission_id,
            verbatim=sentence,
            paraphrased=sentence.strip().replace("  ", " "),
            claim_type=claim_type,
            subject_domain=subject_domain,
            figures_mentioned=figures,
            assumptions=[],
            entities_mentioned=[],
            verdict=verdict,
            confidence=0.78 if verdict != VerdictType.rhetorical else 0.9,
            reasoning=reasoning,
            assumptions_required=assumptions,
            alternative_framings=framings,
            verification_method=method,
            primary_sources=sources,
        )

    def _classify_claim_type(self, lowered: str, figures: list[str]) -> ClaimType:
        if any(token in lowered for token in ["obviously", "betrayal", "uninvestable", "disaster"]):
            return ClaimType.interpretive
        if any(token in lowered for token in ["will", "would", "forecast", "future"]):
            return ClaimType.predictive
        if any(token in lowered for token in ["because", "causes", "drives", "leads to"]):
            return ClaimType.causal
        if any(token in lowered for token in ["double", "higher", "lower", "more than", "less than"]):
            return ClaimType.comparative
        if figures:
            return ClaimType.statistical
        return ClaimType.interpretive

    def _classify_domain(self, lowered: str) -> str:
        if any(token in lowered for token in ["tax", "cgt", "budget", "negative gearing"]):
            return "taxation"
        if any(token in lowered for token in ["rba", "interest rate", "cash rate"]):
            return "monetary_policy"
        if any(token in lowered for token in ["housing", "rent", "property"]):
            return "housing"
        return "fiscal_policy"

    def _verify(
        self, lowered: str
    ) -> tuple[
        VerdictType,
        str,
        list[str],
        list[str],
        VerificationMethod,
        list[PrimarySource],
    ]:
        if any(token in lowered for token in ["obviously", "betrayal", "uninvestable", "disaster"]):
            return (
                VerdictType.rhetorical,
                "This is interpretive or characterising framing rather than a discrete factual claim.",
                [],
                ["A more checkable version would state the specific mechanism or metric being claimed."],
                VerificationMethod.logical_analysis,
                [PRIMARY_SOURCE_LIBRARY["budget_vc"]],
            )

        if any(token in lowered for token in ["double", "doubles", "massive increase"]):
            return (
                VerdictType.requires_assumptions,
                (
                    "The post-Budget regime is real, but the scale depends on timing, holding period, "
                    "grandfathering, and any small-business concessions."
                ),
                [
                    "Assumes a fully post-2027 gain",
                    "Assumes no active-business or founder concession applies",
                ],
                [
                    "The reform can materially increase tax in some scenarios",
                    "The increase is scenario-specific rather than universal",
                ],
                VerificationMethod.policy_text_match,
                [PRIMARY_SOURCE_LIBRARY["budget_cgt"]],
            )

        if any(token in lowered for token in ["young australians", "middle class", "everyone"]):
            return (
                VerdictType.unsupported,
                "The available distributional evidence does not support the claim as broadly stated.",
                [],
                ["The current concession is highly concentrated among higher-income taxpayers."],
                VerificationMethod.empirical_comparison,
                [PRIMARY_SOURCE_LIBRARY["pbo_cgt"]],
            )

        return (
            VerdictType.unverifiable,
            "This sentence needs a narrower measurable claim before it can be verified against public sources.",
            [],
            ["State a specific measure, time period, or comparison to make the claim checkable."],
            VerificationMethod.logical_analysis,
            [PRIMARY_SOURCE_LIBRARY["budget_cgt"]],
        )

    def _build_title(self, raw_text: str) -> str:
        preview = raw_text.strip().split(".")[0][:72].strip()
        return f"Submitted claim-check: {preview}"

    def _build_summary(self, claims: list[ClaimRecord]) -> str:
        mix = Counter(claim.verdict for claim in claims)
        dominant = mix.most_common(1)[0][0].value.replace("_", " ") if mix else "unverifiable"
        return (
          f"The submission produced {len(claims)} extracted claims. "
          f"The dominant verdict category is {dominant}."
        )

