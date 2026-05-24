import type { ClaimResult, ClaimVerdict, ClusterSummary, SubmissionResult } from "./demo";

interface ClusterRule {
  id: string;
  canonicalParaphrase: string;
  subjectDomain?: string;
  tags: string[];
  patterns: RegExp[];
}

interface ClusterAccumulator {
  rule?: ClusterRule;
  claims: ClaimResult[];
  submittedAt: string[];
}

export interface ClusterGenerationReport {
  clusters: ClusterSummary[];
  matchedClaimCount: number;
  unmatchedClaimCount: number;
  unmatchedClaimIds: string[];
}

const CLUSTER_RULES: ClusterRule[] = [
  {
    id: "cluster-shares-debt-recycling",
    canonicalParaphrase:
      "Budget 2026 narrows residential negative gearing but leaves share deductibility in place, so debt recycling into shares remains available.",
    subjectDomain: "taxation",
    tags: ["shares", "debt recycling", "negative gearing", "property"],
    patterns: [/debt recycling/i, /share deductibility/i, /property-focused, not shares/i, /shares remain available/i]
  },
  {
    id: "cluster-negative-gearing-grandfathering",
    canonicalParaphrase:
      "Negative gearing is grandfathered for current investors while future buyers of established housing lose access.",
    subjectDomain: "taxation",
    tags: ["negative gearing", "housing", "grandfathering", "incumbents"],
    patterns: [
      /grandfather/i,
      /existing investors/i,
      /current investors/i,
      /established[- ]property buyers lose access/i,
      /new established[- ]property buyers lose access/i
    ]
  },
  {
    id: "cluster-pre-cgt-assets",
    canonicalParaphrase: "Budget 2026 is pulling pre-1985 assets into the CGT net.",
    subjectDomain: "taxation",
    tags: ["capital gains", "pre-CGT assets", "grandfathering"],
    patterns: [/pre-1985/i, /pre-cgt/i]
  },
  {
    id: "cluster-long-term-etf-planning",
    canonicalParaphrase:
      "The CGT redesign for shares makes long-term ETF planning harder and may leave strong long-horizon investors paying more tax than under the old discount system.",
    subjectDomain: "taxation",
    tags: ["ETFs", "shares", "long-term investing", "planning uncertainty"],
    patterns: [
      /\betf/i,
      /long-term investing/i,
      /planning harder/i,
      /hard to plan/i,
      /fire target/i,
      /bridge-phase/i,
      /share investors/i
    ]
  },
  {
    id: "cluster-young-people-rentvesting-tax-grab",
    canonicalParaphrase:
      "The package barely slows house prices, grandfather-protects incumbents, and makes it harder for younger Australians to build wealth through rentvesting and non-property assets.",
    subjectDomain: "intergenerational_equity",
    tags: ["young Australians", "rentvesting", "housing", "shares"],
    patterns: [
      /rentvesting/i,
      /house prices.*less up/i,
      /under 40/i,
      /young people hurt more than helped/i,
      /only pathways harder/i,
      /wealth divide/i,
      /breaches trust/i
    ]
  },
  {
    id: "cluster-young-etf-home-deposit",
    canonicalParaphrase: "The new CGT regime sharply worsens ETF-based first-home saving for young Australians.",
    subjectDomain: "taxation",
    tags: ["young Australians", "ETFs", "housing", "capital gains"],
    patterns: [/first-home/i, /home deposit/i, /deposit delayed/i, /etf saver/i]
  },
  {
    id: "cluster-young-australians",
    canonicalParaphrase:
      "The current CGT discount mainly protects young Australians trying to build wealth.",
    subjectDomain: "intergenerational_equity",
    tags: ["young Australians", "distribution", "housing"],
    patterns: [
      /young australians/i,
      /\bgen z\b/i,
      /millennial/i,
      /future homeowners/i,
      /favours baby boomers/i,
      /wealth[- ]building playbook/i
    ]
  },
  {
    id: "cluster-young-founder-net-target",
    canonicalParaphrase:
      "A younger founder starting under the new regime needs a much larger gross exit than an older founder under the old regime to keep the same after-tax proceeds.",
    subjectDomain: "taxation",
    tags: ["founders", "young Australians", "capital gains", "intergenerational equity"],
    patterns: [/same after-tax proceeds/i, /\$13m/i, /\$20m/i, /much larger gross exit/i]
  },
  {
    id: "cluster-australian-entrepreneurs-relief",
    canonicalParaphrase:
      "Budget 2026 makes Australia a punitive developed-country tax regime for founders, so Australia needs a founder-specific relief modelled on QSBS and BADR.",
    subjectDomain: "startups",
    tags: ["founders", "startups", "capital gains", "international comparison"],
    patterns: [/qsbs/i, /\bbadr\b/i, /entrepreneurs relief/i, /most punitive/i, /founder-specific relief/i]
  },
  {
    id: "cluster-founder-better-off-countercase",
    canonicalParaphrase:
      "Higher CGT on founder exits can coexist with a better overall startup environment once the rest of the budget is counted.",
    subjectDomain: "startups",
    tags: ["founders", "startups", "cost of living", "capital gains"],
    patterns: [/better overall startup environment/i, /better off overall/i, /broader gains/i]
  },
  {
    id: "cluster-cgt-broader-scope",
    canonicalParaphrase:
      "The CGT redesign applies beyond housing to shares, businesses, and other investment assets.",
    subjectDomain: "taxation",
    tags: ["capital gains", "shares", "businesses", "scope"],
    patterns: [
      /applies beyond property/i,
      /shares and businesses/i,
      /all assets/i,
      /all investments/i,
      /shares too/i,
      /extends beyond/i,
      /blast radius/i,
      /crypto/i
    ]
  },
  {
    id: "cluster-capital-vs-labour-tax",
    canonicalParaphrase:
      "The current CGT discount taxes eligible long-held gains more lightly than marginal labour income for the same taxpayer.",
    subjectDomain: "taxation",
    tags: ["capital gains", "tax design", "distribution"],
    patterns: [
      /capital gains more lightly than labour/i,
      /capital taxed less than wages/i,
      /tax mix away from labour/i,
      /toward consumption taxes/i
    ]
  },
  {
    id: "cluster-startup-equity-attractiveness",
    canonicalParaphrase:
      "The CGT redesign makes startup employee equity and founder upside less attractive than before.",
    subjectDomain: "startups",
    tags: ["startups", "equity", "hiring", "capital gains"],
    patterns: [
      /equity less attractive/i,
      /hiring packages.*equity/i,
      /salary over equity/i,
      /effective(?:ly)? halves startup equity value/i,
      /startup upside less attractive/i,
      /cut innovation economy off at the knees/i
    ]
  },
  {
    id: "cluster-subdiv152-founder-shield",
    canonicalParaphrase:
      "Subdivision 152 means many founder or startup exits may still be materially shielded from the Budget 2026 CGT change.",
    subjectDomain: "startups",
    tags: ["founders", "startups", "Subdivision 152"],
    patterns: [/subdivision 152/i, /small business cgt concessions/i, /most founders are protected/i]
  },
  {
    id: "cluster-zero-cost-base-business-exit",
    canonicalParaphrase:
      "A zero-cost-base self-funded business can face much harsher tax on sale under the Budget 2026 CGT reform, but exact outcomes still depend on ESS and concession assumptions.",
    subjectDomain: "startups",
    tags: ["founders", "small business", "capital gains"],
    patterns: [/zero cost base/i, /sweat equity/i, /full 47/i, /top marginal rate on exit/i, /self-funded business/i]
  },
  {
    id: "cluster-startup-support-measures",
    canonicalParaphrase:
      "Budget 2026 includes startup-support measures such as stronger R&D and venture capital incentives.",
    subjectDomain: "startups",
    tags: ["startups", "venture capital", "R&D"],
    patterns: [/startup support/i, /\br&d\b/i, /venture capital/i, /expanded vc/i, /boosted r&d/i]
  },
  {
    id: "cluster-family-home-distortion",
    canonicalParaphrase:
      "CGT reform plus the continuing family-home exemption could worsen housing access or create extra distortion.",
    subjectDomain: "housing",
    tags: ["housing", "family home", "capital gains"],
    patterns: [/family home exemption/i, /main residence exemption/i, /further distortion/i, /housing access/i]
  },
  {
    id: "cluster-founder-capital-flight",
    canonicalParaphrase:
      "Removing the CGT discount will cause founders, talent, or capital to leave Australia.",
    subjectDomain: "startups",
    tags: ["founders", "capital flight", "startups"],
    patterns: [
      /move offshore/i,
      /moving offshore/i,
      /vote with their feet/i,
      /built overseas/i,
      /capital flight/i,
      /retain top startup talent/i,
      /leave australia/i,
      /best and brightest/i
    ]
  },
  {
    id: "cluster-aspiration-budget",
    canonicalParaphrase:
      "Budget 2026 punishes aspiration, risk-taking, and business-building rather than rewarding it.",
    subjectDomain: "politics",
    tags: ["aspiration", "business owners", "negative gearing", "startups"],
    patterns: [
      /aspiration/i,
      /anti-progress/i,
      /anti-aspiration/i,
      /risk-taking/i,
      /business builders/i,
      /business building/i,
      /job creation/i,
      /employ people/i,
      /punish(?:es|ing)? ambition/i,
      /destroying ambition/i,
      /broader anti-progress frustration/i
    ]
  },
  {
    id: "cluster-policy-uncertainty",
    canonicalParaphrase:
      "Consultation and policy uncertainty around the CGT redesign are already imposing costs on founders, hiring, or capital deployment.",
    subjectDomain: "startups",
    tags: ["consultation", "uncertainty", "capital deployment", "startups"],
    patterns: [
      /consultation/i,
      /uncertainty has a cost/i,
      /investors jittery/i,
      /capital pauses/i,
      /hiring deferred/i,
      /interested in consulting with stakeholders/i,
      /coming changes/i
    ]
  },
  {
    id: "cluster-small-business-hit",
    canonicalParaphrase:
      "The package is unusually harsh on small business, growth, or entrepreneurial scaling.",
    subjectDomain: "business demographics",
    tags: ["small business", "growth", "entrepreneurship", "jobs"],
    patterns: [
      /worst budget in history for small business/i,
      /keep your business small/i,
      /discourage growth/i,
      /jobs innovation and competitiveness/i,
      /disaster for entrepreneurship/i,
      /over 2\.6m small businesses/i
    ]
  }
];

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "being",
  "budget",
  "but",
  "by",
  "can",
  "claim",
  "does",
  "for",
  "from",
  "get",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "its",
  "more",
  "new",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "under",
  "will",
  "with"
]);

