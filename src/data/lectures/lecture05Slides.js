/**
 * Lecture 05 — Momentum (MGT 595, Quantitative Investing)
 * Built from lectures/lecture05_outline_refined.json
 */

export const lecture05Slides = [
  // ── Block A: JT ──
  {
    slideId: 1, type: 'interactive', title: 'Winners Keep Winning — At One Horizon',
    contextLabel: 'Block A · Jegadeesh–Titman (1993)', blockId: 'A', module: 'momentum',
    visual: 'MomentumLab', visualProps: { mode: 'horizons' },
    narration: '[clear] Rank stocks on their past returns and the future depends entirely on how far back you looked. [curious] One month back: reversal. Six to twelve months: continuation. Three to five years: reversal again. Momentum lives in the middle.',
    systemPromptContext: 'BLOCK A — Momentum: past 6–12mo relative winners keep winning; buy winners/short losers = zero-investment; JT 1963–90 ≈12%/yr abnormal. Violates even WEAK-form efficiency (prices vs their own past); typically beta-neutral; the FF3 model\'s biggest failure. Horizon regimes with REAL annual Sharpes by lookback: 1mo −0.82 (Jegadeesh 1990, Lehmann 1990 reversal); 3mo 0.18; 6mo 0.46; 12mo 0.58; 24mo 0.10; 36mo −0.42; 60mo −0.58 (DeBondt–Thaler reversal). Profits dissipate after ~1yr and REVERSE after 2–3 ⟹ temporary price effect, not permanent mispricing. Reconciliation Socratic: underreact to news short-run, over-extrapolate long-run (BSV/DHS/Hong–Stein each formalize a version).',
    content: {
      eyebrow: 'The effect', heading: 'Winners Keep Winning — At One Horizon',
      body: 'Momentum is the statement that 6-to-12-month relative winners keep beating relative losers — about 12% a year on a portfolio that costs nothing to form. It seems to violate even weak-form efficiency. And it lives at exactly one horizon: look back one month and returns reverse; look back three years and they reverse again. Any explanation has to produce continuation in the middle of two reversals.',
      footnote: 'Click a look-back bar; the sign of the Sharpe ratio is the story.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'The Decile Ladder',
    contextLabel: 'Block A · The strategy', blockId: 'A', module: 'momentum',
    visual: 'MomentumLab', visualProps: { mode: 'deciles' },
    narration: '[excited] Ten portfolios, sorted on the past. The returns climb the ladder almost perfectly — and the three-factor model makes it worse, not better. [serious] Losers look like small distressed value stocks. They should earn more. They earn less.',
    systemPromptContext: 'BLOCK A — Construction: rank on past 6–12mo raw returns; overlapping 6-month windows held 6 months ⟹ only 1/6 of weights turn over monthly. REAL decile monthly returns 1965–2008: P1 0.46, P2 0.09, P3 1.05, P4 1.12, P5 1.15, P6 1.18, P7 1.21, P8 1.30, P9 1.41, P10 1.63; 10−1 = 1.17%/mo. FF regressions 1927–2012: alphas P1 −0.67 (t −3.43) → P10 +0.87 (t 8.00); WML alpha 1.53%/mo (t 5.93); R² to 0.94 — factors price VARIATION not MEANS. Loadings: losers s=0.51, h=0.38 (small/distressed/value-like ⟹ model predicts HIGH returns); winners h=−0.29 (growth-like); WML s=−0.25, h=−0.68 ⟹ adjustment pushes the wrong way, alpha GROWS. Carhart 4-factor: MKT+SMB+HML+UMD (12−1 skip a month) becomes the standard; risk adjustment improves profits (Grundy–Martin 2001).',
    content: {
      eyebrow: 'The evidence', heading: 'The Decile Ladder',
      body: 'Sort into ten portfolios and the returns rise almost monotonically from 0.46%/month (losers) to 1.63% (winners). Regress on the three factors and the puzzle sharpens: losers load like small, distressed value stocks — which should mean high expected returns — yet they deliver the lowest. The winners-minus-losers alpha is 1.53% a month with a t-statistic of 5.9. By the mid-1990s the profession surrendered and made momentum the fourth factor.',
      footnote: 'Toggle raw returns vs three-factor alphas.',
    },
  },
  {
    slideId: 3, type: 'problem', title: 'Your Turn: Annualize the Anomaly',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'momentum',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 3,
      scenario: 'The decile table shows a winners-minus-losers spread of 1.17%/month. The Fama–French regression shows a WML three-factor alpha of 1.53%/month.',
      question: 'Annualize the spread (simple) and the alpha (compounded).',
      given: [['Spread', '1.17%/mo'], ['3-factor $\\alpha$', '1.53%/mo'], ['Compound rule', '$(1+m)$¹² − 1']],
      answers: [
        { label: 'Spread, simple annual (%)', value: 14.0, tolerance: 0.15 },
        { label: 'Alpha, compounded annual (%)', value: 20.0, tolerance: 0.3 },
      ],
      steps: [
        'Simple: ${}1.17 \\times 12 = 14.0\\% \\text{per} \\text{year}$.',
        'Compounded: (1.0153)¹² − 1.',
        '${}1.0153^{2} = 1.0308$; $^{4} = 1.0626$; $^{8} = 1.1292$; $^{12} = 1.1292\\times 1.0626 \\approx 1.200$.',
        'Alpha ≈ 20.0% per year — on a zero-investment portfolio, after three risk factors.',
      ],
    },
    narration: '[encouraging] Twelve times for the quick answer; the twelfth power for the honest one.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: 14.0% simple; (1.0153)^12−1 = 19.99% ≈ 20.0%. Common errors: compounding the 1.17 when asked for simple (14.98) or simple-annualizing the alpha (18.4). Note both conventions appear in papers — always check which a table uses.',
    content: { eyebrow: 'Your turn', heading: 'Annualize the Anomaly', problemTitle: 'Your Turn: Annualize the Anomaly', footnote: 'Simple $= \\times 12$ · Compound $= (1+m)^{12} - 1$.' },
  },

  // ── Block B: sources ──
  {
    slideId: 4, type: 'explain', title: 'Three Suspects, One Equation',
    contextLabel: 'Block B · Decomposition', blockId: 'B', module: 'momentum',
    visual: 'MomentumLab', visualProps: { mode: 'decompose' },
    narration: '[thoughtful] Write the profit as an expectation and it splits into three terms — dispersion in true means, factor timing, and firm-specific autocovariance. [clear] The factor term has the wrong sign. The suspects narrow.',
    systemPromptContext: 'BLOCK B — With weights w ∝ (r_{t−1} − r̄_{t−1}): E[π] = σμ² + σβ²·Cov(F_t,F_{t−1}) + (1/N)Σ Cov(ε_jt, ε_j,t−1). Term 2 (factor timing) is WRONG-SIGNED: market autocovariance <0 at these horizons, so it fights momentum. Term 1 (Conrad–Kaul): permanent dispersion in true means — needs NO predictability; rejected by MG and Grundy–Martin. Term 3 (JT): positive firm-specific autocovariance = delayed reaction to firm news. Lead–lag alternative (β₂F_{t−1}: slow diffusion of COMMON shocks): skipping a week between ranking and holding should MUTE it — instead profits GROW ⟹ JT favor underreaction. Ω matrix version: E[π] = own-autocovariances (diagonals) − cross-serial covariances (off-diagonals) + σμ² — the three terms ARE the three explanations. Puzzle: firm-specific shocks are diversifiable ⟹ looks like arbitrage; why does it survive?',
    content: {
      eyebrow: 'Where do the profits come from?', heading: 'Three Suspects, One Equation',
      body: 'Momentum profits decompose exactly: dispersion in true mean returns (no predictability needed — Conrad–Kaul\'s escape hatch), factor timing (betting the market continues — but the market\'s own autocovariance is negative, so this term fights momentum), and firm-specific autocovariance (delayed reaction to a company\'s own news — JT\'s verdict). The tell: put a week between ranking and holding, and a lead–lag story predicts weaker profits. They get stronger.',
      footnote: '$E[\\pi] = \\sigma^2_{\\mu} + \\sigma^2_{\\beta}\\cdot\\operatorname{Cov}(F,F_{-1}) + \\text{avg own-autocovariance}$.',
    },
  },
  {
    slideId: 5, type: 'interactive', title: 'Moskowitz–Grinblatt: It\'s (Mostly) Industries',
    contextLabel: 'Block B · Industry momentum', blockId: 'B', module: 'momentum',
    visual: 'MomentumLab', visualProps: { mode: 'industry' },
    narration: '[curious] Split every firm\'s surprise into an industry piece and a leftover. [surprised] Neutralize the industry, and individual momentum collapses from significant to nothing. Buy winning industries instead, and you keep the whole effect.',
    systemPromptContext: 'BLOCK B — MG decompose ε = δ_industry + ε*. Table 1 REAL numbers, (6,6) monthly WML: Panel A individual — raw 0.0043 (t 4.65); size&B/M-adjusted 0.0029 (3.34); raw−industry 0.0013 (2.04); size,B/M&industry-adjusted 0.0008 (0.91) — COLLAPSES. Panel B — industry momentum 0.0043 (4.24); DGTW industry 0.0020 (2.27); RANDOM industries −0.0005 (−1.09): the crucial control — the grouping itself earns nothing, real industry structure does. Implication: momentum concentrates sector bets ⟹ less diversified than it looks. Dispute: Grundy–Martin 2000 find BOTH own and industry terms positive; Conrad–Kaul (σμ²) rejected by both. Industry share arithmetic: (0.43−0.08)/0.43 ≈ 81%.',
    content: {
      eyebrow: 'Moskowitz & Grinblatt (1999)', heading: 'It\'s (Mostly) Industries',
      body: 'Decompose each stock\'s surprise into an industry component and an idiosyncratic remainder, and ask which one carries the momentum. The answer is stark: industry-neutralized individual momentum falls from 0.43%/month (t = 4.65) to a statistically dead 0.08 (t = 0.91), while buying past-winning industries earns the full 0.43. Randomly assigned "industries" earn nothing — it\'s real industry structure, not the act of grouping. One consequence for practitioners: a momentum book is a stack of sector bets.',
      footnote: 'Grundy–Martin dissent: both channels positive. The fight continues.',
    },
  },
  {
    slideId: 6, type: 'problem', title: 'Your Turn: How Much Is Industry?',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'momentum',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 6,
      scenario: 'MG Table 1: raw individual-stock momentum earns 0.43%/month. After making returns industry-neutral, 0.08%/month remains.',
      question: 'What share of the raw momentum profit is attributable to industry?',
      given: [['Raw WML', '0.43%/mo'], ['Industry-neutral WML', '0.08%/mo']],
      answers: [{ label: 'Industry share (%)', value: 81.4, tolerance: 1.0 }],
      steps: [
        'Industry contribution = 0.43 − 0.08 = 0.35%/month.',
        'Share = 0.35 / 0.43 = 81.4%.',
        'Four-fifths of "stock" momentum was industry momentum wearing a costume — and the residual 0.08 has $t = 0.91$: statistically nothing.',
      ],
    },
    narration: '[calm] One subtraction, one division — and most of the anomaly changes its name.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: (0.43−0.08)/0.43 = 81.4%. Common error: 0.08/0.43 = 18.6% (the residual share, not the industry share — accept as the complement if the student explains). Discussion: Grundy–Martin\'s different decomposition attributes more to firm-specific — decompositions are identities, attributions are choices.',
    content: { eyebrow: 'Your turn', heading: 'How Much Is Industry?', problemTitle: 'Your Turn: How Much Is Industry?', footnote: 'Share = (raw − neutralized)/raw.' },
  },

  // ── Block C: OOS + explanations ──
  {
    slideId: 7, type: 'interactive', title: 'The Data-Mining Test It Keeps Passing',
    contextLabel: 'Block C · Out of sample', blockId: 'C', module: 'momentum',
    visual: 'MomentumEvidence', visualProps: { mode: 'oos' },
    narration: '[clear] A fluke does not replicate. [excited] Momentum shows up in the data before Jegadeesh and Titman looked, after they published, and in every market and asset class anyone has checked.',
    systemPromptContext: 'BLOCK C — Out-of-sample over TIME (VW WML, real): full 1927–2012 mean 0.75 (t 4.85), SR 0.16, 3F alpha 1.09 (7.91); PRE-sample 1927–64: 0.64 (2.60), alpha 1.03 (5.23); original 1965–89: 0.83 (4.03); POST-publication 1990–2012: 0.93 (2.85), alpha 1.17 (3.27) — biggest AFTER fame. Across MARKETS/ASSETS (Asness–Moskowitz–Pedersen, 15% vol scale, Sharpes): US stocks .45, UK .47, Europe .76, Japan .12 (the weak spot), global stocks .68; equity indices .63, currencies .32, bonds .17, commodities .51, EW-other .65; EW ALL CLASSES 0.81 (12.1%/yr). Independent replication across uncorrelated venues is the strongest anti-data-mining evidence in empirical finance.',
    content: {
      eyebrow: 'Explanation 3, eliminated', heading: 'The Test It Keeps Passing',
      body: 'The data-mining critique has teeth — so feed it. Momentum is significant in 1927–64 data JT never examined, and its post-publication alpha (1.17%/month, 1990–2012) is the largest of any window. Across venues it is positive in US, UK, European and Japanese stocks, equity indices, currencies, bonds, and commodities; the equal-weighted combination earns a 0.81 Sharpe ratio. Whatever momentum is, it is not a fluke of one American sample.',
      footnote: 'Two tabs: across time, across everything else.',
    },
  },
  {
    slideId: 8, type: 'explain', title: 'Risk Says No, Behavior Says Maybe',
    contextLabel: 'Block C · Explanations', blockId: 'C', module: 'momentum',
    visual: 'MomentumEvidence', visualProps: { mode: 'states' },
    narration: '[serious] A risk premium must hurt in bad times. Momentum pays one and a half percent a month in bear markets. [thoughtful] The behavioral story fits the cross-section — slow news travels through small, neglected stocks — but it owes us an answer on why arbitrage has not eaten it.',
    systemPromptContext: 'BLOCK C — RISK reading fails on signs: risers are LESS risky; factor momentum wrong-signed; Sharpe too high; bad states (REAL): bear markets mkt −4.43%/mo vs WML +1.46; bull +5.17 vs −0.03; recessions −1.59 vs +0.89; non-recessions +0.94 vs +1.16 — momentum PAYS when marginal utility is high, the OPPOSITE of a premium\'s job. BEHAVIORAL: gradual info diffusion (Daniel–Hirshleifer–Subrahmanyam 1998 overconfidence; Barberis–Shleifer–Vishny 1998 conservatism/representativeness; Hong–Stein 1999 newswatchers/momentum traders) + reference points (disposition, tax-loss). Cross-section fits: strongest for small, LOW-analyst-coverage (Hong–Lim–Stein: concentrated in LOSERS — bad news travels slowly), high-volume (Lee–Swaminathan), growth (Asness 1997); higher transaction costs. Needs LIMITS TO ARBITRAGE. Tension: momentum = short-horizon underreaction, value = long-horizon overreaction — same investors, opposite errors at different frequencies.',
    content: {
      eyebrow: 'Risk, behavior, or luck?', heading: 'Risk Says No, Behavior Says Maybe',
      body: 'The risk reading keeps failing sign tests: past risers are less risky, not more, and the strategy earns +1.46%/month in bear markets and +0.89% in recessions — a premium that pays out in bad states is not compensation for them. The behavioral reading fits where the profits live: small stocks, thin analyst coverage, and especially losers, because firms don\'t publicize bad news and it diffuses slowly. What behavior still owes: an account of why cheap-to-trade arbitrage capital hasn\'t competed the drift away. The answer arrives two slides from now, wearing a crash helmet.',
      footnote: 'Bear-market WML: +1.46%/mo. Read that twice.',
    },
  },

  // ── Block D: crashes ──
  {
    slideId: 9, type: 'interactive', title: 'Steady Gains, Violent Crashes',
    contextLabel: 'Block D · Daniel–Moskowitz', blockId: 'D', module: 'momentum',
    visual: 'CrashLab', visualProps: { mode: 'anatomy' },
    narration: '[calm] For decades, momentum compounds like clockwork. [serious] Then, in a handful of months — nineteen thirty-two, two thousand nine — it loses half its value. Skewness of minus six. This is the risk the Sharpe ratio cannot see.',
    systemPromptContext: 'BLOCK D — WML 1927–2010 characteristics (REAL): mean 14.4%/yr, Sharpe 0.52, market beta −0.54, alpha 18.4% (t 6.5), MONTHLY SKEW −6.32 (HML +1.8, market −0.58; daily −1.47). Histogram-slide stats (different construction): mean 9.0%, sd 16.2%, SR 0.6, skew −3.0, kurtosis 28.7. Worst months: −79, −60, −46, −44, −42%; max +26.1%; Apr 2009 worst since Aug 1932. Like being SHORT AN OTM PUT (Brunnermeier–Nagel–Pedersen carry analogy). Crash signature (10 worst months): all but one follow a deeply NEGATIVE 2-yr market AND the contemporaneous month is POSITIVE — crashes are bear-market REBOUNDS. Episodes: Jul–Aug 1932 market +82%, losers +236% vs winners +30% (WML −206 pts); Mar–May 2009 market +29%, losers +156% vs winners +6.5% (−149 pts). Long-only 1947–2007: $1 → winners $44,290, market $738, losers $1.37.',
    content: {
      eyebrow: 'Momentum crashes', heading: 'Steady Gains, Violent Crashes',
      body: 'The unconditional numbers are glorious: 14.4% a year, Sharpe 0.52, alpha of 18.4%. The conditional numbers are the fine print: monthly skewness of −6.3, five months worse than −40%, and a signature — every great crash arrives when a deeply negative market suddenly rebounds. July–August 1932: the market +82%, past losers +236%. March–May 2009: the market +29%, losers +156%. Momentum is short those losers. It behaves like a strategy that sells disaster insurance on market bottoms.',
      footnote: 'The distribution below is the whole warning label.',
    },
  },
  {
    slideId: 10, type: 'interactive', title: 'Losers Become Options',
    contextLabel: 'Block D · The mechanism', blockId: 'D', module: 'momentum',
    visual: 'CrashLab', visualProps: { mode: 'betas' },
    narration: '[curious] By March two thousand nine, the loser portfolio was Citigroup, Ford, G-M — stocks down ninety percent, levered to the eyeballs. [clear] Their equity had become an out-of-the-money option. When the market turned, their betas were not one. They were nearly four.',
    systemPromptContext: 'BLOCK D — Mechanism: deep losers are levered near-bankrupt firms; equity = OTM CALL on firm value (Merton 1974) ⟹ enormous up-market betas exactly at bottoms; winners defensive (AutoZone). Conditional betas: loser beta ≈2.5 (1930s), ≈3.7 (2009); winner ≈1 ⟹ WML beta deeply negative in rebounds. Up/down regression (REAL): normal WML beta ≈0.05; bear markets ADD −0.79; bear-and-up-month ADDS a further −0.70 ⟹ rebound-state beta ≈ −1.44. Hedge (Grundy–Martin 2001): rolling 42-day betas with 10 market lags (non-trading), r_hedged = r_WML − βt·r_m — removes the 1932 collapse. OOS replication (DM 2016 JFE): same optionality in Europe/Japan/UK/global and in indices, FX, bonds, COMMODITIES (bear Δβ −0.73, optionality −1.10 sig) — a problem for the Merton leverage story, since futures and currencies aren\'t levered equity claims. Ex-ante market variance predicts low momentum returns everywhere.',
    content: {
      eyebrow: 'Time-varying betas', heading: 'Losers Become Options',
      body: 'Merton\'s insight explains the anatomy: the equity of a firm down 90% is an out-of-the-money call on its assets — nearly worthless until the world improves, then explosive. So at market bottoms the loser portfolio\'s beta spikes toward 3.7 while winners sit near 1, and the winners-minus-losers beta swings to roughly −1.4 precisely when the market rebounds. That state-dependent beta is the crash. It also suggests the cure: measure the beta in real time and hedge it — which flattens 1932 almost entirely.',
      footnote: 'Toggle market states and watch the WML beta swing.',
    },
  },
  {
    slideId: 11, type: 'problem', title: 'Your Turn: Precompute a Crash',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'momentum',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 11,
      scenario: 'Daniel–Moskowitz estimate WML\'s market beta at 0.05 in normal times, 0.79 lower in bear markets, and a further 0.70 lower when the bear-market month is an up month. A bear-market rebound arrives: the market gains 10% this month.',
      question: 'What is WML\'s beta in this state, and the beta-implied WML return?',
      given: [['Normal $\\beta$', '0.05'], ['Bear adjustment', '−0.79'], ['Bear-and-up adjustment', '−0.70'], ['Market this month', '+10%']],
      answers: [
        { label: 'Rebound-state $\\beta$', value: -1.44, tolerance: 0.02 },
        { label: 'Implied WML return (%)', value: -14.4, tolerance: 0.3 },
      ],
      steps: [
        'State beta = 0.05 − 0.79 − 0.70 = −1.44.',
        'Beta-implied move = −1.44 × 10% = −14.4% in one month.',
        'That\'s the crash mechanism in two lines: not bad luck, but a beta that predictably turns deeply negative exactly when the market snaps back.',
      ],
    },
    narration: '[serious] The crash is not a surprise — it is a beta you can compute before it happens.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: β = 0.05−0.79−0.70 = −1.44; −1.44×10 = −14.4%. Common error: applying only one adjustment (−0.74×10 = −7.4). Deep point: because the state is OBSERVABLE (past 2-yr market + volatility), the risk is forecastable — which is what the dynamic strategy exploits next slide.',
    content: { eyebrow: 'Your turn', heading: 'Precompute a Crash', problemTitle: 'Your Turn: Precompute a Crash', footnote: '$\\beta(\\text{state}) = 0.05 - 0.79\\cdot\\text{bear} - 0.70\\cdot(\\text{bear}\\times\\text{up})$.' },
  },
  {
    slideId: 12, type: 'interactive', title: 'The Fix: Scale by the Forecast',
    contextLabel: 'Block D · Dynamic momentum', blockId: 'D', module: 'momentum',
    visual: 'CrashLab', visualProps: { mode: 'dynamic' },
    narration: '[excited] If the crash state is forecastable, size the position with the forecast. [clear] Constant-volatility scaling takes the Sharpe from point-five to point-nine. Scaling by the forecast Sharpe ratio takes it past one — in every market, including Japan.',
    systemPromptContext: 'BLOCK D — Constant-vol (Barroso–Santa-Clara 2012): r_scaled = (σtgt/σ̂_{t−1})·r_WML. Dynamic (DM): w* = (1/2$\\lambda$)·$\\mu$̂_{t−1}/σ̂²_{t−1} — scale by the forecast SHARPE, cutting exposure when past-2yr market is down and vol is high. REAL Sharpes 1927–2011: WML 0.52 → const-σ 0.87 → dynamic 1.12; sub-periods: 1927–50 .14/.40/.58; 1950–75 .90/1.04/1.34; 1975–2000 .93/1.09/1.39; 2000–11 .02/.22/.63. Replication (JFE Table 11): Europe .46→.89→1.13; Japan .07→.16→.42 (RESURRECTED); UK .47→.75→.89; US .28→.52→.65; commodities .59→.80; currencies .30→.65; ALL assets .75→.94→1.14, fully dynamic 1.22 (≈4× static US). Skew flips negative→positive: crashes ameliorated, not diluted; dynamic SPANS const-σ (alpha one way, zero the reverse).',
    content: {
      eyebrow: 'Daniel–Moskowitz (2016)', heading: 'The Fix: Scale by the Forecast',
      body: 'Two one-line position rules. Constant-volatility: hold σ_target/σ̂ — shrink when volatility forecasts high. Dynamic: hold μ̂/(2λσ̂²) — shrink further when the forecast mean is low, which it reliably is after two-year market declines. The static 0.52 Sharpe becomes 0.87, then 1.12; Japan — where static momentum famously earns nothing — goes from 0.07 to 0.42; the all-asset dynamic combination reaches 1.22. And the skewness flips positive: the crashes aren\'t diluted, they\'re removed.',
      footnote: 'The same fix works in every market and asset class tested.',
    },
  },
  {
    slideId: 13, type: 'problem', title: 'Your Turn: Size the Position',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'momentum',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 13,
      scenario: 'Constant-vol rule: target 12% annual volatility; this month\'s forecast is σ̂ = 24%. Dynamic rule: w = μ̂/(2λσ̂²) with λ = 2, forecast mean μ̂ = 1%/month, forecast vol σ̂ = 5%/month.',
      question: 'Compute this month\'s weight under each rule.',
      given: [['$\\sigma$ target', '12%'], ['$\\sigma$̂ (annual)', '24%'], ['λ', '2'], ['μ̂', '0.01'], ['$\\sigma$̂ (monthly)', '0.05']],
      answers: [
        { label: 'Constant-vol weight', value: 0.5, tolerance: 0.02 },
        { label: 'Dynamic weight', value: 1.0, tolerance: 0.05 },
      ],
      steps: [
        'Constant-vol: $w = 12/24 = 0.5$ — halve the position when forecast vol doubles.',
        'Dynamic: $\\hat{\\sigma}^{2} = 0.0025$; $\\hat{\\mu}/\\hat{\\sigma}^{2} = 0.01/0.0025 = 4$; $w = 4/(2\\times 2) = 1.0$.',
        'The dynamic rule also cuts w when $\\mu$̂ falls — as it does after two-year market declines. That extra channel is the entire Sharpe gap between 0.87 and 1.12.',
      ],
    },
    narration: '[calm] Position sizing is just the forecast, divided sensibly.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: 12/24 = 0.5; 0.01/0.0025 = 4, /4 = 1.0. Common error: forgetting to square σ̂ in the dynamic rule (0.01/0.05/4 = 0.05). Extension: in a crash state with μ̂ = −0.5%/mo the dynamic weight goes NEGATIVE — the strategy briefly bets on losers, which is where much of the 2000–11 gain (0.02→0.63) comes from.',
    content: { eyebrow: 'Your turn', heading: 'Size the Position', problemTitle: 'Your Turn: Size the Position', footnote: '$w_{cv} = \\sigma_{\\text{tgt}}/\\hat{\\sigma}$ · $w_{dyn} = \\hat{\\mu}/(2\\lambda\\hat{\\sigma}^2)$.' },
  },

  // ── Block E: family ──
  {
    slideId: 14, type: 'interactive', title: 'One Mechanism, Many Costumes',
    contextLabel: 'Block E · The underreaction family', blockId: 'E', module: 'momentum',
    visual: 'UnderreactionGallery',
    narration: '[curious] Earnings surprises drift for sixty days. Analyst revisions drift for a year. A supplier drifts for months after its biggest customer\'s bad news. [thoughtful] Different costumes, one mechanism: information moves faster than prices.',
    systemPromptContext: 'BLOCK E — PEAD: CARs drift in the surprise direction ~60 trading days by SUE quintile (Bernard–Thomas 1989); earnings momentum: drift after analyst revisions ~12 months (Chan–Jegadeesh–Lakonishok 1996); DISTINCT from price momentum, combining is more profitable, appears in 34 markets. DISPOSITION (Grinblatt–Han 2005; Frazzini 2006): sell winners early, ride losers (mental accounting + prospect theory: risk-averse over gains, risk-seeking over losses) ⟹ price pressure makes prices UNDERREACT; Frazzini overhang g=(P−RP)/P from mutual-fund holdings — drift 2.1–2.5%/mo L/S when news and overhang ALIGN, vanishes when they conflict; survives ownership/turnover/characteristics/SUE/revisions controls. WHO: Hvidkjaer via Lee–Ready trade signing — SMALL-trade (individual) imbalances drive it; large traders show no underreaction; winners\' small-trade buying converts to selling over a year. CUSTOMER MOMENTUM (Cohen–Frazzini 2008): Coastcast/Callaway (customer = 50% of sales; July 2001 guidance cut −30%; supplier drifted for weeks); sort suppliers on customers\' last-month return: L/S xret 1.58 (t 3.8), 3F α 1.56, 4F α 1.38%/mo (t 3.1) ≈18%/yr; +3.9% in the news month, +4.7% further drift over 12 months. Limited attention to PUBLIC links.',
    content: {
      eyebrow: 'Beyond price momentum', heading: 'One Mechanism, Many Costumes',
      body: 'Momentum is the most famous member of a family. Prices drift for two months after earnings surprises and for a year after analyst revisions — in 34 markets. The disposition effect supplies a micro-foundation: investors who won\'t realize losses (or rush to realize gains) slow the price\'s adjustment to news, and Frazzini shows the drift is largest exactly when the news and the holders\' paper gains point the same way. Hvidkjaer\'s order-flow forensics identify the culprits as small traders. And Cohen–Frazzini\'s suppliers drift for a year after their own customers\' public news — an 18%-a-year strategy hiding in a disclosed relationship.',
      footnote: 'Four tabs; every number is from the original papers.',
    },
  },
  {
    slideId: 15, type: 'explain', title: 'Momentum: The Closing Argument',
    contextLabel: 'Block E · Takeaways', blockId: 'E', module: 'momentum',
    visual: 'CrashLab', visualProps: { mode: 'verdict' },
    narration: '[clear] Large, monotone, a century of out-of-sample confirmation — and still unexplained. [thoughtful] What we know for certain is the shape of its danger: not volatility, but conditional crashes. Size the position to survive them.',
    systemPromptContext: 'BLOCK E — Confident: large, monotone, out-of-sample robust across a century/markets/asset classes; the FOURTH factor (Carhart UMD); much of it is INDUSTRY momentum; the danger is CONDITIONAL CRASH RISK, not constant vol. Open: erosion as capital chases it (post-publication alpha was LARGER, but the future needn\'t repeat); risk vs behavior (crash risk and higher moments may rationalize part; which behavioral model wins); falling transaction costs cut both ways (easier to exploit AND to erode). Investor synthesis: size to survive the crashes; hedge or scale the time-varying betas; remember Japan. Course thread: value = long-horizon overreaction (L4), momentum = short-horizon underreaction (L5) — the two premier anomalies are opposite errors, and portfolios that hold BOTH diversify each other\'s worst states (2000–03: momentum suffered, value shone).',
    content: {
      eyebrow: 'Takeaways', heading: 'The Closing Argument',
      body: 'What survives every test: momentum is large, monotone across deciles, robust in data from before its discovery and after its fame, present in every asset class, and substantially an industry phenomenon. What remains open: whether it\'s risk (the crash tail says partly), behavior (the coverage and disposition evidence says partly), and whether crowding will erode it. What a practitioner must never forget: its risk is a conditional crash at market turning points — forecastable enough to hedge, brutal enough to end careers. And notice the symmetry with last lecture: value is the market over-reacting slowly; momentum is the market under-reacting quickly. Held together, each insures the other\'s worst year.',
      footnote: 'Next: putting factors to work — portfolio construction.',
    },
  },
];
