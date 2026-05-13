export type ClaimVerdict =
  | "supported"
  | "partially_supported"
  | "unsupported"
  | "unverifiable"
  | "requires_assumptions"
  | "rhetorical";

export type VerificationMethod =
  | "policy_text_match"
  | "statistical_calculation"
  | "empirical_comparison"
  | "logical_analysis";

export interface SourceRef {
  title: string;
  publisher: string;
  section: string;
  page: number;
  url: string;
  supports: "supports" | "contradicts" | "partially_supports";
  relevantPassage: string;
}

export interface ClaimResult {
  id: string;
  verbatim: string;
  paraphrased: string;
  claimType: string;
  subjectDomain: string;
  verdict: ClaimVerdict;
  confidence: number;
  reasoning: string;
  assumptionsRequired: string[];
  alternativeFramings: string[];
  verificationMethod: VerificationMethod;
  primarySources: SourceRef[];
}

export interface SubmissionResult {
  id: string;
  title: string;
  submittedAt: string;
  posterLabel: string;
  posterNamedPublicly: boolean;
  sourceUrl?: string;
  rawText: string;
  summary: string;
  overallVerdictMix: Record<ClaimVerdict, number>;
  claims: ClaimResult[];
  calculatorLink?: CalculatorLink;
}

export interface CalculatorLink {
  label: string;
  description: string;
  href: string;
}

export interface ClusterSummary {
  id: string;
  canonicalParaphrase: string;
  subjectDomain: string;
  tags: string[];
  instanceCount: number;
  lastSeen: string;
  aggregateVerdict: ClaimVerdict;
  commonMissingAssumptions: string[];
  sampleVariations: string[];
  primarySources: Array<{ title: string; url: string }>;
}

export const appStats = {
  totalFactChecks: 29,
  activeClusters: 17,
  primarySourcesIndexed: 11,
  issueLanes: 3
};

const CALCULATOR_BASE_URL = "https://australia-cgt-reform-calculator.setiyaputra.me";

function buildCalculatorHref(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  }
  return `${CALCULATOR_BASE_URL}/?${search.toString()}`;
}

function buildScenarioCalculatorHref(scenarioId: string, caseFile: string) {
  return buildCalculatorHref({
    scenarioId,
    schemaVersion: 1,
    caseFile
  });
}

