/**
 * Lecture 09 — Carry (MGT 595, Quantitative Investing)
 * Built from lectures/lecture09_outline_refined.json
 */

export const lecture09Slides = [
  // ── Block A: what carry is ──
  {
    slideId: 1, type: 'explain', title: 'The Return If Nothing Happens',
    contextLabel: 'Block A · The concept', blockId: 'A', module: 'carry',
    visual: 'CarryLab', visualProps: { mode: 'concept' },
    narration: '[clear] Every asset\u2019s return splits into three pieces: what you earn if the world stands still, the price change you expected, and the surprise. [curious] The first piece has a name — carry — and it is the only one you can read off a screen today.',
    systemPromptContext: 'BLOCK A — Koijen–Moskowitz–Pedersen \u201cCarry\u201d: CARRY = \u201cthe return you earn if market conditions stay constant.\u201d Decomposition: return = carry + E(price appreciation) [together = expected return] + unexpected price shock. Carry is DIRECTLY OBSERVABLE ex ante — no estimation, no model; expected price appreciation requires a model; the shock is noise. Futures definition: fully-collateralized futures excess return r(t+1) = (S(t+1) − F_t)/F_t; if prices stay constant (S(t+1) = S_t), the return is C_t = (S_t − F_t)/F_t — carry is how far the futures price sits BELOW spot, earned by convergence as the contract rolls up the curve. Historical note: the concept was almost exclusively a CURRENCY notion (carry = interest differential; UIP says E[z]=0; carry trades earn it anyway with crashes — Block B); KMP generalize it to EVERY asset class (Block C). The research questions: does a generalized UIP/expectations-hypothesis hold (carry shouldn\\u2019t predict returns)? Do expected returns vary over time and across assets? Can they be estimated EX ANTE? Answering with carry turns most finance models into testable statements, since \u201cmost finance models have direct implications for carry strategies.\u201d',
    content: {
      eyebrow: 'Koijen, Moskowitz, Pedersen & Vrugt', heading: 'The Return If Nothing Happens',
      body: 'Freeze the world — every price, every rate, every curve exactly where it sits — and most assets still pay you something: the bond rolls down its yield curve, the high-yielding currency accrues its interest differential, the futures contract converges toward spot. That frozen-world return is carry, and unlike expected returns, it requires no model and no history: it is printed on today\'s screen. The generalized expectations hypothesis says carry should predict nothing — any visible carry should be offset by expected depreciation. Whether that\'s true, in every asset class at once, is this lecture\'s question.',
      footnote: 'return = carry + E(Δprice) + surprise. Only the first term is observable.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'Carry, Translated Into Five Languages',
    contextLabel: 'Block A · Every asset class', blockId: 'A', module: 'carry',
    visual: 'CarryLab', visualProps: { mode: 'classes' },
    narration: '[curious] In currencies, carry is the interest differential. In stocks, it is the dividend yield above cash. In commodities, the convenience yield. In bonds, the slope plus the roll-down. [clear] One definition — (S minus F) over F — generates all of them.',
    systemPromptContext: 'BLOCK A — Per-class carry (all from the single futures formula C = (S−F)/F): CURRENCIES: F = S(1+rf)/(1+rf*) ⟹ C ∝ rf* − rf — the interest-rate differential, as always. EQUITIES: F = S(1+rf) − E(D) ⟹ C = E(D)/S − rf — expected dividend yield minus local risk-free; Gordon connection: S = D/(E(R)−g) ⟹ E(R) − rf = D/S − rf + g = carry + growth: carry is the model-free piece of the equity premium (L1 callback). COMMODITIES: F = S(1+rf−δ) ⟹ C = δ − rf, convenience yield minus risk-free — backwardated markets (F below S) have positive carry. FIXED INCOME: T-year bond, S = P^{T−1}, F = (1+rf)P^T ⟹ C ≈ (y_T − rf) [SLOPE] − D_mod(y_{T−1} − y_T) [ROLL DOWN]: you earn the curve\\u2019s slope plus the price gain from rolling into a lower yield (on an upward-sloping curve, both positive). Slope trades: carry of a long-maturity minus short-maturity position. TREASURIES/CREDIT: duration-adjust C/D so maturities are comparable. OPTIONS: C ≈ [−θ + ν(σ_{T−1} − σ_T)]/F — theta decay plus vol-curve roll-down. Lux: the unifying trick is always the same — ask what the FORWARD price implies must happen for you to break even; carry is what you collect when it doesn\\u2019t.',
    content: {
      eyebrow: 'One formula, every market', heading: 'Carry, Translated Into Five Languages',
      body: 'Apply C = (S − F)/F mechanically and each asset class hands you its own dialect of carry. Currencies: the interest differential — the classic. Equities: expected dividend yield minus the risk-free rate, which the Gordon model reveals as the observable half of the equity premium. Commodities: the convenience yield in excess of cash — positive whenever the futures curve is in backwardation. Bonds: the curve\'s slope plus the roll-down gain from aging into lower yields, the two components every fixed-income desk quotes. Even options carry: theta plus the roll down the volatility curve. Five markets, five formulas, one idea: what the forward price pays you for standing still.',
      footnote: 'Click a class for its derivation and its intuition.',
    },
  },
  {
    slideId: 3, type: 'problem', title: 'Your Turn: Read Two Carries Off the Screen',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'carry',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 3,
      scenario: 'A commodity trades at spot S = 100 with a one-month futures price F = 98. Separately, a 10-year bond yields 4.0%, cash is 2.0%, modified duration is 7, and the 9-year yield sits 0.10% below the 10-year (y₉ − y₁₀ = −0.10%).',
      question: 'Compute the futures carry and the bond\'s annual carry (slope + roll-down).',
      given: [['S', '100'], ['F', '98'], ['y₁₀', '4.0%'], ['r_f', '2.0%'], ['D_mod', '7'], ['y₉ − y₁₀', '−0.10%']],
      answers: [
        { label: 'Futures carry (%)', value: 2.04, tolerance: 0.02 },
        { label: 'Bond carry (%/yr)', value: 2.7, tolerance: 0.03 },
      ],
      steps: [
        'Futures: C = (S − F)/F = (100 − 98)/98 = 2.04% — the market is backwardated; convergence pays you if spot stands still.',
        'Bond slope: y₁₀ − r_f = 4.0 − 2.0 = 2.0%.',
        'Roll-down: −D×(y₉ − y₁₀) = −7 × (−0.10%) = +0.70% — a year from now your bond is a 9-year priced at a lower yield.',
        'Bond carry = 2.0 + 0.7 = 2.7%/yr. Neither number required a forecast: both are printed on today\'s curve.',
      ],
    },
    narration: '[encouraging] No model, no regression, no history — just today\u2019s prices and one subtraction each.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: (100−98)/98 = 2.041%; slope 2.0 + rolldown −7×(−0.1) = 0.7 ⟹ 2.7%. Common errors: dividing by S instead of F (2.00% — inside tolerance? 2.00 vs 2.04 tol 0.02 ⟹ rejected, good); sign error on roll-down (2.0−0.7 = 1.3, rejected). Extension: what makes bond carry negative? Inverted curve (slope < 0) or a curve steep enough ABOVE your maturity that rolling hurts.',
    content: { eyebrow: 'Your turn', heading: 'Read Two Carries Off the Screen', problemTitle: 'Your Turn: Read Two Carries Off the Screen', footnote: 'C = (S−F)/F · bond carry = slope − D·Δy.' },
  },

  // ── Block B: currency carry and crashes ──
  {
    slideId: 4, type: 'interactive', title: 'Up the Stairs, Down the Elevator',
    contextLabel: 'Block B · Currency carry', blockId: 'B', module: 'carry',
    visual: 'FxCrashLab', visualProps: { mode: 'carry' },
    narration: '[clear] Borrow yen at zero-point-eight-seven, invest in Aussie at seven-point-oh-nine, hope. [serious] The cross-section says the hope is specific: high-carry currencies earn more — and crash harder. The skewness lines up like a ruler.',
    systemPromptContext: 'BLOCK B — Brunnermeier–Nagel–Pedersen: the carry trade (Nov 8, 2007 example): borrow at 0.87% 3m JPY LIBOR (funding currency), invest at 7.09% 3m AUD LIBOR (investment currency), hope JPY doesn\\u2019t appreciate. UIP says the differential should be offset by expected depreciation (E[z]=0 where z = (i*−i) − Δs); it isn\\u2019t — the forward premium puzzle. But the returns are NOT symmetric: \u201cup by the stairs and down by the elevator\u201d — e.g., Oct 7–8 1998, the yen moved massively with NO news. REAL cross-sectional stats (1986–2006, 8 currencies vs USD): interest differential i*−i: NZD .009, AUD .006, NOK .005, GBP .005, CAD .002, EUR −.001, CHF −.004, JPY −.007. Mean z (carry return): NZD .013, AUD .009, GBP .009 ... JPY −.004 — increasing in carry. SKEWNESS: AUD −0.322, NZD −0.297, CAD −0.143, GBP −0.094, NOK −0.019, EUR +0.131, CHF +0.144, JPY +0.318 — DECREASING in carry (investment currencies crash down, funding currencies crash UP). RISK REVERSALS (option-implied crash-insurance price, 1998–2006): JPY +1.059, CHF +0.409, NOK +0.350, EUR +0.329, GBP +0.009, CAD −0.099, AUD −0.426, NZD −0.467 — the OPTIONS MARKET prices exactly the same ranking. Speculator futures positions INCREASE in carry: JPY −0.097, CHF −0.067, EUR +0.031, GBP +0.052, CAD +0.059 — speculators are long the investment currencies, short the funders. Kernel densities: high-carry group right-shifted with a FAT LEFT TAIL.',
    content: {
      eyebrow: 'Brunnermeier, Nagel & Pedersen', heading: 'Up the Stairs, Down the Elevator',
      body: 'The classic trade — borrow yen at 0.87%, deposit Aussie at 7.09% — violates interest parity profitably on average, and the cross-section shows precisely how the average lies. Line up eight currencies by their interest differential: mean carry returns rise with carry (New Zealand and Australia at the top), while return skewness falls with it — the high-carry currencies deliver small steady gains punctuated by violent losses, and the funding currencies mirror-image them with crashes upward. The options market knows: risk reversals, the price of crash insurance, rank the currencies in exactly the same order, with yen crash-protection the most expensive in the set. And CFTC positions confirm who is standing where when the elevator drops: speculators long carry, nearly in proportion to the differential.',
      footnote: 'Three real cross-sections, one ruler-straight pattern.',
    },
  },
  {
    slideId: 5, type: 'problem', title: 'Your Turn: The Trade and Its Hostage',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'carry',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 5,
      scenario: 'The Nov 2007 yen–Aussie trade: borrow at 0.87% (3m JPY LIBOR, annualized), invest at 7.09% (3m AUD LIBOR). Suppose over the year the yen appreciates 2% against the Aussie.',
      question: 'What is the carry, and the net return after the currency move?',
      given: [['JPY LIBOR', '0.87%'], ['AUD LIBOR', '7.09%'], ['JPY appreciation', '2%']],
      answers: [
        { label: 'Carry (%/yr)', value: 6.22, tolerance: 0.02 },
        { label: 'Net return (%)', value: 4.22, tolerance: 0.05 },
      ],
      steps: [
        'Carry = 7.09 − 0.87 = 6.22% per year — collected if exchange rates stand still.',
        'A 2% appreciation of the funding currency costs exactly 2 points: net = 6.22 − 2.00 = 4.22%.',
        'Now the asymmetry: the carry accrues at 0.5% per month — the stairs. The currency move can take back a year\'s accrual in a day — the elevator. UIP claims the expected move exactly eats the 6.22; the data say it doesn\'t, but the crashes are the price of collecting the difference.',
      ],
    },
    narration: '[calm] Six-twenty-two a year, drip by drip — held hostage to a currency that can move that much before lunch.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: 7.09−0.87 = 6.22; 6.22−2 = 4.22. Common error: adding the appreciation (8.22 — direction confusion: funding-currency appreciation HURTS). Extension: what JPY move wipes the year? 6.22%. In Oct 1998 the yen moved ~7% in two days with no news. Leverage multiplies both sides: at 5× the carry is 31%/yr and a 20% yen move is ruin — connect to funding constraints in s7.',
    content: { eyebrow: 'Your turn', heading: 'The Trade and Its Hostage', problemTitle: 'Your Turn: The Trade and Its Hostage', footnote: 'Net = (i* − i) − Δs. The Δs has fat tails.' },
  },
  {
    slideId: 6, type: 'interactive', title: 'Carry Predicts Its Own Crash',
    contextLabel: 'Block B · Prediction', blockId: 'B', module: 'carry',
    visual: 'FxCrashLab', visualProps: { mode: 'predict' },
    narration: '[thoughtful] Regress the future on today\u2019s interest differential and three forecasts fall out: returns — positive. Speculator positions — positive. Skewness — deeply negative, and it stays negative for two years. [serious] The differential forecasts the profit and the crash risk at once.',
    systemPromptContext: 'BLOCK B — REAL predictive panel regressions (Table 2, quarterly 1986–2006, country fixed effects, coefficient on i*−i, SEs in parens): predicting excess return z at t+1: 2.17 (0.78); t+2: 2.24 (0.70); t+3: 1.87; t+4: 1.50; t+5: 1.11; t+6: 0.76; t+7: 0.68; t+8: 0.44; t+9: 0.27; t+10: −0.04 — carry predicts POSITIVE returns (UIP violated) fading over ~2 years. Predicting speculator FUTURES positions: t+1: 8.26 (5.06); t+2: 8.06; t+3: 5.96; t+4: 6.41; t+5: 5.87; t+6: 4.72; fading to −0.96 at t+10 — carry attracts speculative capital. Predicting SKEWNESS of daily returns within quarter t+τ: t+1: −23.92 (3.87); t+2: −23.20; t+3: −23.65; t+4: −23.28; t+5: −23.49; t+6: −22.24; t+7: −21.23; t+8: −16.96; t+9: −12.90; t+10: −11.14 — carry predicts persistent NEGATIVE skewness: conditional crash risk, out two-plus years. VAR(3) impulse responses (i*−i, z, Skew, Futures; Cholesky; bootstrap CIs): a carry shock raises cumulated excess returns ABOVE the UIP-implied line, raises futures positions (peak ~2 quarters), and pushes skewness sharply negative before mean-reverting. The joint pattern: profit, positioning, and fragility all load on the same observable.',
    content: {
      eyebrow: 'Predictive regressions, 1986–2006', heading: 'Carry Predicts Its Own Crash',
      body: 'Put today\'s interest differential on the right-hand side and run it against three futures. Excess returns: coefficient +2.17 next quarter, fading to zero over two years — the forward premium puzzle, quantified. Speculator positions: +8.26 — capital chases the differential. And skewness: −23.9 next quarter, still −21 seven quarters out — the same differential that forecasts the profit forecasts a persistently crash-prone return distribution. The VAR paints it as a movie: a carry shock lifts returns above the parity line, pulls speculators in, and bends the distribution\'s left tail down, all at once. The trade and its fragility are the same phenomenon.',
      footnote: 'Click each horizon; the three panels share one x-axis: today\u2019s carry.',
    },
  },
  {
    slideId: 7, type: 'interactive', title: 'When VIX Spikes, the Trade Unwinds',
    contextLabel: 'Block B · The unwind', blockId: 'B', module: 'carry',
    visual: 'FxCrashLab', visualProps: { mode: 'unwind' },
    narration: '[serious] A volatility spike hits carry three ways at once: positions shrink, returns bleed, and insurance gets more expensive. [surprised] Strangest of all — after a crash, the risk falls but the price of protection rises. Earthquake pricing.',
    systemPromptContext: 'BLOCK B — REAL unwind and insurance-pricing results: Table 4 (weekly panels): ΔVIX × sign(i*−i): ΔFutures_t −1.47 (0.77), ΔFutures_{t+1} −1.29 (0.57) — vol spikes shrink carry positions, contemporaneously AND next week; ΔRiskRev_t −5.33 (2.64) — insurance on carry gets pricier; z_t −0.43 (0.11) — carry loses money in the spike. TED versions: ΔTED z_{t+1} −0.57 (0.31), ΔRiskRev_{t+1} −25.05 — funding-cost spikes ditto. Table 3 (price of crash risk, 1998–2006): Skewness_{t+1} on z_t: −3.34 (0.60) — after LOSSES, future skewness is HIGHER (less negative): the crash already happened, risk is lower; but RiskRev_t on z_t: +7.87 (1.39) — after losses the PRICE of crash insurance RISES. \u201cThe price of insurance goes up after an earthquake, although the risk of another earthquake is low\u201d — the signature of SLOW-MOVING CAPITAL: insurance sellers are the same constrained speculators who just lost money. CO-MOVEMENT (Table 5): pairwise FX correlation on |i1−i2|: −10.89 (3.81); −16.39 with time FE; −13.41 with pair FE — similar-carry currencies co-move: funding currencies together, investment currencies together. Carry trading CREATES a common factor and its own systemic risk: crowded positions + funding constraints = correlated unwinds (Brunnermeier–Pedersen liquidity spirals; L10 preview; L6 BAB same mechanism).',
    content: {
      eyebrow: 'VIX, TED, and earthquake insurance', heading: 'When VIX Spikes, the Trade Unwinds',
      body: 'Interact volatility shocks with the sign of the carry and the machinery becomes visible: when VIX jumps, speculator carry positions shrink this week and next, carry returns bleed (−0.43 per VIX point), and risk reversals — crash-insurance prices — jump. TED-spread shocks do the same, tying it to funding. Then the strangest fact in the paper: after carry losses, future skewness improves (the crash happened; the risk is spent), yet the price of insurance rises — earthquake pricing, possible only when the natural insurance sellers are the same leveraged speculators nursing losses. And the co-movement result closes the loop: currencies with similar carry move together, meaning the trade itself has manufactured a common factor — and a mechanism for correlated collapse.',
      footnote: 'Slow-moving capital: risk down, premium up. Remember it for Lecture 10.',
    },
  },
  {
    slideId: 8, type: 'explain', title: 'Why the Puzzle Survives',
    contextLabel: 'Block B · Verdict', blockId: 'B', module: 'carry',
    visual: 'FxCrashLab', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] Speculators could arbitrage interest parity into oblivion — and they try. [clear] But the correction requires leverage, leverage requires funding, and funding evaporates precisely when the trade crashes. The puzzle is protected by its own police force.',
    systemPromptContext: 'BLOCK B — Synthesis: speculators trading carry PARTLY correct UIP (that\\u2019s why carry earns money), but only partly, because they face crash risk generated by their OWN funding-liquidity constraints: losses → margin calls → forced unwinds → prices move further against them (the elevator) → more unwinds. The crash risk is ENDOGENOUS — created by the crowd of arbitrageurs, timed by VIX/TED, visible in advance in risk reversals and predicted skewness. This LIMITS arbitrage and sustains the forward premium puzzle in equilibrium: the anomaly persists because correcting it fully is too dangerous for constrained capital. Course links: same funding-constraint mechanism as BAB (L6 — constrained investors, ψ) and the same limits-to-arbitrage logic as L3/L8-sports (the vig) — here the \u201cvig\u201d is the risk of being forced out at the bottom. Alternative stories the deck lists: rare disasters (Farhi–Gabaix), consumption risk (Lustig–Verdelhan), transaction costs (Burnside) — BNP\\u2019s contribution is showing the crash risk is FORECAST by carry and TIMED by funding, which pure exogenous-disaster stories don\\u2019t predict. Open question for Block C: is currency carry\\u2019s negative skew intrinsic to carry, or a currency-specific artifact? (KMP\\u2019s answer: diversified global carry has skew −0.02.)',
    content: {
      eyebrow: 'Limits to arbitrage, again', heading: 'Why the Puzzle Survives',
      body: 'The forward premium puzzle persists for the most self-referential reason in finance: the people best positioned to arbitrage it away create the risk that stops them. Correcting UIP requires levered carry positions; levered positions require funding; and funding evaporates exactly when volatility spikes and the trade crashes — forced unwinds deepening the very crash that forced them. The crash risk is endogenous, forecastable from the carry itself, timed by VIX and TED, and priced in advance by the options market. It is Betting Against Beta\'s funding story and the sports book\'s vig wearing a third costume: a real, documented mispricing, defended by the cost of correcting it.',
      footnote: 'Next: is the crash intrinsic to carry — or just to currencies?',
    },
  },

  // ── Block C: carry everywhere ──
  {
    slideId: 9, type: 'interactive', title: 'Carry Works in Everything',
    contextLabel: 'Block C · Global carry', blockId: 'C', module: 'carry',
    visual: 'GlobalCarryLab', visualProps: { mode: 'returns' },
    narration: '[excited] Rank every asset class by its own carry and go long-short: equities, Sharpe zero-point-eight-eight. Puts, one-point-eight. [clear] Stack all nine and the global carry factor runs at one-point-one — with skewness of minus zero-point-zero-two. The crash was a currency story.',
    systemPromptContext: 'BLOCK C — REAL global carry returns (KMP table; carry strategy vs EW long benchmark, annualized): Global equities: carry mean 9.14, vol 10.42, SR 0.88 (EW SR 0.32); Fixed income 10Y global: SR 0.52 (EW 0.74 — the one class where passive long wins); FI slope 10Y−2Y: SR 0.66; US Treasuries: SR 0.68; Commodities: mean 11.22, vol 18.78, SR 0.60 (EW 0.08!); Currencies: 5.29/7.80, SR 0.68 (EW 0.36), skew −0.68; Credit: SR 0.47; Options calls: SR 0.37 (EW −0.23); Options puts: mean 179, vol 99 (%/mo units), SR 1.80 (EW −1.01). GLOBAL CARRY FACTOR (equal-risk across all classes): mean 6.75, stdev 6.12, SKEWNESS −0.02, kurtosis 5.24, SHARPE 1.10 (EW of everything: 0.47). Currency carry skew −0.68 vs GCF −0.02: the CRASH RISK DIVERSIFIES AWAY — crashes are asset-class-specific (currency carry crashes when FX vol spikes; equity carry doesn\\u2019t crash then). Cumulative plot: GCF strong and steady, dwarfing currency carry. Regression coefficients ≶ 1 by class but positive everywhere: generalized UIP/EH strongly rejected in favor of time-varying risk premia. Lux: emphasize what SR 1.10 with skew −0.02 means vs the L7 gauntlet — but also that this is gross of costs (L10).',
    content: {
      eyebrow: 'Nine asset classes, one signal', heading: 'Carry Works in Everything',
      body: 'Rank assets by carry within each class, go long the high-carry and short the low-carry, and the expectations hypothesis fails everywhere: equities 0.88 Sharpe, currencies 0.68, Treasuries 0.68, commodities 0.60 against a passive benchmark of 0.08, index puts 1.80. Combine all nine sleeves at equal risk and the Global Carry Factor earns a 1.10 Sharpe — with skewness of −0.02. Read that twice: currency carry alone is famously crash-prone at −0.68 skew, but the crashes are parochial — each class crashes on its own schedule, so a diversified carry book keeps the premium and diversifies away the elevator. The concept was never about currencies; currencies were just where we noticed it first.',
      footnote: 'Carry bars vs the grey EW benchmarks; the GCF card is the headline.',
    },
  },
  {
    slideId: 10, type: 'problem', title: 'Your Turn: Grade the Global Factor',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'carry',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 10,
      scenario: 'The Global Carry Factor has mean excess return 6.75%/yr and volatility 6.12%/yr. In options, the put-carry strategy has Sharpe 1.80 while the passive EW put benchmark has Sharpe −1.01.',
      question: 'Compute the GCF\'s Sharpe ratio, and the put strategy\'s Sharpe gap over its passive benchmark.',
      given: [['GCF mean', '6.75%'], ['GCF vol', '6.12%'], ['Puts carry SR', '1.80'], ['Puts EW SR', '−1.01']],
      answers: [
        { label: 'GCF Sharpe ratio', value: 1.10, tolerance: 0.01 },
        { label: 'Puts SR gap', value: 2.81, tolerance: 0.02 },
      ],
      steps: [
        'GCF: 6.75 / 6.12 = 1.10.',
        'Puts: 1.80 − (−1.01) = 2.81 — passively holding (buying) index puts torches money at a −1.01 Sharpe; sorting them by carry flips that to +1.80.',
        'Context from Lecture 7\'s gauntlet: a 1.10 Sharpe with −0.02 skewness across 40 years and nine asset classes is exactly the profile that survives every robustness test — the caveat, as always, is that it\'s gross of trading costs. Lecture 10 prices that caveat.',
      ],
    },
    narration: '[calm] Divide once, subtract once — then remember Lecture 7 and ask the robustness questions anyway.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: 6.75/6.12 = 1.1029 ≈ 1.10; 1.80 − (−1.01) = 2.81. Common error: 6.12/6.75 = 0.91 (inverted). Discussion hooks: why is the GCF Sharpe higher than every sleeve? Low cross-class correlations (max 0.31) — L1 diversification math again; why is passive put-buying SR −1.01? Insurance premium flows FROM put buyers (L2/L6 flight-to-quality pricing); carry sorts identify the RICH puts to sell and cheap to buy.',
    content: { eyebrow: 'Your turn', heading: 'Grade the Global Factor', problemTitle: 'Your Turn: Grade the Global Factor', footnote: 'SR = mean/vol · gap = carry SR − EW SR.' },
  },
  {
    slideId: 11, type: 'interactive', title: 'A Timing Signal, Not a Tilt',
    contextLabel: 'Block C · Anatomy', blockId: 'C', module: 'carry',
    visual: 'GlobalCarryLab', visualProps: { mode: 'anatomy' },
    narration: '[curious] Is carry just a disguised buy-and-hold — always long Australia, always short yen? [surprised] Decompose it: in equities, one hundred and one percent of the return is dynamic. Carry earns its keep by moving.',
    systemPromptContext: 'BLOCK C — REAL static/dynamic decomposition: E[carry return] = Σ E[w_i]E[r_i] (STATIC: average positions × average returns — a fixed tilt) + Σ E[(w−E[w])(r−E[r])] (DYNAMIC: timing — being bigger when returns are bigger). % DYNAMIC by class (individual securities): Equities 101% (static −0.1%, dynamic 9.3%), FI 10Y 86%, FI slope 99%, US Treasuries 42%, Commodities 64%, Currencies 58% (static 2.2 + dynamic 3.1), Credit 30%, Calls 111%, Puts 100%. Only Treasuries and credit are mostly static tilts; everywhere else carry PREDICTS TIME-VARIATION in returns — the deep rejection of constant expected returns. Cross-class carry correlations are TINY (Panel: max FX–credit 0.31, most 0.0–0.17; equities–FI 0.17, equities–commodities 0.03) — the 1.10 Sharpe is diversification doing its work. CARRY ≠ VALUE ≠ MOMENTUM: regressions of carry strategies on passive-long + value + momentum + TSMOM leave large alphas: GCF alpha 0.53%/mo (t 6.52) unconditional, 0.44 (t 5.51) with all controls, IRs 1.05–1.24; per class: equities 0.77 (t 4.51), FX 0.30 (t 2.31), puts 12.55 (t 4.55). Definitions kept distinct: momentum = past 1yr return; value = price vs fundamental (5yr reversal); carry = FORWARD-looking, model-free, from today\\u2019s term structure. TIMING version (long/short each class vs its own zero-carry line): SR equities 0.40, FI 0.65/0.72, Treasuries 0.60, commodities 0.40, currencies 0.78, credit 0.64, puts 1.01 — carry also times each market against itself.',
    content: {
      eyebrow: 'Static vs dynamic, and vs V&M', heading: 'A Timing Signal, Not a Tilt',
      body: 'Split each carry strategy\'s profit into a static piece — its average tilt, earning average returns — and a dynamic piece, from positions that grow exactly when returns do. The verdict is lopsided: 101% dynamic in equities, 99% in bond-slope trades, 100% in puts; only Treasuries and credit are mostly tilts. Carry is not a costume for buy-and-hold Australia — it is live evidence that expected returns move, and that today\'s term structure tells you where they\'ve moved to. It is also its own animal: regress carry returns on value, momentum, and trend, and alphas of 0.44–0.53% per month survive with t-statistics above 5.5. Three signals — where prices have drifted from fundamentals, where they\'ve recently run, and what the curve pays you to wait — and each one is paid separately.',
      footnote: 'Tabs: the decomposition · correlations · carry vs V&M alphas.',
    },
  },
  {
    slideId: 12, type: 'interactive', title: 'What Carry Charges For',
    contextLabel: 'Block C · The risks', blockId: 'C', module: 'carry',
    visual: 'GlobalCarryLab', visualProps: { mode: 'risks' },
    narration: '[serious] Three drawdowns in forty years — and all three sit inside global recessions. [clear] Add the liquidity and volatility loadings and the bill becomes legible: carry is paid for showing up short of insurance in bad times — just not crash-by-crash.',
    systemPromptContext: 'BLOCK C — REAL risk exposures: LIQUIDITY SHOCKS (per class carry strategy): Currencies +0.88 (t 3.62), Credit +1.24 (t 3.78), Puts +0.57 (t 2.48), Commodities +0.26 (t 2.36), others positive n.s.; Treasuries −0.21 n.s. — carry loses when liquidity dries up. VOLATILITY CHANGES: Currencies −1.03 (t −6.46), Commodities −0.42 (t −2.74), FI 10Y −0.54 (t −2.25), Credit −0.58 (t −2.05), Puts −0.62 (t −2.00); TREASURIES +0.54 (t +2.92) — the flight-to-quality exception. EXPANSIONS vs DRAWDOWNS (annualized carry-strategy means): Equities 15.03 vs −6.15; FI 10Y 10.84 vs −13.90; FI slope 8.10 vs −7.25; Treasuries 0.97 vs −0.57; Commodities 21.49 vs −13.23; Currencies 10.06 vs −6.81; Credit 0.60 vs −0.50; Calls 152 vs −161; Puts 258 vs −22. THE THREE GCF DRAWDOWNS (1972–2012): Aug 1972–Sep 1975: −19.6%; Mar 1980–Jun 1982: −26.8%; Aug 2008–Feb 2009: −7.2% — every one spans a global recession (business-cycle indicator overlay). Synthesis: NOT crash risk at the global level (skew −0.02, limited kurtosis) but RECESSION + LIQUIDITY + VOLATILITY risk: carry is a pro-cyclical premium that pays steadily and concentrates its losses in the states where capital is scarce — a coherent risk-based story, with limits-to-arbitrage amplification from Block B. Lux: contrast with TSMOM (L8) which PAYS in those states — a carry+trend book is the natural pairing.',
    content: {
      eyebrow: 'Recessions, liquidity, volatility', heading: 'What Carry Charges For',
      body: 'The global factor\'s forty-year history contains exactly three drawdowns — 1972–75 (−19.6%), 1980–82 (−26.8%), 2008–09 (−7.2%) — and each sits squarely inside a global recession. The factor loadings agree on the mechanism: currency carry loads +0.88 on liquidity shocks and −1.03 on volatility changes (t = −6.5), credit +1.24 on liquidity; every sleeve except flight-to-quality Treasuries earns dramatically more in carry expansions than drawdowns. So the diversified evidence rewrites the currency story: the premium isn\'t primarily payment for elevator crashes — those diversify away — it\'s payment for bleeding in recessions, when liquidity is scarce and volatility high, precisely when losses hurt most. A risk premium with a legible bill; Block B\'s funding spirals explain why it\'s this large.',
      footnote: 'Tabs: exposures · expansions vs drawdowns · the three episodes.',
    },
  },
  {
    slideId: 13, type: 'problem', title: 'Your Turn: Measure the State-Dependence',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'carry',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 13,
      scenario: 'Annualized mean carry-strategy returns: currencies earn 10.06% in carry expansions and −6.81% in carry drawdowns; commodities earn 21.49% and −13.23%.',
      question: 'Compute each strategy\'s expansion-minus-drawdown swing in percentage points.',
      given: [['FX expansion', '10.06%'], ['FX drawdown', '−6.81%'], ['Comm. expansion', '21.49%'], ['Comm. drawdown', '−13.23%']],
      answers: [
        { label: 'Currencies swing (pts)', value: 16.87, tolerance: 0.1 },
        { label: 'Commodities swing (pts)', value: 34.72, tolerance: 0.1 },
      ],
      steps: [
        'Currencies: 10.06 − (−6.81) = 16.87 points.',
        'Commodities: 21.49 − (−13.23) = 34.72 points.',
        'This is what "state-dependent returns" looks like in numbers — and it is precisely what a risk premium requires: the strategy must do badly in identifiable bad states, or the average return is a free lunch. Compare Lecture 8\'s trend-following, which SWUNG THE OTHER WAY in crises: the two strategies charge for opposite states, which is why serious multi-strategy books hold both.',
      ],
    },
    narration: '[clear] Two subtractions — and a portfolio lesson: carry bleeds where trend feasts.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: 10.06+6.81 = 16.87; 21.49+13.23 = 34.72. Common error: subtracting drawdown as positive (3.25 / 8.26). Portfolio discussion: carry (pro-cyclical, hurts in recessions) + TSMOM (crisis alpha, L8) have complementary state exposures — the equal-risk pairing is a classic AQR-style construction; both gross of costs pending L10.',
    content: { eyebrow: 'Your turn', heading: 'Measure the State-Dependence', problemTitle: 'Your Turn: Measure the State-Dependence', footnote: 'Swing = expansion mean − drawdown mean.' },
  },
  {
    slideId: 14, type: 'explain', title: 'Expected Returns, Printed on the Screen',
    contextLabel: 'Block C · Verdict', blockId: 'C', module: 'carry',
    visual: 'GlobalCarryLab', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] The expectations hypothesis dies in nine asset classes simultaneously. [clear] What replaces it is almost more useful: expected returns that vary, and a piece of them you can read off the term structure before breakfast.',
    systemPromptContext: 'BLOCK C — Lecture verdict and course integration: (1) Generalized UIP/EH REJECTED everywhere: carry predicts returns in every asset class — the strongest single piece of evidence in the course that expected returns vary over time and across assets. (2) The variation is OBSERVABLE EX ANTE: carry needs no estimation — a direct challenge to the L2 tradition of estimating premia from decades of history. (3) The premium\\u2019s bill: recession, liquidity, and volatility risk (not global crash risk — skew −0.02); currency-specific crashes are the funding-constrained special case (Block B), amplified by limits to arbitrage. (4) L7 gauntlet applied: original t-stats high (alpha t 5.5–6.5); robust across 9 classes and construction choices (current vs carry1-12); out-of-sample by construction (new classes = new samples; concept predates the paper by a century in FX); TWO stories (risk: recession/liquidity/vol; frictions: funding constraints) — passes all four. (5) Open door: gross of transaction costs — L10\\u2019s question. Course arc position: L8 gave value/momentum/trend everywhere; L9 adds the fourth pillar, carry; L10 asks what surviving contact with the market costs. \u201cMost finance models have direct implications for carry strategies\u201d — carry gives every future model a new set of moments to match.',
    content: {
      eyebrow: 'The fourth pillar', heading: 'Expected Returns, Printed on the Screen',
      body: 'One concept, borrowed from currency desks and generalized, rejects the expectations hypothesis in nine asset classes at once and replaces it with something better: expected returns that visibly vary — and whose observable component is sitting in today\'s futures curve, dividend yield, and term structure, no estimation required. Run Lecture 7\'s gauntlet: t-statistics above 5, robustness across classes and constructions, out-of-sample confirmation every time a new class is added, and two live economic stories — a recession-liquidity-volatility risk premium, amplified by the funding constraints that make currency carry crash. Carry joins value, momentum, and trend as the fourth pillar of systematic investing. All four now face the same final exam: Lecture 10, where trading costs grade what survives.',
      footnote: 'Value · momentum · trend · carry. One exam left.',
    },
  },
];
