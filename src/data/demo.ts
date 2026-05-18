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
  totalFactChecks: 64,
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
    id: "budget-2026-chris-brycki-wealth-divide-article-claim",
    title: "Chris Brycki article arguing three Budget 2026 miscalculations lock in a wider wealth divide",
    submittedAt: "2026-05-18T05:39:00Z",
    posterLabel: "Newspaper screenshot submission",
    posterNamedPublicly: true,
    rawText:
      "Three key miscalculations that lock in wealth divide. 1. Misreading Gen Z 2. Breaching trust 3. Favouring Boomers. The article argues younger Australians increasingly feel there is no obvious wealth-building path, that Gen X and Millennials who followed long-standing wealth-building advice will feel betrayed, and that Baby Boomers remain the quiet beneficiaries because primary residences stay tax exempt and existing shares, investment properties and business assets are effectively grandfathered.",
    summary:
      "This article version advances the same generational critique as the shorter Chris Brycki post, but with a clearer factual spine around grandfathering and incumbent-owner protection. The strongest checkable piece is that existing owner advantages remain significant: the family home stays exempt, and established-housing incumbents are treated more favourably than new post-Budget-night entrants. But the broader claims about Gen Z giving up on aspiration, a breach of trust with Gen X and Millennials, or a widening wealth divide remain interpretation-heavy and depend on behavioural and cohort assumptions that the Budget papers do not themselves settle.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a younger-investor case so the article's intergenerational wealth-divide framing can be tested against explicit housing, share, and tax assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-brycki-wealth-divide-lock-in",
        verbatim:
          "Three key miscalculations that lock in wealth divide",
        paraphrased:
          "The Budget 2026 package locks in a wider wealth divide.",
        claimType: "interpretive",
        subjectDomain: "intergenerational_equity",
        verdict: "rhetorical",
        confidence: 0.93,
        reasoning:
          "This is a broad evaluative headline about the package's social meaning and distributive effect, not a narrow factual proposition the current source set can prove by itself.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The article argues the package entrenches incumbent advantages and narrows wealth-building routes for newer entrants."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall tax reform package",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the package as fairness- and productivity-enhancing, which shows the article's 'lock in wealth divide' headline is a competing political judgement rather than a settled factual descriptor."
          }
        ]
      },
      {
        id: "claim-brycki-misreading-gen-z-article",
        verbatim:
          "Misreading Gen Z",
        paraphrased:
          "The Budget misreads younger Australians by assuming they have accepted that traditional wealth-building is no longer realistic.",
        claimType: "interpretive",
        subjectDomain: "politics",
        verdict: "requires_assumptions",
        confidence: 0.81,
        reasoning:
          "The article ties the policy package to a political reading of younger Australians' aspirations. That concern is plausible given the site's other young-saver entries on shares, ETFs and housing, but it still requires mind-reading and broader political assumptions. The Budget papers do not establish that ministers consciously assumed younger Australians had abandoned traditional wealth-building.",
        assumptionsRequired: [
          "Assumes the package's design reflects a deliberate political judgement about younger Australians' aspirations.",
          "Assumes younger Australians mainly experience the package as closing off traditional wealth-building channels rather than opening housing opportunities."
        ],
        alternativeFramings: [
          "A narrower factual claim is that the package may still leave younger non-property savers with weaker post-2027 wealth-building incentives.",
          "The article's Gen Z point is best read as a political interpretation of how the package lands with younger cohorts."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Boosting resilience and dynamism",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The Government says the package will improve productivity, boost resilience and back start-ups, which cuts against the idea that it openly assumes younger Australians have abandoned aspiration."
          },
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms and CGT reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens housing concessions while also redesigning CGT more broadly, which is why younger-saver aspiration concerns appear repeatedly even though the Government frames the package differently."
          }
        ]
      },
      {
        id: "claim-brycki-breach-of-trust-article",
        verbatim:
          "Breaching trust",
        paraphrased:
          "The Budget breaches trust with Gen X and Millennial Australians who followed the usual wealth-building playbook of housing, shares and super.",
        claimType: "predictive",
        subjectDomain: "politics",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "There is a real basis for some backlash among mid-life investors and founders because the package changes post-2027 outcomes for shares, businesses and investment-property pathways. But 'breach of trust' is still a political and emotional conclusion that depends on whether those cohorts expected the prior settings to persist and whether their losses outweigh any support for the package's housing goals.",
        assumptionsRequired: [
          "Assumes a large enough share of Gen X and Millennials used those asset pathways and see the package as reneging on the old rules.",
          "Assumes disappointment and policy disagreement rise to the level of a broad cohort-level trust breach."
        ],
        alternativeFramings: [
          "The package creates plausible resentment among middle-aged investors who built plans around housing, shares and business assets.",
          "A stronger factual version is that familiar wealth-building pathways become less attractive for some incumbent or emerging mid-life investors."
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
              "The housing-side measure narrows tax support for established property investment, which creates a clear basis for backlash among some existing or would-be investors even though the paper frames the policy as improving home ownership."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The broader CGT redesign changes after-tax outcomes for shares, business assets and other gains, which helps explain why some mid-life investors and founders might react negatively."
          }
        ]
      },
      {
        id: "claim-brycki-favouring-boomers-article",
        verbatim:
          "Favouring Boomers",
        paraphrased:
          "The package still favours older incumbent asset owners because the primary residence remains exempt and existing assets remain relatively protected through grandfathering.",
        claimType: "comparative",
        subjectDomain: "intergenerational_equity",
        verdict: "supported",
        confidence: 0.88,
        reasoning:
          "This is the strongest factual spine in the article. The family home remains outside CGT, and the housing measure explicitly preserves better treatment for incumbent established-housing owners than for buyers who enter after Budget night. It is also fair to say that older incumbent owners are more likely to be overrepresented among those protected groups. The age-cohort mapping is still inferential, but the underlying incumbent-protection mechanism is real.",
        assumptionsRequired: [],
        alternativeFramings: [
          "A tighter version is that the package preserves significant advantages for incumbent asset owners relative to new entrants, which often overlaps with older cohorts.",
          "The key factual point is incumbent protection and grandfathering, not a provable intent to reward Boomers as a class."
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
              "Investors who already own established housing remain grandfathered, while investors who buy established housing after Budget night and make rental losses will not be able to deduct them against wages."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The CGT redesign applies more broadly from 1 July 2027, which is why incumbent-owner versus new-entrant comparisons recur across multiple fact-checked submissions."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-chris-brycki-three-miscalculations-claim",
    title: "Chris Brycki post arguing the Budget will be remembered for three generational and political miscalculations",
    submittedAt: "2026-05-18T05:38:00Z",
    posterLabel: "Chris Brycki on LinkedIn",
    posterNamedPublicly: true,
    rawText:
      "Jim Chalmers' fifth budget may ultimately be remembered for three political miscalculations: 1. Believing Gen Z has given up on aspiration 2. Believing Gen X and Millennials won't feel betrayed 3. Unintentionally favouring Baby Boomers",
    summary:
      "This LinkedIn post is mostly political interpretation rather than narrow factual description. The strongest factual hook is the suggestion that the package can still leave older incumbent asset owners looking relatively protected while younger people face weaker post-2027 wealth-building settings outside housing, but even that depends on how broadly you define the comparison group and which concessions matter most. The sharper generational mind-reading claims about Gen Z aspiration and Gen X or Millennial betrayal are not things the Budget papers themselves can verify. They are plausible political readings of the reform, not settled factual outcomes.",
    calculatorLink: {
      label: "Open young ETF saver scenario",
      description:
        "Prefills a younger-investor savings case so the post's generational winners-and-losers framing can be pressure-tested against explicit housing, ETF, and tax assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-young-etf-home-deposit-claim", "budget-2026-young-etf-home-deposit-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-brycki-three-political-miscalculations",
        verbatim:
          "Jim Chalmers' fifth budget may ultimately be remembered for three political miscalculations",
        paraphrased:
          "The Budget 2026 tax package will ultimately be remembered as three major political miscalculations.",
        claimType: "interpretive",
        subjectDomain: "politics",
        verdict: "rhetorical",
        confidence: 0.95,
        reasoning:
          "This is a retrospective political frame about how history and voters will remember the Budget, not a discrete factual proposition that can be verified from the policy texts or current source set.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues the package is a major political own goal on generational and aspiration grounds."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall tax reform package",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the package as fairness- and productivity-enhancing, which shows the post's 'three miscalculations' line is a competing political judgement rather than a settled factual descriptor."
          }
        ]
      },
      {
        id: "claim-brycki-gen-z-given-up-on-aspiration",
        verbatim:
          "Believing Gen Z has given up on aspiration",
        paraphrased:
          "The Budget is built on the belief that Gen Z has given up on aspiration.",
        claimType: "interpretive",
        subjectDomain: "politics",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "This is effectively a claim about the Government's political reading of younger voters, not about the black-letter tax rules themselves. The source base does show the package is sold partly through housing fairness and redistribution language, and other tracked claims show younger non-property savers can still face harsher post-2027 share and ETF treatment. But the leap from policy design to an asserted belief that Gen Z has 'given up on aspiration' requires mind-reading and broader political assumptions the Budget papers do not establish.",
        assumptionsRequired: [
          "Assumes the package's design reflects a deliberate political judgement about Gen Z's aspirations rather than a narrower housing-and-equity policy objective.",
          "Assumes Gen Z would mainly read the package as hostile to ambition instead of as a housing-fairness measure."
        ],
        alternativeFramings: [
          "A stronger factual version is that the package may land badly with younger savers who want to build wealth through assets outside owner-occupied housing.",
          "The policy can be read as down-weighting some aspiration pathways for younger investors, but not as proof of what ministers believe Gen Z thinks."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Boosting resilience and dynamism",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The Government says the package will improve productivity, boost resilience and back start-ups, which cuts against the idea that it openly assumes younger Australians have abandoned aspiration."
          },
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms and CGT reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The package tightens housing concessions while also redesigning CGT more broadly, which is why younger-saver aspiration concerns appear in multiple submissions even though the Government frames the package differently."
          }
        ]
      },
      {
        id: "claim-brycki-gen-x-millennials-wont-feel-betrayed",
        verbatim:
          "Believing Gen X and Millennials won't feel betrayed",
        paraphrased:
          "Gen X and Millennial voters will feel betrayed by the Budget 2026 tax package.",
        claimType: "predictive",
        subjectDomain: "politics",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "This is a political forecast about voter emotion and reaction, not something the current primary-source set can prove. The underlying policy mechanics do create visible reasons some middle-aged asset-builders and founders may dislike the package, but whether that amounts to a widespread feeling of betrayal across Gen X and Millennial cohorts depends on housing tenure, portfolio mix, business exposure, income level, and broader partisan context.",
        assumptionsRequired: [
          "Assumes the affected parts of Gen X and Millennial cohorts are numerous and politically salient enough to define the reaction.",
          "Assumes perceived losses on shares, business exits, or investment-property pathways outweigh any support for housing-side reform."
        ],
        alternativeFramings: [
          "Some Gen X and Millennial savers, founders and investors may feel the package closes off familiar wealth-building routes.",
          "The policy creates plausible resentment among some mid-life asset builders, but a broad generational betrayal verdict remains a forecast."
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
              "The housing-side measure narrows tax support for established property investment, which creates a clear basis for backlash among some existing or would-be investors even though the paper frames the policy as improving home ownership."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The broader CGT redesign changes after-tax outcomes for shares, business assets and other gains, which helps explain why some middle-aged investors and founders might react negatively."
          }
        ]
      },
      {
        id: "claim-brycki-unintentionally-favouring-baby-boomers",
        verbatim:
          "Unintentionally favouring Baby Boomers",
        paraphrased:
          "The Budget unintentionally favours Baby Boomers over younger cohorts.",
        claimType: "comparative",
        subjectDomain: "intergenerational_equity",
        verdict: "requires_assumptions",
        confidence: 0.84,
        reasoning:
          "There is a plausible factual spine here, but the claim still compresses too much. The source set does show that existing established-housing owners remain grandfathered while post-Budget-night buyers of established housing lose key negative-gearing treatment, and other tracked submissions show younger share and ETF investors can also face harsher post-2027 CGT settings. That can create a relative-incumbent advantage story that often maps onto older owners. But the post overstates what can be proven about age cohorts specifically, and 'unintentionally' is an intent claim the Budget papers do not establish.",
        assumptionsRequired: [
          "Assumes Baby Boomers are disproportionately represented among the grandfathered incumbent asset owners who keep the strongest relative protections.",
          "Assumes younger cohorts are more exposed to the newly worsened housing and non-housing wealth-building settings.",
          "Assumes the Government did not intend that age-skewed distributional effect."
        ],
        alternativeFramings: [
          "The package can leave incumbent asset owners looking relatively more protected than younger entrants, which often overlaps with an older-cohort advantage.",
          "A tighter claim is that grandfathering and incumbent protections may favour existing owners more than new entrants, rather than proving a deliberate generational transfer to Boomers."
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
              "Investors who already own established housing remain grandfathered, while investors who buy established housing after Budget night and make rental losses will not be able to deduct them against wages."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The CGT redesign applies more broadly from 1 July 2027, which is why younger-entrant and incumbent-owner comparisons recur across multiple fact-checked submissions."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-albos-tax-landing-page-claim",
    title: "albos.tax landing page summarising the Budget 2026 CGT redesign and startup backlash",
    submittedAt: "2026-05-15T09:20:00Z",
    posterLabel: "Web page submission",
    posterNamedPublicly: false,
    sourceUrl: "https://albos.tax/",
    rawText:
      "Kicks in 1 July 2027. Albo wants to retire the 50% CGT discount. Instead he'll introduce inflation-adjusted indexation, plus a 30% minimum tax on realised gains which he says is about fairness. The startup and finance ecosystem have a lot of strong opinions on this. I'm curating what they're saying about it, technical, funny, even rogue posts.",
    summary:
      "The albos.tax landing page is strongest when it sticks to the high-level policy mechanics: the Budget does retire the current 50 per cent discount from 1 July 2027 and replaces it with indexation plus a 30 per cent floor on gains. The weaker part is not the core policy summary but the broader ecosystem framing. The page clearly documents that there is a loud startup and finance backlash, yet the severity and representativeness of that backlash are still matters of interpretation rather than facts settled by the Budget papers alone.",
    calculatorLink: {
      label: "Model the post-2027 gain case",
      description:
        "Prefills a standard post-2027 capital-gain scenario so the landing page's headline policy summary can be tested against explicit assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-cgt-founder-claim", "budget-2026-cgt-founder-claim")
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
        id: "claim-albos-tax-kicks-in-1-july-2027",
        verbatim: "Kicks in 1 July 2027.",
        paraphrased: "The redesigned CGT regime begins from 1 July 2027.",
        claimType: "historical",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "This is a clean effective-date claim and it matches the primary Budget material already used across the site. The announced CGT redesign starts from 1 July 2027 rather than applying immediately to all prior gains.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The Budget redesign applies from 1 July 2027, with transition mechanics determining how pre- and post-start-date gains are treated."
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
              "The Government states that the redesigned capital-gains tax treatment applies from 1 July 2027."
          }
        ]
      },
      {
        id: "claim-albos-tax-retire-50pct-discount",
        verbatim:
          "Albo wants to retire the 50% CGT discount. Instead he'll introduce inflation-adjusted indexation, plus a 30% minimum tax on realised gains",
        paraphrased:
          "The Budget replaces the current 50 per cent CGT discount with indexation plus a 30 per cent minimum tax on gains.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.94,
        reasoning:
          "This is an accurate high-level summary of the announced policy architecture. The page compresses the mechanics into landing-page language, but the core replacement structure it describes is the same one set out in the Budget tax-reform materials.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The current 50 per cent discount is being replaced by an indexation-based approach plus a minimum 30 per cent tax floor from 1 July 2027."
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
          },
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Capital gains tax redesign",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "The tax explainer describes the same move from the existing discount model to inflation-linked treatment with a 30 per cent minimum tax floor."
          }
        ]
      },
      {
        id: "claim-albos-tax-startup-finance-strong-opinions",
        verbatim:
          "The startup and finance ecosystem have a lot of strong opinions on this. I'm curating what they're saying about it, technical, funny, even rogue posts.",
        paraphrased:
          "There is a broad, visible and emotionally charged startup-and-finance-sector reaction to the CGT changes.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.74,
        reasoning:
          "The page clearly shows many linked reactions from founders, investors and publications, so the basic observation that there is visible ecosystem reaction is fair. But how representative, broad or one-sided that reaction is depends on editorial selection. A curated page can prove that many strong takes exist; it cannot by itself prove that the displayed mood is the full ecosystem consensus.",
        assumptionsRequired: [
          "Assumes the curated outbound links are representative of the wider startup and finance conversation rather than a selected slice.",
          "Assumes link volume and tone are a good proxy for ecosystem-wide intensity."
        ],
        alternativeFramings: [
          "The page demonstrates that there is substantial visible backlash and commentary, but not necessarily that the displayed sentiment is comprehensive or unanimous.",
          "A curated reaction page is evidence of debate intensity, not a full survey of the ecosystem."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "albos.tax",
            publisher: "Web page",
            section: "Landing page curation",
            page: 1,
            url: "https://albos.tax/",
            supports: "partially_supports",
            relevantPassage:
              "The landing page collects a large number of founder, investor and media links, which is direct evidence of visible reaction but not of full-sample representativeness."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-linkedin-winners-losers-claim",
    title: "LinkedIn post listing who supposedly wins and loses from the Budget 2026 tax changes",
    submittedAt: "2026-05-15T08:27:00Z",
    posterLabel: "LinkedIn screenshot submission",
    posterNamedPublicly: false,
    rawText:
      "Here's a quick cheat sheet on the Winners and Losers from Jim Chalmers' abhorrence. LOSERS: Anyone aged under 40 wanting to buy an investment property; anyone aged under 40 wanting to buy shares or any other asset that might allow them to build real wealth; anyone wanting to work for a startup (you'll need to move to New Zealand, or frankly anywhere else); anyone aged under 40 who will be paying the interest on $1.25 trillion of accumulated and rapidly growing debt; anyone paying income tax which is not being adjusted for rampant inflation; business owners who battle for years on a meagre wage and will then be paying 47% tax on capital in one hit. WINNERS: Boomers who own existing investment properties and can keep negative gearing to their heart's content; foreign owned tech companies who use transfer pricing to pay zero tax in Australia; oil and gas companies (many foreign owned) who pay virtually no tax to extract our resources; millionaire superannuation holders who will continue to pay only 15% CGT; foreign investors buying Australian assets who will continue to pay 0% CGT; wealthy boomers who will continue to get refunds into their super for imputed dividend payments; thousands of crooked suppliers who have turned the NDIS into their own $50b cash machine; business valuers who somehow need to value every single Australian entity next July; anyone wanting to be a highly paid public servant; accountants who will be paid a lot more to deal with massively increased tax code complexity.",
    summary:
      "This post mixes one solid grandfathering point with several age-targeting, founder-flight, super-tax and foreign-investor claims that either overstate the current source base or depend heavily on unstated assumptions. The strongest claim in the screenshot is that existing property investors keep grandfathered negative-gearing treatment while later buyers of established housing lose access. But the broader framing that under-40 Australians are the clear losers across both housing and share investing is too sweeping for the indexed evidence here, the 47 per cent founder-exit line still depends on a no-relief scenario, and the claims about super and foreign investors compress more legal detail than the post acknowledges.",
    calculatorLink: {
      label: "Model the founder-exit case",
      description:
        "Prefills a no-relief zero-cost-base business scenario so the screenshot's 47 per cent capital-tax claim can be tested against explicit assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 2,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-under-40-losers-across-property-and-shares",
        verbatim:
          "Anyone aged under 40 wanting to buy an investment property; anyone aged under 40 wanting to buy shares or any other asset that might allow them to build real wealth",
        paraphrased:
          "Budget 2026 mainly makes under-40 Australians trying to build wealth through property or shares into the core losers of the package.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.83,
        reasoning:
          "The screenshot is pushing a much broader age-based conclusion than the current source set supports. The package does tighten housing and CGT settings in ways that can matter for younger investors, but the official distributional material on the current CGT discount does not show the concession as mainly protecting under-40 Australians. The strongest evidence instead points to benefits being concentrated among older and higher-income cohorts. So the post may express a political view about intergenerational effects, but the categorical 'under 40 = loser' framing is not established by the indexed primary sources here.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Some younger investors may face less generous after-tax wealth-building pathways under the redesigned regime, but the age-wide effect is not settled by the core distribution tables alone.",
          "The current CGT discount is not primarily a concession for under-40 Australians, even if some younger investors use it."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "PBO: Operation of the CGT discount",
            publisher: "Parliamentary Budget Office",
            section: "Distribution tables",
            page: 1,
            url: "https://www.pbo.gov.au/publications-and-data/publications/costings/operation-CGT-discount",
            supports: "contradicts",
            relevantPassage:
              "The PBO distribution tables show the current CGT discount is heavily concentrated among higher-income recipients rather than functioning mainly as a broad under-40 wealth-building concession."
          },
          {
            title: "Treasury TEIS chart data workbook",
            publisher: "Australian Treasury",
            section: "Age and income chart data",
            page: 1,
            url: "https://treasury.gov.au/sites/default/files/2025-12/p2025-721342-chart-data.xlsx",
            supports: "contradicts",
            relevantPassage:
              "Treasury's chart data is used on the site as the main age-split reference and does not support the idea that the concession is chiefly a subsidy for younger adults."
          }
        ]
      },
      {
        id: "claim-startup-workers-must-move-offshore",
        verbatim:
          "Anyone wanting to work for a startup (you'll need to move to New Zealand, or frankly anywhere else)",
        paraphrased:
          "The Budget's tax changes will make startup work in Australia unattractive enough that people will need to move offshore for viable startup opportunities.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "This is a forecast-heavy competitiveness claim, not a settled fact in the current source base. Some founder and employee-equity outcomes can look less attractive after the CGT redesign, and that creates a real competitiveness concern. But whether startup workers actually need to move to New Zealand or elsewhere depends on labour-market options, ESS design, migration frictions, venture conditions, and the offsetting startup-support measures that sit elsewhere in the same Budget package. The screenshot states the behavioural conclusion far more strongly than the primary texts warrant on their own.",
        assumptionsRequired: [
          "Assumes tax treatment is a dominant driver of where startup employees choose to work.",
          "Assumes Australian startups cannot redesign compensation or ownership structures to remain competitive.",
          "Assumes the Budget's venture-capital and productivity-side measures are too weak to offset any founder-side drag."
        ],
        alternativeFramings: [
          "The redesign may weaken Australia's appeal for some startup-equity cases, but the size of any talent outflow remains uncertain.",
          "Competitiveness concerns are real, but 'you'll need to move overseas' is a stronger claim than the cited policy text can settle."
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
              "The reform clearly changes after-tax outcomes for gains, which is the basis for startup-competitiveness concern."
          },
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Investment and innovation measures",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also presents itself as strengthening innovation and venture-capital settings, which means the net startup effect is not resolved by the CGT change alone."
          }
        ]
      },
      {
        id: "claim-business-owners-47-capital-tax-in-one-hit",
        verbatim:
          "Business owners who battle for years on a meagre wage and will then be paying 47% tax on capital in one hit",
        paraphrased:
          "Business owners will generally face a full 47 per cent tax on exit gains under the Budget 2026 redesign.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.88,
        reasoning:
          "This is the zero-cost-base founder argument in compressed form. In a fully post-2027, no-relief, top-marginal-rate case with little or no cost base, the effective burden can indeed converge toward the top personal rate. But the screenshot presents that scenario as if it were the universal business-owner outcome. It is not. Eligibility for Subdivision 152 and other small-business relief, ownership structure, timing, and cost-base facts all matter materially. So the claim identifies a real harsh-case scenario but overstates how automatic it is.",
        assumptionsRequired: [
          "Assumes an individual owner taxed at the top marginal rate.",
          "Assumes little or no cost base so indexation does minimal work.",
          "Assumes small-business CGT concessions or other relief do not apply."
        ],
        alternativeFramings: [
          "Some no-relief founder exits can face tax near the top marginal rate under the redesigned system.",
          "The harshest founder scenarios are real, but they are not every business-owner scenario."
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
              "The Government will replace the 50 per cent discount with indexation plus a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions",
            publisher: "Australian Taxation Office",
            section: "Eligibility overview",
            page: 1,
            url: "https://www.ato.gov.au/SBCGT",
            supports: "contradicts",
            relevantPassage:
              "ATO guidance shows eligible small business owners may reduce or disregard gains through specific CGT concessions, so the full-rate outcome is not automatic."
          }
        ]
      },
      {
        id: "claim-existing-boomers-keep-negative-gearing",
        verbatim:
          "Boomers who own existing investment properties and can keep negative gearing to their heart's content",
        paraphrased:
          "Existing residential property investors are largely grandfathered and keep their current negative-gearing treatment.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "This is the cleanest policy-mechanics point in the screenshot. The package limits negative gearing to new builds from 1 July 2027 and removes the wage-offset treatment for post-Budget buyers of established housing, but it does not wipe out the current benefit for existing holders. The post uses loaded language by framing this as a 'boomers' point, yet the underlying grandfathering claim is real.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Existing investors keep grandfathered treatment, while later buyers of established housing lose access.",
          "The reform narrows negative gearing rather than abolishing it universally."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing transition rules",
            page: 3,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "The package limits negative gearing to new builds from 1 July 2027 while preserving grandfathered treatment for existing investors and distinguishing later established-property purchases."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government states that later buyers of established housing lose access while the measure is targeted at new supply rather than universal abolition."
          }
        ]
      },
      {
        id: "claim-millionaire-super-only-15-percent-cgt",
        verbatim:
          "Millionaire superannuation holders who will continue to pay only 15% CGT",
        paraphrased:
          "High-balance superannuation investors will simply continue paying a flat 15 per cent CGT rate on gains.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.76,
        reasoning:
          "This is too compressed to be cleanly right as written. Super funds do sit in a concessional tax environment and capital gains are often taxed more lightly than personal gains, which is the intuition the screenshot is reaching for. But the exact outcome depends on whether the fund is in accumulation or pension phase, whether the gain qualifies for the one-third CGT discount, and how any higher-balance super tax settings interact with the broader picture. So the claim gestures at a real concessionary structure but oversimplifies the legal mechanics.",
        assumptionsRequired: [
          "Assumes the gain is realised in accumulation phase rather than a tax-exempt pension setting.",
          "Assumes the one-third discount applies in the way the poster implies.",
          "Assumes no separate high-balance super tax settings materially alter the effective burden."
        ],
        alternativeFramings: [
          "Super remains a more concessional environment for many gains than personal investing outside super.",
          "The effective tax on super gains depends on phase, fund structure and gain character, not just a single headline number."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: Tax on capital gains in a super fund",
            publisher: "Australian Taxation Office",
            section: "Capital gains in super",
            page: 1,
            url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/tax-on-superannuation",
            supports: "partially_supports",
            relevantPassage:
              "ATO guidance treats superannuation as a concessional tax environment, but the exact CGT outcome depends on fund circumstances and holding period."
          }
        ]
      },
      {
        id: "claim-foreign-investors-zero-percent-cgt",
        verbatim:
          "Foreign investors buying Australian assets who will continue to pay 0% CGT",
        paraphrased:
          "Foreign investors can generally keep buying Australian assets without paying CGT.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.86,
        reasoning:
          "This is too broad and materially misleading as stated. Foreign residents do not simply enjoy a universal 0 per cent CGT outcome on Australian assets. Their treatment depends on asset type, and taxable Australian property remains within the CGT net. Foreign residents are also not entitled to the same discount treatment as resident individuals in many cases. The screenshot compresses a more complex and asset-specific regime into a universal zero-rate slogan.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Foreign-resident CGT treatment is narrower and more asset-specific than the post suggests.",
          "Some foreign investors may still face less tax on some structures than Australian residents, but not via a universal 0 per cent CGT rule."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: Foreign resident capital gains withholding and taxable Australian property",
            publisher: "Australian Taxation Office",
            section: "Taxable Australian property",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents-and-capital-gains-tax",
            supports: "contradicts",
            relevantPassage:
              "ATO guidance makes clear that foreign residents are still taxable on taxable Australian property rather than enjoying a universal 0 per cent CGT outcome."
          },
          {
            title: "ATO: CGT discount for foreign residents",
            publisher: "Australian Taxation Office",
            section: "Discount rules",
            page: 1,
            url: "https://www.ato.gov.au/forms-and-instructions/capital-gains-tax-guide-2022/part-a-about-capital-gains-tax/discount-capital-gains",
            supports: "contradicts",
            relevantPassage:
              "ATO guidance does not support the idea that foreign investors generally continue paying 0 per cent CGT on Australian assets."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-ess-productive-capital-claim",
    title: "Post arguing property speculation should be tightened but ESS, startup equity and stock-market wealth-building should be treated differently",
    submittedAt: "2026-05-15T03:05:00Z",
    posterLabel: "Public text submission",
    posterNamedPublicly: false,
    rawText:
      "I wholeheartedly agree with tightening CGT concessions around property speculation. Homes are homes first, not investment vehicles. But I think working families building wealth on the stock market, startup equity, ESS and entrepreneurial risk are fundamentally different from passive property investment ... if I receive $100 in ESS, it's taxed as if it were $100 of real salary income ... If those shares later grow to $1,000, I'm then taxed again on the capital gain ... if the shares fall below the issued price, the asymmetry becomes obvious ... it becomes far less risky to simply take the $100 as salary instead of equity ... if employees stop seeing ESS as attractive, Australia loses something important ... Australian founders and high-growth companies will increasingly choose to build elsewhere where the tax treatment is more competitive",
    summary:
      "This post is strongest when it distinguishes between housing speculation and non-property risk capital. The Budget really does tighten housing-side tax concessions while still applying the broader CGT redesign to shares, startup equity and business gains. The ESS discussion also points to a real design tension: some ESS discounts are taxed as employment income, and later gains can still fall into the CGT system. But the post states that too generally, because ESS treatment varies across taxed-upfront, tax-deferred and start-up-concession schemes. The larger claims about workers abandoning equity, wealth shifting away from employees, and founders choosing to build offshore are directionally plausible but still forecast-heavy rather than settled facts in the current primary-source set.",
    calculatorLink: {
      label: "Model a non-property investor case",
      description:
        "Prefills a post-2027 non-housing scenario so the claim about productive assets, startup equity and employee upside can be pressure-tested against explicit assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-cgt-founder-claim", "budget-2026-cgt-founder-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 4,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-property-speculation-vs-productive-assets-split",
        verbatim:
          "working families building wealth on the stock market, startup equity, ESS and entrepreneurial risk are fundamentally different from passive property investment.",
        paraphrased:
          "The Budget's housing-side tax tightening is materially different in scope from its treatment of non-property assets like shares, ESS and startup equity.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "That core distinction is real in the policy design. The negative-gearing restriction is aimed at established residential property, while the CGT redesign itself is broader and still reaches non-property gains from 1 July 2027. So the post is right that the package is not simply a property-speculation reform and that productive-asset cases sit in a different policy lane.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Housing-side tax changes and the broader CGT redesign are separate parts of the package, even if they are politically bundled together."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms and CGT reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "Negative gearing changes are targeted at residential property, while the broader capital gains tax redesign applies from 1 July 2027 beyond housing alone."
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
      },
      {
        id: "claim-ess-taxed-like-salary-then-cgt",
        verbatim:
          "if I receive $100 in ESS, it's taxed as if it were $100 of real salary income ... If those shares later grow to $1,000, I'm then taxed again on the capital gain.",
        paraphrased:
          "ESS can be taxed as employment income on acquisition and then later taxed again under CGT if the shares rise in value.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.84,
        reasoning:
          "This is broadly possible, but too sweeping as stated. Under some taxed-upfront ESS arrangements, the discount is included in assessable income and later gains are taxed under the CGT rules. But ESS treatment varies materially across taxed-upfront, tax-deferred and start-up-concession schemes, and the later CGT calculation uses a reset cost base after the ESS taxing point. So the post is pointing at a real design issue, but not every ESS grant follows the same path or creates the same effective asymmetry.",
        assumptionsRequired: [
          "Assumes the ESS interest is in a taxed-upfront scheme rather than a tax-deferred or start-up-concession arrangement.",
          "Assumes the employee is actually taxed near the top marginal rate on the ESS discount.",
          "Assumes the later gain is still realised under the post-2027 CGT regime and is not neutralised by a concession or loss."
        ],
        alternativeFramings: [
          "Some ESS arrangements tax the discount as employment income first, then tax later price appreciation under the CGT rules.",
          "The severity of the ESS asymmetry depends on the scheme type and the taxing point, not just on the headline issue price."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "ATO: Employees – employee share schemes",
            publisher: "Australian Taxation Office",
            section: "Shares at a discounted price",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees",
            supports: "partially_supports",
            relevantPassage:
              "The discount on ESS interests can form part of assessable income, but the ATO also notes that tax treatment depends on the type of scheme and when the interests were acquired."
          },
          {
            title: "ATO: ESS and capital gains tax",
            publisher: "Australian Taxation Office",
            section: "CGT treatment after the taxing point",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees/ess-and-your-tax/ess-and-capital-gains-tax",
            supports: "partially_supports",
            relevantPassage:
              "In most cases, ESS interests are exempt from CGT implications until the discount has been taxed, and later gains or losses are then worked out under CGT with the cost base reset at the taxing point."
          },
          {
            title: "ATO: Calculating the discount",
            publisher: "Australian Taxation Office",
            section: "Start-up concession and tax-deferred schemes",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employers/calculating-the-discount",
            supports: "contradicts",
            relevantPassage:
              "The ATO sets out start-up concession and tax-deferred ESS pathways, showing that not all ESS interests are taxed upfront in the way the post implies."
          }
        ]
      },
      {
        id: "claim-ess-downside-asymmetry",
        verbatim:
          "if the shares fall below the issued price, the asymmetry becomes obvious. My tax obligation can end up being greater than the value I ultimately receive.",
        paraphrased:
          "Some ESS structures can leave an employee with a tax outcome that feels asymmetrically harsh if the shares later fall in value.",
        claimType: "logical",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "This concern is directionally plausible in some taxed-upfront ESS cases where the discount is taxed before later value declines. But whether the employee's net tax burden actually exceeds ultimate realised value depends on the exact ESS structure, timing, disposal outcome, cost base at the taxing point, and whether capital losses are available later. The post is highlighting a real perceived asymmetry, but the strongest version of the claim still depends on scenario detail.",
        assumptionsRequired: [
          "Assumes the ESS discount is taxed before the later share-price decline is known.",
          "Assumes the employee cannot fully offset the later loss in a way that makes the after-tax outcome less harsh.",
          "Assumes the relevant comparison is between tax paid and eventual sale value rather than total remuneration package value."
        ],
        alternativeFramings: [
          "Taxed-upfront ESS arrangements can create a harsh-feeling downside if later share performance disappoints.",
          "The asymmetry concern is real as a design critique, but the exact after-tax outcome depends on the ESS pathway and later loss treatment."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "ATO: ESS and capital gains tax",
            publisher: "Australian Taxation Office",
            section: "CGT treatment after the taxing point",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees/ess-and-your-tax/ess-and-capital-gains-tax",
            supports: "partially_supports",
            relevantPassage:
              "Later ESS gains and losses are handled under CGT after the taxing point, which is why upside and downside can be separated across different tax rules."
          },
          {
            title: "ATO: Does capital gains tax apply to you?",
            publisher: "Australian Taxation Office",
            section: "Capital losses",
            page: 1,
            url: "https://www.ato.gov.au/forms-and-instructions/capital-gains-tax-guide-2022/part-a-about-capital-gains-tax/does-capital-gains-tax-apply-to-you",
            supports: "contradicts",
            relevantPassage:
              "Capital losses can only be used against capital gains, which explains part of the asymmetry concern but also means the post's harshest outcome is still scenario-dependent."
          }
        ]
      },
      {
        id: "claim-workers-will-prefer-salary-over-equity",
        verbatim:
          "it becomes far less risky to simply take the $100 as salary instead of equity. But if employees stop seeing ESS as attractive, Australia loses something important",
        paraphrased:
          "The tax treatment will make ordinary workers less willing to take ESS and more likely to prefer salary over equity.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.78,
        reasoning:
          "This is a plausible behavioural response, but it is still a forecast rather than a settled fact. Whether employees prefer salary over equity depends on risk appetite, liquidity needs, employer quality, vesting restrictions, ESS design, and whether the scheme uses concessional or deferred treatment. The post identifies a real incentive concern, but the size of the response is not established by the primary-source set alone.",
        assumptionsRequired: [
          "Assumes enough employees understand and respond to the tax asymmetry when making compensation choices.",
          "Assumes employers cannot redesign ESS terms to preserve attractiveness.",
          "Assumes salary and ESS are realistic substitutes for the same worker cohort."
        ],
        alternativeFramings: [
          "Harsher-feeling ESS treatment may make equity less attractive for some employees at the margin.",
          "Whether workers actually switch from equity to salary depends on scheme design and labour-market context."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "ATO: Types of ESS",
            publisher: "Australian Taxation Office",
            section: "Different scheme types",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees/types-of-ess",
            supports: "partially_supports",
            relevantPassage:
              "The ATO distinguishes between different ESS types and concessional treatments, showing that employee incentives can vary materially by scheme design."
          }
        ]
      },
      {
        id: "claim-founders-build-elsewhere-more-competitive",
        verbatim:
          "Australian founders and high-growth companies will increasingly choose to build elsewhere where the tax treatment is more competitive",
        paraphrased:
          "The CGT redesign will increasingly push founders and high-growth companies to build offshore in more competitive tax jurisdictions.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "This is directionally plausible but still forecast-heavy. The reform can make some founder and employee-equity outcomes less attractive, and overseas regimes do offer different founder and ESS treatment in some cases. But whether that translates into a meaningful increase in offshore company formation depends on mobility, market access, migration frictions, venture conditions, and whether Australian policy later adds carve-outs or relief.",
        assumptionsRequired: [
          "Assumes tax treatment is a major driver of where high-growth companies choose to incorporate and scale.",
          "Assumes foreign comparison jurisdictions are meaningfully more attractive on a like-for-like founder or ESS basis.",
          "Assumes the Budget's venture-capital and startup-support measures do not offset enough of the drag."
        ],
        alternativeFramings: [
          "The redesign may weaken Australia's competitiveness for some founder and employee-equity cases, but the size of any offshoring response remains uncertain.",
          "Cross-border startup location choices depend on more than tax alone."
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
              "The Australian reform clearly changes founder- and investor-side after-tax outcomes, which is why competitiveness concerns arise."
          },
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also presents itself as strengthening startup and venture-capital support, so the net location effect is not resolved by the CGT change alone."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-head-read-capital-formation-claim",
    title: "Post calling the Budget destructive to capital formation, ambition, and aspiration",
    submittedAt: "2026-05-15T02:45:00Z",
    posterLabel: "Public text submission",
    posterNamedPublicly: false,
    rawText:
      "The Government needs to have its head read! This was recorded well before the 2026 Budget which will destroy efficient capital formation in Australia. It's destroying ambition and aspiration for all Australians particularly the young!",
    summary:
      "This submission is mostly political and evaluative, but it does contain one broader economic-effects claim. The statement that the Budget will destroy efficient capital formation in Australia is a strong forecast about how investors and builders will respond to the new tax settings, not a fact established directly by the primary-source set. The further lines about destroying ambition and aspiration, especially for the young, are even broader rhetorical judgements rather than cleanly testable propositions on the present record.",
    calculatorLink: {
      label: "Model a non-property investor case",
      description:
        "Prefills a post-2027 non-housing scenario so the capital-formation concern can be pressure-tested against explicit tax assumptions rather than headline rhetoric.",
      href: buildScenarioCalculatorHref("budget-2026-cgt-founder-claim", "budget-2026-cgt-founder-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 2
    },
    claims: [
      {
        id: "claim-budget-destroys-efficient-capital-formation",
        verbatim:
          "the 2026 Budget ... will destroy efficient capital formation in Australia.",
        paraphrased:
          "Budget 2026 will materially damage efficient capital formation in Australia.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "This is a strong macroeconomic forecast rather than a source-text fact. The Budget clearly changes the taxation of post-2027 gains and therefore the after-tax attractiveness of some founder, share, and business outcomes. But whether that rises to 'destroying efficient capital formation' depends on behavioural responses, substitution into other assets, the role of small-business concessions, and whether offsetting venture-capital and startup-support measures preserve some of the investment case.",
        assumptionsRequired: [
          "Assumes the CGT redesign is a major determinant of capital allocation decisions in the affected sectors.",
          "Assumes investors and founders do not substantially offset the change through concessions, structures, or other asset choices.",
          "Assumes the Budget's startup and venture-capital support measures do not materially cushion capital formation."
        ],
        alternativeFramings: [
          "The redesign may weaken some forms of productive capital formation, but the size of the effect is still uncertain.",
          "The policy changes after-tax incentives; whether that meaningfully impairs capital formation is a broader empirical question."
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
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also presents itself as supporting innovation and investment through venture-capital and startup measures, which is why the net capital-formation effect is not mechanically settled by the tax change alone."
          }
        ]
      },
      {
        id: "claim-budget-destroys-ambition-and-aspiration",
        verbatim:
          "It's destroying ambition and aspiration for all Australians",
        paraphrased:
          "Budget 2026 destroys ambition and aspiration for Australians.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.93,
        reasoning:
          "This is a broad moral and political judgement about what the package signals to society, not a discrete factual proposition that can be verified or falsified from the policy texts alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author believes the package sends a deeply anti-aspiration signal."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall tax reform package",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the package as fairness- and productivity-enhancing, which shows the author's 'destroying ambition' language is a competing political judgement rather than a settled fact."
          }
        ]
      },
      {
        id: "claim-budget-destroys-aspiration-for-young",
        verbatim:
          "particularly the young!",
        paraphrased:
          "The Budget especially destroys ambition and aspiration for younger Australians.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "This is an age-targeted extension of the same evaluative argument. The site already tracks several cleaner young-Australian and first-home-saver claims separately, but this phrasing itself is still political rhetoric rather than a testable factual proposition.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that younger Australians bear a disproportionate motivational and wealth-building hit from the package."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Tax reform and home ownership framing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package is partly framed as helping home ownership and intergenerational fairness, which is exactly the framing this younger-Australians critique rejects."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-charlie-gearside-housing-vs-productive-assets-claim",
    title: "Charlie Gearside post arguing housing reform is welcome but the wider CGT package still shifts the equation against productive risk-taking",
    submittedAt: "2026-05-15T02:11:00Z",
    posterLabel: "Charlie Gearside on LinkedIn",
    posterNamedPublicly: true,
    rawText:
      "this budget should be applauded for its bold changes to shake us out of housing complacency ... but without tweaks, it risks undermining the very foundations of the australian spirit ... it's kids saving for a home, putting their time and money into productive assets — shares, ETFs and employee share ownership plans — to grow the pie for all of us ... these changes don't affect me. they do shift the equation for the next decade of australians who try",
    summary:
      "This post is strongest when it distinguishes between the housing-side tax reform and the broader non-housing CGT redesign. The Budget does plainly tighten residential-property tax concessions while still applying the CGT change to shares, business assets, and employee equity. But the bigger claims that the package undermines the foundations of the Australian spirit, or shifts the next decade decisively against people who try, are evaluative and causal arguments rather than clean facts established by the source set alone.",
    calculatorLink: {
      label: "Model a non-property investor case",
      description:
        "Prefills a post-2027 non-housing scenario so the claim about productive assets like shares and business equity can be checked against explicit assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-cgt-founder-claim", "budget-2026-cgt-founder-claim")
    },
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-gearside-housing-reform-plus-productive-assets-split",
        verbatim:
          "this budget should be applauded for its bold changes to shake us out of housing complacency ... it's kids saving for a home, putting their time and money into productive assets — shares, ETFs and employee share ownership plans",
        paraphrased:
          "The Budget simultaneously targets housing-tax settings while leaving broader CGT consequences for productive assets like shares and employee equity in place.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "That core split is real. The housing-side package restricts negative gearing on established residential property and is framed as tackling housing distortions, while the CGT redesign itself still applies more broadly from 1 July 2027 to gains beyond housing. So the post is on solid ground when it says the reform is not just about property.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The package tightens housing-side concessions while also changing tax treatment for non-property gains such as shares and founder equity."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms and CGT reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "Negative gearing changes are targeted at residential property, while the broader capital gains tax redesign applies from 1 July 2027 beyond housing alone."
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
      },
      {
        id: "claim-gearside-next-decade-equation-shifts",
        verbatim:
          "these changes ... do shift the equation for the next decade of australians who try",
        paraphrased:
          "The Budget 2026 tax package materially shifts the next decade against Australians trying to build through productive risk-taking.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.81,
        reasoning:
          "That is a plausible strategic concern, but it is still an effects claim rather than a directly established fact. The source set shows a real change in after-tax outcomes for some non-housing gains, yet whether that materially changes the life chances or behaviour of the next decade of strivers depends on tax rate, asset type, concession access, housing conditions, labour-market conditions, and whether other Budget startup-support measures offset some of the drag.",
        assumptionsRequired: [
          "Assumes the CGT redesign materially changes saving, risk-taking, or business-building behaviour at the margin.",
          "Assumes the people most exposed are not mostly buffered by concessional structures, super, or small-business CGT relief.",
          "Assumes offsetting startup and venture-capital support measures do not neutralise much of the effect."
        ],
        alternativeFramings: [
          "The package may shift incentives against some forms of non-housing risk-taking, but the size of that effect is still uncertain.",
          "The policy clearly changes tax treatment; whether it changes the next decade's behaviour is a broader causal question."
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
              "The CGT reform changes post-1 July 2027 after-tax outcomes for eligible gains, which is the basis for the incentive concern raised in the post."
          },
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Incentivising investment and innovation",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also presents itself as supporting innovation and investment through venture-capital and startup measures, which is why the net effect remains contestable."
          }
        ]
      },
      {
        id: "claim-gearside-undermines-australian-spirit",
        verbatim:
          "without tweaks, it risks undermining the very foundations of the australian spirit.",
        paraphrased:
          "Without changes, the Budget undermines the foundations of the Australian spirit.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.93,
        reasoning:
          "This is a high-level moral and national-character judgement, not a discrete factual proposition the source base can verify. It expresses the author's view that the tax package sends the wrong signal about ambition, risk, and nation-building.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The post argues that the package sends an anti-aspiration cultural signal even if its housing-side goals are accepted."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall tax reform package",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the package as fairness- and productivity-enhancing, which shows the post's 'Australian spirit' line is an opposing political and cultural judgement rather than a settled fact."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-profit-indexation-founder-proposal",
    title: "Post proposing gain-side indexation instead of cost-base indexation for founder exits",
    submittedAt: "2026-05-15T00:12:00Z",
    posterLabel: "Public text submission",
    posterNamedPublicly: false,
    rawText:
      "There is such an easy solution to Labor's CGT problem that now overtaxes founders and small business owners relative to investors. Switch indexing to the profit rather than the cost. If a founder launches a company and sells 10 years later for $1m, their cost base for those shares is probably zero. Indexing means multiplying the price they paid by inflation to make it higher. That works for investors, but it still leaves the cost base at zero for founders because $0 x anything is still zero. However, if the $1m exit was reduced by an inflation indexing factor, that would result in a lower gain. Imagine the inflation was 25% over that period. Instead of the cost base rising by 25%, the gain goes down by 25%, to $750k. That's 25% less tax for the founder. Tax on $750k of gain instead of $1m. There are a few issues, mostly that it will collect less tax ... Overall, it's a clean mathematical solution that could be applied universally to all cost bases so no carve out is required. Startup founders might not go overseas, and cafe and retail founders might still take the risk ... it doesn't change the fact that this CGT change is unfair and punitive, and will slow the deployment of capital to productive enterprise.",
    summary:
      "This submission is strongest on one narrow arithmetic criticism of the Budget's CGT redesign: if a founder really has a zero cost base, cost-base indexation does not create any uplift. The worked hypothetical that a $1 million gain reduced by a 25 per cent inflation factor becomes $750,000 is also mathematically correct as an alternative design example. But the stronger claims that founders and small business owners are now categorically overtaxed relative to investors, that gain-side indexation is a clean universal fix needing no carve-out, or that the reform will slow productive capital deployment all require additional policy assumptions that the post does not resolve.",
    calculatorLink: {
      label: "Model the zero-cost-base founder case",
      description:
        "Prefills a post-2027 founder-style exit with little or no cost base so the submission's asymmetry critique can be checked against explicit concession and rate assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 2,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-profit-indexation-founders-overtaxed-relative-to-investors",
        verbatim:
          "Labor's CGT problem now overtaxes founders and small business owners relative to investors.",
        paraphrased:
          "The Budget 2026 CGT redesign now overtaxes founders and small business owners relative to investors as a class.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "The post identifies a real asymmetry for some low-cost-base founder cases, especially when compared with investors whose cost base can be meaningfully indexed. But the broader relative-tax claim is still too categorical as stated. It depends on what kind of investor is being used as the comparator, whether the investor is in a new build that keeps a special CGT choice, whether the founder or small business owner can use Subdivision 152 concessions, and what marginal tax rate and holding pattern are assumed.",
        assumptionsRequired: [
          "Assumes the founder or owner does not materially benefit from the small business CGT concessions.",
          "Assumes the comparator investor has a cost base and holding pattern that produces a materially better outcome under indexation.",
          "Assumes a like-for-like comparison across taxpayer type, marginal rate, and asset structure."
        ],
        alternativeFramings: [
          "Some zero-cost-base founder cases look harsher under cost-base indexation than investor cases with a meaningful indexed cost base.",
          "Whether founders are categorically overtaxed relative to investors depends on concessions, asset mix, and the comparator chosen."
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
        id: "claim-profit-indexation-zero-cost-base-stays-zero",
        verbatim:
          "$0 x anything is still zero.",
        paraphrased:
          "If the relevant founder share cost base is zero, cost-base indexation still leaves the indexed cost base at zero.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.97,
        reasoning:
          "That arithmetic point is correct. If the starting cost base is genuinely zero, multiplying it by an inflation factor does not create a positive indexed cost base. That is the narrow mathematical weakness the post is highlighting in a founder case with little or no acquisition cost.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The zero-cost-base problem is really a problem for founder cases where the first-element cost base is nil or very low."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "ATO: Cost base of assets",
            publisher: "Australian Taxation Office",
            section: "Work out the cost base for a capital gain",
            page: 1,
            url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/calculating-your-cgt/cost-base-of-asset",
            supports: "supports",
            relevantPassage:
              "The cost base of a capital gains tax asset is generally what it cost you to buy it, plus other costs you incur to hold and dispose of it."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "supports",
            relevantPassage:
              "The Government will replace the 50 per cent Capital Gains Tax discount with a discount based on inflation."
          }
        ]
      },
      {
        id: "claim-profit-indexation-25pc-example",
        verbatim:
          "Imagine the inflation was 25% over that period. Instead of the cost base rising by 25%, the gain goes down by 25%, to $750k.",
        paraphrased:
          "Under the post's proposed alternative design, a $1 million gain reduced by a 25 per cent inflation factor would become a $750,000 taxable gain.",
        claimType: "calculation",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.98,
        reasoning:
          "As a worked arithmetic example of the author's proposed alternative design, this is correct: reducing a $1 million nominal gain by 25 per cent produces a $750,000 gain. That also means the tax base in the example falls by 25 per cent relative to a $1 million taxable gain. The check here is only the arithmetic of the hypothetical, not whether the law uses that design.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The worked example is mathematically sound as an illustration of a gain-side indexation design."
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
              "The Budget chooses cost-base indexation and a minimum 30 per cent tax on gains, which is why the post is offering a different mathematical design."
          }
        ]
      },
      {
        id: "claim-profit-indexation-universal-clean-fix",
        verbatim:
          "It's a clean mathematical solution that could be applied universally to all cost bases so no carve out is required.",
        paraphrased:
          "Gain-side indexation is a clean universal CGT fix that could replace founder carve-outs.",
        claimType: "policy_design",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.85,
        reasoning:
          "This is a design judgement, not a settled fact. The proposal would address one narrow asymmetry in zero-cost-base founder cases, but it does not by itself resolve the rest of the policy architecture. Lawmakers would still need to decide how the 30 per cent minimum tax interacts with the proposal, how to treat losses and apportionment, how existing small business concessions should interact with it, and whether broad investor distributional goals are still being met. Calling it a universal no-carve-out solution therefore overstates how much work the arithmetic alone does.",
        assumptionsRequired: [
          "Assumes lawmakers would want to replace cost-base indexation with gain-side indexation across all asset classes.",
          "Assumes the proposal integrates cleanly with the 30 per cent minimum tax and other CGT concessions.",
          "Assumes solving the zero-cost-base founder asymmetry is the main policy problem that needs fixing."
        ],
        alternativeFramings: [
          "Gain-side indexation is one plausible way to reduce the zero-cost-base founder asymmetry without drafting a founder-only concession.",
          "Whether it is the cleanest universal solution is a policy-design question, not a mathematical certainty."
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
              "The reform combines inflation indexation with a minimum 30 per cent tax on gains from 1 July 2027."
          },
          {
            title: "ATO: Small business CGT concessions eligibility overview",
            publisher: "Australian Taxation Office",
            section: "How the concessions work",
            page: 1,
            url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/incentives-and-concessions/small-business-cgt-concessions/small-business-cgt-concessions-eligibility-conditions/cgt-concessions-eligibility-overview",
            supports: "contradicts",
            relevantPassage:
              "The small business CGT concessions already reduce, disregard or defer some gains, which shows the existing design still contains carve-out-style relief choices."
          }
        ]
      },
      {
        id: "claim-profit-indexation-slows-productive-capital",
        verbatim:
          "This CGT change is unfair and punitive, and will slow the deployment of capital to productive enterprise.",
        paraphrased:
          "The Budget 2026 CGT redesign will slow the deployment of capital to productive businesses.",
        claimType: "predictive",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.77,
        reasoning:
          "This is a plausible concern, but it remains a forward-looking behavioural claim rather than something established by the current primary-source set. The Budget clearly changes after-tax founder and investor incentives, yet the same package also claims to support innovation through venture-capital and startup measures. Whether productive capital deployment slows on net depends on behavioural responses, concession use, and how investors trade off the tax increase against those offsets.",
        assumptionsRequired: [
          "Assumes the CGT redesign outweighs the Budget's other startup and venture-capital support measures.",
          "Assumes capital allocators are materially sensitive to this specific after-tax change at the margin.",
          "Assumes founder and investor behaviour does not adjust through other structures or concessions."
        ],
        alternativeFramings: [
          "The redesign may weaken some founder and productive-capital incentives, but the net investment effect is still contested.",
          "The source base establishes a tax change, not a mechanically proven collapse in productive capital deployment."
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
              "The reform changes how post-1 July 2027 gains are taxed, which is why concerns about capital allocation arise in the first place."
          },
          {
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Startup and venture measures",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also presents itself as supporting innovation and investment through venture-capital and productivity measures."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-wyatt-roy-startup-cgt-claim",
    title: "Wyatt Roy post arguing the Budget would cut Australia's innovation economy off at the knees",
    submittedAt: "2026-05-14T12:37:00Z",
    posterLabel: "Wyatt Roy on LinkedIn",
    posterNamedPublicly: true,
    rawText:
      "I have tried very hard not to engage in public political debate since leaving politics. Labor's Budget made that untenable. If unchanged, it proposes to cut the Australian innovation economy off at the knees ... Labor's changes, ruled out before the election, would roughly double the effective tax on a capital gain to between 33 and 47 per cent. That would make Australia the worst place in the developed world to realise a capital gain. Higher than every G7 economy ... no one has explained how a sledgehammer on Australian entrepreneurs, investors and the thousands they employ helps a young Australian buy a home ... Capital and talent are more mobile today than a decade ago. Doubling the tax on the upside of a decade of risk does not keep founders, engineers and investors at home. It books their flights.",
    summary:
      "This post mixes one real policy-mechanics point with several much broader ranking and economic-effect claims. It is correct that Budget 2026 replaces the 50 per cent CGT discount with inflation indexation plus a minimum 30 per cent tax on gains from 1 July 2027, and that in some no-relief founder scenarios the effective tax burden can rise sharply relative to the old discounted-gain regime. But the stronger framing that the Budget would roughly double the effective tax to 33 to 47 per cent as a general proposition, make Australia the worst place in the developed world to realise a capital gain, or send founders and investors offshore still depends on narrow assumptions or evidence not supplied in the post. The claim that this therefore does not help home ownership is also a broader causal and policy-judgement argument rather than a settled fact.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a fully post-2027 founder exit at the top marginal rate so the post's 'doubling' and founder-flight claims can be pressure-tested against explicit concession assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-wyatt-roy-budget-roughly-doubles-effective-tax",
        verbatim:
          "Labor's changes ... would roughly double the effective tax on a capital gain to between 33 and 47 per cent.",
        paraphrased:
          "The Budget can roughly double the effective tax burden on some capital gains, taking it into a 33 to 47 per cent range.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.87,
        reasoning:
          "This is directionally plausible only in a narrower subset of cases than the post implies. The Budget does replace the 50 per cent CGT discount with inflation indexation plus a minimum 30 per cent tax on gains from 1 July 2027, which can push a no-relief top-rate founder case from something like the old discounted-gain benchmark toward much higher effective rates. But 'roughly double' and the 33 to 47 per cent band are not universal capital-gain outcomes: they depend on the owner's marginal rate, inflation path, cost base, when gains accrue, and whether small business CGT concessions or other relief apply.",
        assumptionsRequired: [
          "Assumes the taxpayer is an individual taxed at or near the top marginal rate.",
          "Assumes little shelter from cost-base uplift relative to the real gain.",
          "Assumes concession relief does not materially reduce, defer, or disregard the gain."
        ],
        alternativeFramings: [
          "In some no-relief founder or high-real-gain cases, the post-2027 regime can produce a much higher effective tax burden than the old 50 per cent discount system.",
          "Whether the burden 'roughly doubles' depends on explicit assumptions and is not a universal capital-gains result."
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
              "Top resident marginal tax settings determine the upper-bound personal-rate benchmark that some founder or investor exit calculations can approach once the 50 per cent discount is removed."
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
        id: "claim-wyatt-roy-australia-worst-developed-world-capital-gain",
        verbatim:
          "That would make Australia the worst place in the developed world to realise a capital gain. Higher than every G7 economy.",
        paraphrased:
          "The Budget would leave Australia with the highest capital-gains tax burden in the developed world, above every G7 economy.",
        claimType: "comparative",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.86,
        reasoning:
          "This is a sweeping cross-country ranking claim that the post does not substantiate. To establish it, the comparison would need a fixed country basket, a like-for-like taxpayer profile, consistent treatment of founder relief and exemptions, and a clearly specified gain scenario. The Budget materials only establish the Australian side of the equation. They do not prove that Australia is categorically the worst developed-country jurisdiction or above every G7 economy across comparable cases.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Some no-relief Australian founder-exit scenarios may compare badly with founder-relief regimes overseas, but a blanket 'worst in the developed world' claim is not established here.",
          "Cross-country CGT comparisons depend heavily on taxpayer profile, relief eligibility, holding period, and what counts as a comparable case."
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
              "The Australian reform sets the local tax-treatment change, but it does not establish a universal developed-world ranking."
          },
          {
            title: "IRS Publication 550",
            publisher: "Internal Revenue Service",
            section: "Qualified Small Business Stock and capital gains treatment",
            page: 1,
            url: "https://www.irs.gov/publications/p550",
            supports: "partially_supports",
            relevantPassage:
              "US founder-relief treatment exists in some cases, showing why jurisdictional comparisons can differ substantially by scenario rather than collapsing into one simple ranking."
          },
          {
            title: "GOV.UK: Business Asset Disposal Relief",
            publisher: "GOV.UK",
            section: "Rates and qualifying conditions",
            page: 1,
            url: "https://www.gov.uk/business-asset-disposal-relief",
            supports: "partially_supports",
            relevantPassage:
              "UK founder-style relief exists with conditions and caps, again showing that like-for-like cross-country ranking requires more than a single headline rate comparison."
          }
        ]
      },
      {
        id: "claim-wyatt-roy-home-ownership-sledgehammer",
        verbatim:
          "no one has explained how a sledgehammer on Australian entrepreneurs, investors and the thousands they employ helps a young Australian buy a home.",
        paraphrased:
          "Harsher tax treatment of founders and investors does not clearly help young Australians buy homes.",
        claimType: "causal",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.78,
        reasoning:
          "This is a broader causal and policy-judgement argument rather than a cleanly settled factual point. The Budget does frame the negative-gearing reform as a home-ownership measure, but the post asks whether wider non-property CGT tightening undermines that goal. That depends on broader assumptions about housing demand, investment substitution, capital allocation, entrepreneurship, and whether any housing-access gains outweigh the claimed non-property costs.",
        assumptionsRequired: [
          "Assumes the broader CGT redesign materially harms entrepreneurship and investment activity relevant to younger households.",
          "Assumes any home-ownership gains from the housing-side reform do not outweigh those broader costs."
        ],
        alternativeFramings: [
          "The package combines a home-ownership rationale with broader non-property CGT tightening, so whether it helps younger Australians overall is still contestable.",
          "Housing-market gains and entrepreneurship costs sit on different margins, which is why the net effect cannot be read straight off the policy text."
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
              "The measure is framed as focusing tax support on new supply and improving home ownership, but the policy text alone does not resolve the post's wider founder-and-investor counterargument."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Capital gains tax and negative gearing",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The package combines home-ownership reforms with broader CGT redesign, which is exactly why the net effect across housing and entrepreneurship remains assumption-sensitive."
          }
        ]
      },
      {
        id: "claim-wyatt-roy-capital-and-talent-offshore",
        verbatim:
          "Capital and talent are more mobile today than a decade ago. Doubling the tax on the upside of a decade of risk does not keep founders, engineers and investors at home. It books their flights.",
        paraphrased:
          "The CGT redesign will push founders, engineers, investors, capital and talent offshore.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "This is a strong behavioural forecast rather than a fact established by the primary-source set. The intuition is plausible: if after-tax founder and investor outcomes worsen, mobility may matter more. But whether that actually leads to material relocation, lower investment, or founder flight depends on many additional variables, including company-stage realities, domestic market opportunities, policy offsets, global conditions, and how often concession relief changes the real outcome.",
        assumptionsRequired: [
          "Assumes founders, engineers and investors are highly responsive to this specific tax change at the margin.",
          "Assumes offsetting domestic advantages or startup-support measures are not enough to retain them."
        ],
        alternativeFramings: [
          "The redesign may weaken Australia's competitiveness for some mobile founder and investor cases, but the size of any relocation effect is uncertain.",
          "A stronger case would be that harsher exit taxation could add friction to an already mobile startup ecosystem, not that flight is automatic."
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
              "The reform clearly changes after-tax incentives, but the official materials do not themselves show that founders or investors will leave the country as a result."
          },
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Boosting resilience and dynamism",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "contradicts",
            relevantPassage:
              "The Government simultaneously says it is supporting risk taking, resilience and start-ups through measures like loss carry back, loss refundability and stronger R&D support."
          }
        ]
      },
      {
        id: "claim-wyatt-roy-cut-innovation-economy-off-at-the-knees",
        verbatim:
          "If unchanged, it proposes to cut the Australian innovation economy off at the knees.",
        paraphrased:
          "The Budget would cripple Australia's innovation economy.",
        claimType: "interpretive",
        subjectDomain: "startups",
        verdict: "rhetorical",
        confidence: 0.94,
        reasoning:
          "This is a high-intensity rhetorical summary of the post's broader argument, not a discrete factual claim that can be verified directly against the primary-source set.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author believes the package would materially damage Australia's startup and innovation ecosystem."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget 2026-27 Tax reform page",
            publisher: "Australian Government",
            section: "Overall tax reform package",
            page: 1,
            url: "https://budget.gov.au/content/04-tax-reform.htm",
            supports: "partially_supports",
            relevantPassage:
              "The Government presents the package as encouraging productive investment and supporting businesses, which is the framing this post rejects in emphatic rhetorical terms."
          }
        ]
      }
    ]
  },
  {
    id: "budget-2026-fairer-tax-without-penalising-aspiration-claim",
    title: "Founder-lawyer post arguing property tax concessions were too strong but startup CGT should still be treated differently",
    submittedAt: "2026-05-13T23:47:00Z",
    posterLabel: "Public founder post",
    posterNamedPublicly: false,
    rawText:
      "Through negative gearing, property was way too overpowered relative to other asset classes and other countries ... removing CGT discounts on startups have a detrimental impact on our fledgling ecosystem ... taxing startup exits at double other countries' rates will only compound this issue ... We can have a fairer tax system without penalising aspiration.",
    summary:
      "This post is strongest when it distinguishes between housing-tax reform and startup-exit treatment. The package does clearly target negative gearing on established residential property while also applying the CGT redesign to startups and other non-property assets, so the author's basic 'property reform plus startup concern' split is real. But the stronger claims about property having been decisively overpowered, startup exits being taxed at double other countries' rates, and the ecosystem consequences that follow remain assumption-sensitive or overstated. The closing line about fairness without penalising aspiration is a normative position rather than a discrete factual claim.",
    overallVerdictMix: {
      supported: 1,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 2,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-housing-reform-plus-startup-cgt-split",
        verbatim:
          "Through negative gearing, property was way too overpowered ... However ... removing CGT discounts on startups have a detrimental impact on our fledgling ecosystem.",
        paraphrased:
          "The Budget simultaneously tightens residential-property tax concessions and applies the CGT redesign to startups and other non-property assets.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.91,
        reasoning:
          "That core split is visible in the official Budget materials. The housing-side negative-gearing restrictions are aimed at established residential property, while the CGT redesign reaches broader asset classes rather than carving startups out by default.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The package is not property-only: it also changes CGT treatment for startup and share gains."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Budget 2026–27 Tax Explainer: Negative Gearing and Capital Gains Tax Reform",
            publisher: "Australian Government",
            section: "Negative gearing reforms and CGT reforms",
            page: 4,
            url: "https://budget.gov.au/content/factsheets/download/tax-explainers-negative-gearing-capital-gains-tax.pdf",
            supports: "supports",
            relevantPassage:
              "Negative gearing changes are targeted at residential property, while other asset classes such as shares remain under existing arrangements on that front even as the broader CGT redesign applies from 1 July 2027."
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
      },
      {
        id: "claim-property-overpowered-reduced-capital-flows",
        verbatim:
          "Through negative gearing, property was way too overpowered relative to other asset classes and other countries, leading to extreme property prices and reduced capital flows to businesses.",
        paraphrased:
          "Australia's prior property-tax settings made housing too attractive relative to productive assets, contributing to high prices and weaker business capital allocation.",
        claimType: "causal",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.78,
        reasoning:
          "This is a plausible political-economy argument, but it goes well beyond what the primary Budget sources settle directly. Measuring how much negative gearing and related settings diverted capital away from businesses, and how much that explains extreme property prices, requires empirical attribution and comparison choices not supplied in the post.",
        assumptionsRequired: [
          "Assumes housing tax settings were a major driver of capital allocation away from businesses rather than one factor among many.",
          "Assumes the relevant international comparison set is fair and like-for-like."
        ],
        alternativeFramings: [
          "Property tax settings likely strengthened housing's relative appeal, but the size of the capital-allocation effect is contested."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Budget Paper 2 2026-27",
            publisher: "Australian Government",
            section: "Boosting Home Ownership",
            page: 22,
            url: "https://budget.gov.au/content/bp2/download/bp2-2026-27.pdf",
            supports: "partially_supports",
            relevantPassage:
              "The Government frames the housing-tax changes as reducing distortions in the property market, but that does not by itself quantify the wider capital-allocation effect claimed in the post."
          }
        ]
      },
      {
        id: "claim-startup-exits-taxed-double-other-countries",
        verbatim:
          "taxing startup exits at double other countries' rates will only compound this issue.",
        paraphrased:
          "The new Australian startup-exit tax burden is double that of other countries.",
        claimType: "comparative",
        subjectDomain: "startups",
        verdict: "unsupported",
        confidence: 0.84,
        reasoning:
          "This is a sweeping cross-country ranking claim without a fixed comparison basket or like-for-like founder-relief methodology. The site already treats similar 'double other countries' / 'most punitive developed-country regime' claims as overstated for the same reason.",
        assumptionsRequired: [],
        alternativeFramings: [
          "Some no-relief Australian founder-exit scenarios compare badly with founder-relief regimes overseas, but a blanket 'double other countries' claim is not established."
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
              "The Australian reform sets the local side of the comparison, but it does not establish a universal doubled-rate relationship against other countries."
          },
          {
            title: "IRS Publication 550",
            publisher: "Internal Revenue Service",
            section: "Qualified Small Business Stock",
            page: 1,
            url: "https://www.irs.gov/publications/p550",
            supports: "partially_supports",
            relevantPassage:
              "US founder-relief treatment exists in some cases, but that does not support a simple blanket doubled-rate comparison across jurisdictions."
          },
          {
            title: "GOV.UK: Business Asset Disposal Relief",
            publisher: "GOV.UK",
            section: "Rates and qualifying conditions",
            page: 1,
            url: "https://www.gov.uk/entrepreneurs-relief",
            supports: "partially_supports",
            relevantPassage:
              "UK founder-style relief exists with conditions and caps, which again does not prove a uniform doubled-rate comparison."
          }
        ]
      },
      {
        id: "claim-startup-cgt-detrimental-ecosystem",
        verbatim:
          "removing CGT discounts on startups have a detrimental impact on our fledgling ecosystem.",
        paraphrased:
          "Applying the CGT redesign to startups harms the Australian startup ecosystem.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "That may be true in some founder and employee-equity scenarios, but it remains a broader ecosystem-effect forecast rather than a fact directly proved by the primary source set. The scale depends on how founders, employees, investors, and policymakers respond, including whether later carve-outs emerge.",
        assumptionsRequired: [
          "Assumes startup behaviour is materially sensitive to the post-2027 equity-exit tax setting.",
          "Assumes offsetting VC and startup-support measures are not enough to neutralise the harm claimed."
        ],
        alternativeFramings: [
          "The redesign may add friction to startup incentives, but the aggregate ecosystem effect is still uncertain."
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
              "The package tightens some founder-exit tax settings while also expanding venture capital and startup-support measures, leaving the net ecosystem effect contestable."
          }
        ]
      },
      {
        id: "claim-fairer-tax-without-penalising-aspiration",
        verbatim:
          "We can have a fairer tax system without penalising aspiration.",
        paraphrased:
          "Australia should pursue tax fairness without penalising aspiration.",
        claimType: "normative",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.93,
        reasoning:
          "This is a political value judgement about what the tax system should aim for, not a discrete factual claim the source set can verify or falsify on its own.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The author supports reform, but wants startup treatment carved out from the broader package."
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
              "The Budget frames the package in fairness and productivity terms, but whether it penalises aspiration is a normative debate rather than a resolved source-text fact."
          }
        ]
      }
    ]
  },
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
  },
  {
    id: "budget-2026-fintech-australia-uncertainty-claim",
    title: "LinkedIn post arguing consultation uncertainty is already hurting startup hiring, capital and competitiveness",
    submittedAt: "2026-05-14T03:07:00Z",
    posterLabel: "Rehan Mark D'Almeida on LinkedIn",
    posterNamedPublicly: true,
    rawText:
      "Yes, the proposed CGT changes will go through consultation ... The real impact is on jobs, the broader economy, innovation, and Australia's ability to compete for capital and talent against more founder-friendly markets. ... investors are getting jittery ... capital pauses ... Founders' hiring plans get deferred ... Policy uncertainty always has a cost that is being paid by the very startups committed to this market.",
    summary:
      "This post is less about the arithmetic of founder exits and more about the cost of uncertainty. The official Budget materials still do not establish a specific startup-equity consultation commitment in the form described here. The broader claims about jittery investors, paused capital, deferred hiring and reduced national competitiveness may all be directionally plausible, but they rely on private market reactions and causal chains that are not resolved by the current primary-source set alone. What the source base does establish is the CGT redesign itself and the fact that it sits alongside other startup-support measures, which is why the aggregate jobs-and-innovation effect remains contested rather than mechanically proven.",
    calculatorLink: {
      label: "Model the no-relief founder exit",
      description:
        "Prefills a post-2027 founder-equity scenario so the broader competitiveness and startup-impact claims can be tested against explicit tax assumptions.",
      href: buildScenarioCalculatorHref("budget-2026-zero-cost-base-business-claim", "budget-2026-zero-cost-base-business-claim")
    },
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 1,
      unverifiable: 0,
      requires_assumptions: 3,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-cgt-changes-will-go-through-consultation",
        verbatim:
          "Yes, the proposed CGT changes will go through consultation",
        paraphrased:
          "The official Budget response includes a clear consultation commitment on the proposed CGT changes as they affect startups and founders.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "unsupported",
        confidence: 0.86,
        reasoning:
          "As with several other founder-sector posts already on the site, the reviewed official Budget materials establish the CGT redesign and a broader startup-support package, but they do not themselves identify the specific consultation commitment described here. The statement may reflect media reporting or stakeholder conversations outside the Budget papers, but it is not established on the current primary-source basis used by the dashboard.",
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
      },
      {
        id: "claim-real-impact-on-jobs-innovation-and-competitiveness",
        verbatim:
          "The real impact is on jobs, the broader economy, innovation, and Australia's ability to compete for capital and talent against more founder-friendly markets.",
        paraphrased:
          "The CGT redesign will materially harm jobs, innovation, the broader economy, and Australia's competitiveness for founder talent and capital.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "This is a multi-step macro claim. The source base clearly establishes the policy change itself, but not the size or direction of the downstream economy-wide effect. The same Budget package also contains venture capital and startup-support measures, which means the aggregate jobs-and-competitiveness outcome cannot be read straight off the CGT headline alone.",
        assumptionsRequired: [
          "Assumes founder-exit tax settings dominate over the package's offsetting startup and venture-capital supports.",
          "Assumes startups and investors respond strongly enough for labour-market and innovation effects to show up materially at the economy-wide level."
        ],
        alternativeFramings: [
          "The redesign may add friction for some founder and investor scenarios, but the broader jobs and competitiveness effect remains uncertain."
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
            title: "Budget 2026-27 Productivity page",
            publisher: "Australian Government",
            section: "Innovation and startup measures",
            page: 1,
            url: "https://budget.gov.au/content/03-productivity.htm",
            supports: "contradicts",
            relevantPassage:
              "The Budget also expands venture capital settings, improves the R&D tax incentive, and introduces additional startup-support measures, which is why the net competitiveness effect is contestable."
          }
        ]
      },
      {
        id: "claim-investors-jittery-capital-pauses-hiring-deferred",
        verbatim:
          "I'm hearing it directly from members that investors are getting jittery. When the projected returns on Australian earlystage bets starts to wobble, capital pauses. Founders' hiring plans get deferred. New jobs that could've been unlocked are now on hold. Applicants and employees are also rethinking their career pathways.",
        paraphrased:
          "The reform debate is already making investors more cautious, pausing startup capital, and pushing founders and workers to defer hiring and career decisions.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.79,
        reasoning:
          "This is partly based on private member conversations and short-run market sentiment rather than on public primary-source evidence. The behaviour described may be real in some firms or networks, but the dashboard's source base cannot independently verify its scale or whether the observed hesitation is caused mainly by this policy rather than by wider funding-market conditions.",
        assumptionsRequired: [
          "Assumes the anecdotal investor and hiring reactions described are representative rather than isolated.",
          "Assumes current funding-market hesitation is caused mainly by the Budget 2026 CGT debate rather than by broader startup-market conditions."
        ],
        alternativeFramings: [
          "Policy uncertainty may be adding caution in some startup networks, but the scale and attribution are not independently established here."
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
              "The policy change creates the conditions for changed investor arithmetic, but the page does not establish the claimed real-time behavioural response."
          }
        ]
      },
      {
        id: "claim-policy-uncertainty-has-a-cost-paid-by-startups",
        verbatim:
          "Policy uncertainty always has a cost that is being paid by the very startups committed to this market.",
        paraphrased:
          "The current uncertainty around the CGT redesign is already imposing real costs on startups that remain committed to Australia.",
        claimType: "causal",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "At a high level, uncertainty can impose planning and financing costs. But the size, distribution and timing of those costs are not directly quantified or established by the current primary-source set. The claim is therefore directionally plausible but still assumption-sensitive.",
        assumptionsRequired: [
          "Assumes startups materially change hiring, fundraising, or incorporation decisions in response to the current policy uncertainty.",
          "Assumes those uncertainty costs are not offset by other supports or by later policy clarification."
        ],
        alternativeFramings: [
          "The uncertainty may already be imposing planning costs on some startups, but the magnitude is not independently established here."
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
              "The page confirms a significant post-2027 redesign, which is the policy uncertainty being discussed, but it does not quantify startup planning costs."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-tax-changes-coming-claim",
    title: "The Conversation pre-budget piece saying CGT, negative gearing and trust changes were coming",
    submittedAt: "2026-05-15T11:33:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/in-this-years-budget-chalmers-has-to-keep-a-lid-on-spending-or-risk-stoking-inflation-281875",
    rawText:
      "Tax will be the centrepiece of the budget. The government has signalled it intends to reduce the capital gains tax discount, negative gearing and tax concessions for trusts.",
    summary:
      "This visible article card is mainly a pre-budget expectation piece. The claim it makes on-page is that the government had clearly signalled a package covering CGT, negative gearing and trusts, which is consistent with the published article text.",
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
        id: "claim-budget-2026-conversation-tax-changes-coming-claim",
        verbatim: "The government has signalled it intends to reduce the capital gains tax discount, negative gearing and tax concessions for trusts.",
        paraphrased: "Before budget night, the government had publicly signalled a package spanning CGT, negative gearing and trust concessions.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "Within the source article itself, this is a straightforward description of what was being publicly flagged ahead of the budget. The card is not making a tricky quantitative claim here.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/in-this-years-budget-chalmers-has-to-keep-a-lid-on-spending-or-risk-stoking-inflation-281875",
            supports: "supports",
            relevantPassage:
              "The article says tax will be the budget centrepiece and that the government had signalled changes to the CGT discount, negative gearing and trust concessions."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-smartcompany-sme-concessions-claim",
    title: "SmartCompany article arguing SME CGT concession thresholds were not indexed with the reform",
    submittedAt: "2026-05-15T11:34:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.smartcompany.com.au/tax/hypocrisy-lift-sme-concessions-match-cgt-reform/",
    rawText:
      "Budget documents state four pre-existing concessions will continue unchanged through the transition, while the small business thresholds and the $500,000 retirement exemption have not been indexed for many years.",
    summary:
      "The visible article card is built around a concrete threshold-design claim. On the text available, the clean factual point is that the budget leaves the existing small-business CGT concession settings unchanged rather than indexing them alongside the broader CGT redesign.",
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
        id: "claim-budget-2026-smartcompany-sme-concessions-claim",
        verbatim: "Budget documents state four pre-existing concessions ... will continue unchanged through the transition.",
        paraphrased: "The budget leaves the existing small-business CGT concession framework unchanged through the transition.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The article text explicitly says the concessions continue unchanged, and that is the narrow factual point being checked here.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.smartcompany.com.au/tax/hypocrisy-lift-sme-concessions-match-cgt-reform/",
            supports: "supports",
            relevantPassage:
              "The article says budget documents state four pre-existing concessions continue unchanged through the transition."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-startupdaily-coalition-repeal-claim",
    title: "Startup Daily article saying the Coalition would repeal Labor’s CGT and negative gearing overhaul",
    submittedAt: "2026-05-15T11:35:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.startupdaily.net/topic/politics-news-analysis/coalition-repeal-labor-cgt-negative-gearing-overhaul/",
    rawText:
      "The Coalition says it will repeal Labor’s proposed CGT reforms and negative gearing changes if elected.",
    summary:
      "This article card contains a simple political-position claim. The visible text says the Coalition publicly committed to oppose and repeal the reforms if it returned to government.",
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
        id: "claim-budget-2026-startupdaily-coalition-repeal-claim",
        verbatim: "We’re going to oppose them. We will repeal them.",
        paraphrased: "The Coalition publicly said it would repeal the proposed CGT and negative gearing reforms.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "The article quotes an unambiguous public statement from the Shadow Treasurer.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.startupdaily.net/topic/politics-news-analysis/coalition-repeal-labor-cgt-negative-gearing-overhaul/",
            supports: "supports",
            relevantPassage:
              "The article quotes Tim Wilson saying the Coalition will oppose the reforms and repeal them."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-housing-fairer-claim",
    title: "The Conversation article saying existing negatively geared investments are fully grandfathered",
    submittedAt: "2026-05-15T11:36:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/will-this-budget-really-make-housing-fairer-for-more-australians-its-a-good-start-282367",
    rawText:
      "While existing negatively geared investments are fully grandfathered, the reforms to the capital gains discount are likely to reduce the incentive to hold onto these loss-making properties regardless.",
    summary:
      "The article’s clean mechanical point is about transition design. It says existing negatively geared investments are grandfathered even though the broader package changes future incentives.",
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
        id: "claim-budget-2026-conversation-housing-fairer-claim",
        verbatim: "While existing negatively geared investments are fully grandfathered ...",
        paraphrased: "Existing negatively geared investments keep grandfathered treatment under the package.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.9,
        reasoning:
          "This is a direct transition-rule claim presented explicitly in the source text.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/will-this-budget-really-make-housing-fairer-for-more-australians-its-a-good-start-282367",
            supports: "supports",
            relevantPassage:
              "The article says existing negatively geared investments are fully grandfathered."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-extreme-uncertainty-claim",
    title: "The Conversation roundup describing the budget as combining CGT and negative gearing reform with a delayed start",
    submittedAt: "2026-05-15T11:37:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/a-budget-with-a-bundle-of-reforms-in-a-time-of-extreme-uncertainty-282255",
    rawText:
      "The government will abolish the capital gains tax discount, replace it with an inflation adjustment and a 30% minimum tax, and limit negative gearing for residential property to new builds from July 1 2027.",
    summary:
      "This visible article card restates the headline architecture of the package. The page text clearly describes both the CGT redesign and the negative-gearing limit as delayed reforms beginning on 1 July 2027.",
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
        id: "claim-budget-2026-conversation-extreme-uncertainty-claim",
        verbatim: "The discount will be abolished, replaced by an inflation adjustment ... The government will also limit negative gearing for residential property to new builds.",
        paraphrased: "The article says the budget replaces the CGT discount and limits residential negative gearing to new builds from 1 July 2027.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "This is a clean summary claim explicitly spelled out in the source text.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/a-budget-with-a-bundle-of-reforms-in-a-time-of-extreme-uncertainty-282255",
            supports: "supports",
            relevantPassage:
              "The article says the discount will be abolished and negative gearing for residential property will be limited to new builds from July 1 2027."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-startupdaily-rethink-startup-cgt-claim",
    title: "Startup Daily article saying Labor was weighing startup-specific CGT calculation changes",
    submittedAt: "2026-05-15T11:38:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.startupdaily.net/topic/politics-news-analysis/government-signals-rethink-on-startup-cgt-rules-amid-backlash/",
    rawText:
      "Labor appears to be weighing up whether adjustments to the way CGT is calculated for startups could soften some of the impact without introducing a full exemption.",
    summary:
      "This article card is about a reported rethink rather than settled enacted policy. The visible text supports that the government was considering startup-specific calculation changes, but not that any final carve-out had been agreed.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-startupdaily-rethink-startup-cgt-claim",
        verbatim: "Labor now appears to be further weighing up whether adjustments to the way CGT is calculated for startups could soften some of the impact without introducing a full exemption.",
        paraphrased: "The government was considering startup-specific changes to how the new CGT rules would calculate gains.",
        claimType: "descriptive",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.82,
        reasoning:
          "The article presents this as an active policy consideration and quotes concern about low or zero cost bases, but it is still a report about ongoing consideration rather than a final rule.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.startupdaily.net/topic/politics-news-analysis/government-signals-rethink-on-startup-cgt-rules-amid-backlash/",
            supports: "partially_supports",
            relevantPassage:
              "The article says Labor appears to be weighing adjustments to startup CGT calculations and quotes Daniel Mulino on low or zero cost bases."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-smartcompany-trust-restructure-claim",
    title: "SmartCompany opinion piece saying stamp duty can make trust restructuring commercially prohibitive",
    submittedAt: "2026-05-15T11:39:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.smartcompany.com.au/opinion/trust-tax-overhaul-trap-businesses-wmillion-dollar-restructuring-bills/",
    rawText:
      "For many legitimate businesses holding commercial or development property, stamp duty means restructuring out of trust structures may not be a commercial option.",
    summary:
      "The visible article card makes a practical-constraints claim about the trust package. It is plausible and well argued in the source text, but the extent of the problem depends on business type, state duties, and the availability of workable restructuring paths.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-smartcompany-trust-restructure-claim",
        verbatim: "In states such as Victoria and New South Wales, transferring commercial or development property can give rise to stamp duty liabilities in the millions of dollars.",
        paraphrased: "For some trust-held property groups, restructuring could be blocked by very large stamp-duty costs.",
        claimType: "causal",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "The article offers a credible commercial-mechanics argument, but it is sector- and state-specific rather than a universal consequence established for all affected trusts.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.smartcompany.com.au/opinion/trust-tax-overhaul-trap-businesses-wmillion-dollar-restructuring-bills/",
            supports: "partially_supports",
            relevantPassage:
              "The article argues that stamp duty on transfers of commercial or development property can make restructuring commercially unrealistic for some groups."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-smartcompany-startup-tweaks-claim",
    title: "SmartCompany article saying Labor was considering startup CGT tweaks after backlash",
    submittedAt: "2026-05-15T11:40:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.smartcompany.com.au/federal-budget-2026/labor-startup-cgt-tweaks-founder-backlash/",
    rawText:
      "The Albanese government is considering changes to how startup founders and investors are treated under the proposed CGT overhaul.",
    summary:
      "This visible article card points to an active policy reconsideration driven by founder backlash. The article text supports that startup-specific tweaks were under consideration, but not that a final carve-out was locked in.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-smartcompany-startup-tweaks-claim",
        verbatim: "The Albanese government is considering changes to how startup founders and investors are treated under its proposed capital gains tax overhaul.",
        paraphrased: "The government was considering startup-specific treatment changes within the proposed CGT overhaul.",
        claimType: "descriptive",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.83,
        reasoning:
          "The source supports an active policy discussion, but the content is still about consideration and consultation rather than enacted settled treatment.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.smartcompany.com.au/federal-budget-2026/labor-startup-cgt-tweaks-founder-backlash/",
            supports: "partially_supports",
            relevantPassage:
              "The article says the government is considering changes to how startup founders and investors are treated under the proposed overhaul."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-afr-tech-crowd-expects-win-claim",
    title: "AFR article saying tech leaders expected favourable amendments after backlash",
    submittedAt: "2026-05-15T11:41:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.afr.com/technology/tech-crowd-expects-cgt-win-as-some-cringe-at-billionaire-complaints-20260515-p5zxc2?ref=rss&utm_medium=rss&utm_source=rss_feed",
    rawText:
      "Days of private meetings and public venting left tech sector leaders confident of favourable amendments after anger over the budget’s capital gains tax changes.",
    summary:
      "This article card is about industry sentiment and expected negotiation outcomes. It demonstrates that prominent tech figures believed amendments were possible, but confidence about future amendments is not the same thing as a confirmed policy result.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-afr-tech-crowd-expects-win-claim",
        verbatim: "Days of private meetings and public venting has left the tech sector’s leaders confident of favourable amendments ...",
        paraphrased: "Tech leaders believed backlash and lobbying would likely produce favourable amendments.",
        claimType: "predictive",
        subjectDomain: "startups",
        verdict: "requires_assumptions",
        confidence: 0.78,
        reasoning:
          "The source can support the existence of that confidence, but not whether the amendments would in fact arrive or be favourable in substance.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.afr.com/technology/tech-crowd-expects-cgt-win-as-some-cringe-at-billionaire-complaints-20260515-p5zxc2?ref=rss&utm_medium=rss&utm_source=rss_feed",
            supports: "partially_supports",
            relevantPassage:
              "The article says the sector’s leaders were confident of favourable amendments after meetings and public backlash."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-capitalbrief-founders-scramble-claim",
    title: "Capital Brief article saying startup groups were mobilising for CGT carveout talks",
    submittedAt: "2026-05-15T11:42:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.capitalbrief.com/article/startup-founders-scramble-for-a-seat-at-chalmers-table-for-talks-over-cgt-carveout-91b09dcd-b31d-4c7f-9788-a1d7c35fad0d/",
    rawText:
      "Treasurer Jim Chalmers said the government would consult on the impact of the CGT reforms, and multiple groups were mobilising to ensure startup voices were heard.",
    summary:
      "The visible article card is strongest as an organising-and-consultation story. It supports that founder and investor groups were mobilising in anticipation of talks over startup treatment.",
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
        id: "claim-budget-2026-capitalbrief-founders-scramble-claim",
        verbatim: "Multiple groups are now mobilising to ensure the little guy’s voice is heard.",
        paraphrased: "Startup groups were mobilising to influence the expected consultation over startup CGT treatment.",
        claimType: "descriptive",
        subjectDomain: "startups",
        verdict: "supported",
        confidence: 0.86,
        reasoning:
          "The article directly describes those groups mobilising and frames the issue as a live consultation fight.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.capitalbrief.com/article/startup-founders-scramble-for-a-seat-at-chalmers-table-for-talks-over-cgt-carveout-91b09dcd-b31d-4c7f-9788-a1d7c35fad0d/",
            supports: "supports",
            relevantPassage:
              "The article says multiple groups were mobilising so smaller startup voices would be heard in the CGT debate."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-at-a-glance-claim",
    title: "The Conversation summary card saying Budget 2026 takes big swings on CGT and negative gearing",
    submittedAt: "2026-05-15T11:43:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/at-a-glance-budget-2026-281024",
    rawText:
      "The federal budget takes some big swings, with reforms to capital gains tax and negative gearing.",
    summary:
      "This visible article card is a short summary card rather than a detailed argument. Its core factual point is simply that Budget 2026 includes headline reforms to CGT and negative gearing.",
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
        id: "claim-budget-2026-conversation-at-a-glance-claim",
        verbatim: "The federal budget takes some big swings, with reforms to capital gains tax and negative gearing.",
        paraphrased: "Budget 2026 includes major reforms to CGT and negative gearing.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.96,
        reasoning:
          "This is a direct summary statement from the source card itself.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/at-a-glance-budget-2026-281024",
            supports: "supports",
            relevantPassage:
              "The card says the budget takes big swings with reforms to capital gains tax and negative gearing."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-capitalbrief-vc-response-claim",
    title: "Capital Brief opinion piece saying the loudest anti-CGT response missed wider startup needs",
    submittedAt: "2026-05-15T11:44:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.capitalbrief.com/article/i-spent-five-years-in-vc-the-hysterical-cgt-response-misses-the-point-7fb90765-ed1d-4881-8355-b6c550c455d8/",
    rawText:
      "Tech’s loudest voices say capital gains tax reform will stifle innovation. But founders also need local capital, affordable housing and room to take risks.",
    summary:
      "This visible article card is primarily an opinion framing rather than a discrete checkable policy-mechanics claim. It is best treated as a rhetorical counter-position inside the wider founder backlash debate.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-budget-2026-capitalbrief-vc-response-claim",
        verbatim: "Tech’s loudest voices say capital gains tax reform will stifle innovation. But founders also need local capital, affordable housing and room to take risks.",
        paraphrased: "The backlash narrative is incomplete because startup success also depends on local capital, housing affordability and broader conditions.",
        claimType: "interpretive",
        subjectDomain: "startups",
        verdict: "rhetorical",
        confidence: 0.88,
        reasoning:
          "This is an evaluative argument about what matters most for founders, not a narrowly falsifiable policy fact.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.capitalbrief.com/article/i-spent-five-years-in-vc-the-hysterical-cgt-response-misses-the-point-7fb90765-ed1d-4881-8355-b6c550c455d8/",
            supports: "partially_supports",
            relevantPassage:
              "The card frames itself as a rebuttal to the loudest anti-CGT voices by emphasizing broader founder needs."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-capitalbrief-young-builders-claim",
    title: "Capital Brief opinion piece saying the budget punishes young Australians trying to build wealth",
    submittedAt: "2026-05-15T11:45:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.capitalbrief.com/article/this-budget-punishes-young-australians-trying-to-build-something-c0ae36c9-5191-4512-b694-d6cd54969e98/",
    rawText:
      "Young Australians need a credible path to wealth. Instead, this budget protects existing property owners and taxes risk-taking harder.",
    summary:
      "This visible article card is fundamentally a normative judgment about generational fairness and acceptable risk-taking incentives. It overlaps with other aspiration-themed entries already on the page and is best classified as rhetoric rather than a settled factual proposition.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-budget-2026-capitalbrief-young-builders-claim",
        verbatim: "This budget protects existing property owners and taxes risk-taking harder.",
        paraphrased: "The budget is framed as favouring incumbents while making non-property wealth-building harder for younger Australians.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.9,
        reasoning:
          "The statement bundles multiple policy effects into a political judgement about fairness and aspiration.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.capitalbrief.com/article/this-budget-punishes-young-australians-trying-to-build-something-c0ae36c9-5191-4512-b694-d6cd54969e98/",
            supports: "partially_supports",
            relevantPassage:
              "The card frames the budget as protecting existing property owners while taxing risk-taking more heavily."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-regional-australia-claim",
    title: "The Conversation article saying farming family trusts were exempt from the new trust minimum tax",
    submittedAt: "2026-05-15T11:46:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/despite-some-wins-this-budget-wont-transform-regional-australia-282715",
    rawText:
      "Tuesday’s budget confirmed farming family trusts would be exempt from a new 30% minimum tax rate on discretionary trusts.",
    summary:
      "This visible article card contains one clean regional-policy point: farming family trusts were described as exempt from the new 30 per cent discretionary-trust minimum tax.",
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
        id: "claim-budget-2026-conversation-regional-australia-claim",
        verbatim: "Tuesday’s budget confirmed farming family trusts would be exempt from a new 30% minimum tax rate on discretionary trusts.",
        paraphrased: "Farming family trusts were exempted from the new 30 per cent minimum tax on discretionary trusts.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.92,
        reasoning:
          "The article states the carve-out directly and presents it as a confirmed budget feature.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/despite-some-wins-this-budget-wont-transform-regional-australia-282715",
            supports: "supports",
            relevantPassage:
              "The article says farming family trusts would be exempt from the new 30 per cent minimum tax."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-smartcompany-coalition-axe-claim",
    title: "SmartCompany republication saying the Coalition would axe the CGT and negative gearing overhaul",
    submittedAt: "2026-05-15T11:47:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.smartcompany.com.au/business-advice/politics/coalition-vows-axe-labor-cgt-negative-gearing-overhaul/",
    rawText:
      "Shadow Treasurer Tim Wilson says the Coalition will repeal Labor’s proposed capital gains tax and negative gearing reforms if elected.",
    summary:
      "This visible article card repeats the Coalition’s repeal position in republished form. The claim itself is still a simple political-position statement rather than a disputed technical interpretation.",
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
        id: "claim-budget-2026-smartcompany-coalition-axe-claim",
        verbatim: "We’re going to oppose them. We will repeal them.",
        paraphrased: "The Coalition said it would repeal the proposed CGT and negative gearing changes if elected.",
        claimType: "descriptive",
        subjectDomain: "taxation",
        verdict: "supported",
        confidence: 0.95,
        reasoning:
          "The source again contains an unambiguous repeal commitment.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "policy_text_match",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.smartcompany.com.au/business-advice/politics/coalition-vows-axe-labor-cgt-negative-gearing-overhaul/",
            supports: "supports",
            relevantPassage:
              "The article quotes Tim Wilson saying the Coalition would oppose the reforms and repeal them."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-afr-house-flipping-claim",
    title: "AFR article arguing most individual capital gains do not come from property",
    submittedAt: "2026-05-15T11:48:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.afr.com/policy/tax-and-super/pm-told-to-limit-cgt-changes-to-house-flipping-20260514-p5zwz5?ref=rss&utm_medium=rss&utm_source=rss_feed",
    rawText:
      "Less than 40 per cent of capital gains earned by individuals come from property, with a bit over 60 per cent coming from listed shares, managed funds, trusts and other assets.",
    summary:
      "This visible article card advances a composition claim about where individuals’ capital gains come from. It may be directionally important for the housing-versus-other-assets debate, but as presented here it depends on the underlying AFR/ATO analysis rather than on primary tables shown directly in the card.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-afr-house-flipping-claim",
        verbatim: "Less than 40 per cent of capital gains earned by individuals come from property ... A bit over 60 per cent ... come from ASX-listed shares, managed funds, trusts and other assets.",
        paraphrased: "Most individual capital gains come from non-property assets rather than property.",
        claimType: "empirical",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.77,
        reasoning:
          "The article presents this as an analysis of ATO statistics, but the visible card excerpt does not itself expose the underlying calculation table.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.afr.com/policy/tax-and-super/pm-told-to-limit-cgt-changes-to-house-flipping-20260514-p5zwz5?ref=rss&utm_medium=rss&utm_source=rss_feed",
            supports: "partially_supports",
            relevantPassage:
              "The AFR card says less than 40 per cent of individuals’ capital gains come from property and over 60 per cent from other assets."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-conversation-landlords-tax-claim",
    title: "The Conversation article claiming landlords paid much more tax than owner-occupiers over the past decade",
    submittedAt: "2026-05-15T11:49:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://theconversation.com/landlords-pay-almost-7billion-a-year-more-in-tax-than-home-owners-pushing-rents-higher-282238",
    rawText:
      "Allowing for income tax on rent, capital gains tax and land tax, landlords paid about $6.9 billion a year in extra taxes on average over the decade compared with owner-occupiers.",
    summary:
      "This visible article card makes a large quantitative incidence claim based on the author’s reconstruction from ATO, ABS and other material. The estimate may be serious work, but the card itself does not expose enough of the underlying method to treat the number as a settled mechanical fact here.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-conversation-landlords-tax-claim",
        verbatim: "Landlords paid a total of $6.9 billion in a typical year from 2013–14 to 2022–23 ... owner-occupiers didn’t have to pay.",
        paraphrased: "Over the past decade, landlords paid materially more housing-related tax than owner-occupiers.",
        claimType: "empirical",
        subjectDomain: "housing",
        verdict: "requires_assumptions",
        confidence: 0.76,
        reasoning:
          "The source gives a specific estimate based on a methodology summary, but not enough visible underlying detail to independently validate the exact figure inside this card alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://theconversation.com/landlords-pay-almost-7billion-a-year-more-in-tax-than-home-owners-pushing-rents-higher-282238",
            supports: "partially_supports",
            relevantPassage:
              "The article says landlords paid around $6.9 billion a year in extra taxes on average compared with owner-occupiers."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-afr-trusts-die-with-dignity-claim",
    title: "AFR opinion piece arguing the trust minimum tax copies the burden of company tax without the matching framework",
    submittedAt: "2026-05-17T20:20:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.afr.com/politics/federal/if-labor-wants-trusts-to-die-let-them-die-with-dignity-20260517-p5zxu0?ref=rss&utm_medium=rss&utm_source=rss_feed",
    rawText:
      "The government has chosen the worst of both worlds: impose a corporate-style minimum tax while denying trusts access to a genuine corporate tax framework.",
    summary:
      "This visible AFR card is mainly an argument about legal and policy coherence, not a narrow mechanical fact. The card clearly frames the new trust minimum tax as borrowing company-style burden without a matching company-style framework, but that 'worst of both worlds' conclusion depends on normative judgments about what treatment would count as coherent or fair.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 0,
      rhetorical: 1
    },
    claims: [
      {
        id: "claim-budget-2026-afr-trusts-die-with-dignity-claim",
        verbatim: "The government has chosen the worst of both worlds: impose a corporate-style minimum tax while denying trusts access to a genuine corporate tax framework.",
        paraphrased: "The trust reforms are framed as imposing company-like tax burden on trusts without giving them an equivalent company-style framework.",
        claimType: "interpretive",
        subjectDomain: "taxation",
        verdict: "rhetorical",
        confidence: 0.86,
        reasoning:
          "The visible card is making a policy-design critique rather than reporting a neutral factual observation. Its core force comes from the author's judgment that the framework is incoherent, not from a simple measurable claim exposed directly in the excerpt alone.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "logical_analysis",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.afr.com/politics/federal/if-labor-wants-trusts-to-die-let-them-die-with-dignity-20260517-p5zxu0?ref=rss&utm_medium=rss&utm_source=rss_feed",
            supports: "partially_supports",
            relevantPassage:
              "The card says the policy imposes a corporate-style minimum tax on trusts while denying them a genuine corporate tax framework."
          }
        ]
      }
    ]
  }
  ,{
    id: "budget-2026-afr-hawke-fiscal-repair-claim",
    title: "AFR article comparing Budget 2026 to Hawke-era fiscal repair through CGT indexation and negative gearing restraint",
    submittedAt: "2026-05-17T20:21:00Z",
    posterLabel: "albos.tax linked article",
    posterNamedPublicly: false,
    sourceUrl: "https://www.afr.com/politics/federal/hawke-government-fixed-budget-on-spending-and-revenue-sides-in-1980s-20260517-p5zxty?ref=rss&utm_medium=rss&utm_source=rss_feed",
    rawText:
      "Fiscal repair 40 years ago included two components restored by Labor in the 2026 budget: inflation adjustment for CGT and restrictions on negative gearing.",
    summary:
      "This visible AFR card makes a compressed historical-comparison claim. The comparison is plausible on its face because Budget 2026 does include CGT indexation and tighter negative-gearing settings, but the stronger assertion that these are specific Hawke-era fiscal-repair components being 'restored' depends on historical framing and comparison choices not demonstrated directly in the excerpt itself.",
    overallVerdictMix: {
      supported: 0,
      partially_supported: 0,
      unsupported: 0,
      unverifiable: 0,
      requires_assumptions: 1,
      rhetorical: 0
    },
    claims: [
      {
        id: "claim-budget-2026-afr-hawke-fiscal-repair-claim",
        verbatim: "Fiscal repair 40 years ago included two components restored by Labor in the 2026 budget: inflation adjustment for CGT and restrictions on negative gearing.",
        paraphrased: "The Budget 2026 package revives two features associated with Hawke-era fiscal repair: CGT indexation and tighter negative gearing treatment.",
        claimType: "historical",
        subjectDomain: "taxation",
        verdict: "requires_assumptions",
        confidence: 0.8,
        reasoning:
          "The visible card links today's package to a specific historical precedent, but it does not itself surface the underlying historical record or define the comparison standard for 'restored'. The current source set can confirm the 2026 package features, yet the Hawke-era parallel remains excerpt-dependent here.",
        assumptionsRequired: [],
        alternativeFramings: [
          "The source documents this as one visible part of the wider Budget 2026 reaction and explanation cycle."
        ],
        verificationMethod: "empirical_comparison",
        primarySources: [
          {
            title: "Visible albos.tax linked article",
            publisher: "Web article",
            section: "Article excerpt",
            page: 1,
            url: "https://www.afr.com/politics/federal/hawke-government-fixed-budget-on-spending-and-revenue-sides-in-1980s-20260517-p5zxty?ref=rss&utm_medium=rss&utm_source=rss_feed",
            supports: "partially_supports",
            relevantPassage:
              "The card says Labor restored two Hawke-era fiscal-repair components: inflation adjustment for CGT and restrictions on negative gearing."
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
    instanceCount: 4,
    lastSeen: "2026-05-15T02:45:00Z",
    aggregateVerdict: "rhetorical",
    commonMissingAssumptions: [
      "Treats a broad normative judgement about aspiration and nation-level economic direction as if it were a single verifiable fact.",
      "Mixes one real policy change on negative gearing into a much wider claim about the entire Budget's economic meaning."
    ],
    sampleVariations: [
      "budget punishes aspiration",
      "anti-risk budget",
      "terrible budget for builders",
      "fairer tax without penalising aspiration",
      "housing reform good but anti-productivity overall",
      "destroying ambition and aspiration"
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
    instanceCount: 8,
    lastSeen: "2026-05-15T00:12:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Assumes an individual owner taxed at the top marginal rate",
      "Ignores small business CGT concessions that can reduce or disregard gains"
    ],
    sampleVariations: [
      "sweat equity taxed at 47%",
      "zero cost base means full 47%",
      "self-funded business exit tax",
      "index the gain not the cost base"
    ],
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
    instanceCount: 17,
    lastSeen: "2026-05-14T03:07:00Z",
    aggregateVerdict: "requires_assumptions",
    commonMissingAssumptions: [
      "Treats tax as the dominant factor in founder location decisions",
      "Ignores expanded VC incentives in the same budget package",
      "Assumes no grandfathering or targeted founder concession affects the scenario"
    ],
    sampleVariations: ["mass exodus", "capital flight", "Singapore move", "fewer AI companies", "fewer reasons to stay", "best companies leave"],
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