export const recentFactChecks: SubmissionResult[] = [
  {
    id: "budget-2026-ai-founders-stay-claim",
    title: "LinkedIn post arguing the Budget makes startup upside less attractive and gives ambitious young Australians fewer reasons to stay",
    submittedAt: "2026-05-13T22:07:00Z",
    posterLabel: "James Cronan on LinkedIn",
    posterNamedPublicly: true,
    rawText:
      "Australia is telling founders, early employees and investors: take the risk here, but we'll make the upside less attractive and become a major shareholder. That is what the CGT reform does. ... Tax the upside harder, and fewer people take the risk. Fewer founders. Fewer AI companies. Fewer high-growth jobs. Fewer reasons for ambitious young people to stay in Australia.",
    summary:
      "This post bundles one directional startup-incentives claim with a larger chain of behavioural forecasts. It is fair to say the Budget can make founder and employee upside less attractive in some startup-equity scenarios, because the site's existing founder modelling already shows post-2027 outcomes can worsen where no specific relief applies. But the stronger claims about fewer AI companies, fewer high-growth jobs, and fewer ambitious young Australians staying in Australia are still causal predictions rather than settled facts in the primary sources.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-startup-upside-less-attractive",
        verbatim:
          "take the risk here, but we'll make the upside less attractive ... That is what the CGT reform does.",
        paraphrased:
          "The CGT redesign can make startup-equity upside less attractive for founders, early employees, and investors.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.86,
        reasoning:
          "That direction is plausible and consistent with the site's existing founder-exit cases, but it is still assumption-sensitive. The magnitude depends on ownership structure, holding period, grandfathering, concession eligibility, and whether future founder-specific relief changes the outcome.",
        assumptionsRequired: [
          "Assumes the relevant startup-equity gain is materially exposed to the post-2027 regime.",
          "Assumes no targeted founder carve-out or concession meaningfully offsets the tax change."
        ],
        alternativeFramings: [
          "The redesign can weaken after-tax startup-equity upside in no-relief scenarios."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions eligibility overview",
            publisher: "Australian Taxation Office",
            section: "How the concessions work",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/cgt-concessions-eligibility-overview",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions allow you to reduce, disregard or defer some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-fewer-ai-companies-and-young-people-stay",
        verbatim:
          "Tax the upside harder, and fewer people take the risk. Fewer founders. Fewer AI companies. Fewer high-growth jobs. Fewer reasons for ambitious young people to stay in Australia.",
        paraphrased:
          "Harder taxation of startup upside will reduce risk-taking, AI company formation, high-growth jobs, and the incentive for ambitious young Australians to stay.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "This is a multi-step behavioural forecast. It may capture real founder anxiety, but the current primary sources do not establish that the CGT redesign will dominate other ecosystem, lifestyle, labour-market, and policy factors strongly enough to produce those aggregate outcomes.",
        assumptionsRequired: [
          "Assumes tax settings are a major driver of whether ambitious young Australians build and stay in Australia.",
          "Assumes offsetting startup-support measures and non-tax reasons to stay are not strong enough to blunt the effect."
        ],
        alternativeFramings: [
          "The redesign may add friction to startup formation and retention, but the scale of any effect is uncertain."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Business support measures",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens some founder-exit tax settings while also expanding venture capital and startup-support measures, which is why ecosystem-wide effects remain contestable."
          }
        ]
      },
      {
        id: "claim-budget-disaster-for-young-builders",
        verbatim:
          "This budget seems like a disaster for young Australians who want to build something meaningful.",
        paraphrased:
          "The Budget is a disaster for ambitious young builders.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a value judgement about the overall meaning of the package, not a discrete proposition that the primary sources can settle on their own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post sees the Budget as broadly anti-builder and anti-startup."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Tax reform and business support",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package combines tighter CGT treatment with separate business-support measures, so its overall meaning remains contestable rather than mechanically settled by the policy text."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-shares-debt-recycling-claim",
    title: "r/AusFinance post arguing debt recycling into shares still works because share deductibility is unchanged",
    submittedAt: "2026-05-13T09:50:00Z",
    posterLabel: "r/AusFinance trending post",
    posterNamedPublicly: false,
    sourceUrl: "https://www.reddit.com/r/AusFinance/comments/1taxfuo/tax_reform_small_relief_for_debt_recycling_into/",
    rawText:
      "Tax reform: Small relief for debt recycling into shares (negative gearing not affected) ... other asset classes, such as shares, will remain subject to existing arrangements.",
    summary:
      "This is one of the cleaner r/AusFinance mechanics posts. It is supported that the Budget's negative-gearing clampdown is aimed at residential property and that shares remain under existing deductibility arrangements. The stronger 'small relief' framing is interpretive, because whether that materially improves the relative appeal of debt recycling depends on the investor's rate, the higher post-2027 CGT burden on share gains, and what they are comparing shares against.",
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-shares-existing-arrangements",
        verbatim:
          "other asset classes, such as shares, will remain subject to existing arrangements.",
        paraphrased:
          "The Budget does not remove existing deductibility arrangements for shares.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "The official Budget tax explainer says the negative-gearing restrictions target residential property and that other asset classes, including shares, remain under existing arrangements.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The residential-property negative-gearing changes do not extend the same way to ordinary share investments."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "Other asset classes, such as shares, will remain subject to existing arrangements."
          }
        ]
      },
      {
        id: "claim-debt-recycling-into-shares-still-available",
        verbatim:
          "Tax reform: Small relief for debt recycling into shares (negative gearing not affected)",
        paraphrased:
          "Debt recycling into shares remains legally available after the Budget because the property-focused negative-gearing restrictions do not shut off share deductibility.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "If share deductibility stays under existing arrangements, the Budget does not itself eliminate debt recycling into shares. Whether it is still attractive is a separate question, but the legal-availability point is supported.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget changes do not by themselves switch off debt recycling into shares."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "Other asset classes, such as shares, will remain subject to existing arrangements."
          }
        ]
      },
      {
        id: "claim-debt-recycling-small-relief",
        verbatim:
          "Tax reform: Small relief for debt recycling into shares",
        paraphrased:
          "The Budget meaningfully improves the relative case for debt recycling into shares.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.81,
        reasoning:
          "That may be true relative to buying established housing with restricted loss deductibility, but it is not automatic. The relative appeal still depends on the investor's marginal rate, expected returns, financing costs, and the fact that the Budget also worsens post-2027 CGT treatment for shares.",
        assumptionsRequired: [
          "Assumes the relevant comparison is against established residential property after the negative-gearing restrictions begin.",
          "Assumes the investor still finds shares attractive despite the new CGT settings."
        ],
        alternativeFramings: [
          "The property-focused restriction can make shares look relatively less penalised than established housing, even though shares face their own CGT changes."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "partially_supports",
            relevantPassage:
              "Other asset classes, such as shares, will remain subject to existing arrangements."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-fire-bridge-phase-claim",
    title: "r/fiaustralia post arguing the Budget re-prices FIRE bridge-phase investing before preservation age",
    submittedAt: "2026-05-13T09:34:00Z",
    posterLabel: "r/fiaustralia trending post",
    posterNamedPublicly: false,
    sourceUrl: "https://www.reddit.com/r/fiaustralia/comments/1tayuym/what_the_12_may_budget_actually_changes_for/",
    rawText:
      "Tonight's Budget didn't touch super ... but it materially re-priced the non-super side of the wealth-build. Three structural changes do the work, and the CGT one is the one that bites the bridge-phase realisation strategy most Australian FI plans rely on. ... Gains crystallised before 1 July 2027 keep the 50% discount.",
    summary:
      "This was one of the clearest high-signal r/fiaustralia threads. It is correct that gains realised before 1 July 2027 remain under the old 50 per cent discount and that the Budget materially changes the after-tax maths for non-super investing. But the stronger claim that the CGT change is the defining hit to the bridge-phase strategy most FIRE plans rely on is still assumption-sensitive. That depends on the investor's cost base, inflation path, drawdown pattern, and how much of their pre-retirement bridge actually sits outside super.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a long-horizon ETF case so the bridge-phase and after-tax FIRE claims can be pressure-tested against inflation, return, and tax-rate assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-fire-bridge-cgt-change-is-main-hit",
        verbatim:
          "the CGT one is the one that bites the bridge-phase realisation strategy most Australian FI plans rely on.",
        paraphrased:
          "For many FIRE-style investors, the CGT redesign is the main Budget change that worsens the non-super bridge to preservation age.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "That is plausible for investors who rely heavily on taxable share portfolios to bridge the years before super access. But it is not a universal FIRE fact. The relative impact depends on how much of the plan sits outside super, the embedded gain in the portfolio, inflation assumptions, and the investor's marginal tax profile at realisation.",
        assumptionsRequired: [
          "Assumes the investor's bridge strategy is meaningfully exposed to post-2027 CGT on realised share gains.",
          "Assumes other Budget measures matter less for the individual's plan than the CGT redesign."
        ],
        alternativeFramings: [
          "The CGT redesign can materially worsen bridge-phase maths for FIRE investors who depend on long-held taxable portfolios before age 60."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "Replacing the 50 per cent discount with indexed treatment and a 30 per cent minimum tax changes the after-tax result for realised gains, which is why bridge-phase FIRE planning can worsen under some portfolio assumptions."
          }
        ]
      },
      {
        id: "claim-fire-50pct-discount-replaced-from-2027",
        verbatim:
          "1. 50% CGT discount being replaced (effective 1 July 2027).",
        paraphrased:
          "The 50 per cent CGT discount is replaced from 1 July 2027.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "The official Budget materials state that the 50 per cent discount is replaced from 1 July 2027 by indexed treatment plus a minimum 30 per cent tax on gains.",
        assumptionsRequired: [],
        alternativeFramings: [
          "From 1 July 2027, the old 50 per cent discount no longer governs new gains for affected taxpayers."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-fire-pre-july-2027-gains-keep-discount",
        verbatim:
          "Gains crystallised before 1 July 2027 keep the 50% discount.",
        paraphrased:
          "Gains arising before 1 July 2027 remain under the old 50 per cent discount treatment.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "The Budget materials explicitly say the CGT reforms only apply to gains arising after 1 July 2027, preserving old treatment for earlier gains.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign is prospective for gains arising after 1 July 2027 rather than a full rewrite of prior accrued gains."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The CGT reforms will only apply to gains arising after 1 July 2027."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-pre-cgt-tax-explainer-claim",
    title: "Post quoting the Budget tax explainer on pre-1985 assets entering the post-2027 CGT regime",
    submittedAt: "2026-05-13T09:13:00Z",
    posterLabel: "Public tax commentary post",
    posterNamedPublicly: false,
    rawText:
      "\"These changes will apply to all CGT assets, including pre-1985 CGT assets, held by individuals, trusts and partnerships ... Capital gains on pre-1985 assets arising before 1 July 2027 will remain exempt from CGT.\"",
    summary:
      "This post is materially supported by the official Budget 2026 tax explainer. The explainer states that the post-2027 CGT changes apply to all CGT assets, including legacy assets acquired before 1985, with gains accrued before 1 July 2027 remaining exempt and later gains moving into the new indexed regime. The extra Division 149 comment is a legal-implication inference rather than a cleanly stated policy fact, but the core pre-CGT transition claim itself is supported by the primary source.",
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-pre-1985-assets-post-2027-gains-caught",
        verbatim:
          "These changes will apply to all CGT assets, including pre-1985 CGT assets ... Capital gains on pre-1985 assets arising before 1 July 2027 will remain exempt from CGT.",
        paraphrased:
          "Legacy pre-1985 assets keep their exemption for gains accrued before 1 July 2027, but later gains move into the new post-2027 CGT regime.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.96,
        reasoning:
          "The official Budget 2026 tax explainer states this directly. It says the CGT redesign applies broadly to all CGT assets and that the transitional arrangements also apply to legacy assets, including those purchased before 1985, while gains accrued before 1 July 2027 remain exempt.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Pre-1985 assets are not fully exempt forever under the new Budget design: only gains accrued before 1 July 2027 keep the exemption."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Transitional arrangements for capital gains tax",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "These transitional arrangements also apply to legacy assets, including those purchased before 1985. Gains on pre-1985 assets accrued before 1 July 2027 will continue to be exempt."
          }
        ]
      },
      {
        id: "claim-division-149-no-longer-issue",
        verbatim:
          "I guess, Division 149 will no longer be an issue.",
        paraphrased:
          "The Budget change materially reduces the practical relevance of Division 149 for pre-CGT assets.",
        claimType: "legal_inference",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.75,
        reasoning:
          "This is a technical legal inference from the broader policy change, not a line stated in the Budget itself. If pre-1985 assets are going to be valued at 1 July 2027 and later gains become taxable anyway, some existing pre-CGT integrity rules may matter less in practice. But the exact legal interaction depends on the legislation and transitional design, so this should not be treated as a cleanly settled fact yet.",
        assumptionsRequired: [
          "Assumes the enacted legislation follows the explainer closely enough that pre-CGT status becomes less practically valuable after 1 July 2027.",
          "Assumes no material transitional interaction preserves Division 149 relevance in edge cases."
        ],
        alternativeFramings: [
          "If the legislation follows the explainer, some pre-CGT integrity questions may become less important after 1 July 2027."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Transitional arrangements for capital gains tax",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "partially_supports",
            relevantPassage:
              "Assets owned prior to 1 July 2027 and sold after 1 July 2027 will be treated under current arrangements on gains made prior to this date, and under the new arrangements for gains made after this date."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-founder-chalmers-follow-up-claim",
    title: "Founder post urging Jim Chalmers to follow through on startup-equity CGT consultation",
    submittedAt: "2026-05-13T09:12:00Z",
    posterLabel: "Public founder post",
    posterNamedPublicly: false,
    rawText:
      "The proposed CGT change (if startup equity is included) would roughly double the tax on a successful founder exit in Australia from an effective ~23.5% today to ~46-47% under the new rules. ... and slowly but surely, entrepreneurs and their kids will leave. ... The treasurer is apparently interested in consulting with stakeholders on the treatment of early-stage and start-up businesses in the new CGT mix because of the outcry.",
    summary:
      "This post mixes one narrow founder-exit arithmetic claim, one consultation claim, and one broader capital-flight warning. The effective-rate comparison is directionally consistent with the no-relief founder cases already modelled on the site, but it still depends on assumptions about personal ownership, concession relief, and how much of the gain is exposed to the post-2027 regime. The quoted consultation claim is not established by the reviewed official Budget materials, even though startup backlash around the issue is plainly real in public commentary. The broader claim that entrepreneurs and their children will slowly leave Australia remains a behavioural forecast rather than a fact settled by the primary source set.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the quoted founder-equity CGT claim can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-founder-exit-23point5-to-46point47",
        verbatim:
          "The proposed CGT change (if startup equity is included) would roughly double the tax on a successful founder exit in Australia from an effective ~23.5% today to ~46-47% under the new rules.",
        paraphrased:
          "In a no-relief founder-equity scenario, the effective tax burden can move from roughly 23.5 per cent under the old discount system to something around 46 to 47 per cent under the new rules.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.87,
        reasoning:
          "This is broadly the same arithmetic frame as the existing founder-exit cases on the site. A top-rate individual founder under the old 50 per cent discount can face something like a 23.5 per cent effective rate on discounted gains, while the post-2027 treatment can approach the top marginal rate where indexation does little and no concession meaningfully reduces the gain. But the claim is still narrower than the post states: it assumes startup equity is fully within the new treatment, that little or no relief applies, and that the economically relevant gain is exposed to the post-2027 regime.",
        assumptionsRequired: [
          "Assumes an individual founder taxed at or near the top marginal rate including Medicare.",
          "Assumes no small business CGT concession or targeted founder relief materially reduces the gain.",
          "Assumes the relevant founder gain is substantially post-1 July 2027."
        ],
        alternativeFramings: [
          "Some no-relief founder exits can move from the old discounted-gain benchmark toward a near-top-rate outcome under the redesign.",
          "The exact rate shift depends on cost base, timing, and concession eligibility."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "partially_supports",
            relevantPassage:
              "Resident top marginal tax settings provide the benchmark for the 46 to 47 per cent no-relief founder scenario."
          },
          {
            title: "ATO: Small business CGT concessions eligibility overview",
            publisher: "Australian Taxation Office",
            section: "How the concessions work",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/cgt-concessions-eligibility-overview",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions allow you to reduce, disregard or defer some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-entrepreneurs-and-kids-will-leave",
        verbatim:
          "and slowly but surely, entrepreneurs and their kids will leave.",
        paraphrased:
          "The CGT redesign will gradually push entrepreneurs and their families to leave Australia.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "This is a longer-horizon founder-migration forecast. It may resonate with visible founder anxiety, but the primary source set does not establish that tax will dominate family, market, policy and lifestyle considerations strongly enough to produce that outcome in aggregate.",
        assumptionsRequired: [
          "Assumes founder location and family decisions are heavily driven by the founder-exit tax setting.",
          "Assumes offsetting startup incentives and non-tax reasons to stay are not strong enough to keep a material share of founders in Australia."
        ],
        alternativeFramings: [
          "The redesign may contribute to founder relocation risk, but the magnitude is uncertain and highly context-dependent."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Business support measures",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens founder-exit tax settings while also expanding venture capital and startup support, which is why aggregate relocation effects remain contestable."
          }
        ]
      },
      {
        id: "claim-treasurer-interested-in-consulting-with-stakeholders",
        verbatim:
          "The treasurer is apparently interested in consulting with stakeholders on the treatment of early-stage and start-up businesses in the new CGT mix because of the outcry.",
        paraphrased:
          "The official Budget response includes a Treasuer-led consultation commitment on startup-business treatment in the new CGT mix.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.86,
        reasoning:
          "That claim may reflect media reporting or off-budget remarks, but it is not established by the official Budget materials reviewed by the site. The same gap has appeared in other founder posts and remains unsupported on the current primary-source basis.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The reviewed Budget materials do not themselves surface a specific startup-equity consultation commitment."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Reviewed policy announcements",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The reviewed page sets out the CGT redesign and startup-support measures, but does not identify the quoted startup-equity consultation wording."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-shares-30pct-floor-mp-letter-claim",
    title: "Post and MP letter arguing the 30 per cent floor on share gains is regressive for young and middle-income investors",
    submittedAt: "2026-05-13T09:25:00Z",
    posterLabel: "Public investing post",
    posterNamedPublicly: false,
    rawText:
      "the minimum 30% CGT applied to shares ... the 30% floor is a regressive measure that unfairly targets low-to-middle income Australians trying to build wealth through shares and ETFs ... By mandating a 30% floor, the government is effectively imposing a flat tax that ignores the progressive nature of the Australian tax system.",
    summary:
      "This post is strongest when it focuses on the 30 per cent floor itself. The Budget does apply a 30 per cent minimum tax floor to post-2027 capital gains, including share and ETF gains, and that floor can bear more heavily on lower- and middle-rate investors than a pure progressive-rate approach would. The broader claim that the reform hurts young people more than it helps them is still an all-things-considered judgement that depends on housing, income, and portfolio assumptions. But the narrower design criticism of the floor as flattening outcomes across brackets is materially grounded in the announced tax mechanics.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the 30 per cent floor critique can be pressure-tested against tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 3,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-30pct-floor-applies-to-shares",
        verbatim:
          "the minimum 30% CGT applied to shares",
        paraphrased:
          "The post-2027 30 per cent minimum capital-gains tax floor applies to share gains as well as property and other CGT assets.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "The Budget text describes a broad capital-gains redesign rather than a property-only rule, so ordinary share gains are within scope.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The 30 per cent floor is part of the broad CGT redesign, not just the housing package."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-30pct-floor-regressive-low-middle-income-shares",
        verbatim:
          "the 30% floor is a regressive measure that unfairly targets low-to-middle income Australians trying to build wealth through shares and ETFs.",
        paraphrased:
          "The 30 per cent floor can fall more harshly on low- and middle-rate share and ETF investors than a pure progressive-rate treatment would.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.88,
        reasoning:
          "That narrower design point is materially right. A flat minimum floor binds hardest where a taxpayer's marginal rate would otherwise be lower than 30 per cent, which is why the floor can compress away part of the ordinary progressivity of the tax system for some lower- and middle-rate investors.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The floor is one reason lower- and middle-rate investors may lose more of the apparent benefit of indexation than the headline reform suggests."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The reform introduces a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "supports",
            relevantPassage:
              "Resident marginal tax rates below 30 per cent show why a flat 30 per cent floor binds differently across taxpayers."
          }
        ]
      },
      {
        id: "claim-30pct-floor-flat-tax-ignores-progressive-system",
        verbatim:
          "By mandating a 30% floor, the government is effectively imposing a flat tax that ignores the progressive nature of the Australian tax system.",
        paraphrased:
          "The 30 per cent floor effectively flattens part of the progressive tax schedule for affected capital gains.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.87,
        reasoning:
          "This is a fair characterisation of the floor's design effect when kept narrowly framed. The ordinary income-tax system remains progressive overall, but the 30 per cent floor does impose a common minimum rate on affected gains regardless of whether the taxpayer's normal marginal rate would otherwise be lower.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The floor overrides ordinary lower marginal-rate outcomes for some taxpayers on eligible gains."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The reform introduces a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "supports",
            relevantPassage:
              "Resident rates below 30 per cent illustrate the degree to which the floor departs from pure progressive-rate treatment."
          }
        ]
      },
      {
        id: "claim-young-people-hurt-more-than-helped-by-floor",
        verbatim:
          "This screws over young people way more than it helps them ... It raises the cost of the one wealth building option still available to me while getting locked out of the property market.",
        paraphrased:
          "The 30 per cent floor hurts young people more than the wider Budget package helps them.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "This broader claim goes beyond the floor's design mechanics and depends on how much young households actually rely on shares and ETFs, whether housing-policy benefits offset that hit, and what other Budget measures matter to them.",
        assumptionsRequired: [
          "Assumes shares and ETFs are the main practical wealth-building path for the affected younger cohort.",
          "Assumes wider housing and fiscal effects do not offset the tighter tax treatment."
        ],
        alternativeFramings: [
          "The 30 per cent floor can be criticised for tightening one of the non-property wealth paths some younger households use."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and housing reform",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package combines a broad CGT redesign with housing reform goals, but does not itself settle the overall effect on younger investors."
          }
        ]
      },
      {
        id: "claim-shares-caught-in-blast-radius",
        verbatim:
          "shares investing is caught in the blast radius.",
        paraphrased:
          "Shares were unintentionally caught up in a property-focused reform package.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.89,
        reasoning:
          "This is a framing judgement about legislative intent rather than a discrete factual claim.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues the package reaches non-property assets more broadly than many people expected from the housing debate."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package pairs a broad CGT redesign with housing-focused negative-gearing changes, which is why some investors describe non-property assets as collateral damage."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-fire-withdrawal-cgt-claim",
    title: "FIRE post arguing the new CGT rules raise the portfolio needed for the same after-tax withdrawal",
    submittedAt: "2026-05-13T09:23:00Z",
    posterLabel: "Public investing post",
    posterNamedPublicly: false,
    rawText:
      "Under the new method ... If you were to withdraw $60,000 in shares in 30 years ... you would pay 30% tax on the difference ... your $60,000 withdrawal under the new rules would hypothetically net you about $44,500 after tax instead of $52,500 under the old rules. If you wanted to maintain an after-tax withdrawal rate of $52,500, you would need to withdraw approximately $70,000 per year. Making your FIRE target $1.75 million, instead of the old $1.5 million.",
    summary:
      "This post is a useful worked example, but it is highly assumption-sensitive. The Budget does replace the 50 per cent CGT discount with inflation indexation plus a 30 per cent minimum tax from 1 July 2027, and that can materially worsen after-tax withdrawal maths for long-horizon share investors. But the specific FIRE outputs here depend on hidden assumptions about the investor's marginal tax rate under the old system, the exact interaction of the 30 per cent floor with indexed gains, the cost-base method, and whether the 4 per cent rule is being applied pre-tax or post-tax. The directional point is strong; the precise portfolio jump from $1.5 million to $1.75 million is not automatic from the policy text alone.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the FIRE withdrawal and after-tax portfolio target claim can be pressure-tested against tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-fire-old-system-12point5pct-tax",
        verbatim:
          "the general consensus seems to be tax paid would be around 10-15% of your income. I will split the difference and say 12.5% tax.",
        paraphrased:
          "A typical FIRE-style withdrawal under the old system can be modelled as facing about a 12.5 per cent effective tax rate.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.77,
        reasoning:
          "That may be a workable simplifying assumption for some portfolios, but it is not a generally established FIRE tax rule. The effective rate depends on cost base, discount eligibility, other taxable income, and how much of the withdrawal is capital gain versus principal.",
        assumptionsRequired: [
          "Assumes a particular mix of embedded gains and cost base in the portfolio.",
          "Assumes a specific personal tax position rather than a general FIRE investor."
        ],
        alternativeFramings: [
          "Any old-system FIRE tax estimate needs an explicit cost-base and marginal-rate assumption."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "ATO: CGT discount",
            publisher: "Australian Taxation Office",
            section: "How the CGT discount works",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount",
            supports: "partially_supports",
            relevantPassage:
              "The CGT discount reduces the taxable capital gain, but the investor's actual effective tax rate still depends on their circumstances."
          }
        ]
      },
      {
        id: "claim-fire-60k-withdrawal-nets-44point5k-new-rules",
        verbatim:
          "your 60,000 withdrawal under the new rules would hypothetically net you about $44,500 after tax instead of $52,500 under the old rules.",
        paraphrased:
          "On the post's assumptions, a $60,000 annual share withdrawal would leave about $44,500 after tax under the new rules rather than about $52,500 under the old ones.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "A materially worse after-tax withdrawal outcome is plausible under the new regime for a long-horizon share portfolio. But the exact net amounts depend on the portfolio's embedded gain, indexed cost base, inflation path, floor interaction, and the investor's personal tax treatment under the old system.",
        assumptionsRequired: [
          "Assumes the post's 30-year return and inflation inputs are appropriate and internally consistent.",
          "Assumes the cost-base arithmetic and floor application are being computed correctly for the chosen withdrawal."
        ],
        alternativeFramings: [
          "The new regime can materially reduce after-tax FIRE withdrawals in some long-horizon share scenarios, but the exact net figure depends on disclosed inputs."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-fire-target-rises-1point5m-to-1point75m",
        verbatim:
          "If you wanted to maintain an after-tax withdrawal rate of $52,500, you would need to withdraw approximately $70,000 per year. Making your FIRE target $1.75 million, instead of the old $1.5 million.",
        paraphrased:
          "Maintaining the same after-tax FIRE income under the new rules pushes the required portfolio from about $1.5 million to about $1.75 million.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "That conclusion follows from the post's own assumed tax outputs, but those outputs are themselves assumption-heavy. The 4 per cent rule is also a heuristic rather than a tax-specific theorem, so treating the portfolio jump as a clean mechanical consequence overstates the certainty of the result.",
        assumptionsRequired: [
          "Assumes the 4 per cent rule is the right baseline and is being applied consistently pre-tax versus post-tax.",
          "Assumes the post's after-tax withdrawal estimates are correct."
        ],
        alternativeFramings: [
          "On some FIRE-style assumptions, the new CGT regime can materially raise the portfolio needed to sustain the same after-tax withdrawal."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The post-2027 CGT redesign changes the tax treatment of realised gains, which is why FIRE withdrawal maths can change materially under some assumptions."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-all-cgt-assets-shares-etfs-claim",
    title: "Explainer post on how the CGT redesign reaches shares and ETFs, including pre-CGT transition treatment",
    submittedAt: "2026-05-13T09:22:00Z",
    posterLabel: "Public explainer post",
    posterNamedPublicly: false,
    rawText:
      "Australia is effectively abolishing the current 50% CGT discount for most investors from 1 July 2027 ... This applies broadly to shares, ETFs and other CGT assets ... Existing holdings get transitional protection ... Even pre-1985 assets lose their blanket exemption for future gains after that date ... On negative gearing ... shares and ETFs keep current deductibility rules.",
    summary:
      "This post is mostly solid on the mechanics of the new CGT and negative-gearing split. It is correct that the 50 per cent CGT discount is being replaced from 1 July 2027 by inflation-based treatment plus a 30 per cent minimum tax, and that the redesign reaches shares, ETFs and other non-property CGT assets. It is also right that existing holdings only move to the new treatment for gains arising after 1 July 2027, that legacy pre-1985 assets keep their exemption for gains accrued before that date but not indefinitely after it, and that the negative-gearing changes are mainly about residential property rather than share or ETF deductibility.",
    overallVerdictMix: {
      supported: 5,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-growth-strategy-died-rhetoric",
        verbatim:
          "...and the growth strategy just died...",
        paraphrased:
          "The CGT redesign kills Australia's growth strategy.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a political-economic judgement about the meaning of the package, not a discrete factual proposition the primary source set can settle on its own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the redesign weakens incentives for productive long-term investment."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and business support",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens CGT treatment while also claiming to encourage productive investment and innovation."
          }
        ]
      },
      {
        id: "claim-cgt-redesign-applies-to-shares-etfs-other-assets",
        verbatim:
          "This applies broadly to shares, ETFs and other CGT assets held by individuals, trusts and partnerships.",
        paraphrased:
          "The post-2027 CGT redesign applies broadly to shares, ETFs and other CGT assets, not just property.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.93,
        reasoning:
          "The Budget text describes a broad redesign of the CGT discount system rather than a property-only capital-gains rule.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The capital-gains change is broader than housing and reaches ordinary share and ETF holdings."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-existing-holdings-only-post-2027-gains-shift",
        verbatim:
          "Existing holdings get transitional protection: only gains accruing after 1 July 2027 move to the new rules, while gains built up before that date can still use the old 50% CGT discount.",
        paraphrased:
          "Existing holdings remain under the old discount for pre-1 July 2027 gains, with only later gains moving to the new regime.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The Budget materials explicitly say the CGT reforms only apply to gains arising after 1 July 2027.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The redesign is prospective for gains arising after 1 July 2027 rather than a full retrospective rewrite of past gains."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The CGT reforms will only apply to gains arising after 1 July 2027."
          }
        ]
      },
      {
        id: "claim-pre-1985-assets-lose-blanket-exemption",
        verbatim:
          "Even pre-1985 assets lose their blanket exemption for future gains after that date, although gains accrued before 1 July 2027 stay exempt.",
        paraphrased:
          "Pre-1985 assets lose their blanket CGT exemption for future gains after 1 July 2027.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "The official Budget tax explainer does establish this transition. It says the CGT changes apply to legacy assets, including those purchased before 1985, while gains accrued before 1 July 2027 remain exempt. That means later gains on those assets move into the new regime.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Pre-1985 assets preserve their exemption only for gains accrued before 1 July 2027, with later gains moving to the new rules."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Transitional arrangements for capital gains tax",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "These transitional arrangements also apply to legacy assets, including those purchased before 1985. Gains on pre-1985 assets accrued before 1 July 2027 will continue to be exempt."
          }
        ]
      },
      {
        id: "claim-long-term-investing-still-tax-advantaged-but-smaller-break",
        verbatim:
          "for most ordinary share and ETF investors, this means long-term investing remains tax-advantaged because inflation gets stripped out, but the tax break becomes materially smaller than the current 50% discount, especially during low-inflation periods.",
        paraphrased:
          "For many ordinary share and ETF investors, long-term investing stays tax-advantaged but with a materially smaller break than the current 50 per cent discount.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "That is often directionally right, especially in low-inflation periods or where the 30 per cent floor binds. But the size of the remaining advantage and whether it is materially smaller in a given case depend on inflation, holding period, marginal rate, and the embedded gain profile.",
        assumptionsRequired: [
          "Assumes inflation remains low enough that indexation provides less benefit than the old discount.",
          "Assumes the investor's rate and holding period make the 30 per cent floor or reduced discount benefit relevant."
        ],
        alternativeFramings: [
          "The post-2027 regime can leave long-term investing tax-advantaged relative to nominal-gain taxation, but often less favoured than the old 50 per cent discount."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The redesign taxes real gains rather than applying the old flat 50 per cent discount, which changes the relative benefit depending on the investor's circumstances."
          }
        ]
      },
      {
        id: "claim-negative-gearing-mostly-property-not-shares",
        verbatim:
          "On negative gearing, the changes are mostly about residential property, not shares or ETFs. Shares and ETFs keep current deductibility rules.",
        paraphrased:
          "The negative-gearing changes mainly target residential property rather than changing share or ETF deductibility.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "The negative-gearing changes are framed around residential property and new versus established housing. The reviewed materials do not announce an equivalent deductibility change for shares or ETFs.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget separates the broad CGT redesign from the property-specific negative-gearing restrictions."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "The new negative-gearing restrictions apply to established residential property purchased after Budget night, while the broader CGT redesign is set out separately."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-chatgpt-founder-effective-rate-claim",
    title: "Quoted analysis claiming high-growth founders face something close to a doubling of the top effective CGT rate",
    submittedAt: "2026-05-13T09:09:00Z",
    posterLabel: "Quoted AI analysis",
    posterNamedPublicly: false,
    rawText:
      "\"CGT: for high-growth founders, the reform is close to a doubling of the top effective rate. For a founder whose shares compound at high rates, almost all of the exit value is real gain, so the effective tax rate tends toward the top marginal rate, around 45–47% depending on Medicare levy and exact tax settings.\"",
    summary:
      "This quoted analysis is directionally consistent with the no-relief founder cases already in the corpus, but it still depends on important hidden assumptions. The Budget does replace the 50 per cent CGT discount with inflation indexation plus a 30 per cent minimum tax from 1 July 2027, which can move a founder from something like a 23.5 per cent effective rate on discounted gains to a rate much closer to the top marginal rate in a high-real-gain scenario. But the stronger 'close to a doubling' framing still assumes individual ownership, little or no concession relief, mostly post-2027 gains, and a business exit where the gain remains largely real rather than inflation-indexed away.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the quoted 'near doubling' founder-tax claim can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-high-growth-founders-near-doubling-top-effective-rate",
        verbatim:
          "for high-growth founders, the reform is close to a doubling of the top effective rate",
        paraphrased:
          "For some high-growth founder exits, the reform can take the effective tax burden from roughly the old discounted-gain rate to something close to double that level.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.86,
        reasoning:
          "This is directionally plausible in the narrow no-relief founder scenario already modelled on the site. Under the old system, a founder on the top marginal rate could face an effective rate of roughly 23.5 per cent on a discounted capital gain, while the post-2027 system can push the effective rate much closer to the top marginal rate where indexation provides little shelter relative to the real gain. But 'close to a doubling' is not a universal founder result: it depends on the gain being mostly post-2027, on relief not materially reducing the gain, and on the founder being taxed personally at or near the top rate.",
        assumptionsRequired: [
          "Assumes the founder is an individual taxed at or near the top marginal rate.",
          "Assumes small business CGT concessions do not materially reduce or disregard the gain.",
          "Assumes most of the economically relevant gain is exposed to the post-1 July 2027 regime."
        ],
        alternativeFramings: [
          "In a no-relief top-rate founder scenario, the reform can move the effective tax burden from the old discounted-gain rate to something much closer to the full marginal rate.",
          "Whether that is 'close to double' depends on the founder's rate, holding period, inflation path, and concession eligibility."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "partially_supports",
            relevantPassage:
              "Top resident marginal tax settings determine how far a founder's effective rate can rise once the 50 per cent discount is removed."
          },
          {
            title: "ATO: Small business CGT concessions eligibility overview",
            publisher: "Australian Taxation Office",
            section: "How the concessions work",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/cgt-concessions-eligibility-overview",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions allow you to reduce, disregard or defer some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-high-growth-founder-effective-rate-tends-to-top-marginal-rate",
        verbatim:
          "For a founder whose shares compound at high rates, almost all of the exit value is real gain, so the effective tax rate tends toward the top marginal rate, around 45–47% depending on Medicare levy and exact tax settings.",
        paraphrased:
          "In a high-real-gain founder exit with little shelter from indexation or concessions, the effective tax rate can approach the top marginal personal rate, around 45 to 47 per cent depending on Medicare and settings.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.88,
        reasoning:
          "This is basically the zero-cost-base founder logic expressed in broader high-growth terms. If the founder's gain is overwhelmingly real rather than inflationary, indexation does relatively little work and the post-2027 tax treatment can converge toward the top marginal personal rate in a no-relief case. But the statement still needs narrowing: the actual effective rate varies with ownership structure, cost base, inflation, timing of accrual, and whether Subdivision 152 or other features materially reduce the gain.",
        assumptionsRequired: [
          "Assumes little shelter from cost-base uplift relative to the real gain.",
          "Assumes the founder is taxed personally at or near the top marginal rate including Medicare.",
          "Assumes no small business CGT concession materially reduces or disregards the gain."
        ],
        alternativeFramings: [
          "Some high-real-gain founder exits can face a post-2027 effective rate much closer to the top marginal personal rate than under the old discount system.",
          "The 45 to 47 per cent headline is a narrow no-relief benchmark, not a universal founder outcome."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The new regime replaces the 50 per cent discount with inflation indexation plus a 30 per cent minimum tax, creating scenarios where gains can be taxed much closer to ordinary top rates."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "partially_supports",
            relevantPassage:
              "Resident marginal tax settings provide the upper-bound personal-rate benchmark that the post uses for the founder exit case."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions",
            supports: "contradicts",
            relevantPassage:
              "How to claim the small business 15-year exemption on a business asset to reduce or disregard CGT."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-intergenerational-fairness-d-grade-claim",
    title: "Post arguing the Budget's housing and CGT package fails intergenerational fairness",
    submittedAt: "2026-05-13T09:09:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "The big one is the changes to negative gearing on residential property from 1 July 2027. It 'might' help younger first-home buyers. But here's the catch: the same CGT changes extend to all assets (shares, businesses, not just property). That hits the exact same younger generation this budget supposedly targets. Killing the 50% CGT discount and locking in 30% minimum tax on gains hurts wealth-building when you're starting out. Hard to call that intergenerational fairness. Score: D. Very unambitious.",
    summary:
      "This post mixes two clean policy-scope points with a broader intergenerational-fairness judgement. The Budget does change negative gearing settings for residential property from 1 July 2027, and the CGT redesign does extend beyond property to shares and businesses. But whether the package helps younger first-home buyers, or instead hurts the same generation's wider wealth-building prospects, depends on broader assumptions about housing, returns, savings pathways, and how the measures interact over time. The closing grade and 'very unambitious' line are political judgements rather than verifiable facts.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the intergenerational-fairness and wealth-building critique can be pressure-tested against tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-negative-gearing-residential-property-from-july-2027",
        verbatim:
          "The big one is the changes to negative gearing on residential property from 1 July 2027.",
        paraphrased:
          "Budget 2026 changes negative gearing settings for residential property from 1 July 2027.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "This is a clean policy-description point. The Budget materials say negative gearing will be limited to new builds from 1 July 2027, while established-housing investors who buy after Budget night lose the ability to deduct rental losses against other income like wages.",
        assumptionsRequired: [],
        alternativeFramings: [
          "From 1 July 2027, negative gearing is restricted for residential property rather than abolished across the board."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, negative gearing will be limited to new builds ... Investors who buy established housing after Budget night and make rental losses won't be able to deduct them against other income like wages."
          }
        ]
      },
      {
        id: "claim-might-help-younger-first-home-buyers",
        verbatim:
          "It 'might' help younger first-home buyers.",
        paraphrased:
          "The housing changes may help younger first-home buyers.",
        claimType: "causal",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.75,
        reasoning:
          "That is a cautious forward-looking claim, not a settled fact. It is plausible that tighter tax treatment of established-property investment could help some first-home buyers at the margin, but the size and direction of the effect depend on supply, prices, rents, investor behaviour, and how strongly the negative-gearing change feeds through to the housing market.",
        assumptionsRequired: [
          "Assumes the policy meaningfully reduces competition from leveraged established-property investors.",
          "Assumes any price or demand effect is not offset by other housing-market forces."
        ],
        alternativeFramings: [
          "The Government intends the housing changes to improve access for first-home buyers, but the magnitude of the effect is uncertain."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The measure is framed as a home-ownership reform, but the policy text alone does not quantify how much it will help younger first-home buyers in practice."
          }
        ]
      },
      {
        id: "claim-cgt-changes-extend-to-shares-and-businesses",
        verbatim:
          "the same CGT changes extend to all assets (shares, businesses, not just property).",
        paraphrased:
          "The CGT redesign extends beyond property to shares and businesses, not only housing.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The Budget text describes a broad replacement of the 50 per cent CGT discount with inflation indexation plus a 30 per cent minimum tax from 1 July 2027. That is not a property-only CGT rule, so shares and business assets are within scope unless specifically carved out.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign is a broad capital-gains change, not just a housing measure."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-hurts-starting-out-wealth-building-not-fairness",
        verbatim:
          "That hits the exact same younger generation this budget supposedly targets. Killing the 50% CGT discount and locking in 30% minimum tax on gains hurts wealth-building when you're starting out. Hard to call that intergenerational fairness.",
        paraphrased:
          "The package hurts younger people's early-stage wealth-building enough that the intergenerational-fairness framing is hard to sustain.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.81,
        reasoning:
          "This is the core normative and distributional argument in the post. It builds on two real mechanics: the CGT redesign reaches non-property assets, and younger households may use shares or businesses as alternate wealth paths. But whether that means the package overall undermines intergenerational fairness depends on broader assumptions about who currently benefits from the CGT discount, how younger households actually build wealth, and what offsetting housing effects the package delivers.",
        assumptionsRequired: [
          "Assumes the affected non-property wealth channels are a central savings path for the younger cohort in question.",
          "Assumes the package's housing benefits do not outweigh the tighter tax treatment on those other assets."
        ],
        alternativeFramings: [
          "The package can be criticised for tightening non-property wealth-building channels even while it is framed as helping younger Australians."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and housing reform",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package combines tighter investment-tax settings with a fairness and home-ownership rationale, but the policy text alone does not resolve the net intergenerational effect."
          },
          {
            title: "PBO: Operation of the CGT discount",
            publisher: "Parliamentary Budget Office",
            section: "Distribution of benefits",
            page: 1,
            url: "https://www.pbo.gov.au/publications-and-data/publications/costings/operation-CGT-discount",
            supports: "partially_supports",
            relevantPassage:
              "The distribution of current CGT discount benefits matters to any intergenerational-fairness argument, which is why broader fairness claims require more than the policy mechanics alone."
          }
        ]
      },
      {
        id: "claim-d-grade-very-unambitious",
        verbatim:
          "Score: D. Very unambitious.",
        paraphrased:
          "The Budget deserves a D grade and is very unambitious.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.94,
        reasoning:
          "This is a value judgement about the quality and ambition of the Budget, not a discrete factual claim capable of verification against the primary-source set.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author sees the package as weak and internally inconsistent rather than ambitious reform."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall package framing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government presents the package as reform for workers, businesses and future generations, which is the framing the post is grading negatively."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-keep-your-business-small-claim",
    title: "Post arguing the CGT redesign tells founders to keep their business small",
    submittedAt: "2026-05-13T09:05:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "The Government’s proposed changes to CGT actively discourage businesses from growing above either $6m in net value or $2m per year in aggregated turnover. With these thresholds remaining unchanged for over 15 years, the loss of the CGT discount from 1 July 2027 means a new business with a zero Goodwill cost, will gain no benefit from CPI indexation. That doubles the CGT on its sale if the owner cannot use the Small Business Concessions.",
    summary:
      "This post combines one supported threshold point, one mostly supported arithmetic point, and one broader behavioural claim. ATO guidance does confirm the small business CGT concession gateways at $6 million in net assets or under $2 million aggregated turnover, and the $6 million limit is explicitly not indexed for inflation. It is also directionally right that a zero-cost-base business gets no uplift from indexation itself. But the stronger jump from those mechanics to 'the Government is telling you to keep your business small' is a broader behavioural and design judgement rather than a cleanly verifiable fact, and the statement that tax 'doubles' on sale still depends on the owner's rate and relief eligibility.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the zero-cost-base and small-business-concession threshold claim can be pressure-tested against explicit relief assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-small-business-cgt-thresholds-discourage-growth",
        verbatim:
          "The Government’s proposed changes to CGT actively discourage businesses from growing above either $6m in net value or $2m per year in aggregated turnover.",
        paraphrased:
          "Because the small business CGT concession thresholds sit at $6 million in net assets or under $2 million aggregated turnover, the new regime creates a stronger tax disincentive to grow beyond those thresholds.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.84,
        reasoning:
          "The threshold mechanics are real: ATO guidance confirms the $6 million net-asset test and the under-$2 million aggregated-turnover gateway for the CGT concessions. But saying the reform 'actively discourages' growth above those thresholds is a behavioural and design inference. It is plausible, especially where founders are near the boundary and rely on concession access, but it is still stronger than the policy text alone proves.",
        assumptionsRequired: [
          "Assumes founders and owners materially change growth behaviour in response to the threshold-driven concession cliff.",
          "Assumes concession eligibility is the binding factor in the relevant exit scenarios."
        ],
        alternativeFramings: [
          "The redesign makes the small business CGT concession thresholds more consequential for founders who might otherwise outgrow them before exit.",
          "Threshold cliffs can create stronger tax-planning incentives once the general CGT treatment becomes harsher."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Maximum net asset value test",
            publisher: "Australian Taxation Office",
            section: "Threshold amount",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/maximum-net-asset-value-test",
            supports: "partially_supports",
            relevantPassage:
              "To meet the test, the total net value of CGT assets ... must not exceed $6 million ... The $6 million limit is not indexed for inflation."
          },
          {
            title: "CGT small business entity eligibility",
            publisher: "Australian Taxation Office",
            section: "Aggregated turnover threshold",
            page: 1,
            url: "https://www.ato.gov.au/Business/Income-and-deductions-for-business/Concessions%2C-offsets-and-rebates/Small-business-CGT-concessions/Small-business-CGT-concessions-eligibility-conditions/CGT-concessions-eligibility-overview/?page=4",
            supports: "partially_supports",
            relevantPassage:
              "You're a CGT small business entity ... if ... [your] aggregated turnover [is] less than $2 million."
          }
        ]
      },
      {
        id: "claim-thresholds-unchanged-over-15-years",
        verbatim:
          "With these thresholds remaining unchanged for over 15 years ...",
        paraphrased:
          "The relevant small business CGT concession thresholds have been effectively fixed for well over a decade, with the $6 million test explicitly not indexed.",
        claimType: "historical",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.87,
        reasoning:
          "The currently cited ATO guidance expressly says the $6 million maximum-net-asset limit is not indexed for inflation. The post's broad complaint that these thresholds have not moved for a very long time is directionally consistent with that design.",
        assumptionsRequired: [],
        alternativeFramings: [
          "At minimum, the $6 million maximum-net-asset test is explicitly not indexed, which means its real value shrinks over time."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Maximum net asset value test",
            publisher: "Australian Taxation Office",
            section: "Threshold amount",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/maximum-net-asset-value-test",
            supports: "supports",
            relevantPassage:
              "The $6 million limit is not indexed for inflation."
          }
        ]
      },
      {
        id: "claim-zero-goodwill-no-indexation-benefit-tax-doubles",
        verbatim:
          "a new business with a zero Goodwill cost, will gain no benefit from CPI indexation. That doubles the CGT on its sale if the owner cannot use the Small Business Concessions.",
        paraphrased:
          "A zero-cost-base business gets no direct uplift from indexation, and in a no-relief top-rate case the new regime can roughly double tax relative to the old discount system.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.89,
        reasoning:
          "The zero-cost-base arithmetic is real: indexation of a zero base still leaves zero. And in the standard no-relief founder scenario already modelled on the site, moving from the old discount system to the post-2027 regime can roughly double the tax burden. The caveat is that this depends on relief not applying and on the owner's specific tax position, which the post itself partly acknowledges by conditioning the claim on the owner not using the small business concessions.",
        assumptionsRequired: [],
        alternativeFramings: [
          "If goodwill really has a zero cost base and no small business CGT concession applies, the new regime can produce a dramatically higher sale-tax outcome than the old discount system."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "Small business CGT concessions eligibility overview",
            publisher: "Australian Taxation Office",
            section: "How the concessions work",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/cgt-concessions-eligibility-overview",
            supports: "supports",
            relevantPassage:
              "The small business CGT concessions allow you to reduce, disregard or defer some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-govt-keep-business-small-rhetoric",
        verbatim:
          "BUDGET 2027 - KEEP YOUR BUSINESS SMALL ... Honestly, who is doing the thinking in Government?",
        paraphrased:
          "The Government is effectively telling founders to keep their business small.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "This is the author's political characterisation of the threshold and CGT design rather than a discrete factual proposition. The underlying tax mechanics can be described, but this slogan-level conclusion is still an interpretive judgement.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues the threshold-and-concession design creates a stronger incentive to avoid outgrowing small-business CGT relief."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Small business CGT concessions eligibility conditions",
            publisher: "Australian Taxation Office",
            section: "Eligibility conditions overview",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/income-and-deductions-for-business/concessions-offsets-and-rebates/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions",
            supports: "partially_supports",
            relevantPassage:
              "The policy sets threshold-based eligibility conditions for accessing small business CGT relief, but it does not itself declare that businesses should remain small."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-young-people-house-prices-and-rentvesting-claim",
    title: "Post arguing the Budget barely slows house prices while taxing young people's fallback wealth paths",
    submittedAt: "2026-05-13T08:59:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "based on the government's own modelling, the removal of negative gearing, the removal of the 50% CGT discounts on existing properties & their other housing policies will have a tiny effect on house prices, reducing them by -1.0 to -4.5%. But house prices are still expected to rise by +4% instead of +6% ... Removing negative gearing is going to hurt rentvesters ... anyone already in the market with a negatively geared property keeps the tax benefit ... by extending the removal of the CGT discount to shares, businesses and crypto, the government is just making it harder for them by taxing them more.",
    summary:
      "This post combines several distinct claims: a specific house-price-modelling claim, a grandfathering claim about negative gearing, a rentvesting argument, and a scope claim about the CGT redesign reaching non-property assets. The grandfathering mechanics are real: current investors keep the benefit while later buyers of established housing lose access. It is also correct that the CGT redesign reaches shares and business assets, not only property. But the post's very specific house-price path numbers are not established by the current indexed source set here, and the stronger claims about what that means for young people or rentvesters depend on wider housing-market and household-behaviour assumptions.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the claim about taxing non-property wealth paths can be pressure-tested against tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-govt-modelling-house-prices-down-1-to-4point5-up-4-not-6",
        verbatim:
          "based on the government's own modelling ... house prices ... reducing them by -1.0 to -4.5%. But house prices are still expected to rise by +4% instead of +6%.",
        paraphrased:
          "Government modelling shows the package only modestly slows house-price growth, with prices still rising and only by about 1 to 4.5 percentage points less than otherwise.",
        claimType: "statistical",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.76,
        reasoning:
          "This is a specific quantitative modelling claim. The current indexed Budget summary pages used on the site establish the policy mechanics, but they do not themselves surface the exact '-1.0 to -4.5%' and '+4% instead of +6%' figures quoted in the post. That means the numbers may rely on Treasury modelling or commentary outside the source set currently attached to this fact-check.",
        assumptionsRequired: [
          "Assumes the quoted numbers are taken from an official modelling source not currently indexed here.",
          "Assumes the post is describing the same time horizon and price measure as the underlying modelling."
        ],
        alternativeFramings: [
          "The package may only modestly affect near-term house prices, but the exact quoted percentages need a directly cited modelling source."
        ],
        verificationMethod: "statistical_calculation",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Negative gearing and capital gains tax reform",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The page sets out the tax changes themselves, but does not in the current indexed summary provide the exact house-price path figures quoted in the post."
          }
        ]
      },
      {
        id: "claim-incumbents-keep-ng-benefit",
        verbatim:
          "Meanwhile, anyone already in the market with a negatively geared property keeps the tax benefit.",
        paraphrased:
          "Current negatively geared property investors keep the tax benefit under grandfathering.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The policy is grandfathered for existing holdings, so the new restriction does not simply strip the benefit from all current investors. The change mainly bites on later purchases of established housing and the treatment of losses after the cutoff.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Existing investors are protected by grandfathering while future established-property buyers face tighter rules."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "Investors who buy established housing after Budget night and make rental losses won't be able to deduct them against other income like wages ... From 1 July 2027, negative gearing will be limited to new builds."
          }
        ]
      },
      {
        id: "claim-removing-ng-hurts-rentvesters",
        verbatim:
          "Removing negative gearing is going to hurt them and impact their ability to build wealth.",
        paraphrased:
          "Restricting negative gearing will materially hurt rentvesters and reduce their ability to build wealth.",
        claimType: "causal",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "This is plausible for some rentvesting strategies, especially those relying on established-property losses being deductible against other income. But the size and net effect depend on property type, location, leverage, expected rents, prices, and whether other wealth-building channels offset the change.",
        assumptionsRequired: [
          "Assumes the affected cohort is primarily using established-property rentvesting strategies that rely on negative-gearing deductions.",
          "Assumes the loss of deductibility is not offset by other price, rent, or investment effects."
        ],
        alternativeFramings: [
          "The new rules can make some rentvesting strategies less attractive, especially for leveraged established-property buyers."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The policy removes the ability for later buyers of established housing to deduct losses against other income like wages, which can directly affect some rentvesting strategies."
          }
        ]
      },
      {
        id: "claim-cgt-removal-extended-to-shares-businesses-crypto",
        verbatim:
          "by extending the removal of the CGT discount to these asset classes, the government is just making it harder for them by taxing them more.",
        paraphrased:
          "The CGT redesign extends beyond property to shares, businesses and similar non-property assets.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The CGT redesign is not written as a property-only change. The Budget text describes a broad replacement of the CGT discount system, so shares and business assets are within scope unless a specific exception applies. The post's mention of crypto may also fall within capital-assets logic, but the cleanest supported point is that the reform extends beyond property into other investment assets.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign reaches non-property assets such as shares and business interests, not only housing."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-young-people-only-pathways-harder",
        verbatim:
          "the government is just making it harder for them by taxing them more. Young people are cooked.",
        paraphrased:
          "The package makes the only realistic wealth-building paths for young people materially harder.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "This is a broad intergenerational judgement spanning housing, shares, business formation, and household wealth accumulation. It builds on some real policy scope points, but the all-things-considered claim depends on wider assumptions about asset returns, housing access, earnings, and how younger households actually build deposits.",
        assumptionsRequired: [
          "Assumes the affected non-property wealth paths are the primary or only realistic paths for younger households.",
          "Assumes other Budget measures do not materially offset the tighter tax treatment."
        ],
        alternativeFramings: [
          "The package can be criticised for tightening multiple wealth-building channels that some younger households rely on."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and housing measures",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens some investment tax settings while also presenting itself as a fairness and home-ownership reform, so the net effect on younger households is not resolved by the policy text alone."
          }
        ]
      },
      {
        id: "claim-biggest-con-job-tax-grab",
        verbatim:
          "This feels like the biggest con job ever ... this is just one big tax grab.",
        paraphrased:
          "The package is a deceptive tax grab rather than a genuine intergenerational-equity reform.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a political characterisation of motive and framing, not a discrete factual claim that can be settled by the primary-source set alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the Government's fairness framing does not match the package's practical effects."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Tax reform for workers, businesses and future generations",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the package around fairness, home ownership and future generations, which is precisely the framing the post is disputing."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-negative-gearing-grandfathering-claim",
    title: "Post arguing negative gearing is grandfathered for incumbents while shares and founders are hit",
    submittedAt: "2026-05-13T08:49:00Z",
    posterLabel: "Screenshot of public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "Removing negative gearing is completely defensible policy ... but negative gearing is not being removed. Wealthy boomers very much keep their negative gearing. It's new buyers (of established properties: read young people), who will lose access. So this policy makes the situation WORSE not BETTER for young people. ... The truth: CGT reform will deter some activity around starting and selling businesses, but simultaneously reduce the tax-fuelled appeal of property investment. ... The CGT removal doesn't just apply to property ... but to all investments (like shares) and even worse, to founders who have zero cost base and will end up paying the highest capital gains tax rate in the world (47%).",
    summary:
      "This post combines one strong policy-mechanics claim with several broader behavioural and comparative claims. The Budget does not remove negative gearing in a blanket sense: current investors are grandfathered and post-Budget buyers of established housing lose access while new builds are treated differently. It is also correct that the CGT redesign reaches shares and other investments, not only property. But the statement that the policy therefore makes things worse for young people is a broader causal judgement, and the claim that founders with zero-cost-base businesses will face the highest capital-gains tax rate in the world is not established by the primary sources alone.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the zero-cost-base founder claim can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 2,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-negative-gearing-not-being-removed-blanket",
        verbatim:
          "negative gearing is not being removed.",
        paraphrased:
          "Budget 2026 does not abolish negative gearing across the board.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The package limits negative gearing rather than wiping it out in a universal sense. Existing investors are grandfathered, and the policy also distinguishes between established properties and new builds after the cutoff.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 ends negative gearing for many future established-property purchases, but not for everyone or every housing type."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "The Government will limit negative gearing to new builds from 1 July 2027 ... Investors who buy established housing after Budget night ... won't be able to deduct them against other income like wages."
          }
        ]
      },
      {
        id: "claim-incumbents-keep-ng-new-established-buyers-lose-access",
        verbatim:
          "Wealthy boomers very much keep their negative gearing. It's new buyers (of established properties: read young people), who will lose access.",
        paraphrased:
          "Existing residential investors keep grandfathered negative gearing, while post-Budget buyers of established properties lose access.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "The policy mechanics do favour incumbents over future buyers of established housing: the change is grandfathered for current holdings and the new restriction bites on later purchases of established property. The original post over-personalises that as 'wealthy boomers', but the underlying policy description is right.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The restriction is grandfathered for existing investors, so it mainly hits later buyers of established properties rather than current holders."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "Investors who buy established housing after Budget night and make rental losses won't be able to deduct them against other income like wages ... From 1 July 2027, negative gearing will be limited to new builds."
          }
        ]
      },
      {
        id: "claim-policy-worse-for-young-people",
        verbatim:
          "So this policy makes the situation WORSE not BETTER for young people.",
        paraphrased:
          "The negative-gearing and CGT package makes outcomes worse overall for young people.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "The post points to a real grandfathering asymmetry, but the all-things-considered claim about whether young people are worse off overall depends on how the package affects house prices, supply, rents, savings outside housing, wages, and investor behaviour over time. The primary policy text alone does not settle that combined outcome.",
        assumptionsRequired: [
          "Assumes the grandfathering and access effects outweigh any supply or price effects the package may have for younger households.",
          "Assumes the relevant young-person cohort is primarily trying to buy established property rather than benefiting elsewhere in the package."
        ],
        alternativeFramings: [
          "The grandfathering structure can be criticised as protecting incumbents while imposing tighter rules on later entrants.",
          "Whether that leaves young people worse off overall is a broader housing-market question."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The policy changes investor tax treatment, but the budget text does not itself resolve the full welfare effect for younger households."
          }
        ]
      },
      {
        id: "claim-cgt-change-applies-to-shares-and-all-investments",
        verbatim:
          "The CGT removal doesn't just apply to property ... but to all investments (like shares)",
        paraphrased:
          "The CGT redesign applies to shares and other investments, not only property.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The Budget text frames the CGT change as a broad redesign of the discount system rather than a housing-only rule. That means shares and other eligible capital assets are within scope unless specifically carved out.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign is broader than property and reaches shares too."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-cgt-reform-deters-business-starting-selling-and-reduces-property-appeal",
        verbatim:
          "CGT reform will deter some activity around starting and selling businesses, but simultaneously reduce the tax-fuelled appeal of property investment.",
        paraphrased:
          "The package will deter some founder activity while also reducing the tax-driven appeal of property investment.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.83,
        reasoning:
          "This is a directional behavioural judgement spanning two different markets. The policy text establishes the changed tax settings, but not the size or certainty of those responses.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The package can be argued to trade off weaker founder-exit incentives against weaker established-property tax preferences."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package pairs a stricter post-2027 CGT regime with tighter negative-gearing treatment for established housing."
          }
        ]
      },
      {
        id: "claim-zero-cost-base-founders-highest-cgt-rate-world-47",
        verbatim:
          "founders who have zero cost base and will end up paying the highest capital gains tax rate in the world (47%)",
        paraphrased:
          "Zero-cost-base founders will face the highest capital-gains tax rate in the world at 47 per cent.",
        claimType: "empirical_comparison",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.88,
        reasoning:
          "A zero-cost-base founder can indeed face a very harsh Australian outcome in a no-relief top-rate scenario, but the leap to 'highest in the world' is not established by the primary source set alone. It requires a fixed international comparison basket and a like-for-like treatment of founder concessions and entity structures elsewhere.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Some no-relief zero-cost-base founder exits can face tax up to the top marginal rate under the post-2027 regime.",
          "Whether that is the highest founder tax treatment in the developed world is a separate comparative claim."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions can reduce, defer or disregard some or all of a capital gain from an active asset used in a small business."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-long-term-etf-planning-claim",
    title: "Long-term ETF investor post on higher tax and planning instability",
    submittedAt: "2026-05-13T08:44:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "Now the 50% CGT discount is gone and gets replaced with an inflation indexation model plus a 30% minimum tax. From everything I've read, if your investments perform well over a long time horizon, you will almost certainly pay more tax under the new system than the old one... The thing that frustrates me most is that this was sold as targeting property investors. But the CGT change hits shares just as hard. ... Howard scrapped indexation for the 50% discount in 1999 and now Labor has just flipped it back. What's to say it doesn't change again before any of us actually sell?",
    summary:
      "This post combines one clean policy-description claim, one forward-looking tax-comparison claim, one scope claim about shares, and one historical claim about the CGT framework. The Budget does replace the 50 per cent discount with inflation indexation plus a 30 per cent minimum tax from 1 July 2027, and the CGT redesign applies to shares as well as property. It is also correct that the 1999 reform replaced broad indexation with the discount framework for post-September-1999 assets, and that Budget 2026 now moves the system back toward indexation. But the stronger statement that well-performing long-horizon investments will almost certainly pay more tax than under the old system depends on the investor's marginal rate, inflation path, real return, and how often the 30 per cent floor binds.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the long-horizon share-investor claim can be pressure-tested against tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 3,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-discount-replaced-by-indexation-plus-floor",
        verbatim:
          "the 50% CGT discount is gone and gets replaced with an inflation indexation model plus a 30% minimum tax.",
        paraphrased:
          "Budget 2026 replaces the 50 per cent CGT discount with inflation indexation plus a 30 per cent minimum tax from 1 July 2027.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "This is the core policy change described in the Budget text. The package removes the 50 per cent discount for future gains and replaces it with an indexation-based approach plus a 30 per cent minimum tax from 1 July 2027.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post-2027 CGT redesign replaces the discount with indexation and a 30 per cent floor."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-long-term-good-performance-almost-certainly-more-tax",
        verbatim:
          "if your investments perform well over a long time horizon, you will almost certainly pay more tax under the new system than the old one.",
        paraphrased:
          "Strong long-term investment performance will almost certainly leave ETF investors paying more tax under the new regime than the old one.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.84,
        reasoning:
          "That can be true in many long-horizon scenarios, especially when real returns are strong and the 30 per cent floor binds or indexed gains stay large relative to the old 50 per cent discount. But 'almost certainly' is stronger than the official materials alone establish, because the result depends on the investor's marginal rate, inflation path, holding period, and the shape of real returns over time.",
        assumptionsRequired: [
          "Assumes sufficiently strong real returns relative to inflation over the holding period.",
          "Assumes the investor's marginal rate and the 30 per cent floor produce a worse outcome than the old 50 per cent discount.",
          "Assumes the gain is fully subject to the post-1 July 2027 regime."
        ],
        alternativeFramings: [
          "Many strong-performance long-horizon scenarios will produce higher tax than the old discount system, but the result is not automatic in every case.",
          "The size and even the direction of the difference still depend on inflation, real return, and tax-rate assumptions."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The new regime combines inflation indexation with a 30 per cent minimum tax, which can produce higher tax than the old discount in many scenarios but does not itself prove that outcome for every long-horizon investor."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "partially_supports",
            relevantPassage:
              "Different resident marginal tax rates change how the old discount and new 30 per cent floor compare in practice."
          }
        ]
      },
      {
        id: "claim-cgt-change-applies-to-shares-too",
        verbatim:
          "the CGT change hits shares just as hard.",
        paraphrased:
          "The Budget 2026 CGT change applies to shares as well as property, not only property investors.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The policy is not written as a property-only CGT change. The Budget text describes a broad redesign of the CGT discount while separately pairing it with housing measures, so shares and other capital assets are also within scope unless a specific carve-out applies.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign is broader than residential property and reaches shares too.",
          "Whether shares are hit 'just as hard' as property in every scenario is separate from the basic scope point."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-1999-scrapped-indexation-now-flipped-back",
        verbatim:
          "Howard scrapped indexation for the 50% discount in 1999 and now Labor has just flipped it back.",
        paraphrased:
          "The 1999 framework shifted broad CGT treatment away from indexation toward the discount, and Budget 2026 now shifts it back toward indexation.",
        claimType: "historical",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "ATO guidance confirms that indexation is only available for assets acquired before 21 September 1999, while the CGT discount applies to later eligible assets. Budget 2026 now reverses that broad architecture for future gains by replacing the discount with indexation plus a floor from 1 July 2027.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Australia moved from broad indexation to the discount framework in 1999, and Budget 2026 moves the system back toward indexation for future gains."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: CGT discount",
            publisher: "Australian Taxation Office",
            section: "How the CGT discount works",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount",
            supports: "supports",
            relevantPassage:
              "You can reduce your capital gain by 50% ... If you have owned the asset since before 21 September 1999, you can index the cost of the asset for inflation instead of using the CGT discount."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-small-business-worst-budget-claim",
    title: "Small-business post calling Budget 2026 the worst in Australian history",
    submittedAt: "2026-05-13T06:20:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "This is the worst budget in Australian history for small business. ... Why would any founder hand over 50% of the profit on the sale of their business after risking everything? ... Australia is home to over 2.6 million small businesses. They employ the majority of working Australians. Every founder who packs up and leaves means jobs don't get created here. ... The signal this budget sends to Australian small business is unmistakable: LEAVE. ... Maybe I should move to Singapore?",
    summary:
      "This post mixes one overstated founder-tax claim, one scale claim about small business, and a set of broader historical and capital-flight judgements. Official government sources do support the claim that Australia has more than 2.6 million small businesses. But the line that founders should expect to hand over 50 per cent of sale profit overstates the visible top-rate no-relief scenario, while the statement that small businesses employ the majority of working Australians conflicts with official current small-business employment data. The claims that this is the worst budget in Australian history for small business, or that the signal is simply 'leave', are political and predictive framings rather than discrete facts resolved by the primary source base alone.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the claimed founder sale-tax burden can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 2,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 2
    },
    claims: [
      {
        id: "claim-founder-hand-over-50pct-profit",
        verbatim:
          "Why would any founder hand over 50% of the profit on the sale of their business after risking everything?",
        paraphrased:
          "Founders should expect to lose about half the profit on a business sale under Budget 2026.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.9,
        reasoning:
          "The official Budget materials do support a harsher post-2027 outcome in some no-relief founder-exit scenarios, but the visible upper-bound benchmark on the site is up to the top marginal rate of 47 per cent rather than a universal 50 per cent. And even that upper bound depends on assumptions such as individual ownership, little or no cost base, and no small business CGT concession materially reducing the gain.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Some no-relief founder exits can face tax up to the top marginal rate under the post-2027 regime.",
          "The sale-tax outcome varies with ownership structure, cost base, and small business CGT concession eligibility."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions can reduce, defer or disregard some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-australia-over-2point6m-small-businesses",
        verbatim:
          "Australia is home to over 2.6 million small businesses.",
        paraphrased:
          "Australia has more than 2.6 million small businesses.",
        claimType: "descriptive",
        subjectDomain: "business demographics",
        verdict: "supported",
        confidence: 0.88,
        reasoning:
          "Recent official government material explicitly describes Australia as having about 2.66 million small businesses. That is close enough to support the post's 'over 2.6 million' framing.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Official government material describes Australia as having roughly 2.6 to 2.7 million small businesses."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Rise in new business registrations shows confidence in Australia's small business sector",
            publisher: "Treasury Ministers",
            section: "Media release",
            page: 1,
            url: "https://ministers.treasury.gov.au/ministers/anne-aly-2025/media-releases/rise-new-business-registrations-shows-confidence-australias",
            supports: "supports",
            relevantPassage:
              "The Albanese Labor Government is backing Australia's record high 2.66 million small businesses to run, grow and succeed."
          }
        ]
      },
      {
        id: "claim-small-business-majority-working-australians",
        verbatim:
          "They employ the majority of working Australians.",
        paraphrased:
          "Small businesses employ most working Australians.",
        claimType: "distributional",
        subjectDomain: "business demographics",
        verdict: "unsupported",
        confidence: 0.9,
        reasoning:
          "Recent official small-business employment data do not support a majority-of-workers claim. ASBFEO's current government-hosted data portal says small businesses employed over 5 million people, which it describes as 39 per cent of the private sector workforce in 2023-24. That is a large share, but not a majority of working Australians.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Small businesses employ millions of Australians and a large share of the private-sector workforce.",
          "That is materially different from saying they employ most working Australians."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Contribution to Australian Employment",
            publisher: "ASBFEO",
            section: "Small business contribution to employment",
            page: 1,
            url: "https://www.asbfeo.gov.au/contribution-australian-employment",
            supports: "contradicts",
            relevantPassage:
              "Small businesses (as defined by the ABS as those employing 0-19 employees) employed over 5 million people, which is 39% of the private sector workforce in 2023-24."
          },
          {
            title: "Latest data shows record number of Australians in work",
            publisher: "Treasury Ministers",
            section: "Media release",
            page: 1,
            url: "https://ministers.treasury.gov.au/ministers/jim-chalmers-2022/media-releases/latest-data-shows-record-number-australians-work",
            supports: "contradicts",
            relevantPassage:
              "The number of Australians employed reached a record high of 14,684,100 in December 2025."
          }
        ]
      },
      {
        id: "claim-worst-budget-in-history-for-small-business",
        verbatim:
          "This is the worst budget in Australian history for small business.",
        paraphrased:
          "Budget 2026 is the worst budget in Australian history for small business.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.93,
        reasoning:
          "This is a sweeping historical and political judgement, not a discrete factual proposition with a single measurement test in the primary-source set used by the site.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author sees the package as unusually hostile to founders and small-business owners."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Tax reform package overview",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Budget combines tougher treatment of some capital gains with separate business-support measures such as the permanent $20,000 instant asset write-off, loss carry back and loss refundability."
          }
        ]
      },
      {
        id: "claim-budget-signal-is-leave",
        verbatim:
          "The signal this budget sends to Australian small business is unmistakable: LEAVE. ... Maybe I should move to Singapore?",
        paraphrased:
          "Budget 2026 clearly signals that founders and small-business owners should leave Australia.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "This is a behavioural and political judgement about how entrepreneurs should read the package, not a discrete fact that the primary source set can verify on its own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the package increases the appeal of lower-tax jurisdictions for some founders."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and business support measures",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package includes a stricter post-2027 CGT regime alongside business-support measures such as venture-capital incentive expansion and instant asset write-off permanence."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-government-cofounder-claim",
    title: "Founder post calling the post-2027 tax system a 47 per cent government cofounder",
    submittedAt: "2026-05-13T06:12:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "In 1 year, every Australian startup gets a new cofounder - the government. They wont: stay up late with you stressing, help you get product market fit or bail you out when you fail. But, if by a slim chance you do succeed, expect to pay them up to 47%.",
    summary:
      "This post combines a political metaphor with one concrete tax-outcome claim. The 'government as cofounder' line is rhetorical rather than factual. The 47 per cent line does capture a real upper-bound scenario for some no-relief founder exits after the post-2027 CGT redesign, but it is not universal: it depends on a top-rate individual taxpayer, a gain not softened by Subdivision 152 or other concessions, and a scenario where the post-2027 treatment fully governs the gain.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the 'up to 47%' line can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-government-cofounder-metaphor",
        verbatim:
          "every Australian startup gets a new cofounder - the government.",
        paraphrased:
          "The government effectively becomes a cofounder of every Australian startup.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.94,
        reasoning:
          "This is a metaphor about how the author views the tax burden on successful founders, not a literal or discrete factual proposition that can be verified from the policy text.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the state is capturing too much of founder upside relative to the risk it bears."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-founder-success-pay-47",
        verbatim:
          "if by a slim chance you do succeed, expect to pay them up to 47%",
        paraphrased:
          "A successful founder may face tax of up to 47 per cent on a post-2027 exit.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.9,
        reasoning:
          "That upper bound is real in narrower cases, especially where a top-rate individual founder sells an asset with little or no cost base and no small business CGT concession materially reduces the gain. But the post states it as a broad expectation for startup success, when the actual outcome varies with ownership structure, marginal rate, cost base, concession eligibility, and whether the gain is fully subject to the post-2027 regime.",
        assumptionsRequired: [
          "Assumes an individual founder taxed at the top marginal rate.",
          "Assumes no Subdivision 152 or similar concession reduces the gain.",
          "Assumes the relevant gain falls fully under the post-1 July 2027 treatment."
        ],
        alternativeFramings: [
          "Some no-relief founder exits can face tax at up to the top marginal rate under the post-2027 regime.",
          "The upper bound is real, but it is not the universal founder outcome."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions can reduce, defer or disregard some or all of a capital gain from an active asset used in a small business."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-aspiration-budget-claim",
    title: "Business-owner post calling Budget 2026 anti-aspiration and anti-risk",
    submittedAt: "2026-05-13T06:05:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "This is a terrible budget, that punishes those who take risks to build, to build and grow, to employ others, to provide careers and futures. It does not foster aspiration in any form. As one of my bright young team said this morning - thanks for removing the negative gearing provisions that you all enjoyed for decades... From my reading of today's wash up, it has been universially panned.",
    summary:
      "This post is mostly evaluative and political, but it does contain one clean policy claim. The Budget does remove negative gearing for residential property from 1 July 2027, so the line about removing negative-gearing provisions is grounded in the announced package. The broader claims that the Budget punishes aspiration, objectively sets Australia back, or has been universally panned are not discrete factual propositions that can be established from the site’s primary-source base alone.",
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 2
    },
    claims: [
      {
        id: "claim-budget-removes-negative-gearing",
        verbatim:
          "thanks for removing the negative gearing provisions that you all enjoyed for decades...",
        paraphrased:
          "Budget 2026 removes negative gearing on residential property.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "The official Budget materials state that negative gearing will end for residential property from 1 July 2027, subject to the transitional settings set out in the package. So the post is directionally right that the long-standing residential negative-gearing setting is being removed.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 ends negative gearing for residential property from 1 July 2027, with transition rules and some carve-outs."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, negative gearing will no longer be available for residential property investors except where specific transition or carve-out rules apply."
          }
        ]
      },
      {
        id: "claim-budget-universally-panned",
        verbatim:
          "From my reading of today's wash up, it has been universially panned.",
        paraphrased:
          "The Budget has been universally panned in public commentary.",
        claimType: "distributional",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.82,
        reasoning:
          "This is a sweeping claim about the full commentary landscape. The corpus itself already contains both hostile and supportive or mixed reactions to the Budget, so 'universally panned' overstates the visible discourse even before any broader media survey is attempted.",
        assumptionsRequired: [],
        alternativeFramings: [
          "A large share of visible business and founder commentary has been strongly negative.",
          "Public reaction has been mixed rather than universal."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Budget 2026 Claims Monitor corpus",
            publisher: "Operator-curated public commentary set",
            section: "Dashboard entries",
            page: 1,
            url: "https://factual-au.setiyaputra.me/dashboard",
            supports: "contradicts",
            relevantPassage:
              "The tracked corpus includes both negative reactions and counter-claims arguing that higher CGT can coexist with a better startup environment."
          }
        ]
      },
      {
        id: "claim-budget-punishes-aspiration",
        verbatim:
          "This is a terrible budget, that punishes those who take risks to build ... It does not foster aspiration in any form.",
        paraphrased:
          "Budget 2026 punishes aspiration and risk-taking.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "This is a normative judgement about what kinds of conduct the tax system should reward and how competing policy goals should be weighed. The Budget papers can establish the tax changes, but not resolve that evaluative conclusion on their own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the Budget trades off founder and investor upside against other policy goals in a way the author considers anti-aspirational."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and housing measures",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Budget presents the package as a rebalancing toward home ownership, productive investment and fairness across generations."
          }
        ]
      },
      {
        id: "claim-budget-objectively-sets-australia-back",
        verbatim:
          "objectively, sets Australia back.",
        paraphrased:
          "Budget 2026 objectively sets Australia back.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a broad political and economic characterisation, not a discrete factual claim with a single measurable test in the primary source set used by the site.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author sees the package as economically harmful overall."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Budget presents itself as encouraging investment and innovation, which shows the issue is a contestable overall judgement rather than a settled fact."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-young-founder-net-exit-claim",
    title: "Worked founder-exit claim on what gross sale is needed to keep $10 million after tax",
    submittedAt: "2026-05-13T06:03:00Z",
    posterLabel: "Public social post",
    posterNamedPublicly: false,
    rawText:
      "25yo started a business in 2016. Sells it ten year later. Keeps $10m after tax. How big did the exit need to be? $13m. 25yo starts a business in 2026. Sells it ten year later. Keeps $10m after tax. How big did the exit need to be? $20m. When would you rather have been a 25yo entrepreneur starting a business? Albo calls this intergenerational equity.",
    summary:
      "This post turns a founder-exit comparison into a clean intergenerational headline. The broad direction is real: under a no-relief top-rate scenario, a founder selling after the post-2027 CGT redesign needs a materially larger gross exit to keep the same after-tax amount than a founder selling under the old 50 per cent discount. But the quoted dollar figures depend on hidden assumptions about ownership structure, marginal rate, Medicare, concession eligibility, cost base, and whether the entire gain sits under one regime. The '$13m' figure is broadly consistent with a top-rate no-relief pre-reform exit; the '$20m' figure overstates the simple no-relief post-2027 arithmetic, which lands closer to $18.9m before any rounding or extra assumptions.",
    calculatorLink: {
      label: "Open founder net-target scenario",
      description:
        "Prefills a top-rate founder-style exit so the gross sale needed to clear a $10 million after-tax target can be pressure-tested under the post-2027 regime.",
      href: buildScenarioCalculatorHref("budget-2026-young-founder-net-exit-claim", "budget-2026-young-founder-net-exit-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-young-founder-2016-needs-13m",
        verbatim:
          "25yo started a business in 2016. Sells it ten year later. Keeps $10m after tax. How big did the exit need to be? $13m.",
        paraphrased:
          "A founder selling under the old discount regime would need roughly a $13 million gross exit to keep $10 million after tax.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.86,
        reasoning:
          "That figure is broadly consistent with a simple top-marginal-rate individual scenario under the old 50 per cent CGT discount, where an effective 23.5 per cent tax on the gross gain implies a gross exit of about $13.07 million to net $10 million. But the post does not disclose the assumptions needed to make that arithmetic meaningful, including ownership structure, Medicare inclusion, zero or low cost base, no small business CGT concessions, and full use of the pre-1 July 2027 discount regime.",
        assumptionsRequired: [
          "Assumes an individual founder taxed at the top marginal rate with the 50 per cent CGT discount applying.",
          "Assumes no Subdivision 152 or other concession reduces the gain.",
          "Assumes a zero or low cost base and a sale occurring before the post-1 July 2027 redesign bites."
        ],
        alternativeFramings: [
          "Under a simple top-rate no-relief scenario, the old regime gets a founder to $10 million net at around a $13.1 million gross exit."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "partially_supports",
            relevantPassage:
              "Resident tax rates 2025–26 ... taxable income over $190,000 is taxed at 45c for each $1 over $190,000."
          }
        ]
      },
      {
        id: "claim-young-founder-2026-needs-20m",
        verbatim:
          "25yo starts a business in 2026. Sells it ten year later. Keeps $10m after tax. How big did the exit need to be? $20m.",
        paraphrased:
          "A founder selling ten years after starting in 2026 would need a $20 million gross exit to keep $10 million after tax.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.88,
        reasoning:
          "Under a simple no-relief top-marginal-rate post-2027 scenario, keeping $10 million after tax implies a gross exit closer to $18.9 million, not $20 million. The quoted $20 million figure could only be justified by extra assumptions or heavy rounding the post does not disclose. That makes the headline number too strong as stated.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Under a simple top-rate no-relief post-2027 scenario, a founder needs roughly a $19 million gross exit to keep $10 million after tax.",
          "The required gross exit can be higher or lower depending on cost base, concession eligibility, and whether the gain is fully post-2027."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions can reduce, defer or disregard some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-post-2027-founder-needs-bigger-exit",
        verbatim:
          "When would you rather have been a 25yo entrepreneur starting a business?",
        paraphrased:
          "Holding other things equal, a no-relief founder selling under the post-2027 regime needs a materially larger gross exit than one selling under the old discount regime to keep the same after-tax amount.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The shift from the 50 per cent discount to indexation plus a 30 per cent minimum tax raises effective tax in standard no-relief founder-exit scenarios at the top marginal rate. That means the gross sale needed to preserve the same after-tax target rises materially under the new regime, even though the exact number depends on assumptions.",
        assumptionsRequired: [],
        alternativeFramings: [
          "In clean no-relief founder examples, the post-2027 regime requires a meaningfully larger exit to land the same net proceeds."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "supports",
            relevantPassage:
              "Resident tax rates 2025–26 ... taxable income over $190,000 is taxed at 45c for each $1 over $190,000."
          }
        ]
      },
      {
        id: "claim-intergenerational-equity-rhetoric",
        verbatim:
          "Albo calls this 'intergenerational equity'.",
        paraphrased:
          "Calling this outcome intergenerational equity is self-evidently absurd.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a political characterisation about how the reform should be morally framed rather than a discrete factual proposition that can be resolved from the primary source set alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The worked example is being used to argue that the reform cuts against the Government's intergenerational-equity framing."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 1 2026-27",
            publisher: "Australian Government",
            section: "Statement 4",
            page: 112,
            url: "https://budget.gov.au/content/bp1/download/bp1-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The Budget frames tax reform partly in terms of fairness and intergenerational distribution, but that framing does not by itself settle whether any single founder example is fair."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-australian-entrepreneurs-relief-claim",
    title: "Claim that the Budget makes Australia the most punitive founder-tax jurisdiction in the developed world",
    submittedAt: "2026-05-13T06:01:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "the proposed CGT reforms will now make Australia's tax regime the most punitive for founders of quite literally anywhere else in the developed world ... Fortunately, the Government has said they intend to engage with the startup sector on this topic ... this is modelled on Qualified Small Business Stock (QSBS) in the US & Business Asset Disposal Relief (BADR) in the UK",
    summary:
      "This post mixes one sweeping cross-country ranking claim, one consultation claim, and one narrower policy-design reference. The Budget clearly increases tax in some post-2027 founder-exit scenarios, but the statement that Australia would become the most punitive founder-tax regime in the developed world is not demonstrated without a fixed comparison basket and explicit treatment of concessions, holding rules, and entity structures across jurisdictions. The reviewed official Budget materials also do not establish the claimed startup-sector engagement wording. By contrast, the proposed 'Australian Entrepreneurs Relief' is fairly described as drawing on real founder-oriented relief concepts in the US and UK.",
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 2,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-australia-most-punitive-founder-jurisdiction",
        verbatim:
          "the proposed CGT reforms will now make Australia's tax regime the most punitive for founders of quite literally anywhere else in the developed world.",
        paraphrased:
          "Budget 2026 would make Australia the most punitive founder-tax jurisdiction in the developed world.",
        claimType: "empirical_comparison",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.81,
        reasoning:
          "The Budget does create harsher outcomes in some Australian founder-exit scenarios, but the post does not supply a comparison basket, comparable founder-relief methodology, or a consistent treatment of jurisdiction-specific carve-outs. A claim about being the most punitive 'anywhere else in the developed world' is much stronger than what the visible source base establishes.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The reform could make Australia materially less founder-friendly in some scenarios than key comparison jurisdictions.",
          "A robust ranking claim requires a fixed jurisdiction list and a like-for-like founder-relief methodology."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "Business Asset Disposal Relief: Eligibility",
            publisher: "GOV.UK",
            section: "Eligibility",
            page: 1,
            url: "https://www.gov.uk/entrepreneurs-relief",
            supports: "contradicts",
            relevantPassage:
              "Business Asset Disposal Relief lets qualifying founders or business owners pay a reduced rate on eligible gains, showing that cross-country founder treatment cannot be ranked from the Australian policy text alone."
          }
        ]
      },
      {
        id: "claim-government-intends-to-engage-startup-sector",
        verbatim:
          "the Government has said they intend to engage with the startup sector on this topic.",
        paraphrased:
          "The Government has explicitly said it will engage the startup sector on founder and employee CGT treatment.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.83,
        reasoning:
          "The official Budget 2026 tax reform and productivity materials reviewed for this check establish the CGT reform and several startup-support measures, but they do not identify the specific startup-sector consultation commitment described in the post.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget materials reviewed here show startup-support tax measures, but not a specific startup-sector consultation commitment targeted at founders or startup employees."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax; a better tax system for businesses",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The page sets out the CGT reform and business-support measures, but does not identify the specific startup-sector engagement wording quoted in the post."
          }
        ]
      },
      {
        id: "claim-australian-entrepreneurs-relief-modelled-on-qsbs-and-badr",
        verbatim:
          "this is modelled on Qualified Small Business Stock (QSBS) in the US & Business Asset Disposal Relief (BADR) in the UK",
        paraphrased:
          "The proposed relief draws on real founder-oriented capital-gains relief concepts in the US and UK tax systems.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "The US does have qualified small business stock rules under section 1202 that can exclude some or all gains on eligible stock held at least five years, and the UK does have Business Asset Disposal Relief for qualifying business disposals. That does not mean the Australian proposal is identical, but the post is broadly right that it is modelled on real relief structures in those two systems.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The proposal borrows from founder-oriented gain relief concepts that already exist in the US and UK, even though the thresholds and mechanics are not identical."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Publication 550 (2025), Investment Income and Expenses",
            publisher: "Internal Revenue Service",
            section: "Qualified small business stock",
            page: 1,
            url: "https://www.irs.gov/publications/p550",
            supports: "supports",
            relevantPassage:
              "You may be able to exclude up to 100% of your gain from the sale or exchange of qualified small business stock held for more than 5 years."
          },
          {
            title: "Business Asset Disposal Relief: Eligibility",
            publisher: "GOV.UK",
            section: "Eligibility",
            page: 1,
            url: "https://www.gov.uk/entrepreneurs-relief",
            supports: "supports",
            relevantPassage:
              "Business Asset Disposal Relief is available for qualifying business disposals and applies a reduced capital gains tax rate on eligible profits."
          }
        ]
      },
      {
        id: "claim-budget-disaster-for-entrepreneurship",
        verbatim:
          "The 2026 budget in its current form really is a disaster for entrepreneurship in Australia.",
        paraphrased:
          "The Budget is a disaster for entrepreneurship in Australia.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "This is an evaluative judgement about the overall startup environment rather than a discrete fact that can be cleanly verified from the budget papers alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget creates stronger founder-exit friction in some scenarios while also containing startup-support measures that cut in the opposite direction."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Productivity | Budget 2026–27",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "partially_supports",
            relevantPassage:
              "This Budget delivers landmark tax reforms that will encourage investment and innovation, including loss refundability and expanded tax incentives for venture capital."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-young-etf-home-deposit-claim",
    title: "Claim that the new CGT rules sharply worsen ETF-based first-home saving for young Australians",
    submittedAt: "2026-05-13T05:52:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "A young Australian investing into ETFs to save for their first home could now see their capital gains tax bill increase by more than 260% under the Federal Budget’s new tax rules. From 1 July 2027, someone growing a $25,000 ETF investment into $40,000 over 5 years ... would keep around $2,164 less after tax under the new rules ... that alone could delay reaching the same property goal by another 9-12 months.",
    summary:
      "This post combines one specific tax-example claim, one headline percentage claim, one deposit-delay claim, and one clean policy-design point about the 30 per cent floor. The Budget text does establish a new indexation-plus-minimum-tax regime from 1 July 2027, and that floor can bite hardest at lower marginal rates where the indexed-gain calculation would otherwise produce less tax. But the quoted 260 per cent increase and 9–12 month deposit-delay claims depend on undisclosed tax-rate, inflation, savings-path, and housing-target assumptions rather than following cleanly from the example as stated.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a post-2027 ETF-style savings case so the quoted tax increase can be pressure-tested against explicit tax-rate and inflation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-young-etf-tax-bill-up-260",
        verbatim:
          "A young Australian investing into ETFs to save for their first home could now see their capital gains tax bill increase by more than 260% under the Federal Budget’s new tax rules.",
        paraphrased:
          "The Budget 2026 CGT redesign can increase tax on a young ETF saver by more than 260 per cent.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.84,
        reasoning:
          "The Budget does create a higher-tax outcome in some post-2027 ETF scenarios by replacing the 50 per cent discount with indexation plus a 30 per cent minimum tax. But the post does not disclose the marginal tax rate or inflation path needed to generate a claimed increase of more than 260 per cent, and that magnitude does not follow cleanly from the worked example as stated. The headline percentage therefore overstates what is demonstrated by the visible assumptions.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The new regime can materially increase tax on some lower-rate ETF savers once the 30 per cent floor binds.",
          "The size of the increase depends on tax rate, inflation, and holding-period assumptions rather than following from the post on its face."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "contradicts",
            relevantPassage:
              "Resident tax rates 2025–26 ... taxable income up to $18,200 is nil; $18,201 to $45,000 is taxed at 16c for each $1 over $18,200; $45,001 to $135,000 is taxed at 30c for each $1 over $45,000."
          }
        ]
      },
      {
        id: "claim-young-etf-2164-less-after-tax",
        verbatim:
          "someone growing a $25,000 ETF investment into $40,000 over 5 years ... would keep around $2,164 less after tax under the new rules.",
        paraphrased:
          "On the post's worked ETF example, the saver ends up about $2,164 worse off after tax under the new regime.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "A post-2027 ETF example of this kind can certainly produce a worse after-tax outcome under the new regime, especially once the 30 per cent floor binds. But the exact figure depends on undisclosed assumptions including the taxpayer's marginal rate, the inflation path used for indexation, whether Medicare or offsets are included, and whether the example is purely post-2027. The post supplies a precise output without exposing the assumptions needed to reproduce it.",
        assumptionsRequired: [
          "Assumes a specific marginal tax rate for the saver.",
          "Assumes a specific inflation path for the five-year holding period.",
          "Assumes the gain is fully subject to the post-1 July 2027 regime."
        ],
        alternativeFramings: [
          "The example can produce a materially worse after-tax outcome under the new rules, but the exact dollar gap depends on hidden assumptions."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          }
        ]
      },
      {
        id: "claim-etf-delay-home-deposit-9-to-12-months",
        verbatim:
          "that alone could delay reaching the same property goal by another 9-12 months.",
        paraphrased:
          "The higher tax in this ETF scenario delays a first-home deposit by roughly 9 to 12 months.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "A deposit-delay claim requires more than the CGT example itself. It depends on the target deposit size, future house-price growth, saving rate, wage path, investment returns after the tax event, and whether the investor has other savings sources. The budget papers do not supply enough information to derive a 9–12 month delay from the quoted ETF example alone.",
        assumptionsRequired: [
          "Assumes a particular deposit target and house-price path.",
          "Assumes a particular ongoing savings rate and wage growth path for the saver.",
          "Assumes the ETF example is the binding constraint on reaching the deposit rather than one input among several."
        ],
        alternativeFramings: [
          "A worse after-tax ETF outcome could slow deposit accumulation, but the timing effect depends on wider household assumptions."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The measure changes the post-2027 tax treatment of eligible capital gains but does not specify individual deposit-timing effects."
          }
        ]
      },
      {
        id: "claim-30pct-floor-most-punitive-on-lower-rate-savers",
        verbatim:
          "the surprise minimum 30% CGT floor ... is most punitive on lower income Australians who are disciplined long term savers trying to build wealth gradually through shares and ETFs outside super.",
        paraphrased:
          "The 30 per cent minimum tax floor can be most punitive for lower-rate long-term savers when indexation would otherwise leave them with a lower tax result.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.89,
        reasoning:
          "The 30 per cent floor matters most where the indexed-gain calculation would otherwise produce tax below that floor. That happens more readily at lower marginal rates and with moderate real returns over time, because those taxpayers would otherwise benefit most from the indexed-gain method relative to the floor.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The floor is a key reason lower- and middle-rate savers may not receive the full apparent benefit of indexation."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "supports",
            relevantPassage:
              "Resident tax rates 2025–26 include materially lower marginal rates below the top bracket, which is why a flat minimum floor binds differently across taxpayers."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-founder-better-off-counterclaim",
    title: "Founder counter-claim that higher CGT can coexist with a better overall startup environment",
    submittedAt: "2026-05-13T05:36:00Z",
    posterLabel: "Public founder post",
    posterNamedPublicly: false,
    rawText:
      "I will pay more tax with the changes. But I’ll also be better off. ... To my mind, the best environment for start-ups is one where the necessary things are more affordable. ... Having wealthy people pay a fairer share of tax, and taking steps to make housing more secure and affordable, are a move towards that better environment.",
    summary:
      "This submission combines one clean policy point, one broader all-things-considered claim, and several normative or causal judgements. The Budget does increase CGT on some post-2027 founder-exit scenarios while also including worker tax cuts and startup-support measures such as loss refundability, venture-capital changes, and stronger R&D settings. But whether a founder is 'better off overall' depends on personal income, housing exposure, business structure, timing, and which parts of the package matter most to that person.",
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 2
    },
    claims: [
      {
        id: "claim-higher-cgt-with-offsetting-startup-support",
        verbatim:
          "I will pay more tax with the changes. But I’ll also be better off.",
        paraphrased:
          "Some founders may face higher CGT on a future exit while still benefiting from other Budget 2026 measures that improve their overall position.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "The Budget clearly raises tax in some founder-exit scenarios by replacing the 50 per cent CGT discount with indexation plus a 30 per cent minimum tax from 1 July 2027. It also includes worker tax cuts and startup-support measures such as loss refundability, expanded venture capital incentives, and stronger R&D support. But the claim that a founder is 'better off overall' cannot be resolved in the abstract because it depends on their income, business type, housing costs, timing of any exit, and which measures they actually use.",
        assumptionsRequired: [
          "Assumes the founder benefits materially from the broader worker-tax or startup-support measures in the same budget.",
          "Assumes those gains outweigh the higher CGT they would face in their specific exit scenario."
        ],
        alternativeFramings: [
          "The Budget can raise CGT in some founder scenarios while still improving other parts of the startup or household balance sheet.",
          "Whether a founder is better off overall is scenario-dependent rather than universally true."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax; better tax system for businesses",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation ... The Government is also introducing loss refundability to support new start-up businesses."
          },
          {
            title: "Budget 2026-27 Cost of living page",
            publisher: "Australian Government",
            section: "Tax cuts for every taxpayer starting 1 July 2026",
            page: 1,
            url: "https://budget.gov.au/content/02-cost-of-living.htm",
            supports: "partially_supports",
            relevantPassage:
              "Every Australian taxpayer will receive a tax cut of up to $268 from 1 July 2026, then up to $536 every year from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-budget-includes-startup-support-beyond-cgt",
        verbatim:
          "The best environment for start-ups is one where the necessary things are more affordable.",
        paraphrased:
          "Budget 2026 includes startup-relevant measures beyond the CGT change, including worker tax relief and business-support settings aimed at investment, resilience, and innovation.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.88,
        reasoning:
          "The Budget is not only a CGT and negative-gearing package. Official Budget materials show broader measures that affect startup conditions, including worker tax cuts, loss carry back, loss refundability for young startups, expanded venture capital incentives, and stronger R&D support for young firms.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The startup impact of the Budget cannot be reduced to the CGT change alone because the package also contains business and worker measures that move in the opposite direction."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "A better tax system for businesses",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government is reintroducing loss carry back ... introducing loss refundability to support new start-up businesses ... and expanding venture capital tax incentives."
          },
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "supports",
            relevantPassage:
              "This Budget delivers landmark tax reforms that will encourage investment and innovation, including loss refundability, a permanent $20,000 instant asset write-off, and expanded tax incentives for venture capital."
          }
        ]
      },
      {
        id: "claim-lower-housing-costs-broaden-founder-pool",
        verbatim:
          "When housing and other living costs are so high, it shrinks the pool of people who can take the risks of founding or joining a start-up.",
        paraphrased:
          "High housing and living costs reduce the pool of people able to take startup risk.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.79,
        reasoning:
          "This is a plausible but still causal and interpretive claim about labour markets, household risk tolerance, and startup formation. The current primary-source set on the site does not by itself quantify how strongly housing costs narrow the founder or early-employee pool.",
        assumptionsRequired: [],
        alternativeFramings: [
          "High living costs may increase the barriers to founding or joining a startup, but the size of that effect is not settled by the budget papers alone."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "A better tax system for workers, first home buyers and future generations",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government is reforming the tax system to help more Australians realise the dream of home ownership, better encourage productive investment and help fund a new $250 tax offset for workers."
          }
        ]
      },
      {
        id: "claim-fairer-share-and-better-environment",
        verbatim:
          "Having wealthy people pay a fairer share of tax, and taking steps to make housing more secure and affordable, are a move towards that better environment.",
        paraphrased:
          "Making capital taxation fairer and housing more affordable creates a better startup environment.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.84,
        reasoning:
          "This is a normative conclusion about what counts as a better startup environment and how fairness should be weighed against other incentives. The budget papers can establish the policy settings, but they do not resolve that value judgement on their own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The package can be defended as trading some founder-exit upside for broader fairness and cost-of-living goals.",
          "Whether that produces a better startup environment is ultimately a policy judgement rather than a cleanly verifiable fact."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Tax reform for workers, businesses and future generations",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government is reforming the tax system to help more Australians realise the dream of home ownership, better encourage productive investment and help fund a new $250 tax offset for workers."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-capital-vs-labour-tax-claim",
    title: "Public post comparing long-held capital-gains tax with marginal labour tax",
    submittedAt: "2026-05-13T03:25:00Z",
    posterLabel: "Public X post",
    posterNamedPublicly: false,
    rawText:
      "Under the current rules, a long-held capital gain is taxed more lightly than the next dollar of labour income for the same taxpayer. That's why the CGT discount is a real tax preference.",
    summary:
      "This post makes one clean tax-design claim and one broader characterisation. The core comparison is supported: the current 50 per cent CGT discount means only half an eligible gain is included in assessable income, so the tax burden on that gain is lower than the tax on the same amount of extra wage income at the taxpayer's marginal rate. The 'tax preference' label is a defensible description of that design rather than a separate empirical finding.",
    calculatorLink: {
      label: "Open capital-vs-labour comparison",
      description:
        "Prefills a long-held top-rate scenario so the current-law discount can be compared with marginal labour-income taxation assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-capital-vs-labour-tax-claim", "budget-2026-capital-vs-labour-tax-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-capital-gains-lower-than-labour",
        verbatim:
          "Under the current rules, a long-held capital gain is taxed more lightly than the next dollar of labour income for the same taxpayer.",
        paraphrased:
          "The current CGT discount lets an eligible long-held gain face less tax than marginal labour income for the same resident taxpayer.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "Under current law, eligible gains held longer than 12 months receive the 50 per cent CGT discount before being taxed at the taxpayer's marginal rate. That means only half the gain is included in assessable income, whereas the next dollar of salary or wages is taxed at the full marginal labour-income rate.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The current system taxes discounted long-held gains more lightly than the same taxpayer's marginal labour income.",
          "The comparison should be made against marginal labour tax, not average labour tax."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO: Tax rates – Australian resident",
            publisher: "Australian Taxation Office",
            section: "Resident tax rates 2025–26",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000",
            supports: "supports",
            relevantPassage:
              "Resident tax rates 2025–26 ... taxable income over $190,000 is taxed at 45c for each $1 over $190,000."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-subdiv152-founder-relief-claim",
    title: "Public post claiming most founder exits are still shielded by Subdivision 152",
    submittedAt: "2026-05-13T03:10:00Z",
    posterLabel: "Public text submission",
    posterNamedPublicly: false,
    rawText:
      "The founder panic is overdone. The vast majority of real startup and small-business exits would still be neutralised by Subdivision 152, so the headline tax-shock story is basically false.",
    summary:
      "This post combines one supported legal point with one stronger prevalence claim. ATO guidance confirms that Subdivision 152 can reduce or disregard gains for eligible active-business cases, but the public sources reviewed here do not establish that the vast majority of founder or startup exits satisfy those conditions. That broader claim depends on undisclosed eligibility facts.",
    calculatorLink: {
      label: "Open Subdivision 152 founder scenario",
      description:
        "Prefills a founder-style exit with active-business relief turned on so the effect of the concession stack is visible rather than assumed.",
      href: buildScenarioCalculatorHref("budget-2026-subdiv152-founder-relief-claim", "budget-2026-subdiv152-founder-relief-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-subdiv152-can-neutralise-some-exits",
        verbatim:
          "real startup and small-business exits would still be neutralised by Subdivision 152",
        paraphrased:
          "Subdivision 152 can heavily reduce or eliminate CGT in eligible founder or small-business exit cases.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "ATO guidance confirms that the small business CGT concessions can reduce or disregard gains where the basic conditions are met. That makes it correct to say some founder or small-business exits can be materially softened or even eliminated by Subdivision 152.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Eligible active-business exits may face far less tax than a no-relief founder-exit headline implies."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "supports",
            relevantPassage:
              "The small business CGT concessions can reduce, defer or disregard some or all of a capital gain from an active asset used in a small business."
          }
        ]
      },
      {
        id: "claim-vast-majority-founder-exits-qualify",
        verbatim:
          "The vast majority of real startup and small-business exits would still be neutralised by Subdivision 152",
        paraphrased:
          "Most founder or startup exits would qualify for enough Subdivision 152 relief to neutralise the Budget 2026 CGT change.",
        claimType: "distributional",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "The legal availability of Subdivision 152 does not by itself show how many founder or startup exits meet the active-asset and basic-conditions tests. Without eligibility distribution data, the jump from 'some cases qualify' to 'the vast majority qualify' depends on assumptions the post does not disclose.",
        assumptionsRequired: [
          "Assumes most founder exits satisfy the active-asset and basic-conditions tests for Subdivision 152.",
          "Assumes the relevant founder cohort falls within the concession thresholds often enough to make the prevalence claim true."
        ],
        alternativeFramings: [
          "Many named small-business scenarios may still be heavily mitigated or eliminated by Subdivision 152.",
          "Whether most founder exits qualify is a separate empirical question not resolved by the concession rules alone."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Basic conditions",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "partially_supports",
            relevantPassage:
              "You can use the concessions only if the basic conditions are satisfied, including conditions tied to active assets and business-size limits."
          },
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-pre-cgt-assets-claim",
    title: "Public post claiming pre-1985 assets are being pulled into the CGT net",
    submittedAt: "2026-05-13T02:45:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "Chalmers thinks he's roping pre-1985 assets into the CGT net. What he's actually done is send Australian startup policy back 40 years. Expect a steady stream of founders, startups and capital to head for Dubai and Singapore.",
    summary:
      "This post contains one clean factual claim and broader predictive rhetoric. The official Budget 2026 tax explainer does state that the transitional CGT arrangements apply to legacy assets, including those purchased before 1985, while preserving exemption only for gains accrued before 1 July 2027. That means the post's core claim about pre-1985 assets entering the post-2027 CGT regime is materially supported. The founder-flight language remains a forward-looking judgement rather than a discrete fact resolved by the primary sources alone.",
    calculatorLink: {
      label: "Open pre-CGT stress test",
      description:
        "Prefills a pre-1985 acquisition so the calculator shows the exemption boundary rather than a blanket 'everything is taxed' reading.",
      href: buildScenarioCalculatorHref("budget-2026-pre-cgt-assets-claim", "budget-2026-pre-cgt-assets-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-pre-1985-assets-cgt-net",
        verbatim: "Chalmers thinks he's roping pre-1985 assets into the CGT net.",
        paraphrased:
          "Budget 2026 pulls pre-1985 assets into the capital gains tax net.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.96,
        reasoning:
          "The official Budget tax explainer does support this claim. It states that the transitional arrangements also apply to legacy assets, including those purchased before 1985, and that only gains accrued before 1 July 2027 remain exempt. That means later gains on pre-1985 assets move into the new regime.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Pre-1985 assets keep their exemption only for gains accrued before 1 July 2027, with later gains taxed under the new rules."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Transitional arrangements for capital gains tax",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "These transitional arrangements also apply to legacy assets, including those purchased before 1985. Gains on pre-1985 assets accrued before 1 July 2027 will continue to be exempt."
          }
        ]
      },
      {
        id: "claim-founder-capital-flight-dubai",
        verbatim:
          "Expect a steady stream of founders, startups and capital to head for Dubai and Singapore.",
        paraphrased:
          "The Budget 2026 CGT reform will drive a steady stream of founders, startups and capital offshore.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.87,
        reasoning:
          "This is a forecast about future migration, investment behaviour and capital flows. The primary sources establish the policy change itself, but they do not by themselves resolve whether it will produce a steady offshore founder-and-capital shift.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The reform may increase friction for some founder and investor scenarios, but the size of any offshore response is not settled by the primary policy text alone."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The CGT reforms will only apply to gains arising after 1 July 2027."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-zero-cost-base-business-claim",
    title: "Public post on zero-cost-base businesses and a claimed 47 per cent exit tax",
    submittedAt: "2026-05-13T02:07:00Z",
    posterLabel: "Public text submission",
    posterNamedPublicly: false,
    rawText:
      "I support negative gearing and CGT changes on residential property. But why are our other assets - the actually productive ones like businesses and shares - being penalised? ... It doesn't take a mathematician to work out that applying an indexation method to a $0 cost base gets you $0. Which means all gains on the eventual sale of a self-funded business get hit at the full 47%.",
    summary:
      "This submission mixes one correct scope point, one correct arithmetic point, and one overstated tax-outcome claim. Budget 2026 does apply the CGT redesign beyond residential property, and a zero starting cost base does stay at zero under indexation. But the jump from that arithmetic point to a universal 47 per cent tax on all self-funded business sale gains leaves out key variables such as who owns the asset, their marginal tax rate, and whether small business CGT concessions reduce or disregard the gain.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027, top-rate business-sale scenario without small-business concessions so the 47% claim can be pressure-tested against its hidden assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-cgt-reform-applies-beyond-property",
        verbatim:
          "Why are our other assets - the actually productive ones like businesses and shares - being penalised?",
        paraphrased:
          "Budget 2026's CGT redesign applies beyond residential property to other eligible capital gains, not only housing assets.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The official Budget 2026 tax reform page describes the CGT change as a general replacement of the 50 per cent discount from 1 July 2027, while separately carving out a special choice for investors in new builds. That means the policy is not framed as a housing-only change.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The CGT redesign is broader than residential property, although other concessions can still matter in specific business cases."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent CGT discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-indexing-zero-cost-base",
        verbatim:
          "Applying an indexation method to a $0 cost base gets you $0.",
        paraphrased:
          "Indexing a zero cost base still leaves a zero cost base.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.97,
        reasoning:
          "As a mathematical statement, applying an inflation factor to a starting cost base of zero still produces zero. That arithmetic point is consistent with the Budget's move from the discount to indexation for eligible gains.",
        assumptionsRequired: [],
        alternativeFramings: [
          "If the starting cost base is genuinely zero, indexation does not create a positive cost base."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent CGT discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-self-funded-business-sale-full-47",
        verbatim:
          "Which means all gains on the eventual sale of a self-funded business get hit at the full 47%.",
        paraphrased:
          "All gains on the eventual sale of a self-funded business will be taxed at 47 per cent under the Budget 2026 CGT reform.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.89,
        reasoning:
          "That outcome is possible only in narrower scenarios than the post states. It assumes an individual on the top marginal rate, a gain not reduced by small business CGT concessions, and no other offsetting design feature. The ATO's own guidance shows that eligible small business taxpayers may access concessions that reduce or disregard gains, including the 15-year exemption, the 50 per cent active asset reduction, and the retirement exemption.",
        assumptionsRequired: [
          "The asset is held by an individual taxed at the top marginal rate",
          "No small business CGT concession reduces or disregards the gain",
          "The gain falls fully under the post-1 July 2027 regime"
        ],
        alternativeFramings: [
          "Some self-funded business sale scenarios could face tax at the top marginal rate on most or all of the gain.",
          "The tax outcome varies with ownership structure, marginal rate, and small business CGT concession eligibility."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent CGT discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Overview of the CGT concessions for small business",
            publisher: "Australian Taxation Office",
            section: "Overview of the concessions",
            page: 1,
            url: "https://www.ato.gov.au/forms-and-instructions/capital-gains-tax-concessions-for-small-business-guide-2007/1-getting-started/overview-of-the-cgt-concessions-for-small-business",
            supports: "contradicts",
            relevantPassage:
              "The small business 15-year exemption provides a total exemption ... The small business 50% active asset reduction provides a 50% reduction ... The small business retirement exemption provides an exemption for capital gains up to a lifetime limit of $500,000."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-startup-incentives-counterclaim",
    title: "Public post on startup-support measures in Budget 2026",
    submittedAt: "2026-05-13T01:53:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "Tonight's budget announced boosted R&D tax incentives, expanded VC tax incentives, loss carry back for companies up to $1 billion in turnover, loss refundability for startups, and a specific commitment to consult with the startup sector on CGT treatment.",
    summary:
      "The visible post contains four clean policy claims that are supported by official Budget 2026 materials: expanded venture capital tax incentives, stronger R&D tax incentive settings, reintroduced loss carry back, and loss refundability for eligible start-ups. The final claim about a specific startup-sector consultation on CGT treatment was not located in the official Budget 2026 materials reviewed for this check.",
    overallVerdictMix: {
      supported: 4,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-expanded-vc-incentives",
        verbatim: "Tonight's budget announced ... expanded VC tax incentives ...",
        paraphrased: "Budget 2026 expands venture capital tax incentives.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "The official Budget 2026 tax reform materials explicitly state that the Government will expand venture capital tax incentives from 1 July 2027 and that the changes to the ESVCLP and VCLP programs are intended to support start-ups and high-growth businesses.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 expands venture capital tax incentives from 1 July 2027 through changes to the ESVCLP and VCLP programs."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Expanding venture capital incentives",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "From 1 July 2027, the Government will expand venture capital tax incentives to align with modern company valuations."
          }
        ]
      },
      {
        id: "claim-budget-boosted-rd-incentives",
        verbatim: "Tonight's budget announced boosted R&D tax incentives ...",
        paraphrased: "Budget 2026 boosts R&D tax incentives.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "The official Budget 2026 materials describe reforms to the R&D Tax Incentive that are framed as delivering stronger support to young firms and core R&D, including larger offsets, a higher refundable threshold for younger firms, and a higher expenditure cap.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 strengthens the R&D Tax Incentive, especially for young firms and core R&D."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "supports",
            relevantPassage:
              "Reforms to the Research and Development (R&D) Tax Incentive will unlock $400 million per year in additional R&D by young firms."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Better targeting the Research and Development Tax Incentive",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will better incentivise core R&D that benefits the broader economy ... increasing the turnover threshold for the higher, refundable offset to $50 million."
          }
        ]
      },
      {
        id: "claim-budget-loss-carry-back",
        verbatim:
          "Tonight's budget announced ... loss carry back ...",
        paraphrased:
          "Budget 2026 reintroduces loss carry back for eligible companies.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The official Budget 2026 tax reform page explicitly states that the Government is reintroducing loss carry back from 2026-27 for eligible companies that make a loss in the current income year.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 restores loss carry back so eligible companies can get a refund against tax paid in the prior two income years."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Boosting resilience and dynamism",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "From 2026-27, eligible companies that make a loss in the current income year will be able to use that loss to get a refund against tax paid in the prior two income years."
          }
        ]
      },
      {
        id: "claim-budget-loss-refundability",
        verbatim:
          "Tonight's budget announced ... loss refundability for startups ...",
        paraphrased:
          "Budget 2026 introduces loss refundability for eligible start-ups.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "The official Budget 2026 tax reform page states that the Government is introducing loss refundability for small start-ups in their first two years of operation from 2028-29.",
        assumptionsRequired: [],
        alternativeFramings: [
          "From 2028-29, eligible small start-ups in their first two years will be able to get a refund for tax losses."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Boosting resilience and dynamism",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "From 2028-29, small start-ups in their first two years of operation will be able to get a refund for tax losses, up to the value of fringe benefits tax and withholding tax paid on employee wages."
          }
        ]
      },
      {
        id: "claim-budget-startup-cgt-consultation",
        verbatim:
          "Tonight's budget announced ... a specific commitment to consult with the startup sector on CGT treatment.",
        paraphrased:
          "Budget 2026 includes a specific commitment to consult with the startup sector on CGT treatment.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.76,
        reasoning:
          "The official Budget 2026 tax reform and productivity materials reviewed for this check contain the CGT reform itself and several startup-support measures, but they do not identify a specific startup-sector consultation commitment on CGT treatment.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget materials reviewed here show startup-support tax measures, but not a specific CGT consultation commitment targeted at the startup sector."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and business tax reform sections",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The page sets out the CGT reform, loss carry back, loss refundability, venture capital incentives and R&D changes, but does not identify a specific startup-sector consultation on CGT treatment."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-family-home-distortion-claim",
    title: "Public post on CGT \"doubling\" and family-home distortion",
    submittedAt: "2026-05-13T01:50:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    rawText:
      "However in the debate about CGT there has been one critical issue missing. The doubling of the CGT rate and the ongoing exemption of the family home will make home ownership even more elusive for those that don't own their own home today. This policy change will create further distortion.",
    summary:
      "The visible post contains one over-precise tax-design claim, one descriptive claim about the main residence exemption, and one predictive housing-distortion claim. The tax-design wording overstates what Budget 2026 actually does, the family-home exemption point is broadly consistent with current law, and the housing prediction is not resolved by the primary sources alone.",
    calculatorLink: {
      label: "Open housing-distortion scenario",
      description:
        "Prefills an established-property case after the cutoff so the calculator can show the reform is not a literal uniform rate-doubling.",
      href: buildScenarioCalculatorHref("budget-2026-family-home-distortion-claim", "budget-2026-family-home-distortion-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-cgt-doubling-post",
        verbatim: "The doubling of the CGT rate ...",
        paraphrased: "Budget 2026 doubles the CGT rate.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.86,
        reasoning:
          "Budget Paper 2 does not describe a simple doubled CGT rate. The measure replaces the 50 per cent discount with indexation plus a 30 per cent minimum tax on net capital gains from 1 July 2027, and effective outcomes vary with inflation, holding period, grandfathering, and any other concession that applies.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Budget 2026 replaces the 50 per cent CGT discount with indexation plus a 30 per cent minimum tax from 1 July 2027.",
          "The reform can increase effective CGT in some scenarios, but not as a uniform doubling."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "contradicts",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          }
        ]
      },
      {
        id: "claim-family-home-exemption-ongoing",
        verbatim: "... the ongoing exemption of the family home ...",
        paraphrased: "The family home remains generally exempt from CGT.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "The Budget 2026 CGT measure changes the discount treatment for eligible capital gains, but the main residence exemption remains part of the current CGT framework. The ATO states that a taxpayer's main residence is generally exempt from CGT if the standard conditions are met.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The main residence exemption remains generally available under current CGT rules."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: Eligibility for main residence exemption",
            publisher: "Australian Taxation Office",
            section: "Eligibility conditions",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence---home/eligibility-for-main-residence-exemption",
            supports: "supports",
            relevantPassage:
              "Your main residence (your home) is exempt from CGT if you're an Australian resident and the dwelling meets the usual conditions."
          }
        ]
      },
      {
        id: "claim-home-ownership-more-elusive",
        verbatim: "... will make home ownership even more elusive ... This policy change will create further distortion.",
        paraphrased: "This policy mix will worsen housing access and create additional distortion.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.84,
        reasoning:
          "This is a forward-looking causal judgement about housing markets and behavioural responses. The cited primary sources establish the policy settings, but they do not by themselves resolve how strongly this specific policy combination will affect home ownership access or market distortion.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The policy mix may intensify some housing-allocation concerns, but the size and direction of the effect are not resolved by the primary texts alone."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The measure changes CGT discount treatment from 1 July 2027 while retaining the broader structure of housing-related tax settings described in the package."
          },
          {
            title: "ATO: Eligibility for main residence exemption",
            publisher: "Australian Taxation Office",
            section: "Eligibility conditions",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence---home/eligibility-for-main-residence-exemption",
            supports: "partially_supports",
            relevantPassage:
              "If you meet these conditions, you don't pay tax on any capital gain when you sell your home."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-cgt-founder-claim",
    title: "Founder-exit claim on Budget 2026 CGT reform",
    submittedAt: "2026-05-13T00:12:00Z",
    posterLabel: "Public LinkedIn post",
    posterNamedPublicly: false,
    sourceUrl: "https://www.linkedin.com/posts/example",
    rawText:
      "The Budget 2026 CGT changes will push founders to Singapore because they double the tax on any startup exit. Australia will become uninvestable for builders.",
    summary:
      "The submission contains one calculation-style claim and one broader behavioural claim. The calculation claim requires assumptions the post does not disclose, while the behavioural claim is not cleanly verified by the cited primary sources alone.",
    calculatorLink: {
      label: "Open founder-exit scenario",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the 'double the tax' argument can be tested with visible assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-cgt-founder-claim", "budget-2026-cgt-founder-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-founder-double-tax",
        verbatim: "The Budget 2026 CGT changes ... double the tax on any startup exit.",
        paraphrased: "The 2026-27 CGT reform doubles tax on founder exits in startup scenarios.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "The primary source confirms a new post-1 July 2027 regime, but the magnitude depends on asset timing, holding period, any grandfathering split, Subdivision 152 eligibility, and whether the claim assumes no targeted founder carve-out emerges from consultation.",
        assumptionsRequired: [
          "No Subdivision 152 concession applies",
          "The gain is fully post-1 July 2027",
          "The claim is using a specific marginal tax rate and holding period"
        ],
        alternativeFramings: [
          "The reform can materially increase tax in some founder scenarios",
          "The effect varies sharply with grandfathering and active-business concessions"
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Tax Reform – Boosting Home Ownership",
            page: 21,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "From 1 July 2027, eligible taxpayers move from the 50 per cent CGT discount to indexation plus a 30 per cent minimum tax on net capital gains."
          },
          {
            title: "ATO small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Subdivision 152 overview",
            page: 1,
            url: "https://www.ato.gov.au/law/view/view.htm?docid=SAV/CGTCONCESSIONS/00001",
            supports: "partially_supports",
            relevantPassage:
              "Small business CGT concessions may reduce or disregard gains where the basic conditions are met."
          }
        ]
      },
      {
        id: "claim-founder-exodus",
        verbatim: "Australia will become uninvestable for builders.",
        paraphrased: "The reform will make Australia uninvestable for startup builders.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.92,
        reasoning:
          "This is a characterisation about future investment sentiment, not a discrete factual claim that can be resolved by current primary sources alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The reform may create stronger friction for some founder exit scenarios",
          "The same Budget also expands venture capital incentives"
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Expanding venture capital tax incentives",
            page: 18,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The Budget expands ESVCLP and VCLP thresholds to encourage investment in high-growth firms."
          }
        ]
      }
    ]
  },
  {
    id: "housing-claim-negative-gearing",
    title: "Housing substitution claim after negative gearing changes",
    submittedAt: "2026-05-12T18:41:00Z",
    posterLabel: "Anonymous screenshot submission",
    posterNamedPublicly: false,
    rawText:
      "If they hit CGT, capital will obviously flood into existing housing instead. That's the only rational response.",
    summary:
      "The submission mixes a factual housing-tax-package claim with a stronger behavioural assertion. The first is contradicted by the same Budget package; the second requires evidence beyond the Budget papers.",
    calculatorLink: {
      label: "Open housing-substitution scenario",
      description:
        "Prefills a post-cutoff established-property case with negative-gearing losses so the housing-substitution story can be tested against the same package design.",
      href: buildScenarioCalculatorHref("housing-claim-negative-gearing", "housing-claim-negative-gearing")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-capital-flood-existing-housing",
        verbatim: "If they hit CGT, capital will obviously flood into existing housing instead.",
        paraphrased:
          "Budget 2026's CGT change will redirect capital into established housing.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.93,
        reasoning:
          "The same Budget package does not simply 'hit CGT' in isolation. It also limits negative gearing to new builds from 1 July 2027 and stops investors who buy established housing after Budget night from deducting rental losses against wage income. That directly weakens the claim that the package channels investors into existing housing as the obvious substitute destination.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The package changes both CGT and negative gearing together, with a policy preference toward new housing supply rather than established-housing substitution."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation and introduce a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The Government will limit negative gearing to new builds from 1 July 2027 ... Investors who buy established housing after Budget night ... won't be able to deduct them against other income like wages."
          }
        ]
      },
      {
        id: "claim-only-rational-response",
        verbatim: "That's the only rational response.",
        paraphrased:
          "Moving capital into established housing is the only rational investor response to the Budget 2026 package.",
        claimType: "behavioural",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.85,
        reasoning:
          "This conclusion depends on substantial hidden assumptions about investor tax rates, debt use, property type, access to new-build stock, expected returns in non-housing assets, and how investors weigh the simultaneous CGT and negative-gearing changes. The Budget papers establish the policy settings, but they do not show that one behavioural response is uniquely rational across investor types.",
        assumptionsRequired: [
          "Assumes investors are comparing established housing rather than new builds, even though new builds retain fuller negative-gearing treatment.",
          "Assumes leverage, marginal tax rates, and expected returns make established housing superior to businesses, shares, or other assets after the reform.",
          "Assumes all relevant investors face the same objective and constraints."
        ],
        alternativeFramings: [
          "Some investors may reassess relative after-tax returns, but the dominant response depends on facts the Budget papers do not settle.",
          "The package may shift some demand within housing, though the design explicitly favours new supply over established-property loss deductions."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "Investors in new builds will be able to choose the 50 per cent CGT discount or the new arrangements ... investors who buy new builds will still be able to deduct losses from other income."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The CGT reforms will only apply to gains arising after 1 July 2027."
          }
        ]
      }
    ]
  }
];

