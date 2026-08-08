from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, HttpUrl


class ClaimType(str, Enum):
    statistical = "statistical"
    causal = "causal"
    comparative = "comparative"
    historical = "historical"
    predictive = "predictive"
    interpretive = "interpretive"


class VerdictType(str, Enum):
    supported = "supported"
    partially_supported = "partially_supported"
    unsupported = "unsupported"
    unverifiable = "unverifiable"
    requires_assumptions = "requires_assumptions"
    rhetorical = "rhetorical"


class VerificationMethod(str, Enum):
    policy_text_match = "policy_text_match"
    statistical_calculation = "statistical_calculation"
    empirical_comparison = "empirical_comparison"
    logical_analysis = "logical_analysis"


class SubmissionCreate(BaseModel):
    raw_text: str = Field(min_length=20, max_length=30000)
    source_url: HttpUrl | None = None
    poster_identifier: str | None = Field(default=None, max_length=200)
    poster_named_publicly: bool = False


class PrimarySource(BaseModel):
    title: str
    publisher: str
    section: str
    page: int
    url: HttpUrl
    supports: Literal["supports", "contradicts", "partially_supports"]
    relevant_passage: str


class ClaimRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    submission_id: str
    verbatim: str
    paraphrased: str
    claim_type: ClaimType
    subject_domain: str
    entities_mentioned: list[str] = Field(default_factory=list)
    figures_mentioned: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    verdict: VerdictType
    confidence: float
    reasoning: str
    assumptions_required: list[str] = Field(default_factory=list)
    alternative_framings: list[str] = Field(default_factory=list)
    verification_method: VerificationMethod
    primary_sources: list[PrimarySource] = Field(default_factory=list)


class SubmissionResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    poster_label: str = "Anonymous submission"
    poster_named_publicly: bool = False
    source_url: HttpUrl | None = None
    raw_text: str
    summary: str
    overall_verdict_mix: dict[VerdictType, int]
    claims: list[ClaimRecord]


class ClusterSummary(BaseModel):
    id: str
    canonical_paraphrase: str
    subject_domain: str
    instance_count: int
    first_seen: datetime
    last_seen: datetime
    aggregate_verdict: VerdictType
    common_missing_assumptions: list[str]
    sample_variations: list[str]
    primary_sources: list[dict[str, str]]

