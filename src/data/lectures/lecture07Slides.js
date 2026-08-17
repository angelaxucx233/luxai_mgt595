/**
 * Lecture 07 — Robustness of Anomalies (MGT 595, Quantitative Investing)
 * Built from lectures/lecture07_outline_refined.json
 */

export const lecture07Slides = [
  // ── Block A: every backtest is a random variable ──
  {
    slideId: 1, type: 'interactive', title: 'The Best-Looking Backtest Is the Most Overfit',
    contextLabel: 'Block A · Overfitting', blockId: 'A', module: 'robustness',
    visual: 'SharpeUncertaintyLab', visualProps: { mode: 'screen' },
    narration: '[serious] Every Sharpe ratio you have ever computed is a random variable. [clear] Put a significance screen on a pile of them and two things happen: noise sneaks over the bar, and real signals fall under it. The more you try, the worse it gets.',
    systemPromptContext: 'BLOCK A — Overfitting harms: select pure-noise signals; overweight real ones; REJECT real signals that had a bad sample (Type II — the invisible opportunity cost); misassess strategy quality. Optimization EXAGGERATES it: an optimizer is in-sample regression — weights tilt toward the signals with the most estimation error, guaranteeing the biggest out-of-sample degradation. The selection schematic: no-edge distribution centered at 0, real-edge centered at ~2SE; a t=1.96 screen admits the noise distribution’s right tail (“these get discovered”) and rejects the real distribution’s left tail (“real signals we throw away”). Disciplines: track ALL signals tried INCLUDING rejected (the denominator of every multiple-testing correction — without it no honest hurdle exists); declare ex-ante signs (converts fishing into a one-sided stated hypothesis — the cheapest discipline available); document stories; give rejected-but-sensible signals a probation period; simulate what N random factors would produce; THE rule: NEVER use full-sample moments, especially the mean (the least visible look-ahead bias) — use odd/even months, rolling estimates, other markets.',
    content: {
      eyebrow: 'The overfitting problem', heading: 'The Best-Looking Backtest Is the Most Overfit',
      body: 'A backtested Sharpe ratio is a draw from a distribution, not a fact. Screen a hundred candidate signals at $t = 2$ and you will "discover" the lucky tail of the worthless ones and discard the unlucky tail of the real ones — and an optimizer then doubles down on exactly the noisiest estimates. The defenses are procedural, not statistical: write down every signal you try (the rejected ones are the denominator of every honest correction), declare the predicted sign before you look, and never, ever let the full-sample mean into the backtest.',
      footnote: 'Slide the screen and watch who gets discovered — and who gets thrown away.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'Same Sharpe, Different Reliability',
    contextLabel: 'Block A · Error bars', blockId: 'A', module: 'robustness',
    visual: 'SharpeUncertaintyLab', visualProps: { mode: 'interval' },
    narration: '[curious] Two strategies, both Sharpe zero-point-eight over five years. [surprised] One is symmetric; one quietly sells insurance. Their error bars differ by nearly forty percent — the same point estimate is not the same evidence.',
    systemPromptContext: 'BLOCK A — SR sampling error, normal iid: SR̂ ~ N(SR, (1/(T−1))(1+SR²/2)); 95% CI = SR̂ ± 2·SE. Ratio of two mismeasured quantities ⟹ interval wider than for mean or SD alone; deck convention plugs the (annual) SR with T in months: T=120, SR 0.5 ⟹ SE ≈ 0.10. Non-normal (only stationarity+ergodicity): Var = (1/(T−1))(1 + SR²·kurt/4 − SR·skew) — negative skew and excess kurtosis WIDEN it. Worked pair (REAL, T=60, both SR 0.80 annualized, monthly mean 0.67%, $\\sigma$ 2.89%): A (skew 0, kurt 3) SE 0.46, CI [−0.10, 1.70], P(SR̂<0)=4.1%; B (skew −3.1, kurt 19.9) SE 0.63 — 38% wider — CI [−0.44, 2.04], P(SR̂<0)=10.3%. Insurance-sellers look smooth until they don’t: their track record says LESS about their true Sharpe. Empirical alternatives: bootstrap (resample with replacement) vs jackknife (leave-one-out) — jackknife preserves distributional properties better with outliers. Robust diagnostics: % of ±3σ months; fraction of observations needed to HALVE the Sharpe or drive it to ZERO; % positive months; drawdown charts; always compare Sharpes over the SAME window.',
    content: {
      eyebrow: 'Confidence intervals on the Sharpe', heading: 'Same Sharpe, Different Reliability',
      body: 'The Sharpe ratio\'s standard error is √[$(1+\\mathrm{SR}^{2}/2)$/$(T-1)$] under friendly assumptions — and real strategies aren\'t friendly: negative skewness and fat tails enter the variance formula directly and widen it. The deck\'s worked pair makes it concrete: two strategies with identical 0.80 Sharpes over 60 months, but the insurance-seller\'s error bar is 38% wider and its probability of a negative realized Sharpe is 10.3% against 4.1%. Report the interval, count the ±3σ months, and compute how few observations it takes to zero the result. A point estimate is not evidence; a point estimate with its error bar is.',
      footnote: 'Toggle strategy B\'s tail on and watch the interval stretch.',
    },
  },
  {
    slideId: 3, type: 'problem', title: 'Your Turn: Put an Error Bar on a Sharpe',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 3,
      scenario: 'A backtest reports SR̂ = 0.5 over T = 120 observations. Under normal iid returns, SE = √[(1/(T−1))(1 + SR̂²/2)], and the 95% CI is SR̂ ± 2·SE (the deck\'s formula card).',
      question: 'Compute the standard error and the lower bound of the 95% confidence interval.',
      given: [['SR̂', '0.5'], ['T', '120'], ['SE', '√[(1+SR²/2)/(T−1)]'], ['CI', 'SR̂ ± 2·SE']],
      answers: [
        { label: 'SE of the Sharpe', value: 0.097, tolerance: 0.004 },
        { label: '95% CI lower bound', value: 0.31, tolerance: 0.012 },
      ],
      steps: [
        '${}1 + 0.5^{2}/2 = 1.125$.',
        'Divide by $T-1 = 119$: 0.009454. Square root: $SE = 0.097$.',
        'Lower bound = 0.5 − 2×0.097 = 0.5 − 0.194 ≈ 0.31.',
        'A full decade of data cannot statistically separate a 0.5-Sharpe strategy from a 0.31 one — or from a 0.69 one. That is why "my backtest Sharpe beats yours by 0.2" is rarely a meaningful sentence.',
      ],
    },
    narration: '[encouraging] The formula is three operations long — and it will change how you read every backtest for the rest of your career.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: SE = √(1.125/119) = 0.0972; lower = 0.5 − 0.1945 = 0.3055 ≈ 0.31. Common errors: forgetting the SR²/2 term (SE 0.0917 — close, accepts by tolerance? 0.0917 vs 0.097 tol 0.004 → 0.0917 is outside by 0.0013, rejected, good); using T instead of T−1 (0.0968, accepted — harmless). Extension: with the non-normal formula and skew −3, kurt 20, the SE roughly doubles.',
    content: { eyebrow: 'Your turn', heading: 'Put an Error Bar on a Sharpe', problemTitle: 'Your Turn: Put an Error Bar on a Sharpe', footnote: '$SE = √[(1+\\mathrm{SR}^{2}/2)/(T-1)]$.' },
  },

  // ── Block B: HLZ ──
  {
    slideId: 4, type: 'interactive', title: 'What 316 Factors Do to t = 2',
    contextLabel: 'Block B · Harvey–Liu–Zhu', blockId: 'B', module: 'robustness',
    visual: 'MultipleTestingLab', visualProps: { mode: 'hurdle' },
    narration: '[clear] Three hundred sixteen published factors, from three hundred thirteen papers, all mining substantially the same data. [serious] At that scale, a t-statistic of two is not evidence. It is the expected best draw from noise.',
    systemPromptContext: 'BLOCK B — HLZ “…and the Cross-Section of Expected Returns”: 313 papers, 316 published factors — an UNDERCOUNT (unpublished work and discarded factors unobservable). Not 316 independent experiments: overlapping samples on the same cross-section. Publication bias: journals publish new factors, not replications (Critical Finance Review the exception); a researcher who finds a factor gets a publication, one who doesn’t gets nothing ⟹ the published record is the RIGHT TAIL of everything tried. Bonferroni hurdle (REAL curve points): t = Φ⁻¹(1−0.05/2N): N=1: 1.960; 2: 2.241; 5: 2.576; 10: 2.807; 25: 3.090; 50: 3.291; 100: 3.481; 200: 3.662; 500: 3.891; 1000: 4.056. Note the shape: rises fast then flattens — 100→1000 tests moves the bar only 3.48→4.06. Bonferroni is the MAXIMUM adjustment (assumes independence); correlated tests put the honest hurdle between 1.96 and the curve. Projection to 2032 (at the last decade’s factor-production rate): Bonferroni ≈4.0, Holm ≈3.8, BHY ≈3.4; HML, MOM, DCG clear even t=4.9. Factor production: flat 1962–1990, then compounding — 59 new factors in 2010–12 alone; the appropriate hurdle is a rising function of calendar time. Two remedies: out-of-sample validation (cleanest, but needs years and isn’t genuine OOS since researchers can see all data) vs a multiple-testing framework (usable today, needs assumptions about how many tests and their correlations).',
    content: {
      eyebrow: 'Factor discovery as multiple testing', heading: 'What 316 Factors Do to t = 2',
      body: 'Harvey, Liu, and Zhu counted: 313 papers proposing 316 factors, nearly all tested on overlapping US data — and that excludes everything tried and never published. Run many tests and the bar for any one of them must rise: the Bonferroni hurdle is 1.96 for a single test, 3.09 at twenty-five, 3.48 at a hundred, 4.06 at a thousand. The literature operates at the far right of that curve, which is the argument behind the modern rule of thumb: don\'t believe a new factor below t = 3. And since journals only publish the discoveries, the published record is, by construction, the right tail of everything that was tried.',
      footnote: 'Drag N and watch what your t-stat has to clear.',
    },
  },
  {
    slideId: 5, type: 'interactive', title: 'Three Corrections, Three Verdicts',
    contextLabel: 'Block B · The machinery', blockId: 'B', module: 'robustness',
    visual: 'MultipleTestingLab', visualProps: { mode: 'procedures' },
    narration: '[thoughtful] Bonferroni asks that no discovery be false. Holm asks the same, more cleverly. B-H-Y tolerates a controlled fraction of junk. [clear] Run all three on the published record and between one hundred thirty-two and one hundred fifty-eight factors fail.',
    systemPromptContext: 'BLOCK B — Error rates: FWER = P(at least one false discovery) — harsh: one mistake in 300 tests is failure; FDR = E[false discoveries / total discoveries] — permissive: tolerates a controlled error RATE. Controlling Type I harder mechanically raises Type II (missed real factors); frequentist fixes Type I and maximizes power; Bayesian treats both jointly (foreshadows JKP). Procedures on ordered p-values p(1)≤…≤p(M): BONFERRONI reject if p(i) ≤ α/M — flat, harshest, assumes independence; HOLM step-down: p(i) ≤ α/(M−i+1) — threshold rises down the list, uniformly less conservative, still controls FWER; BHY step-up: p(i) ≤ (i/M)·α/c(M), c(M)=Σ(1/j) — linear in rank, controls FDR under ARBITRARY dependence (right tool for correlated factors). HLZ worked example (REAL, M=10, α=5%, c(10)=2.929, cutoffs 0.5%/0.60%/0.85%): single tests 10 discoveries; Bonferroni 3 (tests 4,7,8); Holm 4 (adds 9); BHY 6. Methods agree on the strongest factor and diverge at the marginal one. Applied to the literature: of 296 significant published factors, FALSE under Bonferroni 158, Holm 142, BHY(1%) 132 — the conclusion is method-robust (~20% spread). Same conclusion medicine reached: Ioannidis 2005, “most claimed research findings are false.” Limitations: correlations, theory-vs-pure-empirics treated equally, unconditional tests only.',
    content: {
      eyebrow: 'FWER, FDR, and the three procedures', heading: 'Three Corrections, Three Verdicts',
      body: 'Bonferroni divides α by the number of tests — brutal and simple. Holm walks down the ordered p-values, relaxing the bar as stronger results pass. Benjamini–Hochberg–Yekutieli changes the target: instead of forbidding any false discovery, it caps the fraction of discoveries that are false, which buys real power and stays valid when tests are correlated. On HLZ\'s worked ten tests they admit 3, 4, and 6 discoveries respectively — and applied to the 296 significant published factors, they brand 158, 142, and 132 as false. Pick any method you like; the verdict on the factor zoo barely moves.',
      footnote: 'Click a procedure to see its threshold and its casualty count.',
    },
  },
  {
    slideId: 6, type: 'problem', title: 'Your Turn: Set the Honest Hurdle',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 6,
      scenario: 'A desk tested $N = 100$ signals this year and wants a 5% family-wise error rate using Bonferroni. (Useful: $\\Phi ^{-1}(1 - 0.00025) = 3.48$.)',
      question: 'What per-test p-value threshold should each signal face, and what t-statistic does that require?',
      given: [['Family $\\alpha$', '5%'], ['N', '100'], ['Hint', '$\\Phi ^{-1}(1-0.00025) = 3.48$']],
      answers: [
        { label: 'Per-test p-value (%)', value: 0.05, tolerance: 0.005 },
        { label: 'Required t-stat', value: 3.48, tolerance: 0.03 },
      ],
      steps: [
        'Per-test $p = \\alpha /N = 0.05/100 = 0.0005 = 0.05\\%$.',
        'Two-sided: each tail gets 0.0005/2 = 0.00025, so $t = \\Phi ^{-1}(1-0.00025) = 3.48$.',
        'The familiar 1.96 bar was spent by the 99 other signals. This is the deck\'s own $N = 100$ point — and roughly where HLZ say the published literature already sits.',
      ],
    },
    narration: '[calm] Divide your significance level by everything you tried — including the tries you would rather forget.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: 0.05/100 = 0.0005 = 0.05%; t = Φ⁻¹(0.99975) = 3.481 (deck curve point at N=100). Common errors: entering 0.0005 instead of 0.05 when the field asks for PERCENT; forgetting the two-sided split (Φ⁻¹(1−0.0005)=3.29 — outside tolerance, rejected). Extension: Šidák 1−0.95^(1/100) = 0.000513, agrees to two decimals; and correlation between the signals moves the honest hurdle back toward 1.96 — Bonferroni is the ceiling.',
    content: { eyebrow: 'Your turn', heading: 'Set the Honest Hurdle', problemTitle: 'Your Turn: Set the Honest Hurdle', footnote: '$p = \\alpha/N$ · $t = \\Phi^{-1}(1-p/2)$.' },
  },

  // ── Block C: MP + JKP ──
  {
    slideId: 7, type: 'interactive', title: 'Publication Kills (Some of) the Predictor',
    contextLabel: 'Block C · McLean–Pontiff', blockId: 'C', module: 'robustness',
    visual: 'DecayLab', visualProps: { mode: 'decay' },
    narration: '[clear] Track ninety-seven published predictors past the end of their samples, and past their publication dates. [serious] Returns fall twice: once for statistical bias, once when the world reads the paper — and you can watch the arbitrageurs arrive in the volume data.',
    systemPromptContext: 'BLOCK C — McLean–Pontiff “Does Academic Research Destroy Stock Return Predictability?”: 97 predictors; the three-regime design (in-sample / post-sample / post-publication) separates STATISTICAL BIAS from MARKET LEARNING. REAL bars (mean monthly predictor-portfolio return): in-sample 0.582% (323 mo avg) → out-of-sample 0.402% (56 mo) → post-publication 0.264% (156 mo). Headline (regression-based): returns 26% lower OOS, 58% lower post-publication ⟹ 32% attributable to publication-informed trading. First drop would happen if nobody read the paper (selection on the same data); nothing statistical happens at the publication date — only learning. Cross-section of the decay: LARGER for predictors built from price/volume data only (weak-form violations, easiest to trade) and for cheap-to-arbitrage portfolios (liquid stocks, low idiosyncratic risk). Mechanism visible (REAL): post-sample → post-publication coefficients: trading volume 0.092 → 0.187, dollar volume 0.066 → 0.097, short−long short interest 0.166 → 0.315 — volume and shorting roughly DOUBLE (equality rejected p=0.000); only variance unchanged. Replicability floor: 12 of 97 predictors not replicable in their own original samples (data errors/restatements). Decay begins BEFORE publication (working-paper circulation) and deepens for years after. A firm would add a fourth regime: vs live implementation — “implementation drag.” Lux: a RISK premium wouldn’t care about a publication date; mispricing being competed away would — the post-publication drop is the behavioral tell.',
    content: {
      eyebrow: 'McLean & Pontiff (2015)', heading: 'Publication Kills (Some of) the Predictor',
      body: 'Ninety-seven published predictors, followed out of their samples and past their publication dates. The average portfolio earns 0.582% a month in sample, 0.402% after the sample ends — that drop is pure statistical bias — and 0.264% once the paper is public. Nothing statistical happens on a publication date; what happens is readers: trading volume and short interest in the predictor portfolios roughly double. The decay is steepest exactly where arbitrage is cheapest — liquid stocks, price-based signals. Anomalies, it turns out, are partly noise and partly food.',
      footnote: 'Click each bar for what it isolates; the mechanism tab shows the arbitrageurs arriving.',
    },
  },
  {
    slideId: 8, type: 'problem', title: 'Your Turn: Split the Decay',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 8,
      scenario: 'McLean & Pontiff estimate that predictor returns are 26% lower out of sample and 58% lower post-publication (both measured relative to in-sample returns).',
      question: 'How much of the decay is attributable to publication-informed trading, and what share of the total post-publication decay is that?',
      given: [['OOS decay', '26%'], ['Post-publication decay', '58%']],
      answers: [
        { label: 'Trading-attributable decay (pts)', value: 32, tolerance: 0.5 },
        { label: 'Share of total decay (%)', value: 55.2, tolerance: 0.5 },
      ],
      steps: [
        'Publication-informed trading = 58 − 26 = 32 percentage points.',
        'Share of the total = 32/58 = 55.2%.',
        'Read it as a verdict on the debate: a bit under half of the decay (26/58) means the published estimate was inflated — noise. A bit over half means the effect was real and the market ate it — learning. Both camps are right.',
      ],
    },
    narration: '[calm] One subtraction splits the anomaly literature into the part that was never there and the part that got eaten.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: 58−26 = 32 pts; 32/58 = 55.2%. Common error: computing 32/26 = 123% (dividing by the wrong base). Nuance if asked: the raw bar ratios differ slightly (0.582→0.402 is −30.9% not −26%) because the paper’s headline numbers are regression-based with controls; we use the headline decomposition.',
    content: { eyebrow: 'Your turn', heading: 'Split the Decay', problemTitle: 'Your Turn: Split the Decay', footnote: 'Bias = 26 pts · Learning = 32 pts · Total = 58.' },
  },
  {
    slideId: 9, type: 'interactive', title: 'The Bayesian Rebuttal',
    contextLabel: 'Block C · Jensen–Kelly–Pedersen', blockId: 'C', module: 'robustness',
    visual: 'DecayLab', visualProps: { mode: 'bayes' },
    narration: '[curious] Jensen, Kelly, and Pedersen rebuilt every factor with one recipe, in ninety-three countries, and put a Bayesian prior over the whole zoo. [excited] Verdict: eighty-two percent replicate — and having many factors makes each one more credible, not less.',
    systemPromptContext: 'BLOCK C — JKP “Is There a Replication Crisis in Finance?” answers both charges (HXZ internal validity: “most anomalies fail” — their raw-return rate 35%, falling to 18% with their own MT adjustment; HLZ external validity: p-hacking). One uniform recipe: 153 factors × 93 countries, terciles with non-micro breakpoints, capped value weights (Nokia was 70% of Finland’s market cap in 1999!), 10% idiosyncratic-vol scaling, open-sourced at jkpfactors.com. SEVEN BARS (REAL): 35.0 (HXZ raw) → 55.6 (JKP sample/construction: +9.2 capped weights, +5.0 one-month hold, +8.3 longer sample, −6.0 their own more-conservative terciles, +4.1 other) → 61.3 (exclude 34 factors whose ORIGINAL papers never claimed significance — you can’t fail to replicate an unmade claim) → 82.4 (CAPM ALPHAS, not raw returns — theory’s quantity; low-beta factors PREDICT negative raw return with positive alpha, so HXZ’s “failures” there are CONFIRMATIONS of BAB; still pure OLS) → 75.6 (HLZ-style BY adjustment) → 82.4 (empirical Bayes US) → 82.4 (EB global). The zoo is THIRTEEN THEMES (hierarchical clustering on CAPM-residual correlations): Value 0.81 within-cluster correlation, Investment 0.75, Low Risk 0.75, Momentum 0.71 … Seasonality 0.04; the zoo = decentralized refinement of ~a dozen concepts, not fraud. Size distribution: mega 77.3%, large 79.8%, small 85.7%, micro 85.7%, nano 68.1% — the micro-cap objection fails. Global: OLS rates lower abroad only because samples are SHORTER (world alpha = 0.079 + 0.67·US alpha, R² 0.37, cloud hugs 45°); BY devastates short samples (dev ex-US 60.5→31.1) while EB-All lifts them (→80.7) using only incremental information. IS-vs-OOS slopes 0.57/0.26/0.35 (t 5.29/3.47/4.79), positive intercepts ⟹ pure alpha-hacking (slope 0, negative intercept) REJECTED — but slopes sit below the no-hacking Bayesian benchmark ≈0.90: the strongest in-sample alphas are partly mined or arbitraged. Shrinkage core: E(α|$\\alpha$̂)=κα̂, κ=1/(1+σ²/($\\tau$²T)) — attenuated OOS alpha is the EXPECTED outcome of learning, not failure (JKP avg −47% vs MP’s −58%). Economic payoff: factors BY rejects but EB keeps earn IR ≈ 0.93–1.60 afterward. Bayesian FDR 0.1%; expected fraction of true factors 94%. Lux answer: in a hierarchical model the other factors estimate the PRIOR (does alpha exist in general?), so more factors tighten every posterior — HLZ’s framework has no channel for evidence to accumulate, only for suspicion to.',
    content: {
      eyebrow: 'Jensen, Kelly & Pedersen (2022)', heading: 'The Bayesian Rebuttal',
      body: 'JKP rebuild the entire zoo — 153 factors, 93 countries, one public recipe — and walk the replication rate from Hou–Xue–Zhang\'s 35% to 82.4% in auditable steps: sensible portfolio construction, dropping factors whose original papers never claimed significance, and testing CAPM alphas, the quantity theory actually speaks to (a low-beta factor with negative raw return isn\'t a failure — it\'s Betting Against Beta working). Then the reframe: model all factors jointly, with a zero-alpha prior whose tightness the data estimate. Out-of-sample decay stops being scandal and becomes the predicted shrinkage; the thirteen-theme structure means every factor\'s evidence strengthens the others; and the factors the frequentist correction discards go on to earn information ratios near one.',
      footnote: 'Tabs: the seven bars · shrinkage · the world test.',
    },
  },

  // ── Block D: shrinkage, tradability, theory ──
  {
    slideId: 10, type: 'problem', title: 'Your Turn: Shrink an Alpha',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 10,
      scenario: 'JKP\'s posterior: E(α|α̂) = κ·α̂ with κ = 1/(1 + σ²/(τ²T)). A factor has monthly residual volatility σ = 2%, prior dispersion τ = 0.4%, T = 100 months of data, and a reported alpha α̂ = 0.5%/month.',
      question: 'Compute the shrinkage factor $\\kappa$ and the posterior alpha.',
      given: [['σ', '2%/mo'], ['τ', '0.4%'], ['T', '100'], ['α̂', '0.5%/mo']],
      answers: [
        { label: 'Shrinkage factor $\\kappa$', value: 0.80, tolerance: 0.01 },
        { label: 'Posterior alpha $(\\%/mo)$', value: 0.40, tolerance: 0.01 },
      ],
      steps: [
        '$\\sigma ^{2}/(\\tau ^{2}T) = 2^{2}/(0.4^{2}\\times 100) = 4/16 = 0.25$.',
        '$\\kappa = 1/(1+0.25) = 0.80$.',
        'Posterior = 0.80 × 0.5 = 0.40%/month.',
        'Interpretation: the prior is worth $\\sigma ^{2}/\\tau ^{2} = 25$ months of zero alpha stacked onto your 100 observed months. A Bayesian always forecasts less than the backtest — which is why out-of-sample "decay" of about this size is the expected outcome, not a crisis.',
      ],
    },
    narration: '[calm] Kappa is the exchange rate between what a backtest says and what you should believe.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: σ²/(τ²T) = 4/(0.16·100) = 0.25; κ = 0.80; posterior 0.40. Common error: forgetting to square σ or τ (κ = 1/(1+2/(0.4·100)) = 0.952). Extensions: JKP’s US calibration gives κ ≈ 0.90 (σ²=(10%)²/12, T=420, τ=0.41%); the OOS-on-IS regression slope should equal κ under no hacking — the observed 0.26–0.57 below 0.90 is the residue of mining/arbitrage.',
    content: { eyebrow: 'Your turn', heading: 'Shrink an Alpha', problemTitle: 'Your Turn: Shrink an Alpha', footnote: '$\\kappa = 1/(1+\\sigma^2/(\\tau^2 T))$ — the prior is worth $\\sigma^2/\\tau^2$ months of zeros.' },
  },
  {
    slideId: 11, type: 'interactive', title: 'Real, Replicable — and Tradable?',
    contextLabel: 'Block D · Chen–Welch', blockId: 'D', module: 'robustness',
    visual: 'DecayLab', visualProps: { mode: 'tradable' },
    narration: '[thoughtful] Chen and Welch concede the whole replication debate — the anomalies were real. [serious] Then they ask what a large-cap manager could actually have earned after two thousand five: seven basis points a month, before costs.',
    systemPromptContext: 'BLOCK D — Chen–Welch “What Useful Alphas?” (2026): ~200 published long-short anomalies, each rebuilt with its own paper’s sort; two eras (through 2005 / post-2005 — decimalization, algo trading); investable universe = top 3,000 stocks & top 90% of market cap. THE 2×2 (REAL, median bp/mo, % positive): through-2005 all stocks 48 (99%); through-2005 top-90% 26 (92%); post-2005 all stocks 19 (80%); post-2005 top-90% 7 (67%). Effects roughly MULTIPLICATIVE: era alone ≈ −60%; cap filter alone ≈ −½; together ≈ −85% (48→7). Median post-2005 tradable t = 0.45; essentially zero after luck and transaction costs. Even COMBINING anomalies: 250–380 bp/mo gross through 2005 → 0–20 bp NET afterward (Chen–Velikov 2023). Their line: “published academic anomalies have been useless to non-micro-cap portfolio managers in the 21st century. Public stock markets were VERY efficient.” What they do NOT claim: the original research was wrong (“the anomalies were genuine… they were, however, traded away”); that NO anomaly strategy can profit — factor timing (Haddad–Kozak–Santosh; Moreira–Muir), ML combinations (Gu–Kelly–Xiu), and proprietary/alt data lie outside the test. THE FOUR-PAPER MAP: HLZ (much is multiple-testing noise) · MP (−26% bias + −32% learning) · JKP (largely replicates; decay ≈ Bayesian shrinkage) · CW (replicates, but ~7bp tradable) — NOT mutually exclusive: a factor can be real, shrink out of sample, and be arbitraged below costs in liquid stocks, all at once. Statistical significance and economic implementability are different properties.',
    content: {
      eyebrow: 'Chen & Welch (2026)', heading: 'Real, Replicable — and Tradable?',
      body: 'Grant every point JKP made — the anomalies were genuine. Chen and Welch then impose two constraints any real manager faces: trade after 2005, and trade the top 90% of market cap. Each alone cuts the median anomaly roughly in half or more; together they take 48 basis points a month down to 7, with a median t-statistic of 0.45 — before transaction costs. Even stacking all 200 anomalies into one combined signal nets out near zero. The reconciliation of the whole lecture sits here: a factor can be statistically real, shrink out of sample exactly as Bayes predicts, and still be arbitraged below usefulness precisely where capital can act on it.',
      footnote: 'The 2×2 below is the whole paper. Both constraints must bind.',
    },
  },
  {
    slideId: 12, type: 'problem', title: 'Your Turn: The Practitioner’s Discount',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 12,
      scenario: 'Chen–Welch medians: 48 bp/month (through 2005, all stocks); 19 bp (post-2005, all stocks); 7 bp (post-2005, top-90% universe).',
      question: 'What is the era-only decline, and the total decline from the published environment to the practitioner\'s?',
      given: [['Through 2005, all', '48 bp'], ['Post-2005, all', '19 bp'], ['Post-2005, top 90%', '7 bp']],
      answers: [
        { label: 'Era-only decline (%)', value: 60.4, tolerance: 0.5 },
        { label: 'Total decline (%)', value: 85.4, tolerance: 0.5 },
      ],
      steps: [
        'Era alone: $(48 - 19)/48 = 29/48 = 60.4\\%$.',
        'Total: $(48 - 7)/48 = 41/48 = 85.4\\%$.',
        'Check the multiplicative structure: surviving the era leaves ×0.396 of the return; the cap filter leaves roughly ×0.37 of that — 48 × 0.396 × 0.37 ≈ 7. Impose only one constraint and you still find something; a large-cap manager today faces both.',
      ],
    },
    narration: '[serious] Eighty-five percent of the published anomaly literature evaporates between the journal page and the trading desk.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: 29/48 = 60.4%; 41/48 = 85.4%. Common error: differencing percentages of different bases (48−19=29 “percent”). Discussion: which 15% survives? Small/illiquid corners, fresher signals, combinations with timing — exactly where implementation costs bite hardest: the equilibrium of Grossman–Stiglitz.',
    content: { eyebrow: 'Your turn', heading: 'The Practitioner’s Discount', problemTitle: 'Your Turn: The Practitioner’s Discount', footnote: 'The two filters are roughly multiplicative.' },
  },
  {
    slideId: 13, type: 'explain', title: 'Why Theory Is the Cheapest Filter',
    contextLabel: 'Block D · Signal vs noise', blockId: 'D', module: 'robustness',
    visual: 'MultipleTestingLab', visualProps: { mode: 'theory' },
    narration: '[curious] Book-to-price, the Super Bowl winner, and the position of Mars all sit on the same candidate list — and all three of those silly factors were actually published. [clear] Theory is the filter that removes them before the t-stat ever gets computed.',
    systemPromptContext: 'BLOCK D — Under- vs overfitting: simple models (first principles, interpretable, omit variables) vs data-driven (capture signal AND noise); CAPM vs the zoo is the same axis; Big Data/ML widens the scope for BOTH. The candidate list deliberately mixes book-to-price with the Super Bowl winner, lunar phases, CEO age, Mars-vs-Venus, temperature. PUBLISHED silliness (real papers): “Are Investors Moonstruck?” (lunar phases), “Sports Sentiment and Stock Returns” (World Cup losses), “Stock Market Returns: A Temperature Anomaly.” What theory does: filters noise from first principles; provides intuition; finds truth ABSENT data (the peso problem — an unrealized devaluation is invisible in data, visible in theory); the honest cost: it raises Type-II error — real effects with no story yet get filtered too. What is a good t-stat: 1.96 = 5% false-positive chance PER TEST — says nothing about a literature of hundreds. The simulation (REAL series): 1,000 factors tested, 100 truly real: at t=1.95 you make 143 discoveries of which 49 are junk; the false positives die out near t=3 while ~99 of the 100 real ones survive t=2.5. The arithmetic of luck (log scale): tests needed for one fluke: t=2 ≈ 121; 2.5 ≈ 393; 3 ≈ 8,329; 3.5 ≈ 408,234; 5 ≈ 4.4×10¹¹. The literature has run ~400+ tests — right at the t=3 line, well past t=2: “t≥3” is not a convention, it is the level at which flukes need more searching than the field has plausibly done.',
    content: {
      eyebrow: 'Underfitting, overfitting, and stories', heading: 'Why Theory Is the Cheapest Filter',
      body: 'Purely data-driven search cannot tell book-to-price from the Super Bowl indicator — and the journals prove it, having published lunar phases, sports sentiment, and air temperature as return predictors. A theory requirement filters those out before any statistics run, at a price stated honestly: some real effects have no story yet. The arithmetic then sets the bar. Testing 1,000 factors of which 100 are real, a t = 1.95 screen delivers 143 "discoveries," a third of them junk; producing a t = 3 fluke takes about 8,000 tries — roughly the field\'s entire plausible search volume. Hence the modern rule: a story, and t ≥ 3.',
      footnote: 'Each extra unit of t costs orders of magnitude more searching.',
    },
  },

  // ── Block E: the gauntlet ──
  {
    slideId: 14, type: 'interactive', title: 'Four Tests, Two Survivors',
    contextLabel: 'Block E · Value & momentum', blockId: 'E', module: 'robustness',
    visual: 'FactorGauntlet', visualProps: { mode: 'gauntlet' },
    narration: '[clear] The rule from everything before: a high original t-stat, robustness to specification, out-of-sample evidence, and a story. [excited] Run value and momentum through all four — and watch momentum come back from abroad stronger than it left.',
    systemPromptContext: 'BLOCK E — The four criteria: (1) original-sample t ≥ 3; (2) robustness to specification (small construction changes don’t flip the result); (3) out-of-sample — before/after the sample, other countries, other asset classes; (4) sound economic story. Why value & momentum specifically: largest published t-stats and citation counts — if the gauntlet can’t clear them it’s too strict; if it clears them and rejects the zoo, it works. VALUE (Rosenberg–Reid–Lanstein 1985; FF 1992): five constructions, avg return %/yr 1951–2014 (REAL): B/P 3.6, E/P 5.3, CF/P 4.5, D/P 1.8, LT-reversal 2.5 — every one positive; composite 3.5 (≈ the mean of the five, 3.54 — not a cherry-pick). OOS t-stats (1920–2017): US OOS 3.62; non-US full 4.49; non-US OOS 2.93 — two of three clear t=3 outright. Stories: risk (systematic/distress, prolonged droughts) AND behavioral (neglect, extrapolation) — both make ADDITIONAL testable predictions, which is what separates a story from a rationalization. MOMENTUM (JT 1993): 16 constructions (4 lookbacks × 4 holds, 1965–89, REAL grid): 1.10, 2.29, 2.69, 3.53 / 2.44, 3.07, 3.76, 3.36 / 3.03, 3.78, 3.47, 2.89 / 3.74, 3.40, 2.95, 2.25 — only 3mo/3mo (1.10) fails t=2: 15 of 16 clear. OOS: US 2.78; non-US full 4.49; non-US OOS 5.99 — LARGER out of sample than in: the single most convincing number in the lecture (no selection bias can produce strength where nobody selected). Stories: risk (winners’ cost of capital shifts) and behavioral (underreaction + limited attention + delayed overreaction, reversing long-term — matches L5’s horizon map). Both clear all four. NOTE: the source deck’s text claims eleven constructions clear t=3 but its own 16-value list contains nine ≥3.0 — the app shows the grid and states only the uncontested 15-of-16 fact.',
    content: {
      eyebrow: 'Best practices, applied', heading: 'Four Tests, Two Survivors',
      body: 'The lecture\'s whole machinery compresses to four demands: an original t-statistic of three, robustness to construction, out-of-sample confirmation, and an economic story. Value answers with five different price ratios, every one positive over six decades, and a composite that equals their average — no cherry-picking possible. Momentum answers with fifteen of sixteen formation-and-holding combinations clearing t = 2, and the showstopper: its non-US out-of-sample t-statistic (5.99) exceeds its full-sample one (4.49). Selection bias cannot manufacture strength in a sample nobody selected. Both factors carry two live economic stories each — which is two more than the lunar-phase paper had.',
      footnote: 'Tabs: value · momentum. The grid is the argument.',
    },
  },
  {
    slideId: 15, type: 'problem', title: 'Your Turn: Is Value One Lucky Ratio?',
    contextLabel: 'Block E · Your turn', blockId: 'E', module: 'robustness',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 15,
      scenario: 'The five value constructions earn (annualized, 1951–2014): B/P 3.6%, E/P 5.3%, CF/P 4.5%, D/P 1.8%, long-term reversal 2.5%. The published composite earns 3.5%.',
      question: 'Compute the mean of the five constructions, and the range $(\\text{max} - \\text{min})$.',
      given: [['B/P', '3.6'], ['E/P', '5.3'], ['CF/P', '4.5'], ['D/P', '1.8'], ['LT-rev', '2.5'], ['Composite', '3.5']],
      answers: [
        { label: 'Mean of the five (%)', value: 3.54, tolerance: 0.05 },
        { label: 'Range, max − min (pts)', value: 3.5, tolerance: 0.05 },
      ],
      steps: [
        '$\\text{Sum} = 3.6 + 5.3 + 4.5 + 1.8 + 2.5 = 17.7$. $\\text{Mean} = 17.7/5 = 3.54\\%$.',
        'Range = 5.3 − 1.8 = 3.5 points.',
        'The composite (3.5%) sits exactly at the mean, not at the maximum — the published number is the average of its parts, and every part is positive. That is what robustness to specification looks like: the premium is a property of cheapness itself, not of one lucky ratio.',
      ],
    },
    narration: '[encouraging] If the composite equaled the best construction, you would smell cherry-picking. It equals the average.',
    systemPromptContext: 'BLOCK E PROBLEM — VERIFIED: mean 3.54; range 3.5. Common error: including the composite in the average (16.2+3.5... wait: (17.7+3.5)/6 = 3.53 — nearly identical, accepted by tolerance; harmless). Contrast case for discussion: a data-mined factor family shows one construction at 6% and the rest near zero — mean far below max, published number AT the max.',
    content: { eyebrow: 'Your turn', heading: 'Is Value One Lucky Ratio?', problemTitle: 'Your Turn: Is Value One Lucky Ratio?', footnote: 'Composite ≈ mean of parts ⟹ no cherry-pick.' },
  },
  {
    slideId: 16, type: 'explain', title: 'Most Don’t Matter — A Few Really Do',
    contextLabel: 'Block E · The course verdict', blockId: 'E', module: 'robustness',
    visual: 'FactorGauntlet', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] Ninety percent of all factor citations go to four or five factors — the ones that pass every test in this lecture. [clear] There are a lot of factors out there. Most don’t matter. A few really do.',
    systemPromptContext: 'BLOCK E — Citation concentration (REAL, thousands): Value 72.1, Size 58.1, Momentum 33.1, Beta 19.4, FSQ 18.3 — ≈90% of all citations in 4–5 factors; then Reversal 14.1, LIQ 10.8, Default 7.7, ESG 7.1 … a long thin tail of 17 more. Impact-weighted, academia focuses on the robust factors; time wasted on data-mined ones is small (“more time is spent replicating bogus factors than anyone paid them originally”). The EW index of surviving factors has t > 11 ⟹ more than a TRILLION random trials to fluke — versus the field’s ~400. Course-wide synthesis: overfitting is a measurement problem (report intervals, perturbations, month-dependence); keep score of everything tried; the MT hurdle rises mechanically (1.96 → 3.28 at 50 tests); decay is real and two-part (−26 bias / −32 learning); straight replication is harsh (HXZ: 64% of 447 fail at 5%, 85% at t=3); Bayesian shrinkage reconciles decay with replication; tradability is a separate hurdle (48→7bp). THE RULE: t ≥ 3, robustness, out-of-sample evidence, and a story — before believing a factor exists; then size it to survive being wrong (L4’s drawdown lesson, L5’s crash lesson). Full-course arc closes: CAPM (L1–2) → efficiency and anomalies (L3) → value (L4) → momentum (L5) → quality/defensive (L6) → which of it all deserves belief (L7).',
    content: {
      eyebrow: 'Putting it all together', heading: 'Most Don’t Matter — A Few Really Do',
      body: 'Step back and the zoo has an order. Ninety percent of factor citations concentrate in four or five names — value, size, momentum, beta, quality — and those are precisely the factors that clear every hurdle this lecture built: original t-stats above three, robustness across constructions, out-of-sample confirmation across decades and continents, and competing economic stories. An equal-weighted index of the survivors carries a t-statistic above eleven, which pure luck would need a trillion trials to fake. So leave the course with the rule, and with its temperament: demand t ≥ 3, robustness, out-of-sample evidence, and a story before you believe — and size every position so that being wrong is survivable. Most factors don\'t matter. A few really do.',
      footnote: 'End of MGT 595. The gauntlet is yours now.',
    },
  },
];