export const clusterSummaries: ClusterSummary[] = [
  {
    id: "cluster-shares-debt-recycling",
    canonicalParaphrase:
      "Budget 2026 narrows residential negative gearing but leaves share deductibility in place, so debt recycling into shares remains available.",
    subjectDomain: "taxation",
    tags: ["shares", "debt recycling", "negative gearing", "property"],
    instanceCount: 1,
    lastSeen: "2026-05-13T09:50:00Z",
    aggregateVerdict: "supported",
    commonMissingAssumptions: [
      "The legal availability point is clean, but claims about whether this makes shares the better strategy still depend on relative-return and tax assumptions.",
      "Do not confuse unchanged share deductibility with unchanged CGT outcomes for shares."
    ],
    sampleVariations: [
      "debt recycling into shares still works",
      "shares keep existing arrangements",
      "negative gearing change is property-focused, not shares"
    ],
    primarySources: [
      {
        title: "Budget 2026–27 Tax Explainer",
        url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf"
      },
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      }
    ]
  },
  {
    id: "cluster-young-people-rentvesting-tax-grab",
    canonicalParaphrase:
      "The package barely slows house prices, grandfather-protects incumbents, and makes it harder for young people to build wealth through rentvesting and non-property assets.",
    subjectDomain: "taxation",
    tags: ["young Australians", "rentvesting", "housing", "shares"],
    instanceCount: 2,
    lastSeen: "2026-05-13T09:09:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "The grandfathering and non-property scope points are real, but the larger claim about overall harm to young people depends on unresolved housing-price, rent, and asset-return assumptions.",
      "The post cites specific house-price modelling figures that are not surfaced in the current indexed source set attached to this check."
    ],
    sampleVariations: [
      "house prices still up, just less up",
      "rentvesters get hurt",
      "young people are cooked",
      "hard to call that intergenerational fairness"
    ],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.22",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      }
    ]
  },
  {
    id: "cluster-negative-gearing-grandfathering",
    canonicalParaphrase:
      "Negative gearing is being grandfathered for current investors while future buyers of established housing lose access.",
    subjectDomain: "taxation",
    tags: ["negative gearing", "housing", "grandfathering", "young Australians"],
    instanceCount: 1,
    lastSeen: "2026-05-13T08:49:00Z",
    aggregateVerdict: "supported",
    commonMissingAssumptions: [
      "The core policy mechanics are clear, but broader claims about whether this leaves young people better or worse off overall require separate housing-market assumptions.",
      "The post's age-and-wealth framing overstates what the policy text itself says about who is protected."
    ],
    sampleVariations: [
      "boomers keep negative gearing",
      "new established-property buyers lose access",
      "grandfathered for incumbents"
    ],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.22",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      }
    ]
  },
  {
    id: "cluster-long-term-etf-planning",
    canonicalParaphrase:
      "The CGT redesign for shares makes long-term ETF planning harder and may leave strong long-horizon investors paying more tax than under the old discount system.",
    subjectDomain: "taxation",
    tags: ["ETFs", "shares", "long-term investing", "planning uncertainty"],
    instanceCount: 5,
    lastSeen: "2026-05-13T09:34:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Treats higher long-run tax outcomes as almost automatic without disclosing the inflation, return, and marginal-rate assumptions that drive the comparison.",
      "Blends a supported scope point about shares being affected with a broader confidence-and-planning judgement that is harder to verify cleanly."
    ],
    sampleVariations: [
      "shares hit too",
      "long-term ETF investors almost certainly worse off",
      "hard to plan when the CGT framework flips again",
      "FI bridge-phase gets repriced before preservation age",
      "FIRE target rises because after-tax withdrawals get worse",
      "30% floor is regressive for share investors"
    ],
    primarySources: [
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      },
      {
        title: "ATO: CGT discount",
        url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount"
      },
      {
        title: "ATO: Tax rates – Australian resident",
        url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000"
      }
    ]
  },
  {
    id: "cluster-aspiration-budget",
    canonicalParaphrase:
      "Budget 2026 punishes aspiration, risk-taking, and business-building rather than rewarding it.",
    subjectDomain: "taxation",
    tags: ["aspiration", "business owners", "negative gearing", "startups"],
    instanceCount: 1,
    lastSeen: "2026-05-13T06:05:00Z",
    aggregateVerdict: "rhetorical",
    commonMissingAssumptions: [
      "Treats a broad normative judgement about aspiration and nation-level economic direction as if it were a single verifiable fact.",
      "Mixes one real policy change on negative gearing into a much wider claim about the entire Budget's economic meaning."
    ],
    sampleVariations: [
      "budget punishes aspiration",
      "anti-risk budget",
      "terrible budget for builders"
    ],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, pp.21-22",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      }
    ]
  },
  {
    id: "cluster-young-founder-net-target",
    canonicalParaphrase:
      "A younger founder starting under the new regime needs a much larger gross exit than an older founder under the old regime to keep the same after-tax proceeds.",
    subjectDomain: "taxation",
    tags: ["founders", "young Australians", "capital gains", "intergenerational equity"],
    instanceCount: 1,
    lastSeen: "2026-05-13T06:03:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Treats precise net-to-gross founder exit numbers as if they do not depend on marginal rate, cost base, Medicare, and concession eligibility.",
      "Uses a real directional founder-comparison point, but overstates it with an unsupported '$20 million' headline."
    ],
    sampleVariations: [
      "$13m then, $20m now",
      "young founders need much bigger exits",
      "this is not intergenerational equity"
    ],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "ATO: Tax rates – Australian resident",
        url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000"
      },
      {
        title: "ATO: Small business CGT concessions",
        url: "https://www.ato.gov.au/SBCGT"
      }
    ]
  },
  {
    id: "cluster-australian-entrepreneurs-relief",
    canonicalParaphrase:
      "Budget 2026 makes Australia the most punitive developed-country tax regime for founders, so Australia needs a founder-specific relief modelled on QSBS and BADR.",
    subjectDomain: "taxation",
    tags: ["founders", "startups", "capital gains", "international comparison"],
    instanceCount: 1,
    lastSeen: "2026-05-13T06:01:00Z",
    aggregateVerdict: "unsupported",
    commonMissingAssumptions: [
      "Uses a sweeping cross-country ranking without a fixed comparison basket or a like-for-like founder-relief methodology.",
      "Blends a supported policy-design reference to QSBS and BADR into a much stronger claim that Australia is the most punitive jurisdiction."
    ],
    sampleVariations: [
      "Australia most punitive for founders",
      "need Australian Entrepreneurs Relief",
      "model it on QSBS and BADR"
    ],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "IRS Publication 550",
        url: "https://www.irs.gov/publications/p550"
      },
      {
        title: "GOV.UK: Business Asset Disposal Relief",
        url: "https://www.gov.uk/entrepreneurs-relief"
      }
    ]
  },
  {
    id: "cluster-young-etf-home-deposit",
    canonicalParaphrase:
      "The new CGT regime sharply worsens ETF-based first-home saving for young Australians.",
    subjectDomain: "taxation",
    tags: ["young Australians", "ETFs", "housing", "capital gains"],
    instanceCount: 1,
    lastSeen: "2026-05-13T05:52:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Treats a precise dollar loss and deposit delay as if they follow without disclosing tax-rate, inflation, and deposit-target assumptions.",
      "Collapses a supported floor-design critique into a stronger headline percentage claim that is not cleanly shown by the visible example."
    ],
    sampleVariations: ["ETF saver hit 260%", "first-home deposit delayed by CGT", "young investors punished by 30% floor"],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "ATO: Tax rates – Australian resident",
        url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000"
      }
    ]
  },
  {
    id: "cluster-founder-better-off-countercase",
    canonicalParaphrase:
      "Higher CGT on founder exits can coexist with a better overall startup environment once the rest of the budget is counted.",
    subjectDomain: "taxation",
    tags: ["founders", "startups", "cost of living", "capital gains"],
    instanceCount: 1,
    lastSeen: "2026-05-13T05:36:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Assumes the founder benefits enough from worker-tax and startup-support measures to offset the higher CGT exposure.",
      "Treats a broad all-things-considered judgement as if it can be resolved without person-specific facts."
    ],
    sampleVariations: ["higher tax but still better off", "better startup environment overall", "CGT increase but broader gains"],
    primarySources: [
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      },
      {
        title: "Budget 2026-27 Cost of living page",
        url: "https://budget.gov.au/content/02-cost-of-living.htm"
      }
    ]
  },
  {
    id: "cluster-capital-vs-labour-tax",
    canonicalParaphrase:
      "The current CGT discount taxes eligible long-held gains more lightly than marginal labour income for the same taxpayer.",
    subjectDomain: "taxation",
    tags: ["capital gains", "tax design", "distribution"],
    instanceCount: 1,
    lastSeen: "2026-05-13T03:25:00Z",
    aggregateVerdict: "supported",
    commonMissingAssumptions: [
      "The clean comparison is against marginal labour tax, not average tax.",
      "The gain must be eligible for the 50 per cent CGT discount."
    ],
    sampleVariations: ["capital taxed less than wages", "CGT discount is a tax preference", "discounted gain below labour tax"],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "ATO: Tax rates – Australian resident",
        url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000"
      }
    ]
  },
  {
    id: "cluster-subdiv152-founder-shield",
    canonicalParaphrase:
      "Subdivision 152 means most founder or startup exits will still be largely shielded from the Budget 2026 CGT change.",
    subjectDomain: "taxation",
    tags: ["founders", "startups", "Subdivision 152"],
    instanceCount: 1,
    lastSeen: "2026-05-13T03:10:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Assumes most founder exits satisfy the active-asset and business-size conditions for Subdivision 152.",
      "Treats legal availability of the concessions as proof of prevalence across the founder cohort."
    ],
    sampleVariations: ["most founders are protected by Subdivision 152", "startup exits still neutralised", "founder tax shock mostly disappears under SBCGT"],
    primarySources: [
      {
        title: "ATO: Small business CGT concessions",
        url: "https://www.ato.gov.au/SBCGT"
      },
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      }
    ]
  },
  {
    id: "cluster-pre-cgt-assets",
    canonicalParaphrase:
      "Budget 2026 is pulling pre-1985 assets into the CGT net.",
    subjectDomain: "taxation",
    tags: ["capital gains", "pre-CGT assets", "grandfathering"],
    instanceCount: 3,
    lastSeen: "2026-05-13T09:13:00Z",
    aggregateVerdict: "supported",
    commonMissingAssumptions: [
      "The core transition is now explicit in the Budget tax explainer, but the exact valuation and apportionment mechanics still depend on legislation and ATO implementation tools.",
      "Claims about secondary legal consequences, such as the future importance of Division 149, still need careful legislative treatment."
    ],
    sampleVariations: ["pre-1985 assets taxed", "pre-CGT assets dragged into net", "old assets now caught by CGT", "future gains on pre-1985 assets now taxed"],
    primarySources: [
      {
        title: "Budget 2026–27 Tax Explainer",
        url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf"
      },
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      }
    ]
  },
  {
    id: "cluster-zero-cost-base-business-exit",
    canonicalParaphrase:
      "A zero-cost-base self-funded business will automatically face a full 47 per cent tax on sale under the Budget 2026 CGT reform.",
    subjectDomain: "taxation",
    tags: ["founders", "small business", "capital gains"],
    instanceCount: 7,
    lastSeen: "2026-05-13T09:12:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Assumes an individual owner taxed at the top marginal rate",
      "Ignores small business CGT concessions that can reduce or disregard gains"
    ],
    sampleVariations: ["sweat equity taxed at 47%", "zero cost base means full 47%", "self-funded business exit tax"],
    primarySources: [
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      },
      {
        title: "ATO: CGT concessions eligibility overview",
        url: "https://www.ato.gov.au/SBCGT"
      }
    ]
  },
  {
    id: "cluster-startup-support-measures",
    canonicalParaphrase:
      "Budget 2026 includes startup-support measures such as stronger R&D and venture capital incentives.",
    subjectDomain: "taxation",
    tags: ["startups", "venture capital", "R&D"],
    instanceCount: 1,
    lastSeen: "2026-05-13T01:53:00Z",
    aggregateVerdict: "supported",
    commonMissingAssumptions: [
      "Cleanest when limited to the measures explicitly visible in the screenshot",
      "Do not over-extend the truncated loss carry back and refundability wording without the full post text"
    ],
    sampleVariations: ["boosted R&D incentives", "expanded VC tax incentives", "startup support"],
    primarySources: [
      {
        title: "Budget 2026-27 Tax reform page",
        url: "https://budget.gov.au/content/04-tax-reform.htm"
      },
      {
        title: "Budget 2026-27 Productivity page",
        url: "https://budget.gov.au/content/03-productivity.htm"
      }
    ]
  },
  {
    id: "cluster-family-home-distortion",
    canonicalParaphrase:
      "CGT reform plus the continuing family-home exemption will worsen housing access or create extra distortion.",
    subjectDomain: "taxation",
    tags: ["housing", "family home", "capital gains"],
    instanceCount: 1,
    lastSeen: "2026-05-13T01:50:00Z",
    aggregateVerdict: "rhetorical",
    commonMissingAssumptions: [
      "Assumes a specific housing-market transmission from CGT changes to first-home access",
      "Treats the policy interaction as directionally clear without empirical attribution"
    ],
    sampleVariations: ["further distortion", "home ownership more elusive", "family home exemption"],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.21",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "ATO: Main residence exemption",
        url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence---home/eligibility-for-main-residence-exemption"
      }
    ]
  },
  {
    id: "cluster-founder-capital-flight",
    canonicalParaphrase:
      "Removing the CGT discount will cause founders or capital to leave Australia.",
    subjectDomain: "taxation",
    tags: ["founders", "capital flight", "startups"],
    instanceCount: 15,
    lastSeen: "2026-05-13T22:07:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Treats tax as the dominant factor in founder location decisions",
      "Ignores expanded VC incentives in the same budget package",
      "Assumes no grandfathering or targeted founder concession affects the scenario"
    ],
    sampleVariations: ["mass exodus", "capital flight", "Singapore move", "fewer AI companies", "fewer reasons to stay"],
    primarySources: [
      {
        title: "Budget Paper 2 2026-27, p.18",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      },
      {
        title: "Budget Paper 2 2026-27, pp.21-22",
        url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
      }
    ]
  },
  {
    id: "cluster-young-australians",
    canonicalParaphrase:
      "The current CGT discount mainly protects young Australians trying to build wealth.",
    subjectDomain: "taxation",
    tags: ["young Australians", "distribution", "housing"],
    instanceCount: 8,
    lastSeen: "2026-05-12T14:05:00Z",
    aggregateVerdict: "unsupported",
    commonMissingAssumptions: [
      "Conflicts with official age and income split data",
      "Treats a concentrated concession as broadly distributed"
    ],
    sampleVariations: ["young investors", "middle-class ladder", "future homeowners"],
    primarySources: [
      {
        title: "PBO: Operation of the CGT discount",
        url: "https://www.pbo.gov.au/publications-and-data/publications/costings/operation-CGT-discount"
      },
      {
        title: "Treasury TEIS chart data workbook",
        url: "https://treasury.gov.au/sites/default/files/2025-12/p2025-721342-chart-data.xlsx"
      }
    ]
  }
];

