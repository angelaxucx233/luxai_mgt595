/**
 * Lecture 06 — Quality and Defensive Investing (MGT 595, Quantitative Investing)
 * Built from lectures/lecture06_outline_refined.json
 */

export const lecture06Slides = [
  // ── Block A: Novy-Marx ──
  {
    slideId: 1, type: 'explain', title: 'Pay Up — But Not Too Much',
    contextLabel: 'Block A · What quality is', blockId: 'A', module: 'quality',
    visual: 'ProfitabilityLab', visualProps: { mode: 'map' },
    narration: '[clear] Everyone on the street knows some companies are just better — profitable, safe, well run. [curious] The question this lecture asks is whether the market charges full price for that — and what happens when it does not.',
    systemPromptContext: 'BLOCK A — Quality: what you\\u2019d pay a high price for, all else equal. No uniform definition: profitable, safe, good governance, good growth, high payout, creditworthy, well managed, clean accounting (accruals). Relation to value: buying quality WITHOUT paying premium prices IS value investing — Buffett: \\u201cfar better to buy a wonderful business at a fair price than a fair business at a wonderful price.\\u201d Structural fact: high-quality firms tend to be expensive and value firms low-quality ⟹ quality strategies are SHORT value and value strategies SHORT quality — each does well when the other bleeds: a natural hedge. Two questions: does quality carry a standalone premium, or just enhance value? Stakes: market efficiency. History: obvious to Graham and practitioners, resisted by academics; interest surged after the dot-com bust (quality as the alternative to growth). Plan: simplest measure (Novy-Marx gross profitability) → measure zoo → safety dimension (BAB) → synthesis (QMJ) → Buffett.',
    content: {
      eyebrow: 'Quality & defensive investing', heading: 'Pay Up — But Not Too Much',
      body: 'Quality is whatever you\'d willingly pay more for: profitability, safety, good management, clean accounting. Benjamin Graham built a checklist around it in 1934; academia mostly ignored it for sixty years. The lecture\'s organizing insight is structural: because good companies tend to be expensive, quality strategies are implicitly short value — and value strategies implicitly short quality. That tension makes them natural partners, and it makes the central question sharp: does quality earn a premium of its own, or is it value investing wearing a suit?',
      footnote: 'The answer, it turns out, troubles the CAPM and the EMH at the same time.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'One Ratio: Gross Profits over Assets',
    contextLabel: 'Block A · Novy-Marx (2013)', blockId: 'A', module: 'quality',
    visual: 'ProfitabilityLab', visualProps: { mode: 'sorts' },
    narration: '[excited] Revenues minus cost of goods, divided by assets. That is the whole measure. [surprised] Sort on it and returns climb — and adjusting for risk makes the anomaly bigger, not smaller.',
    systemPromptContext: 'BLOCK A — GP/A = (revenues − COGS)/assets: gross profitability, the cleanest accounting measure of productivity (further down the income statement gets polluted). Economic argument: productive assets should out-earn unproductive ones at the same price — the same logic as value, pointed at the asset side; identifies variation in required returns; consistent with BOTH risk and behavioral stories. Evidence (REAL): decile sorts high−low 0.31%/mo (t 2.49), FF3 alpha 0.52%/mo (t 4.49) — profitable firms are GROWTH-like (negative HML loading, lower B/M, larger caps), so risk adjustment RAISES the anomaly (same wrong-way mechanism as momentum L5 s2). Fama–MacBeth slope 0.75 (t 5.49); industry-demeaned 1.00 (t 8.99); survives earnings, FCF, log(B/M), size, momentum controls; works internationally with the same growth tilt. Key subtlety: GP/A predicts returns ESPECIALLY controlling for B/M — its negative correlation with value obscures it in raw sorts.',
    content: {
      eyebrow: 'Novy-Marx, \u201cThe Other Side of Value\u201d', heading: 'Gross Profits over Assets',
      body: 'The measure could not be simpler: revenues minus cost of goods sold, per dollar of assets. Sorted into deciles, the profitable firms beat the unprofitable by 0.31% a month — and the three-factor alpha is 0.52%, larger than the raw spread, because profitable firms look like growth stocks and the model expects them to underperform. The Fama–MacBeth slope survives every control, and demeaning by industry nearly doubles it. Novy-Marx\'s title is exact: this is value\'s logic — pay less per unit of the good stuff — applied to productivity instead of book value.',
      footnote: 'Toggle sorts vs Fama–MacBeth; watch the alpha exceed the spread.',
    },
  },
  {
    slideId: 3, type: 'interactive', title: 'Each Hides the Other',
    contextLabel: 'Block A · Quality + value', blockId: 'A', module: 'quality',
    visual: 'ProfitabilityLab', visualProps: { mode: 'double' },
    narration: '[thoughtful] Sort on value alone and profitability looks weak. Sort on profitability alone and value looks weak. [clear] Sort on both, and each spread nearly doubles — they were hiding each other the whole time.',
    systemPromptContext: 'BLOCK A — Double sorts (REAL): conditional profitability spread 58bp/mo vs 31 unconditional; conditional value spread 68bp vs 41 — controlling for each widens the other because the two characteristics are negatively correlated. Joint 50/50 strategy roughly DOUBLES the Sharpe of either leg (0.65–0.78 vs market 0.41), far shallower drawdowns, survives trading costs; trailing 5-yr Sharpes strongly negatively related — profitability\\u2019s best runs (late 1990s dot-com) are value\\u2019s worst: VALUE INSURANCE. The measure zoo (NM 2014): Graham\\u2019s 7 criteria (size; current ratio>2; 10yr positive earnings; 20yr dividends; EPS growth ≥1/3 over 10yr; P/E≤15; P/B≤1.5); Grantham (low leverage, high profitability, low earnings vol); Greenblatt magic formula = ROIC + EBIT/EV ranks; Sloan accruals; Piotroski F-score; defensive low-beta/low-vol. Verdict: ALL have some power (small caps, with value) but only GROSS PROFITABILITY earns significant standalone returns AND survives spanning tests (alpha 2.34–4.62%/yr in every spec); it subsumes most others; defensive strategies carry huge negative MKT loadings (−0.66, t −20.4). PMU factor added to FF3 drives out ROE, market-power, default-risk, net-issuance, organizational-capital anomalies.',
    content: {
      eyebrow: 'Double sorts & the measure zoo', heading: 'Each Hides the Other',
      body: 'Because quality and cheapness are negatively correlated, one-way sorts understate both: control for value and the profitability spread jumps from 31 to 58 basis points a month; control for profitability and the value spread jumps from 41 to 68. A 50/50 combination roughly doubles either leg\'s Sharpe ratio, because profitability\'s best years — think the late-1990s — are precisely value\'s worst. And when Novy-Marx races the whole quality zoo, from Graham\'s seven criteria to Greenblatt\'s magic formula, one measure survives every spanning test: gross profitability. If you can carry only one quality signal, that\'s the one.',
      footnote: 'Tabs: the double sort · the insurance · the zoo.',
    },
  },
  {
    slideId: 4, type: 'problem', title: 'Your Turn: Score Two Firms',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'quality',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 4,
      scenario: 'Firm A: revenues $100m, COGS $60m, assets $200m. Firm B: revenues $150m, COGS $135m, assets $100m.',
      question: 'Compute gross profitability (GP/A) for each firm.',
      given: [['Firm A', 'rev 100, COGS 60, assets 200'], ['Firm B', 'rev 150, COGS 135, assets 100'], ['GP/A', '(rev − COGS)/assets']],
      answers: [
        { label: 'Firm A GP/A', value: 0.20, tolerance: 0.005 },
        { label: 'Firm B GP/A', value: 0.15, tolerance: 0.005 },
      ],
      steps: [
        'Firm A: (100 − 60)/200 = 40/200 = 0.20.',
        'Firm B: (150 − 135)/100 = 15/100 = 0.15.',
        'B has 50% more revenue — and lower quality. GP/A prices productivity per asset dollar, not size or top-line growth. That\'s why glamour and quality are different things.',
      ],
    },
    narration: '[encouraging] One subtraction and one division per firm — the whole measure fits on a napkin.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: A = 0.20, B = 0.15. Common error: dividing by revenues instead of assets (A: 0.40, B: 0.10) — that computes gross MARGIN, not gross profitability; the identity is GP/A = margin × asset turnover. Discussion: which firm the market probably prices higher (B, the revenue grower) vs which NM buys (A).',
    content: { eyebrow: 'Your turn', heading: 'Score Two Firms', problemTitle: 'Your Turn: Score Two Firms', footnote: 'GP/A = (revenues − COGS)/assets.' },
  },

  // ── Block B: BAB ──
  {
    slideId: 5, type: 'interactive', title: 'The Anomaly Fischer Black Couldn\u2019t Sell',
    contextLabel: 'Block B · Betting Against Beta', blockId: 'B', module: 'quality',
    visual: 'BabLab', visualProps: { mode: 'theory' },
    narration: '[curious] In nineteen sixty-nine, Fischer Black told Wells Fargo that boring low-beta stocks were systematically underpriced. The bank said no. [clear] The theory is one Greek letter: if investors cannot borrow, they reach for beta instead — and beta gets overpriced.',
    systemPromptContext: 'BLOCK B — History: 1969, Black consulting for Wells Fargo finds low-beta stocks return too much vs the CAPM; Wells Fargo refuses to trade it (\\u201cthe nearly unique instance when Fischer lost his cool\\u201d). Theory (Frazzini–Pedersen, after Black 1972): investors who cannot lever (or face margin constraints) overweight HIGH-beta assets to reach for return ⟹ the market portfolio sits right of the tangency portfolio; unconstrained investors do the opposite: buy LOW beta and apply leverage. Proposition 1: E[r] = rf + ψ + β·λ where λ = E[rM] − rf − ψ and ψ = average Lagrange multiplier on the funding constraint. Implications: SML intercept lifted by ψ, slope FLATTENED below the CAPM; CAPM-alpha of any asset = ψ(1−β): positive for low beta, negative for high beta, zero at β=1. Evidence: the classic Black–Jensen–Scholes flat SML (1931–65); updated US equities 1926–2010 — same picture; BONDS 1952–2010 too. The Lux question: if you can\\u2019t lever, buying more market means buying more beta per dollar — and the crowd of reachers bids high-beta prices up, expected returns down.',
    content: {
      eyebrow: 'Frazzini & Pedersen', heading: 'The Anomaly Black Couldn\u2019t Sell',
      body: 'Some investors — most, actually — can\'t or won\'t use leverage. When they want more return, they buy higher-beta assets instead, bidding those up and leaving low-beta assets cheap. In equilibrium the security market line pivots: the intercept rises by ψ, the tightness of funding constraints, and the slope flattens. Every asset\'s CAPM-alpha becomes ψ(1−β) — positive below beta one, negative above it. Black saw this in the data in 1969; nine decades of US stocks and six of bonds have kept drawing the same too-flat line.',
      footnote: 'Drag ψ and watch the SML pivot around β = 1.',
    },
  },
  {
    slideId: 6, type: 'interactive', title: 'Bet Against Beta, Everywhere',
    contextLabel: 'Block B · The evidence', blockId: 'B', module: 'quality',
    visual: 'BabLab', visualProps: { mode: 'evidence' },
    narration: '[excited] Long low beta, levered up; short high beta, delevered. The Sharpe ratio is zero-point-seven-five — beating value, momentum, and size. [serious] And it works in every asset class, fails exactly when funding dries up, and matches who actually holds what.',
    systemPromptContext: 'BLOCK B — BAB factor: long low-beta levered to β=1, short high-beta delevered to β=1 (self-financing, beta-neutral by construction). Evidence (REAL): US stocks BAB Sharpe 0.75 vs HML 0.39, UMD 0.50, SMB 0.25; positive in every country examined and every asset class: US/intl stocks, Treasuries (short vs long maturity), credit, equity indices, country bonds, FX, commodities — alphas DECLINE in beta nearly everywhere (1964–2009). Embedded leverage: securities with built-in leverage (equity options, index options, leveraged ETFs) earn NEGATIVE returns per unit of exposure — FM embedded-leverage coefficient negative and highly significant: constrained investors pay for the embedded borrowing. Prop 3: BAB returns FALL when funding constraints tighten (rising TED spread ⟹ deleveraging ⟹ contemporaneous BAB losses); underpricing reasserts when constraints ease. Prop 5 (who holds what): MPT predicts everyone holds the same portfolio — rejected in the BAB direction: mutual funds and individuals (leverage-averse) hold HIGH-beta portfolios; LBO funds and Berkshire Hathaway buy LOW-beta and apply leverage. Buffett foreshadowed: this is half his decomposition (slide 11).',
    content: {
      eyebrow: 'Propositions 2, 3, and 5', heading: 'Bet Against Beta, Everywhere',
      body: 'The trade the theory implies — long low-beta levered to one, short high-beta delevered to one — earns a 0.75 Sharpe ratio in US stocks, ahead of value, momentum, and size. The same pattern runs through Treasuries, credit, currencies, and commodities. Its two signatures nail the mechanism: BAB loses money precisely when the TED spread spikes and leveraged investors are forced to delever; and portfolios sort by constraint exactly as predicted — mutual funds and individuals crowd into high beta, while Berkshire and LBO funds buy the boring stuff and lever it.',
      footnote: 'Also: anything with leverage built in — options, levered ETFs — is systematically overpriced.',
    },
  },
  {
    slideId: 7, type: 'problem', title: 'Your Turn: Price a Stock When Leverage Is Scarce',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'quality',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 7,
      scenario: 'Funding-liquidity CAPM: E[r] = rf + ψ + β·λ, with λ = E[rM] − rf − ψ. Take rf = 2%, ψ = 1.5%, and E[rM] − rf = 6%. Consider a low-beta stock with β = 0.5.',
      question: 'Find the risk premium λ, and the stock\'s alpha relative to the standard CAPM.',
      given: [['rf', '2%'], ['ψ', '1.5%'], ['E[rM] − rf', '6%'], ['β', '0.5']],
      answers: [
        { label: 'Risk premium λ (%)', value: 4.5, tolerance: 0.05 },
        { label: 'CAPM-alpha (%)', value: 0.75, tolerance: 0.05 },
      ],
      steps: [
        'λ = (E[rM] − rf) − ψ = 6 − 1.5 = 4.5%.',
        'Funding-CAPM: E[r] = 2 + 1.5 + 0.5×4.5 = 5.75%. Standard CAPM: 2 + 0.5×6 = 5.0%.',
        'Alpha = 5.75 − 5.0 = +0.75% — exactly ψ(1−β) = 1.5×0.5.',
        'Run β = 1.5 and the sign flips: alpha = −0.75%. High beta is low alpha; the whole BAB trade is this formula.',
      ],
    },
    narration: '[calm] One Greek letter reprices the whole cross-section — alpha equals psi times one minus beta.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: λ = 4.5; alpha = +0.75 = ψ(1−β). Common error: forgetting to subtract ψ from the market premium (λ = 6, alpha = 1.5+0.5·6−(2+3)... they\\u2019ll get intercept-only alpha 1.5%). Extension: at β=1 alpha is exactly zero — the market prices itself; the mispricing is symmetric around β=1.',
    content: { eyebrow: 'Your turn', heading: 'Price a Stock When Leverage Is Scarce', problemTitle: 'Your Turn: Price a Stock When Leverage Is Scarce', footnote: 'α = ψ(1−β): the entire BAB paper in five symbols.' },
  },

  // ── Block C: QMJ ──
  {
    slideId: 8, type: 'explain', title: 'Price Quality, Then Ask Why It\u2019s Cheap',
    contextLabel: 'Block C · Quality Minus Junk', blockId: 'C', module: 'quality',
    visual: 'QmjLab', visualProps: { mode: 'score' },
    narration: '[thoughtful] Cochrane challenged the field: explain prices, not just returns. [clear] So Asness, Frazzini, and Pedersen rewrite the Gordon model, read four quality components out of it, and ask the market a blunt question: how much do you actually pay for quality? The answer: surprisingly little.',
    systemPromptContext: 'BLOCK C — Motivation: Cochrane\\u2019s 2011 AFA address — \\u201cWhen did our field stop being asset pricing and become asset expected returning? Market-to-book should be our LEFT-hand variable.\\u201d Two views: Graham–Dodd (buy quality, it\\u2019s underpriced) vs efficiency (quality has high prices, normal returns). Definition from Gordon: P/B = profitability × payout / (required return − growth) ⟹ four components: PROFITABILITY (gross profits, margins, earnings, accruals, cash flows — average rank), GROWTH (prior 5-yr growth in those), SAFETY (return-based: beta, vol; fundamental: leverage, earnings vol, credit risk), PAYOUT (shareholder friendliness; free cash flow can worsen agency problems, Jensen 1986). Quality = z(Prof + Growth + Safety + Payout), rank z-scores z=(r−μr)/σr. Data: US long sample 1956–2012; global broad sample 24 countries 1986–2012. Price of quality (FM of price z on quality): coefficient POSITIVE and highly significant — but average R² only 0.05–0.31: quality explains surprisingly LITTLE of prices. Three hypotheses with testable return implications: (a) market uses superior measures ⟹ ours shouldn\\u2019t predict returns; (b) quality linked to unmeasured risk ⟹ quality stocks should behave risky; (c) prices underreact to quality ⟹ quality PREDICTS returns. Next slide tests them.',
    content: {
      eyebrow: 'Asness, Frazzini & Pedersen', heading: 'Price Quality, Then Ask Why It\u2019s Cheap',
      body: 'Rewrite Gordon and the price-to-book of any firm decomposes into four things worth paying for: profitability, growth, safety, and payout. Score every stock on all four, and ask how much of the cross-section of prices the combined score explains. It is positive, highly significant — and weak: R² between 0.05 and 0.31. The market pays up for quality, but nowhere near one-for-one. Three explanations are possible, and they disagree about the future: better hidden measures, hidden risk, or underreaction. Each makes a different prediction about returns — which is how we\'ll pick.',
      footnote: 'Quality = z(Profitability + Growth + Safety + Payout).',
    },
  },
  {
    slideId: 9, type: 'interactive', title: 'Quality Pays — and Hedges',
    contextLabel: 'Block C · The evidence', blockId: 'C', module: 'quality',
    visual: 'QmjLab', visualProps: { mode: 'results' },
    narration: '[excited] Quality-sorted returns rise decile by decile, with a four-factor alpha of zero-point-nine-seven a month. [surprised] And the loadings are all negative — quality stocks are big, safe, growth-like, and they rally in crashes. This is not what a risk premium looks like.',
    systemPromptContext: 'BLOCK C — Results (REAL): US quality deciles — returns and alphas rise nearly monotonically; H−L 0.47%/mo (t 2.80), 4-factor alpha 0.97%/mo (t 8.55), H−L market beta −0.38 (quality HEDGES). Global broad sample: 4F alpha 0.93 (t 6.06). QMJ factor: 4F alpha 0.66%/mo (t 10.2) US, 0.45 (t 5.5) global — with NEGATIVE MKT, SMB, HML loadings: safe, big, growth-like stocks earning high returns; \\u201cany theory of size and value can get into trouble here.\\u201d IRs positive in every country but one. FLIGHT TO QUALITY: QMJ vs market returns is negative and CONVEX — best QMJ returns in sharp declines: the opposite of what a risk premium requires. Analysts: target prices higher for quality but vary LESS with quality than actual prices ⟹ implied expected returns DECREASE in quality — yet realized returns RISE: analysts underreact too. Hypothesis triage: (a) fails — our measures DO predict returns; (b) fails — quality looks safer, not riskier, and gains in distress; (c) consistent with everything. Conclusion: challenges market efficiency (joint-hypothesis caveat); Graham–Dodd vindicated. Bonus: QMJ as RHS variable RESURRECTS the size effect and helps price private equity.',
    content: {
      eyebrow: 'The three hypotheses, tested', heading: 'Quality Pays — and Hedges',
      body: 'Hypothesis (a) dies first: the quality score predicts returns strongly — a 0.97%/month four-factor alpha across US deciles, 0.66%/month for the QMJ factor with a t-statistic of ten. Hypothesis (b) dies next: quality stocks aren\'t secretly risky — QMJ\'s market beta is negative, its loadings on size and value are negative, and its best months arrive in market collapses, when investors fly to quality. What survives is (c): prices underreact to quality — and the analysts\' own target prices show the same too-flat response. Graham and Dodd, formalized; the EMH, on the back foot.',
      footnote: 'Tabs: deciles & factor · flight to quality · the verdict.',
    },
  },
  {
    slideId: 10, type: 'problem', title: 'Your Turn: The Gordon Price of Quality',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'quality',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 10,
      scenario: 'QMJ\'s identity: P/B = profitability × payout / (required return − growth). Firm X: profitability 0.30, payout 0.5, required return 10%, growth 5%. Firm Y has the same quality (profitability × payout = 0.15) and growth (5%), but trades at P/B = 2.',
      question: 'What is X\'s fair P/B — and what required return is the market implying for Y?',
      given: [['X', 'prof 0.30, payout 0.5, r 10%, g 5%'], ['Y', 'prof×payout 0.15, g 5%, P/B = 2']],
      answers: [
        { label: 'Firm X P/B', value: 3.0, tolerance: 0.05 },
        { label: 'Firm Y implied r (%)', value: 12.5, tolerance: 0.1 },
      ],
      steps: [
        'X: P/B = (0.30×0.5)/(0.10−0.05) = 0.15/0.05 = 3.0.',
        'Y: invert — r = g + (prof×payout)/(P/B) = 0.05 + 0.15/2 = 0.125 ⟹ 12.5%.',
        'Same quality, lower price ⟹ higher implied return. Quality at a discount is precisely the stock QMJ (and Buffett) buys — and AFP\'s time-series result says a low price of quality predicts high QMJ returns.',
      ],
    },
    narration: '[calm] The identity runs both ways: quality to price, or price back to the return the market is offering you.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: X P/B = 3.0; Y implied r = 12.5%. Common error: forgetting to add g back when inverting (getting 7.5%). Deep link: this is the L4 Gordon problem\\u2019s twin — there we read implied GROWTH from price; here implied REQUIRED RETURN from price given quality.',
    content: { eyebrow: 'Your turn', heading: 'The Gordon Price of Quality', problemTitle: 'Your Turn: The Gordon Price of Quality', footnote: 'P/B = prof·payout/(r−g), and its inverse.' },
  },

  // ── Block D: Buffett ──
  {
    slideId: 11, type: 'interactive', title: 'Decomposing Buffett',
    contextLabel: 'Block D · Buffett\u2019s Alpha', blockId: 'D', module: 'quality',
    visual: 'BuffettDecomposer',
    narration: '[curious] Split Berkshire into its stock picks and its wholly-owned companies, regress on six factors, and the most famous track record in investing becomes legible. [thoughtful] Cheap, safe, quality stocks — bought with steady insurance-financed leverage, fifty years before the factors had names.',
    systemPromptContext: 'BLOCK D — Frazzini–Kabiller–Pedersen \\u201cBuffett\\u2019s Alpha\\u201d: split Berkshire into Berkshire stock (observed), public equities (13F filings), private companies (inferred from the balance-sheet identity r_private = (rf·Liab + r_equity·Equity − r_public·Public − rf·Cash)/Private). Leverage L = (Total Assets − Cash)/Equity — financed heavily by insurance float. Six-factor regression r = α + β·MKT + SMB + HML + UMD + BAB + QMJ (REAL): significant positive MKT and HML, NEGATIVE SMB (buys cheap, LARGE stocks); adding BAB (loading 0.29, t 2.67) and QMJ (0.43, t 2.34) — both significant — cuts alpha from 12.1%/yr (t 3.19) to 6.3% (t 1.58): statistically indistinguishable from zero. A systematic leveraged cheap-safe-quality portfolio tracks Berkshire\\u2019s public book. Interpretation for discussion: this does NOT diminish Buffett — he identified and stuck with BAB+QMJ 40–50 years before academia named them, applied cheap stable leverage via float, and survived every drawdown (the L4 lesson: the premium is earned by staying invested). Genius = ex-ante factor identification + implementation + discipline.',
    content: {
      eyebrow: 'Frazzini, Kabiller & Pedersen', heading: 'Decomposing Buffett',
      body: 'Berkshire decomposes cleanly: the public stock picks (visible in 13F filings), the private businesses (backed out of the balance sheet), and roughly 1.6-to-1 leverage financed by insurance float. Regress the record on the market, size, value, and momentum, and Buffett shows a 12.1% annual alpha. Add the two factors from this lecture — Betting Against Beta and Quality Minus Junk — and both load significantly, and the alpha falls to 6.3% with a t-statistic of 1.6: statistically, nothing. The magic wasn\'t magic. It was cheap, safe, quality stocks held with disciplined leverage — chosen half a century before the factors had names.',
      footnote: 'A systematic Buffett-style portfolio tracks his public book.',
    },
  },
  {
    slideId: 12, type: 'problem', title: 'Your Turn: How Much of Buffett Is Factors?',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'quality',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 12,
      scenario: 'Berkshire\'s annualized alpha is 12.1% under the four-factor model (t = 3.19). Adding BAB and QMJ reduces it to 6.3% (t = 1.58).',
      question: 'How many points of alpha do BAB and QMJ absorb, and what share of the original alpha is that?',
      given: [['α (4-factor)', '12.1%'], ['α (+BAB, +QMJ)', '6.3%']],
      answers: [
        { label: 'Alpha absorbed (pts)', value: 5.8, tolerance: 0.1 },
        { label: 'Share absorbed (%)', value: 47.9, tolerance: 0.5 },
      ],
      steps: [
        'Absorbed = 12.1 − 6.3 = 5.8 percentage points.',
        'Share = 5.8/12.1 = 47.9%.',
        'Nearly half the legend is systematic exposure to defensive factors anyone can now hold — and the remainder carries t = 1.58, indistinguishable from zero. The skill was seeing it in 1965.',
      ],
    },
    narration: '[calm] One subtraction and one division settle a fifty-year argument about the greatest investor alive.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: 5.8 pts; 47.9%. Common error: computing share of the REMAINING alpha (5.8/6.3 = 92%). Discussion: the statistical vs economic reading — t=1.58 doesn\\u2019t prove zero skill, it proves the data can\\u2019t distinguish the residual from luck once factors are charged.',
    content: { eyebrow: 'Your turn', heading: 'How Much of Buffett Is Factors?', problemTitle: 'Your Turn: How Much of Buffett Is Factors?', footnote: 'Attribution = before − after; share = absorbed/before.' },
  },
  {
    slideId: 13, type: 'explain', title: 'The Defensive Verdict',
    contextLabel: 'Block D · Takeaways', blockId: 'D', module: 'quality',
    visual: 'QmjLab', visualProps: { mode: 'verdict' },
    narration: '[clear] High returns from low risk — that is the defensive premium, and it is a standing challenge to both the CAPM and market efficiency. [thoughtful] The evidence leans toward constraints plus behavior: Graham and Dodd, formalized. One question remains: with hundreds of published factors, how do we know these are real?',
    systemPromptContext: 'BLOCK D — Synthesis: (1) gross profitability — simple, powerful, hedges value, subsumes rival quality signals; (2) BAB — leverage constraints flatten the SML in every asset class, losses timed to funding shocks (TED), holdings sorted by constraint; (3) QMJ — quality priced weakly (low R²), earns large alpha with NEGATIVE risk loadings and flight-to-quality gains. Together: resurrect the size effect, absorb accounting anomalies, decompose Buffett. Open question: unmeasured risk vs leverage-aversion+underreaction inefficiency — evidence leans constraints + behavior (Graham–Dodd formalized). Course thread → L7: the factor zoo has hundreds of members; quality/BAB are recent additions — the next lecture builds the statistical machinery (multiple testing, out-of-sample decay, Bayesian shrinkage, tradability) to decide which factors deserve belief. Preview stat: of 296 significant published factors, 132–158 are likely false (HLZ).',
    content: {
      eyebrow: 'Where this leaves us', heading: 'The Defensive Verdict',
      body: 'Three results, one theme: the market underpays for boring virtue. Profitability is the one quality signal that survives every spanning test and insures value. Betting Against Beta turns a funding constraint into a 0.75-Sharpe factor visible in every asset class. Quality Minus Junk earns a ten-t-statistic alpha while loading negatively on every risk the standard model knows, and rallies in crashes. The honest reading is constraints plus behavior — Graham and Dodd, formalized. But a skeptic should ask the obvious question: hundreds of factors have been published, and most are noise. How do we know these aren\'t? That question is the entire final lecture.',
      footnote: 'Next: data mining, multiple testing, and the factors that survive.',
    },
  },
];
