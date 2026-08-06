/**
 * Lecture 08 — Other Asset Classes (MGT 595, Quantitative Investing)
 * Built from lectures/lecture08_outline_refined.json
 */

export const lecture08Slides = [
  // ── Block A: value & momentum everywhere ──
  {
    slideId: 1, type: 'explain', title: 'One Recipe, Every Market',
    contextLabel: 'Block A · Everywhere', blockId: 'A', module: 'everywhere',
    visual: 'EverywhereLab', visualProps: { mode: 'map' },
    narration: '[curious] What does \u201ccheap\u201d mean for a barrel of oil? What is the book value of the yen? [clear] Asness, Moskowitz, and Pedersen force one uniform recipe onto every major asset class — and the recipe is almost embarrassingly simple.',
    systemPromptContext: 'BLOCK A — Asness–Moskowitz–Pedersen \u201cValue and Momentum Everywhere\u201d: before this paper V&M were studied one asset class at a time; literature had NOTHING on value in commodities/currencies or either effect in government bonds. Uniform measures: MOMENTUM = return from t−12 to t−2 months, identical in every class. VALUE: stocks & country indices = book-to-price; commodities = \u201cbook\u201d is the average spot price 4.5–5.5 years ago (long-run reversal as value); currencies = 5-year excess-return reversal = deviation from UIP (change in PPP if real rates constant); bonds = REAL yield (yield minus expected inflation forecast from Consensus Economics). Methodology: terciles, value-weight stocks / equal-weight others, H−L spreads, 50/50 V+M combos; robustness equal-VOLATILITY weighting because commodities have ~5× the vol of bonds. Data: US/UK/Japan/Europe stocks (top ~37.5% of names = 96–98% of cap), MSCI country indices, 10yr bond indices, currencies, 27 commodities. The philosophical point: if value and momentum are real phenomena rather than equity-market quirks, the SAME crude signal should work everywhere — a much harder test than optimizing per market.',
    content: {
      eyebrow: 'Asness, Moskowitz & Pedersen', heading: 'One Recipe, Every Market',
      body: 'Momentum travels unchanged: the return from twelve months ago to one month ago, whether the asset is Apple, the Topix, the Aussie dollar, or copper. Value needs translation, and the translations are deliberately crude: book-to-price for stocks, the spot price of five years ago for commodities, the five-year deviation from interest parity for currencies, the real yield for bonds. No per-market optimization is allowed — that is the point. If these effects are real economics rather than data-mined equity quirks, one blunt recipe should find them everywhere it looks.',
      footnote: 'Click each asset class for its value translation.',
    },
  },
  {
    slideId: 2, type: 'interactive', title: 'It Works Everywhere — and the Two Halves Hedge',
    contextLabel: 'Block A · The results', blockId: 'A', module: 'everywhere',
    visual: 'EverywhereLab', visualProps: { mode: 'results' },
    narration: '[excited] Positive value returns in eight of eight settings. Positive momentum in seven of eight. [thoughtful] And everywhere, the two are negatively correlated — which makes their combination better than either, and solves the Japan puzzle along the way.',
    systemPromptContext: 'BLOCK A — Results (Table I is an image in the deck; the app shows the paper\\u2019s structure as a stylized strip and states only deck-text claims): value and momentum earn positive returns in essentially every market and asset class studied (8 settings: US/UK/Europe/Japan stocks, country indices, bonds, currencies, commodities); V and M are NEGATIVELY correlated within every class (roughly −0.5 to −0.6 in stocks per the paper); therefore the 50/50 COMBO has a higher Sharpe than either alone and is more stable across markets. THE JAPAN PUZZLE: momentum famously \u201cdoesn\u2019t work\u201d in Japan — but value was exceptionally strong there over the same period, and given the strong negative correlation, a weak momentum realization is exactly what conditional statistics predict when value has a great draw; the COMBO worked fine in Japan. \u201cNo momentum in Japan? So what?\u201d — the right test is the combination, and Japan is a data point FOR the framework, not against it. Long vs short legs contribute roughly equally. Lux: push students to articulate why negative correlation between two positive-mean strategies is a free lunch (variance shrinks faster than mean).',
    content: {
      eyebrow: 'The everywhere table', heading: 'It Works Everywhere — and the Two Halves Hedge',
      body: 'The same blunt signals earn positive returns in every market and asset class the paper touches — and everywhere, value and momentum are negatively correlated: one buys what has bled, the other buys what has run. Two positive-mean strategies with strongly negative correlation are the closest thing investing has to a free lunch, so the 50/50 combination beats both legs in every setting. It also retires a famous objection: momentum\'s weakness in Japan is exactly what a negative correlation predicts during value\'s spectacular Japanese run — and the combo performed fine there. The unified view turns an anomaly of an anomaly back into evidence.',
      footnote: 'Toggle classes; the Japan card is the punchline.',
    },
  },
  {
    slideId: 3, type: 'problem', title: 'Your Turn: Price the Free Lunch',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'everywhere',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 3,
      scenario: 'Value and momentum each have Sharpe ratio 0.4 (mean 0.4, volatility 1.0, in convenient units) and correlation ρ = −0.6. You form a 50/50 combination.',
      question: 'Compute the combo\'s volatility and its Sharpe ratio.',
      given: [['Each SR', '0.4'], ['Each σ', '1.0'], ['ρ', '−0.6'], ['Weights', '50/50']],
      answers: [
        { label: 'Combo volatility', value: 0.447, tolerance: 0.005 },
        { label: 'Combo Sharpe ratio', value: 0.89, tolerance: 0.01 },
      ],
      steps: [
        'Mean: 0.5×0.4 + 0.5×0.4 = 0.4 — averaging doesn\'t change the mean.',
        'Variance: 0.25(1) + 0.25(1) + 2(0.25)(−0.6) = 0.5 − 0.3 = 0.2. Volatility = √0.2 = 0.447.',
        'Sharpe = 0.4 / 0.447 = 0.894.',
        'The mean survived intact while the volatility fell 55%. That is why the combo beats either leg everywhere — and why the negative correlation is the single most important number in the paper.',
      ],
    },
    narration: '[encouraging] This is Lecture 1 portfolio math meeting Lecture 8 evidence — watch what a minus-point-six correlation does.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: σ² = 0.25+0.25+2·0.25·(−0.6) = 0.2, σ = 0.4472; SR = 0.4/0.4472 = 0.894. Common errors: forgetting the 2 in the covariance term (σ²=0.425, σ=0.652); using ρ instead of ρσ1σ2w1w2 structure. Extension: at ρ = 0 the combo SR is 0.4/0.707 = 0.566; at ρ = −1 volatility is 0 (arbitrage). Connect to L1 diversification and to the deck\\u2019s claim that combining ACROSS asset classes adds a second diversification layer on top.',
    content: { eyebrow: 'Your turn', heading: 'Price the Free Lunch', problemTitle: 'Your Turn: Price the Free Lunch', footnote: 'σ² = w²σ² + w²σ² + 2w²ρσσ.' },
  },
  {
    slideId: 4, type: 'interactive', title: 'A Global Factor Hiding in Plain Sight',
    contextLabel: 'Block A · Co-movement', blockId: 'A', module: 'everywhere',
    visual: 'EverywhereLab', visualProps: { mode: 'comovement' },
    narration: '[surprised] Value in US stocks correlates with value in currencies. Momentum in bonds correlates with momentum in commodities. [serious] Whatever drives these effects, it is global, it crosses asset classes — and it smells like funding liquidity.',
    systemPromptContext: 'BLOCK A — Co-movement and liquidity risk: value HERE correlates with value THERE (across markets and even asset classes), momentum ditto, and V–M are negatively correlated everywhere — a striking global factor structure that no stock-specific story (accounting, coverage, retail behavior) can explain. First principal component cleanly separates value-vs-momentum globally. Asset pricing tests: a global 3-factor model (market + everywhere-value + everywhere-momentum) prices 48 global V&M portfolios better than local models. LIQUIDITY RISK (the deck\\u2019s candidate mechanism): once noise is diversified by looking everywhere, VALUE loads POSITIVELY (t = 3.8) and MOMENTUM NEGATIVELY (t = −3.2) on funding-liquidity risk (TED spreads, LIBOR–repo, etc.). Notes line: \u201ccheap assets get cheaper during liquidity events, but trending assets do better.\u201d This PARTLY explains the premia and the negative correlation — but makes momentum MORE puzzling (it earns a premium while HEDGING liquidity risk). Dynamics: liquidity risk\\u2019s importance rises sharply after summer 1998 (LTCM); over time both strategies become less profitable, more correlated across markets, and more correlated with each other — consistent with more arbitrage capital chasing them (foreshadows L10). Macro risks (recessions, consumption growth) explain little. Honest bottom line from the deck: \u201cstill far from a full explanation.\u201d',
    content: {
      eyebrow: 'Comovement & liquidity risk', heading: 'A Global Factor Hiding in Plain Sight',
      body: 'The correlations are the deepest finding: value strategies co-move across markets and asset classes, momentum strategies do too, and the first principal component of all of them splits cleanly into a global value factor and a global momentum factor. No story about accounting rules or retail investors in one country can produce that. The deck\'s candidate: funding liquidity. Diversify away the noise and value loads positively on liquidity risk (t = 3.8) — cheap assets get cheaper when funding dries up — while momentum loads negatively (t = −3.2), actually hedging those events. That explains part of value\'s premium, deepens momentum\'s puzzle, and (the paper admits) still leaves much unexplained.',
      footnote: 'Everything sharpened after the summer of 1998.',
    },
  },

  // ── Block B: time-series momentum ──
  {
    slideId: 5, type: 'explain', title: 'Momentum Without the Cross-Section',
    contextLabel: 'Block B · TSMOM', blockId: 'B', module: 'everywhere',
    visual: 'TsmomLab', visualProps: { mode: 'definition' },
    narration: '[clear] Cross-sectional momentum asks: did you beat your peers? Time-series momentum asks something purer: is your own past return positive? [curious] That question is the most direct test of the random walk ever run.',
    systemPromptContext: 'BLOCK B — Moskowitz–Ooi–Pedersen \u201cTime Series Momentum\u201d: TSMOM = a security\\u2019s OWN past return predicts its OWN future return (buy if past-12-month excess return > 0, short if < 0), vs cross-sectional momentum = RELATIVE outperformance predicts relative outperformance (JT terciles). Why it matters: (1) the most direct test of the random walk hypothesis; (2) behavioral AND rational theories (BSV, DHS, Hong–Stein) are actually about ABSOLUTE returns, not relative — TSMOM tests them head-on; (3) it can be run identically in every futures market. The 2×2 literature map: n-months-predict-n-months time series = \u201cautocorrelation\u201d (Fama–French 1988, Lo–MacKinlay 1988); m-predict-n cross-sectional = \u201cstandard momentum\u201d (Jegadeesh–Titman, Asness, AMP); m-predict-n TIME SERIES = the gap MOP fills. 58 liquid futures: equity indices, bond futures (duration-scaled), currency forwards, 24 commodities. Regression evidence: the sign of the own past return positively predicts the next month for lookbacks up to ~12 months, then REVERSES beyond — continuation, then give-back.',
    content: {
      eyebrow: 'Moskowitz, Ooi & Pedersen', heading: 'Momentum Without the Cross-Section',
      body: 'Strip momentum of its cross-section and something purer remains: does an asset\'s own past 12-month return predict its own next month? That is the random walk hypothesis, tested at its heart — and it is what the underreaction and overreaction theories were always actually about, since none of them says anything about beating peers. The strategy could not be simpler: long anything whose trailing 12-month excess return is positive, short anything whose return is negative, sized to equal risk, across 58 futures markets. The panel regressions say the sign predicts positively for about a year — and then the prediction flips.',
      footnote: 'The 2×2: autocorrelation · standard momentum · and the cell MOP filled.',
    },
  },
  {
    slideId: 6, type: 'interactive', title: 'A Century of Trend, Sixty-Six Markets',
    contextLabel: 'Block B · The evidence', blockId: 'B', module: 'everywhere',
    visual: 'TsmomLab', visualProps: { mode: 'everywhere' },
    narration: '[excited] Eighteen-eighty to twenty-seventeen. Sixty-six instruments. [clear] Trend-following has a positive Sharpe ratio in essentially every one — from German bunds to lean hogs.',
    systemPromptContext: 'BLOCK B — REAL embedded chart data (AQR, hypothetical trend-following Sharpe by instrument, Jan 1880–Dec 2017, gross of fees, longest available sample per asset): EQUITIES: Australia ASX 0.86, Spain 0.68, Canada 0.55, Italy 0.52, Japan Topix 0.46, Russell 2000 0.45, France 0.44, Netherlands 0.43, S&P500 0.41, Germany 0.34, FTSE 0.21. BONDS: Germany 5yr 1.02, Germany 10yr 0.85, Italy 10yr 0.73, US 10yr 0.67, US 5yr 0.64, Japan 10yr 0.55, US 2yr 0.55, UK 10yr 0.53, Canada 10yr 0.52, Australia 10yr 0.49, Germany 30yr 0.44, US 30yr 0.44, Australia 3yr 0.06. FX: USDJPY 0.60, USDGBP 0.56, EURSEK 0.38, USDAUD 0.37, EURNOK 0.35, EURJPY 0.34, EURCHF 0.31, USDEUR 0.30, EURGBP 0.30, USDCAD 0.28, JPYAUD 0.24, AUDNZD 0.08. COMMODITIES: GasOil 0.60, Brent 0.59, Short ribs 0.53, Zinc 0.50, Cotton 0.47, Crude 0.45, Sugar 0.43, Copper 0.41, Wheat 0.37, Corn 0.37, Oats 0.37, Soy oil 0.37, Lard 0.36, NatGas 0.36, Rye 0.34, Cattle 0.35, Gold 0.33, Heating oil 0.33, Unleaded 0.34, Aluminum 0.31, Pork 0.30, Soymeal 0.26, Soybeans 0.23, Nickel 0.18, Silver 0.16, Platinum 0.16, Hogs 0.14, Coffee 0.12, Cocoa 0.08. Essentially ALL positive across 137 years. Diversified 12M TSMOM across 58 instruments: ~9–10% annualized vol, realistic margin (5–20%), large alpha to standard factors, robust across lookback/holding grids in every class; TSMOM SUBSUMES cross-sectional momentum (large intercepts vs AMP factors) but not vice versa; Lo–MacKinlay decomposition: AUTO-covariance (own past predicting own future) drives most of both strategies.',
    content: {
      eyebrow: '1880–2017, real data', heading: 'A Century of Trend, Sixty-Six Markets',
      body: 'This chart is the empirical case: hypothetical trend-following Sharpe ratios for sixty-six instruments over as much as 137 years of data, and essentially every bar is positive — German five-year notes at 1.02, the ASX at 0.86, crude at 0.45, all the way down to cocoa still slightly above zero. No single market is spectacular; the diversified portfolio across all 58 liquid instruments is, because trend returns are nearly uncorrelated across markets. The decomposition confirms what drives it: auto-covariance — each asset\'s own past predicting its own future — which also turns out to be most of what cross-sectional momentum was picking up all along.',
      footnote: 'Filter by asset class; find your favorite market.',
    },
  },
  {
    slideId: 7, type: 'problem', title: 'Your Turn: Give Every Market a Vote',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'everywhere',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 7,
      scenario: 'MOP size each position at 40%/σ, where σ is the instrument\'s ex-ante annualized volatility — so every market contributes equal risk. Consider a commodity with σ = 30% and a bond future with σ = 6%.',
      question: 'What position (as a multiple of notional per unit of capital) does each get?',
      given: [['Sizing rule', '40% / σ'], ['Commodity σ', '30%'], ['Bond σ', '6%']],
      answers: [
        { label: 'Commodity position (×)', value: 1.33, tolerance: 0.02 },
        { label: 'Bond position (×)', value: 6.67, tolerance: 0.05 },
      ],
      steps: [
        'Commodity: 0.40 / 0.30 = 1.33× notional.',
        'Bond: 0.40 / 0.06 = 6.67× notional — leverage, applied where volatility is low.',
        'Each position now has the same ex-ante risk (40% annualized), so the diversified strategy is an equal-risk vote across 58 markets rather than a commodity-vol lottery. Without this scaling, the portfolio would secretly be a commodities fund — they run ~5× the volatility of bonds.',
      ],
    },
    narration: '[calm] Same rule as risk parity: divide by volatility, and suddenly bonds and natural gas can share a portfolio as equals.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: 0.40/0.30 = 1.333; 0.40/0.06 = 6.667. Common error: multiplying by σ instead of dividing. Conceptual link: this is the same equal-risk logic as BAB\\u2019s beta-scaling (L6) and risk parity; leverage aversion says most investors WON\\u2019T lever the bond leg, which is partly why these premia persist. Note: the deck\\u2019s extracted text garbles the target (\u201c0.60%\u201d); the paper\\u2019s convention is 40%/σ and the app states that convention explicitly.',
    content: { eyebrow: 'Your turn', heading: 'Give Every Market a Vote', problemTitle: 'Your Turn: Give Every Market a Vote', footnote: 'Position = 40% / σ — equal ex-ante risk per market.' },
  },
  {
    slideId: 8, type: 'interactive', title: 'The Strategy That Shows Up in Crashes',
    contextLabel: 'Block B · Crisis alpha', blockId: 'B', module: 'everywhere',
    visual: 'TsmomLab', visualProps: { mode: 'smile' },
    narration: '[serious] Take the ten worst episodes a sixty-forty portfolio has suffered since eighteen-eighty. [surprised] Trend-following made money in eight of them — including ninety-five percent while stocks and bonds lost thirty in seventy-three, seventy-four.',
    systemPromptContext: 'BLOCK B — REAL embedded data (10 largest 60/40 drawdowns 1880–2015, 60/40 return vs trend-following NET of 2/20 fees): Feb–Aug 1893: −12.3% vs +8.6%; Oct 1906–Dec 1907: −16.8% vs +26.5%; Dec 1916–Dec 1917: −12.1% vs +25.6%; Sep 1929–Jun 1932 (Great Depression): −62.3% vs +36.1%; Mar 1937–Mar 1938: −32.5% vs −8.1%; Dec 1968–Jun 1970: −19.9% vs +54.8%; Jan 1973–Sep 1974: −30.6% vs +95.4%; Sep–Nov 1987 (crash): −18.0% vs −2.4%; Sep 2000–Sep 2002 (dot-com): −21.2% vs +26.4%; Nov 2007–Feb 2009 (GFC): −30.5% vs +21.6%. Positive in 8 of 10; the two misses (1937–38, Oct 1987) were FAST crashes with no trend to ride — the strategy needs the bear market to develop over months. This is the \u201cTSMOM smile\u201d: regressing TSMOM returns on market returns and squared market returns gives positive convexity — it does best in LARGE moves of either sign. NOT crash risk (it delivers in crashes, unlike carry or insurance-selling); NOT transaction costs (performance unrelated to instrument liquidity); NOT captured by standard factors. Why it works in long bears: by construction the 12-month signal flips short a few months into a sustained decline. Lux: contrast with the negative skew of currency carry (L9 preview) and value\\u2019s drawdowns (L4).',
    content: {
      eyebrow: 'The ten worst 60/40 episodes', heading: 'The Strategy That Shows Up in Crashes',
      body: 'Line up the ten deepest drawdowns a 60/40 portfolio has suffered since 1880 and put trend-following\'s net-of-fees return beside each: positive in eight of ten, including +36% through the Great Depression, +95% through 1973–74\'s stagflation, and +22% through the financial crisis. The two exceptions — 1937 and October 1987 — were crashes too fast for a 12-month signal to flip short, which is exactly the mechanism talking: trend needs bear markets that develop, not detonate. This convexity — the "smile" — is what makes the strategy special: most return-generating strategies implicitly sell insurance; this one has historically been paid to hold it.',
      footnote: 'Click any episode; grey bars are 60/40, navy is trend.',
    },
  },
  {
    slideId: 9, type: 'problem', title: 'Your Turn: Quantify the Crisis Alpha',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'everywhere',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 9,
      scenario: 'From the drawdown table: Jan 1973–Sep 1974, the 60/40 portfolio returned −30.6% while trend-following returned +95.4%. In the GFC (Nov 2007–Feb 2009): −30.5% vs +21.6%.',
      question: 'Compute the trend-minus-60/40 spread in each episode (percentage points).',
      given: [['1973–74', '−30.6% vs +95.4%'], ['GFC', '−30.5% vs +21.6%']],
      answers: [
        { label: '1973–74 spread (pts)', value: 126.0, tolerance: 1 },
        { label: 'GFC spread (pts)', value: 52.1, tolerance: 0.5 },
      ],
      steps: [
        '1973–74: 95.4 − (−30.6) = 126.0 percentage points.',
        'GFC: 21.6 − (−30.5) = 52.1 points.',
        'These spreads are why allocators call it "crisis alpha": the payoff arrives precisely when the rest of the portfolio — and the investor\'s marginal utility — needs it most. A risk-based story for TSMOM has to explain being PAID for delivering in bad times; that is backwards for a risk premium, which is why the under/overreaction mechanism does the heavy lifting.',
      ],
    },
    narration: '[clear] One subtraction per crisis. The sizes are the argument.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: 95.4−(−30.6)=126.0; 21.6−(−30.5)=52.1. Common error: subtracting the wrong direction or averaging. Discussion: marginal-utility logic — a strategy that pays in states where consumption is low should command a LOWER expected return in equilibrium, yet TSMOM\\u2019s realized Sharpe is high: either the premium reflects hedger demand (they pay speculators to absorb inventory risk) or slow-moving behavioral frictions; the deck leans on both.',
    content: { eyebrow: 'Your turn', heading: 'Quantify the Crisis Alpha', problemTitle: 'Your Turn: Quantify the Crisis Alpha', footnote: 'Spread = trend − 60/40 per episode.' },
  },
  {
    slideId: 10, type: 'explain', title: 'Anatomy of a Trend',
    contextLabel: 'Block B · Mechanism', blockId: 'B', module: 'everywhere',
    visual: 'TsmomLab', visualProps: { mode: 'mechanism' },
    narration: '[thoughtful] Shock a price and watch what happens: a year of continuation, then a partial give-back. [clear] Underreaction starts the trend; delayed overreaction ends it — and the roll returns tell you who is paying whom.',
    systemPromptContext: 'BLOCK B — Mechanism: impulse-response / event-study evidence: after a return shock, prices CONTINUE for ~12 months, then PARTIALLY REVERSE — the signature of initial under-reaction followed by delayed over-reaction (consistent with Hong–Stein slow diffusion + DHS overconfidence; matches L5\\u2019s horizon map and L8 sports results). Decomposing futures return = spot price change + ROLL RETURN (deviation from cost-of-carry, i.e., the shape of the futures curve): the price-change component drives continuation and later REVERSES (overreaction lives in prices); the roll-return component is PERSISTENT and does NOT reverse — that is HEDGING PRESSURE: hedgers pay a persistent premium via the curve shape. WHO trades: CFTC data — SPECULATORS are positioned WITH the trend (long TSMOM), HEDGERS take the other side; speculator positions, spot changes, and roll returns all predict returns. Interpretation: speculators earn a premium for providing liquidity to hedgers while trends form from slow information diffusion; the eventual reversal warns against long holding periods. \u201cA Trending Walk Down Wall Street.\u201d',
    content: {
      eyebrow: 'Under-reaction, over-reaction, and hedgers', heading: 'Anatomy of a Trend',
      body: 'The impulse response tells the story in one curve: a return shock keeps propagating for about twelve months, then partially reverses — underreaction building the trend, delayed overreaction ending it. Splitting futures returns into spot-price changes and roll returns splits the mechanism too: the price component continues and then gives back (that\'s the behavioral part), while the roll component — the futures curve\'s tilt, set by hedging pressure — persists without reversing (that\'s the payment). The CFTC positions complete the picture: speculators ride the trend, hedgers lean against it, and the roll return is the fee flowing from one to the other.',
      footnote: 'Trend = slow news + paid insurance. Both halves show in the data.',
    },
  },

  // ── Block C: the sports-betting laboratory ──
  {
    slideId: 11, type: 'explain', title: 'A Market Where Risk Can\u2019t Be the Answer',
    contextLabel: 'Block C · The laboratory', blockId: 'C', module: 'everywhere',
    visual: 'SportsLab', visualProps: { mode: 'lab' },
    narration: '[curious] Every bet is idiosyncratic, and every game ends. [clear] That makes sports betting the laboratory finance never had: any value or momentum effect found here cannot be a risk premium — and the final score grades every price.',
    systemPromptContext: 'BLOCK C — Moskowitz \u201cAsset Pricing and Sports Betting\u201d: financial markets can\\u2019t cleanly separate risk vs behavioral vs data-mining (joint hypothesis problem, unobservable preferences/information). Betting markets have two decisive features: (1) bets are IDIOSYNCRATIC — outcomes uncorrelated with consumption/marginal utility, so NO risk premium is justified for any cross-sectional pattern; (2) FINITE TERMINAL DATE — the game ends and truth is revealed by outcomes UNRELATED to bettor beliefs or activity: mispricing must correct. Market: $500B–1T (~$5B legal Vegas then); samples 1999–2013 (SportsDirect) and 2005–2013 (SportsInsight), NBA/NFL/MLB/NHL; opening line, closing line, outcome. THREE CONTRACTS (exact deck payoffs): SPREAD: $110 on team A at −N points pays $210 if A wins by more than N (\u201ccover\u201d), $110 back on a push, $0 on a fail — the 10% asymmetry is the VIG (trading cost); MONEYLINE: $100 on A listed at −$M pays M+100 on a win; OVER/UNDER: $110 on total points > T pays $210. Return decomposition: open-to-close (line movement = the market\\u2019s \u201cprice path\u201d) vs close-to-end (outcome vs final price). Sentiment moves lines but should NOT predict outcomes; information moves lines AND predicts outcomes. Measures built to mirror finance: momentum = past game payoffs / win% / score differentials (composite); value = long-term past performance, payroll-to-spread, E(P)/P from win-probability models; size = franchise value/revenue.',
    content: {
      eyebrow: 'Moskowitz\u2019s laboratory', heading: 'A Market Where Risk Can\u2019t Be the Answer',
      body: 'Two features make betting markets the cleanest test bench asset pricing has: every bet is idiosyncratic — a game\'s outcome is uncorrelated with anyone\'s consumption, so no rational risk premium can exist in the cross-section of bets — and every contract terminates, with truth revealed by a final score that no bettor\'s beliefs can move. Any value, momentum, or size pattern found here is mispricing by construction, and the reversal test is automatic. The instruments mirror finance exactly: momentum from recent game results, value from long-term performance and payroll-to-price, size from franchise value — with the bookmaker\'s vig playing the role of trading costs.',
      footnote: 'Three contracts, exact payoffs below. The vig is the house\u2019s spread.',
    },
  },
  {
    slideId: 12, type: 'problem', title: 'Your Turn: Beat the Vig',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'everywhere',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 12,
      scenario: 'A standard spread bet risks $110 to win $100: pay $110, receive $210 on a win, $0 on a loss (ignore pushes).',
      question: 'What win rate makes this bet break even — and what is your expected profit as a percent of stake if you can actually win 55% of the time?',
      given: [['Stake', '$110'], ['Payoff if win', '$210'], ['Payoff if lose', '$0']],
      answers: [
        { label: 'Break-even win rate (%)', value: 52.38, tolerance: 0.05 },
        { label: 'Edge at 55% (% of stake)', value: 5.0, tolerance: 0.1 },
      ],
      steps: [
        'Break-even: p × 210 = 110 ⟹ p = 110/210 = 52.38%.',
        'At 55%: E[payoff] = 0.55 × 210 = $115.50 ⟹ profit $5.50 on $110 = 5.0% of stake.',
        'The vig taxes every round trip 4.76 points of win probability above a fair coin. Every anomaly in this lecture\'s data earns less than that — which is why the mispricing persists: it is real, and it is unarbitrageable. The same Grossman–Stiglitz logic as Lecture 10\'s trading costs, in miniature.',
      ],
    },
    narration: '[calm] Fifty-two point four percent. Every sports anomaly you will ever find lives below that line — which is exactly why it survives.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: 110/210 = 0.52381 = 52.38%; 0.55×210 = 115.5, profit 5.5/110 = 5.0%. Common errors: 110/220 = 50% (using stake+win incorrectly); 100/110 = 90.9%. Deck: \u201cthe vig = 10% difference\u201d; \u201cprofits easily wiped out by tcosts.\u201d Extension: this is limits-to-arbitrage made concrete — documented mispricing (full reversal by game end) coexisting with no profitable trade.',
    content: { eyebrow: 'Your turn', heading: 'Beat the Vig', problemTitle: 'Your Turn: Beat the Vig', footnote: 'Break-even p = 110/210. The vig is the moat.' },
  },
  {
    slideId: 13, type: 'interactive', title: 'The Verdict: Overreaction, Fully Refunded',
    contextLabel: 'Block C · Results', blockId: 'C', module: 'everywhere',
    visual: 'SportsLab', visualProps: { mode: 'results' },
    narration: '[excited] Momentum moves the betting lines from open to close — and then the games refund every penny of it by the final whistle. [clear] Total reversal. In this laboratory, that word means mispricing, with a signature: overreaction.',
    systemPromptContext: 'BLOCK C — Framework: regress open-to-close return (line movement) and close-to-end return (outcome vs final line) on each characteristic. Hypotheses: H1 irrelevance: β1 = βT = 0; H2 efficient information: line moves reflect real info; H3 pure noise/total overreaction: β1 ≠ 0 and βT = −β1 (FULL reversal); H4 inefficiency: Cov(β1, βT) < 0 = overreaction, > 0 = underreaction. RESULTS: MOMENTUM strongly moves lines open→close and is COMPLETELY REVERSED by game end (H3 pattern) — bettors chase recent team performance, the market maker accommodates, and the final scores refund it; replicated in BetFair exchange data. VALUE effects weaker, also reversed. SIZE: nothing. Magnitudes: ~1/5 the size of the analogous financial-market effects; net of the vig, unprofitable. NO COVARIANCE STRUCTURE: contracts sharing a characteristic do NOT co-move (unlike financial factors) — so no risk story is even mechanically possible, and none is needed given full reversal. Survey validation of the measures: Fama — \u201cMost of these make sense to me... past team record longer-term for value, shorter-term for momentum\u201d; Thaler — \u201cMomentum is easier. For value, since that\\u2019s my measure with DeBondt, I guess I have to like that one.\u201d (Both Nobel laureates blessing the same instrument choices.)',
    content: {
      eyebrow: 'Line moves vs final scores', heading: 'The Verdict: Overreaction, Fully Refunded',
      body: 'Betting lines exhibit real momentum: contracts on teams with recent winning streaks get bid up between the opening and closing line. Then the games are played, and the close-to-end returns reverse the movement completely — β at the terminal date equals minus β on the way in. In a market with terminal truth, that pattern has only one name: overreaction. Value shows the same signature more weakly; size shows nothing; and contracts sharing a characteristic don\'t co-move, so there is no covariance structure for a risk story to even grab. Both Fama and Thaler, shown the measures, endorsed them — before seeing which way the verdict cut.',
      footnote: 'H3: β_T = −β_1. The refund is the diagnosis.',
    },
  },
  {
    slideId: 14, type: 'explain', title: 'What the Laboratory Licenses',
    contextLabel: 'Block C · Synthesis', blockId: 'C', module: 'everywhere',
    visual: 'SportsLab', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] Momentum grows stronger when uncertainty is high; value when it is low — in betting markets, and then, tested back, in US equities too. [clear] The laboratory earned the right to that prediction.',
    systemPromptContext: 'BLOCK C — Synthesis and the uncertainty interaction: overreaction theories (DHS 1998, Rabin 2002, Rabin–Vayanos 2010) predict overreaction is STRONGER under greater uncertainty ⟹ momentum stronger, value weaker with more uncertainty. Betting-market proxies: early vs late season (more uncertainty early); parlay volume (parlays = all-legs-must-win portfolios placed where bettors are most CONFIDENT ⟹ low-parlay contracts = high uncertainty). Confirmed in betting data; then FLIPPED BACK and confirmed in US equity returns — the lab generated a prediction finance hadn\\u2019t tested and it worked. Generalization scorecard (deck\\u2019s own balance): AGGRESSIVE case — same characteristics, similar preferences, lab evidence about generic risky gambles, unified framework; CAUTIOUS case — characteristics aren\\u2019t perfect matches, magnitudes ~1/5 of finance, trading costs prohibitive, no covariance structure (financial factor premia may still be partly risk). Course integration: EMH implications — clear mispricing exists AND limits to arbitrage (the vig) protect it: Grossman–Stiglitz equilibrium in a petri dish; behavioral mechanisms (overreaction, uncertainty interaction) validated in an environment where risk explanations are impossible; sets up L10: in real markets the \u201cvig\u201d is trading costs and its size decides what survives.',
    content: {
      eyebrow: 'From the lab back to Wall Street', heading: 'What the Laboratory Licenses',
      body: 'The interaction seals the interpretation: overreaction theory predicts momentum should strengthen and value weaken when uncertainty is high — and it does, early in seasons and in low-confidence contracts. Testing the same prediction back in US equities: it holds there too. So the laboratory licenses a specific conclusion: value and momentum patterns can arise from pure overreaction, protected by transaction costs, with no risk premium anywhere. What it does not license is the claim that financial-market premia are ONLY that — there, magnitudes are five times larger and real covariance structure exists, leaving room for the risk stories of Lectures 4 through 7. Mispricing is real; so are its limits; and next lecture prices the limits themselves.',
      footnote: 'The vig was the toy version. Lecture 10 is the real one.',
    },
  },
];