export const featuredSources = [
  {
    title: "IRS Publication 550",
    detail: "Primary US reference for qualified small business stock treatment used when claims invoke QSBS-style founder relief.",
    url: "https://www.irs.gov/publications/p550"
  },
  {
    title: "GOV.UK: Business Asset Disposal Relief",
    detail: "Primary UK reference for founder-oriented disposal relief used in international comparison claims.",
    url: "https://www.gov.uk/entrepreneurs-relief"
  },
  {
    title: "Budget 2026 cost of living page",
    detail: "Primary reference for the worker tax-cut measures used when claims argue founders may still be better off overall.",
    url: "https://budget.gov.au/content/02-cost-of-living.htm"
  },
  {
    title: "Budget Paper 1, Statement 4",
    detail: "Distributional rationale and lifetime-income concentration of CGT discount benefits.",
    url: "https://budget.gov.au/content/bp1/download/bp1-2026-27.pdf"
  },
  {
    title: "Budget Paper 2, pp.21-22",
    detail: "Primary policy text for CGT and negative gearing reform.",
    url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf"
  },
  {
    title: "PBO: Operation of the CGT discount",
    detail: "Distribution tables for who benefits under the current concession.",
    url: "https://www.pbo.gov.au/publications-and-data/publications/costings/operation-CGT-discount"
  },
  {
    title: "ABS CPI historical series",
    detail: "Quarterly CPI reference for calculation-based verification work.",
    url: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia/latest-release"
  },
  {
    title: "ATO: Main residence exemption",
    detail: "Primary reference for the continuing CGT exemption treatment of the main residence.",
    url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence---home/eligibility-for-main-residence-exemption"
  },
  {
    title: "Budget 2026 productivity and tax reform pages",
    detail: "Primary web sources for venture capital and R&D incentive measures referenced in startup-policy claims.",
    url: "https://budget.gov.au/content/04-tax-reform.htm"
  },
  {
    title: "ATO: Small business CGT concessions",
    detail: "Primary reference showing that eligible small business owners may reduce or disregard gains through specific CGT concessions.",
    url: "https://www.ato.gov.au/SBCGT"
  },
  {
    title: "ATO: Tax rates – Australian resident",
    detail: "Resident marginal income-tax rate reference used for capital-versus-labour comparisons.",
    url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents?lang=en&pubdate=636168759750000000"
  }
];