const VERDICT_PRIORITY: ClaimVerdict[] = [
  "unsupported",
  "requires_assumptions",
  "rhetorical",
  "unverifiable",
  "partially_supported",
  "supported"
];

function buildSearchText(claim: ClaimResult) {
  return [claim.paraphrased, claim.verbatim, ...claim.alternativeFramings].join(" ").toLowerCase();
}

function findRule(claim: ClaimResult) {
  const searchText = buildSearchText(claim);
  return CLUSTER_RULES.find((rule) => rule.patterns.some((pattern) => pattern.test(searchText)));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function buildFallbackClusterKey(claim: ClaimResult) {
  const tokens = tokenize(claim.paraphrased);
  const topTokens = Array.from(new Set(tokens)).slice(0, 4);
  return `fallback-${slugify([claim.subjectDomain, ...topTokens].join("-")) || claim.id}`;
}

function uniqueStrings(values: string[], limit?: number) {
  const unique = values.map((value) => value.trim()).filter(Boolean).filter((value, index, array) => array.indexOf(value) === index);
  return typeof limit === "number" ? unique.slice(0, limit) : unique;
}

function collectSampleVariations(claims: ClaimResult[], canonicalParaphrase: string) {
  return uniqueStrings(
    claims.flatMap((claim) => [claim.paraphrased, ...claim.alternativeFramings]).filter((value) => value !== canonicalParaphrase),
    6
  );
}

function collectCommonAssumptions(claims: ClaimResult[]) {
  const assumptionCounts = new Map<string, number>();
  for (const assumption of claims.flatMap((claim) => claim.assumptionsRequired)) {
    assumptionCounts.set(assumption, (assumptionCounts.get(assumption) ?? 0) + 1);
  }

  return [...assumptionCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([assumption]) => assumption);
}

function collectPrimarySources(claims: ClaimResult[]) {
  const sourceCounts = new Map<string, { title: string; url: string; count: number }>();

  for (const source of claims.flatMap((claim) => claim.primarySources)) {
    const key = `${source.title}::${source.url}`;
    const existing = sourceCounts.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    sourceCounts.set(key, { title: source.title, url: source.url, count: 1 });
  }

  return [...sourceCounts.values()]
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))
    .slice(0, 4)
    .map(({ title, url }) => ({ title, url }));
}

