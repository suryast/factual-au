from __future__ import annotations

from datetime import UTC, datetime

from factual_au.models import (
    ClaimRecord,
    ClaimType,
    ClusterSummary,
    PrimarySource,
    SubmissionResult,
    VerdictType,
    VerificationMethod,
)


def seeded_fact_checks() -> list[SubmissionResult]:
    submission_id = "budget-2026-cgt-founder-claim"
    claim = ClaimRecord(
        id="claim-founder-double-tax",
        submission_id=submission_id,
        verbatim="The Budget 2026 CGT changes double the tax on any startup exit.",
        paraphrased="The 2026-27 CGT reform doubles tax on founder exits in startup scenarios.",
        claim_type=ClaimType.comparative,
        subject_domain="taxation",
        entities_mentioned=["Budget Paper 2", "ATO"],
        figures_mentioned=["2026", "2027"],
        assumptions=["No Subdivision 152 relief", "Fully post-2027 gain"],
        verdict=VerdictType.requires_assumptions,
        confidence=0.79,
        reasoning=(
            "The new regime is real, but the size of the increase depends on grandfathering, "
            "holding period, active-business concessions, and whether the post assumes a fully "
            "post-1 July 2027 gain."
        ),
        assumptions_required=[
            "No Subdivision 152 concession applies",
            "The gain is fully post-1 July 2027",
            "The claim assumes a specific marginal rate and holding period",
        ],
        alternative_framings=[
            "The reform can materially increase tax in some founder scenarios",
            "The effect varies with grandfathering and active-business concessions",
        ],
        verification_method=VerificationMethod.policy_text_match,
        primary_sources=[
            PrimarySource(
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
            )
        ],
    )
    return [
        SubmissionResult(
            id=submission_id,
            title="Founder-exit claim on Budget 2026 CGT reform",
            submitted_at=datetime(2026, 5, 13, 0, 12, tzinfo=UTC),
            source_url="https://www.linkedin.com/posts/example",
            raw_text=(
                "The Budget 2026 CGT changes will push founders to Singapore because they double "
                "the tax on any startup exit."
            ),
            summary=(
                "Seeded demo record showing the distinction between a supported policy-text change "
                "and the assumptions required to make a stronger headline claim."
            ),
            overall_verdict_mix={
                VerdictType.supported: 0,
                VerdictType.partially_supported: 0,
                VerdictType.unsupported: 0,
                VerdictType.unverifiable: 0,
                VerdictType.requires_assumptions: 1,
                VerdictType.rhetorical: 0,
            },
            claims=[claim],
        )
    ]


def seeded_clusters() -> list[ClusterSummary]:
    return [
        ClusterSummary(
            id="cluster-founder-capital-flight",
            canonical_paraphrase=(
                "Removing the CGT discount will cause founders or capital to leave Australia."
            ),
            subject_domain="taxation",
            instance_count=12,
            first_seen=datetime(2026, 5, 8, 2, 0, tzinfo=UTC),
            last_seen=datetime(2026, 5, 13, 0, 12, tzinfo=UTC),
            aggregate_verdict=VerdictType.requires_assumptions,
            common_missing_assumptions=[
                "Treats tax as the dominant factor in founder location decisions",
                "Ignores expanded VC incentives in the same budget package",
                "Assumes no grandfathering or targeted founder concession affects the scenario",
            ],
            sample_variations=["mass exodus", "capital flight", "Singapore move"],
            primary_sources=[
                {
                    "title": "Budget Paper 2 2026-27, p.18",
                    "url": "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
                },
                {
                    "title": "Budget Paper 2 2026-27, pp.21-22",
                    "url": "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
                },
            ],
        )
    ]

