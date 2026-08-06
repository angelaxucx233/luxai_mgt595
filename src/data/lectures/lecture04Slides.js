/**
 * Lecture 04 — The Value Premium (MGT 595, Quantitative Investing)
 * Built from lectures/lecture04_outline_refined.json
 */

export const lecture04Slides = [
  // ── Block A: LSV ──
  {
    slideId: 1, type: 'interactive', title: 'Cheap Beats Expensive — Everywhere You Sort',
    contextLabel: 'Block A · LSV (1994)', blockId: 'A', module: 'value-premium',
    visual: 'LsvLab', visualProps: { mode: 'doublesort' },
    narration: '[clear] Sort stocks on any cheapness measure crossed with past growth, and the cheap, unloved corner beats the expensive, exciting corner by around ten points a year. [curious] The fact is not in dispute. The entire lecture is about why.',
    systemPromptContext: 'BLOCK A — Value = high B/M, C/P, E/P (cheap vs fundamentals); glamour = low. LSV double sorts, REAL corner returns (annual, yrs 1 avg): C/P×GS glamour 11.3% vs value 21.5% (10.2 pts); E/P×GS 11.8 vs 22.4 (10.6); B/M×GS 13.2 vs 20.4 (7.2); E/P×B/M 11.6 vs 18.9 (7.3); B/M×C/P 11.1 vs 19.4 (8.3). Sorting on cheapness AND extrapolated past growth (GS) widens the gap because it isolates the stocks the market is most wrong about. FM Table IV: C/P t 3.7–4.6, GS t −2.1 to −2.8, independent power; B/M and size fade. The debate: LSV behavioral (extrapolation) / FF96 risk (distress factor) / DT97 characteristics. Sample: NYSE-AMEX 1968–90, EW buy-and-hold.',
    content: {
      eyebrow: 'Lakonishok, Shleifer & Vishny (1994)', heading: 'Cheap Beats Expensive',
      body: 'A value stock is cheap relative to fundamentals; a glamour stock is one the market pays up for. Cross any cheapness ratio with past sales growth and the double sort maximizes the spread: the cheap-and-boring corner beats the expensive-and-exciting corner by 7 to 10.6 points per year, depending on the sort. Every panel below carries LSV\'s published numbers.',
      footnote: 'Pick a sort; the circled corners are the trade.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'What the Market Is Paying For',
    contextLabel: 'Block A · Extrapolation', blockId: 'A', module: 'value-premium',
    visual: 'EventStudyLab', visualProps: { mode: 'dcf' },
    narration: '[thoughtful] A high price against fundamentals is a bet on growth — the Gordon machine makes the bet explicit. [serious] LSV then checked whether the growth arrives. By year three, it does not.',
    systemPromptContext: 'BLOCK A — LSV separate PAST growth (realized sales/earnings/CF growth; average-over-time FIRST then divide, so negative earnings don\'t blow up the rate; GS = sales-growth rank) from EXPECTED growth (Gordon P=D/(r−g): holding r, high P vs fundamentals ⟹ low C/P, E/P ⟹ high implied g; alternative: analyst forecasts, La Porta 1993). Table V verdict: glamour\'s priced-in growth advantage looks right for ~2 years then evaporates by years 3–5 — the persistence the market paid for never materializes: overreaction/extrapolation caught in the act. This is the mirror image of momentum (short-horizon underreaction). Why a low-B/M stock could be: intangibles, real growth, low risk, or overpriced glamour — the past/future split discriminates.',
    content: {
      eyebrow: 'The extrapolation machine', heading: 'What the Market Is Paying For',
      body: 'The Gordon model turns a price into a growth forecast: pay a high multiple and you are implicitly betting on high g forever. LSV\'s Table V runs the tape forward — glamour firms\' priced-in growth advantage holds for a year or two, then evaporates. Investors extrapolated a trend that mean-reverted, confused good companies with good investments, and paid for persistence that never came.',
      footnote: 'Same DCF machine as Lecture 3 — now read the r−g slider as an expectations dial.',
    },
  },
  {
    slideId: 3, type: 'interactive', title: 'Value Wins When It Counts',
    contextLabel: 'Block A · Not risk', blockId: 'A', module: 'value-premium',
    visual: 'LsvLab', visualProps: { mode: 'years' },
    narration: '[excited] Here is every year from sixty-eight to eighty-nine. [calm] Value beats glamour in at least seventeen of twenty-two — including the recessions and the down markets. A risk premium is supposed to hurt sometimes. This one barely does.',
    systemPromptContext: 'BLOCK A — Figure 2 real annual value−glamour bars 1968–89 (embedded in visual): positive ≥17/22 years and in EVERY 5-yr window; wins in NBER recessions (69,70,73,74,75,80,82) and equal-weighted-index-decline years (70,74,78,81,86). No higher betas/SDs; no underperformance in high-marginal-utility states — for risk, value must hurt with frequency in states that matter (ICAPM lens); APT door (unnamed factor) left open, FF96 walks through. Why the mistake survives: individuals can\'t shake the good-company=good-investment bias; institutions prefer defensible glamour; horizons too short for multi-year convergence. Data-mining defenses: international + pre-sample (Davis 1994) evidence. Selection biases (COMPUSTAT back-fill, delisting in distressed names) push AGAINST finding the premium.',
    content: {
      eyebrow: 'The risk test', heading: 'Value Wins When It Counts',
      body: 'For the premium to be compensation for risk, value has to underperform sometimes — and in the states that matter. LSV\'s year-by-year record says otherwise: value beat glamour in at least 17 of 22 years and in every five-year window, recessions included, with no higher betas or variance. Their verdict: a behavioral mistake, surviving because arbitraging it takes years the arbitrageurs don\'t have.',
      footnote: 'R = NBER recession · D = down year for the equal-weighted index.',
    },
  },
  {
    slideId: 4, type: 'problem', title: 'Your Turn: Read the Market\'s Growth Bet',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'value-premium',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 4,
      scenario: 'Both stocks are priced with r = 9% in the Gordon model P = D/(r−g). Value stock: P = $40, D = $2.00. Glamour stock: P = $60, D = $1.20.',
      question: 'What growth rate is the market implicitly forecasting for each stock?',
      given: [['r', '9%'], ['Value', 'P=$40, D=$2.00'], ['Glamour', 'P=$60, D=$1.20']],
      answers: [
        { label: 'Value implied g (%)', value: 4.0, tolerance: 0.1 },
        { label: 'Glamour implied g (%)', value: 7.0, tolerance: 0.1 },
      ],
      steps: [
        'Rearrange Gordon: g = r − D/P.',
        'Value: D/P = 2/40 = 5% ⟹ g = 9 − 5 = 4.0%.',
        'Glamour: D/P = 1.20/60 = 2% ⟹ g = 9 − 2 = 7.0%.',
        'The market is betting glamour out-grows value by 3 points forever. LSV\'s Table V: that advantage evaporates by year 3 — the bet is extrapolation, and it fails.',
      ],
    },
    narration: '[encouraging] Rearrange the Gordon formula and the price confesses its forecast.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: g = r − D/P; value 4.0%, glamour 7.0%. Common error: computing D/P and forgetting to subtract from r (answering 5 and 2). Extension if asked: at the 2020 value-spread extreme, the implied growth gap was 80–110% over five years — never realized in any historical data (slide 12).',
    content: { eyebrow: 'Your turn', heading: 'Read the Market\'s Growth Bet', problemTitle: 'Your Turn: Read the Market\'s Growth Bet', footnote: 'g = r − D/P. Prices are forecasts.' },
  },

  // ── Block B: FF96 ──
  {
    slideId: 5, type: 'interactive', title: 'The Scoreboard: What Three Factors Absorb',
    contextLabel: 'Block B · Fama–French (1996)', blockId: 'B', module: 'value-premium',
    visual: 'Ff96Scoreboard', visualProps: { mode: 'scoreboard' },
    narration: '[clear] Fama and French take every anomaly on the table — including LSV\'s own refined sorts — and run the three-factor test. [surprised] Almost everything passes. One row glows red.',
    systemPromptContext: 'BLOCK B — E[r]=rf+b·MKT+s·SMB+h·HML. FF96 GRS results (REAL p-values): B/M deciles reject only via tiny-alpha-high-R² technicality; E/P p=0.59 PASS; C/P p=0.90 PASS; 5-yr DeBondt–Thaler reversal p=0.56 PASS; LSV double sorts B/M p=0.28, E/P p=0.39, C/P p=0.41 PASS — the model passes its adversary\'s own test; alphas ≤9bp/mo. MOMENTUM t−12:t−2: GRS 4.45, p=0.000 REJECTED — losers load HIGH on s and h (small, distressed, value-like) so the model predicts HIGH returns for them; they earn LOW: sign flip, alpha grows when you adjust. Longer formation recovers: t−48:t−2 p=0.031, t−60:t−13 p=0.235. HML-as-distress: weak-earnings firms share common variation; value = fallen angels; the premium is a wage.',
    content: {
      eyebrow: 'Fama–French (1996)', heading: 'One Model for (Almost) Everything',
      body: 'Add SMB and HML to the market and the anomaly zoo lines up: E/P, cash-flow yield, sales growth, even the DeBondt–Thaler five-year reversal — and LSV\'s own refined double sorts — all produce near-zero alphas and GRS tests that fail to reject. The reading: the anomalies were one phenomenon wearing different costumes, and HML is its factor. The exception stares back from the bottom row: momentum, rejected at p = 0.000 with the wrong sign.',
      footnote: 'Click any row for the verdict and the mechanism.',
    },
  },
  {
    slideId: 6, type: 'explain', title: 'Risk Story, Fine Print Included',
    contextLabel: 'Block B · Interpretation', blockId: 'B', module: 'value-premium',
    visual: 'Ff96Scoreboard', visualProps: { mode: 'debate' },
    narration: '[thoughtful] The model works. Whether that makes value a risk premium is a different question. [calm] Fama and French argue yes — with honest fine print about what remains unproven.',
    systemPromptContext: 'BLOCK B — MMV interpretation: the factors are ≈multifactor-minimum-variance; ANY three spanning portfolios price identically (single-factor R² 0.79–0.92; spanned on each other 0.98–0.99; five specifications give identical avg |a|) — the SPACE matters, SMB/HML chosen for near-zero correlation. FF vs LSV rebuttals: (1) HML Sharpe unexceptional — H underperforms L about as often as small vs big or market vs bills: looks like risk, not a money pump; (2) timing — the premium persists ≥5 years but LSV\'s earnings mean-reversion happens sooner: the premium outlasts the supposed mistake. Concession: distress is NOT macro-correlated — convenient for the data, awkward for the risk label. Data mining: VW NYSE construction, Davis 1994 pre-1962, international evidence, and the unification itself (many independent flukes wouldn\'t line up under one model). Unfinished business: NAME the state variable and explain its special premium; Roll\'s proxy caveat persists.',
    content: {
      eyebrow: 'Is HML actually risk?', heading: 'Risk Story, Fine Print Included',
      body: 'In favor: HML captures real common variation — in fundamentals, not just prices — and any three spanning portfolios do the same pricing job, which is what a factor structure predicts. Against LSV: the HML Sharpe ratio is unexceptional, and the premium persists for five years while the earnings mean-reversion LSV lean on resolves sooner. The honest gaps: the distress state variable is still unnamed, and distress conveniently doesn\'t correlate with the macroeconomy. The model is a triumph; the label is still on trial.',
      footnote: 'FF\'s own concession: convenient for the data, awkward for the "risk" label.',
    },
  },
  {
    slideId: 7, type: 'problem', title: 'Your Turn: Compute a Fund\'s Alpha',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'value-premium',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 7,
      scenario: 'A value fund earned 11.2% excess return this year. Its loadings: b = 1.0, s = 0.3, h = 0.5. Premia: market 6%, SMB 2%, HML 4%.',
      question: 'What is the fund\'s three-factor alpha?',
      given: [['Excess return', '11.2%'], ['b, s, h', '1.0, 0.3, 0.5'], ['Premia', '6%, 2%, 4%']],
      answers: [{ label: 'Three-factor alpha (%)', value: 2.6, tolerance: 0.1 }],
      steps: [
        'Required = 1.0×6 + 0.3×2 + 0.5×4 = 6 + 0.6 + 2.0 = 8.6%.',
        'Alpha = 11.2 − 8.6 = 2.6%.',
        'Under the CAPM (market only) the "alpha" would be 11.2 − 6 = 5.2% — the three factors reclassify half of the apparent skill as value and size exposure. This is exactly why factor models changed performance evaluation.',
      ],
    },
    narration: '[calm] Alpha is what remains after every loading has been paid its premium.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: required 8.6%, alpha 2.6%; CAPM alpha would be 5.2%. Common error: subtracting factor RETURNS not loading-weighted premia. Discussion: if HML is risk, the 2.6% is skill; if HML is mispricing (LSV), the fund is partly harvesting others\' mistakes — same number, two philosophies.',
    content: { eyebrow: 'Your turn', heading: 'Compute a Fund\'s Alpha', problemTitle: 'Your Turn: Compute a Fund\'s Alpha', footnote: 'α = excess − (b·MKT + s·SMB + h·HML).' },
  },

  // ── Block C: Daniel–Titman ──
  {
    slideId: 8, type: 'explain', title: 'What Are You Actually Paid For?',
    contextLabel: 'Block C · Daniel–Titman (1997)', blockId: 'C', module: 'value-premium',
    visual: 'CharCovLab', visualProps: { mode: 'models' },
    narration: '[curious] Covariances are how you co-move. Characteristics are what you are. [serious] Daniel and Titman noticed the whole risk story rests on the first — and designed a test to pry them apart.',
    systemPromptContext: 'BLOCK C — The question: is the premium paid for COVARIANCES (loading on a distress factor — the FF prediction) or CHARACTERISTICS (being small/high-B/M, full stop)? Note whose theory is on trial: DT test the RISK story; LSV\'s behavioral story says nothing about covariances. Three models: (1) distress factor with constant premium λD, B/M proxies the loading θ; (2) time-varying premia, no distress factor — distressed firms load on factors with negative realizations; (3) characteristics price directly E[r]=a+b1·θ — implies ASYMPTOTIC ARBITRAGE (same risk, different characteristic, different return). Test 1 (pre/post-formation SDs): covariation barely changes as firms become high/low B/M — comovement PREDATES distress (industry/region), killing model 1. Key DT claim: high-B/M stocks were already correlated before becoming distressed.',
    content: {
      eyebrow: 'Daniel & Titman (1997)', heading: 'What Are You Actually Paid For?',
      body: 'The risk story makes a specific prediction: returns should track factor loadings — how a stock co-moves with distress. The rival: returns track characteristics — what a stock is — with no role for the covariance at all, which would imply a near-arbitrage. DT\'s first test already wounds the factor story: firms\' comovement barely changes as they slide into or out of the value bucket. The correlation was always there, sourced in industry and region, not switched on by distress.',
      footnote: 'Three formal models; two tests; one uncomfortable answer.',
    },
  },
  {
    slideId: 9, type: 'interactive', title: 'Hold the Characteristic, Vary the Loading',
    contextLabel: 'Block C · The test', blockId: 'C', module: 'value-premium',
    visual: 'CharCovLab', visualProps: { mode: 'test' },
    narration: '[clear] Fix what the stock is; move only how it co-varies. [surprised] If risk is priced, returns should climb with the loading. They come out flat.',
    systemPromptContext: 'BLOCK C — Test 2: sort on characteristics (size, B/M) FIRST, then within groups on pre-formation HML loading (est. t−42..t−7, portfolios to tame EIV; pre-formation loadings do rank post-formation ones). Risk model: returns rise with loading inside a characteristic group. DT Table III average row across loading quintiles (REAL): 0.740, 0.817, 0.846, 0.866, 0.806 %/mo — FLAT. Characteristics win (1973–93). Caveats: characteristic may proxy an unknown TRUE factor measured better than the HML loading; betas estimated with error vs characteristics error-free (mechanical win); time-varying loadings. Replies: Davis–Fama–French 2000 — extend to 1927–97, result DISAPPEARS; Berk 2001 — dependent sorts bias toward the characteristic model, use independent sorts; DT reply (\'Sorting Out Sorting Out Sorts\') — dependence is the only way to hold the characteristic fixed. Stakes: benchmarking, cost of capital, event-study counterfactuals.',
    content: {
      eyebrow: 'The clever sort', heading: 'Hold the Characteristic, Vary the Loading',
      body: 'Within groups of stocks that are the same on paper — same size, same book-to-market — DT sort again on the HML loading. If covariance is what\'s priced, returns should rise across those loading quintiles. The published average row: 0.740, 0.817, 0.846, 0.866, 0.806. Flat. Then the counterattack: Davis–Fama–French stretch the sample to 1927 and the result dissolves; Berk argues the dependent sort was rigged; DT reply that dependence was the entire point. The methodology became the battleground.',
      footnote: 'Toggle what the risk model predicts against what the data delivered.',
    },
  },
  {
    slideId: 10, type: 'problem', title: 'Your Turn: What Should Risk Have Delivered?',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'value-premium',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 10,
      scenario: 'Suppose HML carries a 0.40%/month premium, and within a characteristic group the loading quintiles run h = 0.0, 0.5, 1.0, 1.5, 2.0. DT\'s observed average returns at the extreme quintiles: 0.740 and 0.806 %/month.',
      question: 'What Q5−Q1 return spread does the risk model predict — and what did DT observe?',
      given: [['λ_HML', '0.40%/mo'], ['h range', '0.0 → 2.0'], ['Observed extremes', '0.740, 0.806']],
      answers: [
        { label: 'Predicted spread (%/mo)', value: 0.8, tolerance: 0.02 },
        { label: 'Observed spread (%/mo)', value: 0.066, tolerance: 0.012 },
      ],
      steps: [
        'Risk model: E[r] rises by Δh × λ = (2.0−0.0) × 0.40 = 0.80%/month across the quintiles.',
        'Observed: 0.806 − 0.740 = 0.066%/month.',
        'The data delivered one-twelfth of the risk-model prediction. In this sample, being value paid; co-moving like value did not.',
      ],
    },
    narration: '[serious] The gap between prediction and observation is the whole paper. [calm] Two subtractions and you have it.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: predicted 0.80; observed 0.066. Common error: averaging instead of differencing the extremes. Follow-up: over 1927–97 (DFF 2000) the loading spread reappears — sample matters, and the profession still hasn\'t settled it.',
    content: { eyebrow: 'Your turn', heading: 'What Should Risk Have Delivered?', problemTitle: 'Your Turn: What Should Risk Have Delivered?', footnote: 'Predicted = Δh × λ_HML; observed = Q5 − Q1.' },
  },

  // ── Block D: The drawdown ──
  {
    slideId: 11, type: 'interactive', title: 'The Arithmetic of Patience',
    contextLabel: 'Block D · Value 1990–today', blockId: 'D', module: 'value-premium',
    visual: 'ValueDrawdownLab', visualProps: { mode: 'patience' },
    narration: '[serious] From twenty-seventeen to twenty-twenty, value had its worst run in a century — roughly minus fifty percent on every measure. [thoughtful] Before declaring it dead, do the arithmetic: a Sharpe of point-four loses to cash a third of all years.',
    systemPromptContext: 'BLOCK D — 2017–20: deepest/longest value drawdown in ~100 yrs (records to 1825): HML ≈−50%, Russell V−G −55%, MSCI −54%, AQR −50% (Asness et al. 2020, hypothetical backtests). Patience math: P(underperform cash over h years) = Φ(−SR·√h). SR=0.4 (≈the US market\'s own): 1yr Φ(−0.4)=34.5%; 10yr Φ(−1.265)=10.3% — the deck\'s \'34% of years, 10% of decades\'. A multi-year drawdown is statistically ORDINARY for a good premium. Value still positive across US/Japan/Europe/EM equities, bonds, currencies. The real question: structural break or deep draw? Socratic ready: SR for 5%-decade = 1.645/√10 ≈ 0.52.',
    content: {
      eyebrow: 'The great drawdown', heading: 'The Arithmetic of Patience',
      body: 'Every standard value measure fell roughly in half between 2017 and 2020 — the worst run in about a century of records. But run the numbers before the funeral: a premium with a 0.4 Sharpe ratio underperforms cash in about 34% of years and 10% of decades, purely by chance. Long droughts aren\'t evidence a premium is dead; they\'re a property of every premium worth having. The question is whether this one was ordinary — which is testable.',
      footnote: 'P(lose to cash) = Φ(−SR·√h). Drag both dials.',
    },
  },
  {
    slideId: 12, type: 'interactive', title: 'The Suspects — and the Spread',
    contextLabel: 'Block D · What broke value?', blockId: 'D', module: 'value-premium',
    visual: 'ValueDrawdownLab', visualProps: { mode: 'spread' },
    narration: '[curious] AQR put every popular story on trial — FANGs, intangibles, rates, fundamentals. [excited] One by one they fail, and what remains is a re-pricing: by twenty-twenty, cheap had never been this cheap relative to expensive.',
    systemPromptContext: 'BLOCK D — Suspect elimination (AQR): NOT FANGs (drop largest 10%/tech-media-telecom/most-expensive decile — spread barely moves, both near 90th pct); NOT intangibles (drop high-intangible names — still historically wide); NOT deserved cheapness (profitability/ROA/margin/5yr-growth gaps within normal range); NOT recessions/crashes (little sensitivity to NBER or 10 worst drawdowns); rates: correlation rose 0.08→0.41 but explain only 15–30% (Maloney–Moskowitz 2020). VALUE SPREAD = expensive basket\'s multiple / cheap basket\'s: by 2020 ≈99th percentile, BEYOND the 2000 tech-bubble peak. Implied bet: expensive must out-grow cheap 80–110% over 5 yrs — larger than ANY realized differential. A widening spread IS the drawdown; a wide spread is the recovery setup (post-2000: +75–108%, ≈+93%); recovery began ≈Nov 2020; 2023–24 spreads still 80th–90th pct. LSV extrapolation, live; last analog 1999–2000.',
    content: {
      eyebrow: 'Trial by data', heading: 'The Suspects — and the Spread',
      body: 'Every "value is dead" story is a testable claim, so AQR tested them: remove the mega-caps and the spread barely moves; remove intangible-heavy names, still wide; the fundamentals gap between cheap and expensive stayed normal; rates explain at most 15–30%. What survives is re-pricing: the value spread — what you pay for glamour versus value — blew past its tech-bubble record to the 99th percentile, implying a growth gap no cohort of expensive firms has ever delivered. LSV\'s extrapolation error, on the largest possible stage.',
      footnote: 'Widening spread = the drawdown. Wide spread = the setup.',
    },
  },
  {
    slideId: 13, type: 'problem', title: 'Your Turn: How Ordinary Was the Drought?',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'value-premium',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 13,
      scenario: 'A premium has an annual Sharpe ratio of 0.4. Assume normal returns, so the probability of underperforming cash over h years is Φ(−SR·√h). Useful values: Φ(−0.40) = 0.345, Φ(−1.26) ≈ 0.103.',
      question: 'Find the probability of losing to cash over one year, and over a decade.',
      given: [['SR', '0.4'], ['Formula', 'Φ(−SR·√h)'], ['Φ(−0.40)', '0.345'], ['Φ(−1.26)', '≈0.103']],
      answers: [
        { label: 'P(lose to cash, 1 yr) (%)', value: 34.5, tolerance: 0.5 },
        { label: 'P(lose to cash, 10 yr) (%)', value: 10.3, tolerance: 0.5 },
      ],
      steps: [
        '1 year: Φ(−0.4×1) = Φ(−0.40) = 34.5%.',
        '10 years: SR·√10 = 0.4×3.162 = 1.265 ⟹ Φ(−1.26) ≈ 10.3%.',
        'One decade in ten, a perfectly healthy 0.4-Sharpe premium loses to cash. The 2017–20 value drought was extreme — but "extreme" and "dead" are different claims.',
      ],
    },
    narration: '[calm] The Sharpe ratio times the square root of the horizon — that one product is the whole psychology of factor investing.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: 34.5% and 10.3% (deck rounds to 34%/10%). Common error: forgetting √h (getting Φ(−4)≈0 for 10yr). Extension: solve Φ(−SR√10)=0.05 ⟹ SR=1.645/3.162≈0.52 — even a market-beating Sharpe has 1-in-20 lost decades.',
    content: { eyebrow: 'Your turn', heading: 'How Ordinary Was the Drought?', problemTitle: 'Your Turn: How Ordinary Was the Drought?', footnote: 'Time diversification is real — and slow.' },
  },
  {
    slideId: 14, type: 'explain', title: 'Same Trade, Two Stories',
    contextLabel: 'Block D · Takeaways', blockId: 'D', module: 'value-premium',
    visual: 'ValueDrawdownLab', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] Dimensional sells value as risk you are paid to bear. LSV Asset Management sells it as a mistake you exploit. [clear] Their portfolios are ninety-eight percent correlated. The story is not about the stocks — it is about whether the client survives the bottom.',
    systemPromptContext: 'BLOCK D — The live test under-determines the why: re-pricing character + spread predictability + 1999 echo lean BEHAVIORAL; but a genuine premium CAN go negative a decade and the spread could be a time-varying PRICE of risk (FF-compatible). Commercial twin: DFA (FF risk pitch: stay disciplined, you\'re paid to bear what others won\'t) vs LSV Asset Management (behavioral pitch: we exploit extrapolation; edge lasts while the behavior does) — strategies ≈0.98 correlated: same stocks, opposite explanations. Investor synthesis: premia have stretches that feel like failure; the SPREAD (not recent returns) is the forward signal; size to SURVIVE the drawdown, lean in when the spread is wide. Course thread: momentum next — the anomaly that troubles everyone.',
    content: {
      eyebrow: 'Where the debate stands', heading: 'Same Trade, Two Stories',
      body: 'Thirty years on, the fact is undisputed and the cause is not: LSV read the drawdown as a fattening mistake that corrected; FF can read it as a risk premium having one of its statistically ordinary bad decades. The commercial world split the same way — DFA sells the risk story, LSV Asset Management the behavioral one — and runs portfolios that are 0.98 correlated. What the story determines isn\'t the trade; it\'s whether the investor is still holding it in November 2020 when the recovery begins. Size to survive; watch the spread.',
      footnote: 'Next lecture: momentum — the anomaly neither camp can explain.',
    },
  },
];