function aggregateVerdict(claims: ClaimResult[]) {
  const counts = new Map<ClaimVerdict, number>();
  for (const claim of claims) {
    counts.set(claim.verdict, (counts.get(claim.verdict) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return VERDICT_PRIORITY.indexOf(a[0]) - VERDICT_PRIORITY.indexOf(b[0]);
  })[0][0];
}

function collectTags(rule: ClusterRule | undefined, claims: ClaimResult[]) {
  if (rule) return rule.tags;

  const tokenCounts = new Map<string, number>();
  for (const claim of claims) {
    for (const token of tokenize(claim.paraphrased)) {
      tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1);
    }
  }

  return [...tokenCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([token]) => token);
}

function canonicalParaphraseForCluster(rule: ClusterRule | undefined, claims: ClaimResult[]) {
  if (rule) return rule.canonicalParaphrase;

  return [...claims]
    .sort((a, b) => a.paraphrased.length - b.paraphrased.length || a.paraphrased.localeCompare(b.paraphrased))[0]
    .paraphrased;
}

function subjectDomainForCluster(rule: ClusterRule | undefined, claims: ClaimResult[]) {
  if (rule?.subjectDomain) return rule.subjectDomain;

  const counts = new Map<string, number>();
  for (const claim of claims) {
    counts.set(claim.subjectDomain, (counts.get(claim.subjectDomain) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

function shouldKeepCluster(rule: ClusterRule | undefined, claims: ClaimResult[]) {
  return Boolean(rule) || claims.length > 1;
}

export function generateClusterReport(submissions: SubmissionResult[]): ClusterGenerationReport {
  const clusters = new Map<string, ClusterAccumulator>();
  const unmatchedClaimIds: string[] = [];
  let matchedClaimCount = 0;

  for (const submission of submissions) {
    for (const claim of submission.claims) {
      const rule = findRule(claim);
      const clusterKey = rule?.id ?? buildFallbackClusterKey(claim);
      if (rule) matchedClaimCount += 1;
      else unmatchedClaimIds.push(claim.id);

      const bucket = clusters.get(clusterKey) ?? { rule, claims: [], submittedAt: [] };
      bucket.claims.push(claim);
      bucket.submittedAt.push(submission.submittedAt);
      if (!bucket.rule && rule) bucket.rule = rule;
      clusters.set(clusterKey, bucket);
    }
  }

  const summaries = [...clusters.entries()]
    .filter(([, bucket]) => shouldKeepCluster(bucket.rule, bucket.claims))
    .map(([clusterKey, bucket]) => {
      const canonicalParaphrase = canonicalParaphraseForCluster(bucket.rule, bucket.claims);
      return {
        id: bucket.rule?.id ?? clusterKey,
        canonicalParaphrase,
        subjectDomain: subjectDomainForCluster(bucket.rule, bucket.claims),
        tags: collectTags(bucket.rule, bucket.claims),
        instanceCount: bucket.claims.length,
        lastSeen: [...bucket.submittedAt].sort().at(-1) ?? "",
        aggregateVerdict: aggregateVerdict(bucket.claims),
        commonMissingAssumptions: collectCommonAssumptions(bucket.claims),
        sampleVariations: collectSampleVariations(bucket.claims, canonicalParaphrase),
        primarySources: collectPrimarySources(bucket.claims)
      } satisfies ClusterSummary;
    })
    .sort((a, b) => {
      if (b.instanceCount !== a.instanceCount) return b.instanceCount - a.instanceCount;
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    });

  return {
    clusters: summaries,
    matchedClaimCount,
    unmatchedClaimCount: submissions.reduce((count, submission) => count + submission.claims.length, 0) - matchedClaimCount,
    unmatchedClaimIds
  };
}

export function generateClusterSummaries(submissions: SubmissionResult[]) {
  return generateClusterReport(submissions).clusters;
}
