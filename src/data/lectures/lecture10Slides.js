/**
 * Lecture 10 — Trading Costs & Liquidity (MGT 595, Quantitative Investing)
 * Built from lectures/lecture10_outline_refined.json
 */

export const lecture10Slides = [
  // ── Block A: implementation shortfall ──
  {
    slideId: 1, type: 'explain', title: 'The Gap Between the Backtest and the Bank Account',
    contextLabel: 'Block A · Shortfall', blockId: 'A', module: 'liquidity',
    visual: 'TcostLab', visualProps: { mode: 'shortfall' },
    narration: '[clear] Your backtest trades any size at the mid-quote, instantly, for free. Your fund does not. [curious] The gap has a name, an accounting identity, and — most usefully — a diagnosis chart.',
    systemPromptContext: 'BLOCK A — Perold’s IMPLEMENTATION SHORTFALL: paper portfolio = the wish portfolio, marked at bid-ask midpoints, unlimited size, rebalanced in real time. Shortfall = paper return − real return (after all costs except management fees) = EXECUTION COSTS (spreads, impact, commissions actually paid) + OPPORTUNITY COSTS (paper profit on trades you didn’t do — limit orders never hit, positions skipped as too expensive). THE TRADEOFF: trade FAST → high execution costs, low opportunity cost; trade SLOW/passively → low execution, high opportunity cost + tracking error. MANAGING EFFORT (the diagnosis chart): shortfall LOW → spend effort on better strategies and being first; shortfall high from TC → trade slower, minimize impact; shortfall high from OPPORTUNITY costs → trade faster, accept higher TC for lower tracking error; a change pays off iff the reduction in one component exceeds the increase in the other. E(TC) = f(order size, execution speed, daily volume, volatility, shares outstanding, float, date, time...). BACKTEST ADJUSTMENT recipe: each rebalance, compute implied trades → estimate E(TC) per trade → subtract → recompute Sharpe/t-stats. Which strategies to trade fast? High-alpha-decay signals (short-term reversal, news) — their opportunity cost of waiting is huge; slow-decay signals (value) can afford patience.',
    content: {
      eyebrow: 'Perold’s accounting identity', heading: 'The Gap Between the Backtest and the Bank Account',
      body: 'Run two funds in parallel: the paper one, filling any order instantly at the quote midpoint, and the real one. The return difference is the implementation shortfall, and it decomposes exactly: execution costs — what trading did cost — plus opportunity costs — what not trading forfeited, every limit order that never filled while the stock ran away. The two components trade off against each other through one dial, patience, which makes the decomposition a diagnosis: shortfall dominated by execution costs says slow down; dominated by opportunity costs says speed up; low overall says your problem is the strategy, not the trading. Fast-decaying signals earn their costs back quickly or not at all; value can afford to wait.',
      footnote: 'Shortfall = execution + opportunity. Patience moves money between them.',
    },
  },
  {
    slideId: 2, type: 'problem', title: 'Your Turn: Diagnose a Shortfall',
    contextLabel: 'Block A · Your turn', blockId: 'A', module: 'liquidity',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 2,
      scenario: 'Last year your paper portfolio returned 12.0%; your real portfolio returned 10.8% (before management fees). Your execution desk measures realized trading costs of 70 bp for the year.',
      question: 'Compute the implementation shortfall and its opportunity-cost component (in basis points).',
      given: [['Paper return', '12.0%'], ['Real return', '10.8%'], ['Execution costs', '70 bp']],
      answers: [
        { label: 'Shortfall (bp)', value: 120, tolerance: 1 },
        { label: 'Opportunity cost (bp)', value: 50, tolerance: 1 },
      ],
      steps: [
        'Shortfall = ${}12.0\\% - 10.8\\% = 1.2\\% = 120 bp$.',
        'Opportunity cost = ${}120 - 70 = 50 bp$ — paper profits on trades that never happened.',
        'The diagnosis: with costs at 70 and opportunity at 50, you\'re near balance, tilted toward execution — modest patience might help, but neither dial is screaming. If opportunity were 100 of the 120, the verdict would be trade faster and pay up. The identity turns "we underperform our backtest" from a lament into an instruction.',
      ],
    },
    narration: '[calm] Two subtractions turn a vague underperformance into a specific instruction.',
    systemPromptContext: 'BLOCK A PROBLEM — VERIFIED: 1200−1080 = 120bp; 120−70 = 50bp. Common errors: computing 12.0/10.8 ratios; forgetting shortfall excludes management fees. Extension: which signals justify paying the 70? alpha decay comparison — a signal earning 30bp/month that decays in 2 weeks cannot wait; a value signal decaying over years can. Connect s1 diagnosis chart.',
    content: { eyebrow: 'Your turn', heading: 'Diagnose a Shortfall', problemTitle: 'Your Turn: Diagnose a Shortfall', footnote: 'Shortfall = paper − real = execution + opportunity.' },
  },
  {
    slideId: 3, type: 'interactive', title: 'What the Literature Said You’d Pay',
    contextLabel: 'Block A · TAQ estimates', blockId: 'A', module: 'liquidity',
    visual: 'TcostLab', visualProps: { mode: 'literature' },
    narration: '[thoughtful] Costs have collapsed for a century — and yet the academic estimates still said momentum barely survives them. [serious] Korajczyk and Sadka priced the average trade. The question nobody asked: is an arbitrageur the average trade?',
    systemPromptContext: 'BLOCK A — The literature’s cost estimates: trading costs fell over the century (Jones: record lows; turnover rose 54% → 99% daily 1994–2004 as a consequence). Korajczyk–Sadka (2004), intraday TAQ data, momentum after frictions: PROPORTIONAL costs (REAL table, monthly return cost for EXTREME WINNERS): effective spread: 0.19% equal-weighted, 0.12% value-weighted; quoted spread: 0.26% EW, 0.17% VW (effective spread = actual execution vs midpoint; quoted = posted bid-ask). NON-PROPORTIONAL price impact (Breen–Hodrick–Korajczyk: % return per net turnover over 30-min intervals; Lee–Ready signing of trades; Kyle 1985 says linear, empirics slightly concave) rises with trade size ⟹ BREAK-EVEN FUND SIZES for momentum are SMALL — the literature’s verdict: costs significantly bind most anomalies (also Chen–Stanzl–Watanabe, Lesmond–Schill–Zhou). THE CAVEATS (deck’s own): these numbers assume you DEMAND liquidity, trading everything at once, at the AVERAGE TAQ trade’s cost, in a naive un-optimized strategy; patience and SUPPLYING liquidity can cut costs substantially, at the price of tracking error. That caveat is the bridge to Block B.',
    content: {
      eyebrow: 'Korajczyk & Sadka and the TAQ tradition', heading: 'What the Literature Said You’d Pay',
      body: 'A century of falling commissions and decimalized spreads should have made anomalies cheap to harvest — yet the canonical estimates said otherwise. Korajczyk and Sadka priced momentum from intraday data: 12 to 26 basis points a month for the winner portfolio in spreads alone, plus price impact growing with size, implying break-even fund capacities small enough to make momentum a boutique product. But look at the assumptions doing the work: every trade demands liquidity, immediately, at the cost of the average market participant. The average trade includes the panicked, the informed, and the impatient. Whether a patient, systematic arbitrageur pays anything like that price is an empirical question — one that requires seeing an actual arbitrageur\'s tickets.',
      footnote: 'Effective spread · quoted spread · impact. All priced at the average trade.',
    },
  },

  // ── Block B: what a real arbitrageur pays ──
  {
    slideId: 4, type: 'interactive', title: '$1.7 Trillion of Receipts',
    contextLabel: 'Block B · Live trades', blockId: 'B', module: 'liquidity',
    visual: 'TcostLab', visualProps: { mode: 'anatomy' },
    narration: '[excited] Frazzini, Israel, and Moskowitz opened AQR’s books: every equity order from ninety-eight to twenty-sixteen. One-point-seven trillion dollars of actual executions. [clear] Here is what a trade actually does to a price.',
    systemPromptContext: 'BLOCK B — Frazzini–Israel–Moskowitz “Trading Costs of Asset Pricing Anomalies”: ALL longer-term equity orders and executions from AQR Capital, 1998–2016, $1.7 TRILLION traded, ~9,543 stocks, US + 20 developed markets, executed by automated algorithms; high-frequency/stat-arb trades EXCLUDED; portfolio decisions separate from trading (algos only choose duration, mostly within 1 day); orders broken into smaller randomized child orders; LIQUIDITY-PROVIDING limit orders (buy at bid or below, sell at ask or above). MI ANATOMY (deck’s worked example, REAL): around an execution: pre-execution drift, execution-period prices, then partial reversal after completion; AVERAGE MARKET IMPACT = 11 bps, decomposed into PERMANENT impact = 8.5 bps (the price level after reversal — information/lasting demand) and TEMPORARY impact = 2.5 bps (the liquidity-demand premium that decays). Measured vs theoretical model price (strategy efficacy) and vs VWAP (execution quality). Data fields per order: model price P_theory, arrival price P_start, execution price P_ex, quantities, horizon. Exogeneity: client-mandate trades, benchmark-tracking constraints, and (later) NEW-INFLOW first trades give quasi-exogenous size variation. Headline coming in s8: realized costs ≈ 1/10 of literature estimates.',
    content: {
      eyebrow: 'Frazzini, Israel & Moskowitz', heading: '$1.7 Trillion of Receipts',
      body: 'Instead of modeling costs from the average TAQ print, open a real arbitrageur\'s books: every longer-horizon equity order AQR executed from 1998 to 2016 — $1.7 trillion across 9,500 stocks in 21 markets, traded by algorithms that slice orders, randomize them, and post liquidity-providing limit orders rather than crossing the spread. The anatomy of an average execution: the price moves 11 basis points against the trade in total, of which 8.5 are permanent — the market genuinely repricing on the order\'s information — and 2.5 temporary, a liquidity premium that decays after the order completes. Keep that split in mind: it is about to explain why every cost function ever estimated looks the way it does.',
      footnote: 'Average ${}11 bp = 8.5$ permanent + 2.5 temporary. The split is the story.',
    },
  },
  {
    slideId: 5, type: 'problem', title: 'Your Turn: Price a Strategy’s Cost Drag',
    contextLabel: 'Block B · Your turn', blockId: 'B', module: 'liquidity',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 5,
      scenario: 'FIM\'s average trade: 11 bp of market impact, of which 8.5 bp is permanent. A strategy turns over 500% per year (each way — it trades five times its capital annually).',
      question: 'What is the temporary component of the average trade, and the strategy\'s annual cost drag?',
      given: [['Average MI', '11 bp'], ['Permanent', '8.5 bp'], ['Turnover', '500%/yr']],
      answers: [
        { label: 'Temporary MI (bp)', value: 2.5, tolerance: 0.05 },
        { label: 'Annual drag (%)', value: 0.55, tolerance: 0.01 },
      ],
      steps: [
        'Temporary = ${}11 - 8.5 = 2.5 bp$.',
        '$\\text{Drag} = \\text{turnover} \\times \\text{cost} \\text{per} \\text{trade} = 5 \\times 11 \\text{bp} = 55 \\text{bp} = 0.55\\% \\text{per} \\text{year}$.',
        'Now the punchline of the whole block: at literature costs (~10× these), the same strategy would pay ~5.5% a year — enough to kill nearly any anomaly in this course. At 0.55%, value, momentum, and size all clear the bar comfortably. The entire tradability debate compresses into which cost number you believe.',
      ],
    },
    narration: '[clear] Multiply turnover by cost per trade. Then do it again at ten times the cost, and watch the anomaly literature live or die.',
    systemPromptContext: 'BLOCK B PROBLEM — VERIFIED: 11−8.5 = 2.5; 5×0.11% = 0.55%. Common errors: using only temporary cost for drag (0.125% — the trader pays the full impact); forgetting turnover is 5×. Discussion: L7 Chen–Welch found ~7bp/mo of gross anomaly return post-2005 in large caps — against 0.55%/yr ≈ 4.6bp/mo of costs, the margin is thin but positive; at 10× costs, hopeless. The FIM-vs-literature cost dispute IS the tradability dispute.',
    content: { eyebrow: 'Your turn', heading: 'Price a Strategy’s Cost Drag', problemTitle: 'Your Turn: Price a Strategy’s Cost Drag', footnote: 'Drag $= \\text{turnover} \\times \\text{cost per trade}$.' },
  },
  {
    slideId: 6, type: 'interactive', title: 'The Shape of Market Impact',
    contextLabel: 'Block B · The cost function', blockId: 'B', module: 'liquidity',
    visual: 'MarketImpactLab', visualProps: { mode: 'function' },
    narration: '[curious] Plot impact against trade size and two different laws appear: the permanent part rises in a straight line, exactly as Kyle predicted. [surprised] The temporary part bends — a square root. And the bend, it turns out, is partly an illusion.',
    systemPromptContext: 'BLOCK B — REAL curve data (bps vs fraction of daily volume, FIM slide 77 embedded data): TOTAL market impact: 2.46 (0% — the fixed cost of showing up), 9.23 (1%), 12.23 (2%), 14.60 (3%), 16.66 (4%), 18.51 (5%). PERMANENT component (after 10 trade lags): 2.25, 4.06, 5.99, 7.95, 9.91, 11.88 — LINEAR: cannot reject linearity (≈ 2.25 + 1.93 per % DTV); Kyle (1985) lambda for the information component. TEMPORARY component: 0.21, 6.90, 8.61, 9.51, 9.98, 10.19 — strongly CONCAVE: on a log-log plot the coefficient is 0.49 ⟹ square-root law; linearity easily rejected. Trade-size distribution (REAL histogram): 0–0.5% DTV: 1,405,055 orders; 0.5–1%: 236,618; 1–1.5%: 121,911; 1.5–2%: 76,485; 2–2.5%: 52,589; ... 4.5–5%: 13,776 — the vast majority of real orders are TINY fractions of daily volume, where costs are single-digit bps. Regression model: MI on trade size (sqrt and linear terms), firm size, volatility, contemporaneous market returns — used to PREDICT costs for all stocks (coefficients to be published for researchers). Time variation: impact spikes in crises (2000–02, 2008). Comparison: at the same trade sizes, the Korajczyk–Sadka model predicts costs several times larger than AQR’s realized costs.',
    content: {
      eyebrow: 'Permanent is linear, temporary bends', heading: 'The Shape of Market Impact',
      body: 'A trade of 1% of daily volume moves the price 9.2 basis points; 5% moves it 18.5 — the total curve bends, the square-root law every desk uses. But decompose it and two clean laws emerge: the permanent component climbs in a straight line from 2.25 to 11.9 bp, exactly Kyle\'s linear information model (linearity can\'t be rejected), while the temporary component does all the bending — 0.2 to 10.2 bp with a log-log slope of 0.49, a textbook square root. Meanwhile the histogram shows where real trading actually lives: 1.4 million of AQR\'s orders were under half a percent of daily volume, in single-digit-bp territory. The obvious next question: why would the price of immediacy — the temporary part — bend at all?',
      footnote: 'Real curves from $1.7T of executions. Toggle the components.',
    },
  },
  {
    slideId: 7, type: 'interactive', title: 'The Bend Is Partly You',
    contextLabel: 'Block B · Endogeneity', blockId: 'B', module: 'liquidity',
    visual: 'MarketImpactLab', visualProps: { mode: 'endogeneity' },
    narration: '[thoughtful] Traders are patient exactly when they expect impact to be high — so measured impact flattens at the top. [clear] Look at trades with no discretion — forced buys from new client inflows — and the square root straightens back toward a line.',
    systemPromptContext: 'BLOCK B — Why is temporary MI concave? ENDOGENEITY of discretionary trading: you trade patiently when E[impact] is high and quickly only when it’s low, so the measured curve flattens — “the only large trades we do quickly are those with small MI, which makes the MI function LOOK concave.” Tests: (1) AGGRESSIVENESS buckets (25th/50th/75th percentile of aggressiveness ratio): PASSIVE trades follow the sqrt function; AGGRESSIVE trades follow a LINEAR function (sqrt term rejected in broker algos; mostly linear in-house) — remove the discretion and the bend straightens. (2) NEW INFLOWS (first trades from client inflows — size is exogenous, must be done): REAL curves: inflow MI: 2.59 (0), 9.75 (1%), 14.22 (2%), 18.25 (3%), 22.05 (4%), 25.70 bps (5%) vs non-inflow: 1.17, 9.70, 13.35, 16.21, 18.65, 20.83 — inflows are STEEPER and the sqrt term is INSIGNIFICANT: with stock and day fixed effects, inflows face a LINEAR MI function (“we have little discretion over inflow trade size, some over stock and day”). (3) Participation-rate error: unexpected %DTV (volume forecast error) maps the true forced-trade function — closer to linear. LESSON: the universal sqrt cost model is partly an artifact of optimized trading; for FORCED flows (redemptions, rebalances you can’t delay, crisis exits) budget closer to LINEAR costs — a direct bridge to Block D’s fire sales. Brokers get more aggressive as expected order size rises and even more for surprises (catching up), at an increasing rate.',
    content: {
      eyebrow: 'Aggression, inflows, and forecast errors', heading: 'The Bend Is Partly You',
      body: 'The square root flatters you because you drew it yourself: traders are patient precisely when they expect impact to be high, and fast only when it\'s cheap, so the top of the measured curve is populated by the lucky. Three tests expose it. Sort trades by aggressiveness: passive executions trace the square root, aggressive ones a straight line. Isolate first trades from new client inflows — size dictated, no discretion: the curve steepens (25.7 vs 20.8 bp at 5% of volume) and the square-root term dies; controlling for stock and day, inflows face linear impact. And volume-forecast errors — participation you didn\'t choose — price the same way. Budget with the square root for trading you control; budget linear for trading that controls you.',
      footnote: 'Discretionary → $\\sqrt{s}\\text{ize}.$ Forced → linear. Crises are forced.',
    },
  },
  {
    slideId: 8, type: 'explain', title: 'One-Tenth the Price, Ten Times the Capacity',
    contextLabel: 'Block B · Verdict', blockId: 'B', module: 'liquidity',
    visual: 'TcostLab', visualProps: { mode: 'verdict' },
    narration: '[excited] The realized costs come in at roughly one-tenth of the literature’s estimates. [clear] Rerun the anomaly ledger at real prices: size, value, and momentum survive at institutional scale. Short-term reversal does not — some things really are too expensive.',
    systemPromptContext: 'BLOCK B — The FIM verdict: realized trading costs ≈ 1/10 of literature estimates; break-even capacities MANY TIMES larger. Using ACTUAL dollars traded and realized costs (“no estimation here”): SIZE, VALUE, MOMENTUM all survive trading costs at high capacity; SHORT-TERM REVERSAL does NOT (its turnover is too high for even cheap trading). WHY the literature was 10× too high: (1) the AVERAGE trade’s cost ≠ the cost facing a patient arbitrageur — averages include the informed, the impatient, the panicked; (2) portfolios and execution can be designed ENDOGENOUSLY to costs: liquidity-providing limit orders, slicing, patience. OPTIMIZED PORTFOLIOS: minimize E(TC) subject to tracking error vs the paper factor (SMB/HML/UMD): the tracking-error frontier shows net Sharpe and capacity rising substantially for tiny style drift — build the portfolio net of E(TC), don’t bolt costs onto a paper portfolio afterwards. Course link: this ADJUDICATES L7’s Chen–Welch pessimism — CW measured gross anomaly returns in the investable universe (7bp/mo post-2005); FIM measures the COST side and finds it small for patient capital; the surviving edge is thin but real for low-turnover factors, and negative for high-turnover ones (STR). Both can be true: anomalies were arbitraged toward the cost boundary, and the boundary is ~10× lower than academics assumed.',
    content: {
      eyebrow: 'The anomaly ledger, repriced', heading: 'One-Tenth the Price, Ten Times the Capacity',
      body: 'Add it up: costs realized on $1.7 trillion of live trades run about one-tenth of the canonical academic estimates, for two stated reasons — an arbitrageur is not the average trade, and portfolios can be designed around expected costs rather than billed after the fact. Repricing the anomaly ledger at these numbers: size, value, and momentum all survive at institutional scale, with break-even capacities many times the literature\'s; short-term reversal, whose turnover devours even cheap trading, does not. And the constructive tool: optimize the portfolio against E(TC) subject to tracking error, and small tolerated style drift buys large gains in net Sharpe and capacity. Lecture 7 asked whether anomalies survive contact with the market. Answer: the patient ones do — because patience is exactly what makes the market cheap.',
      footnote: 'Survivors: size, value, momentum. Casualty: short-term reversal.',
    },
  },

  // ── Block C: liquidity level and prices ──
  {
    slideId: 9, type: 'explain', title: 'Illiquidity Is a Cash Flow (a Negative One)',
    contextLabel: 'Block C · Liquidity & prices', blockId: 'C', module: 'liquidity',
    visual: 'LiquidityLab', visualProps: { mode: 'pricing' },
    narration: '[clear] Every future trade you’ll ever make in an asset is a small negative dividend. [curious] Discount them all and illiquidity lowers the price today — which raises the return, and explains a family of one-price violations we met in Lecture 3.',
    systemPromptContext: 'BLOCK C — Liquidity LEVEL and prices: five sources of illiquidity (deck): exogenous transaction costs (fees, taxes); demand pressure / search costs; inventory risk (market maker bears price risk, charges); private information (adverse selection — fundamentals or order flow); locating a counterparty (OTC search, negotiation) — each imposes a cost someone must be paid to bear. PRICING: equilibrium price = PV(all future cash flows) − PV(all future TRADING COSTS, at expected trading frequency μ) ⟹ E(R) = rf + risk premium + μ×c (per-period percentage cost = relative cost × trading frequency). CLIENTELE EFFECT: everyone prefers low costs but short-horizon investors value liquidity MOST → they hold liquid assets; PATIENT long-horizon investors hold illiquid assets in equilibrium and earn MORE than their own amortized costs (the marginal holder trades more often than they do) ⟹ the liquidity premium EXCEEDS the patient holder’s cost — illiquidity is a subsidy to patience. Subtlety: with perfect borrowing, everyone could smooth shocks and hold forever — WITHOUT borrowing constraints, market liquidity wouldn’t be priced: FUNDING liquidity is what makes MARKET liquidity matter (Block D bridge). LOOP violations explained: 3Com/Palm (L3 callback), on-the-run vs off-the-run Treasuries (identical cash flows, newer bond more liquid, pricier), restricted vs common shares, put-call parity under shorting constraints.',
    content: {
      eyebrow: 'Amihud–Mendelson logic', heading: 'Illiquidity Is a Cash Flow (a Negative One)',
      body: 'Treat every future trade in an asset as a small negative dividend — the spread and impact you\'ll pay each time — and discount the stream: the price today falls by the present value of all future trading costs, so the expected return rises by trading frequency times cost per trade, μ×c. Then the clientele twist: impatient investors crowd into liquid assets, leaving illiquid ones to patient holders — who therefore earn a premium calibrated to someone else\'s trading frequency, more than their own amortized costs. Illiquidity is a tax on the impatient and a subsidy to the patient. It also quietly resolves Lecture 3\'s one-price scandals: on-the-run Treasuries out-pricing identical off-the-runs is the μ×c term, made visible.',
      footnote: '$E(R) = r_f + \\text{risk premium} + \\mu c$. Patience collects the last term.',
    },
  },
  {
    slideId: 10, type: 'problem', title: 'Your Turn: Price the Illiquidity',
    contextLabel: 'Block C · Your turn', blockId: 'C', module: 'liquidity',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 10,
      scenario: 'An asset costs c = 1% per round trip to trade, and its marginal holder trades μ = 2 times per year. Separately, Acharya–Pedersen\'s calibration attributes 3.5%/yr of expected return to the liquidity LEVEL and 1.1%/yr to liquidity RISK.',
      question: 'What liquidity-level premium does μ×c imply, and what is Acharya–Pedersen\'s total liquidity-related premium?',
      given: [['c', '1% per trade'], ['μ', '2 trades/yr'], ['AP level', '3.5%/yr'], ['AP risk', '1.1%/yr']],
      answers: [
        { label: '$\\mu$×c premium $(\\%/yr)$', value: 2.0, tolerance: 0.02 },
        { label: 'AP total $(\\%/yr)$', value: 4.6, tolerance: 0.05 },
      ],
      steps: [
        '$\\mu \\times c = 2 \\times 1\\% = 2.0\\%$ per year — the amortized cost of the marginal trader, capitalized into the price.',
        'Acharya–Pedersen: 3.5 + 1.1 = 4.6% per year of expected return traced to liquidity — level plus risk.',
        'For scale: 4.6% rivals the equity premium itself. A patient investor who trades μ = 0.2 times a year amortizes only 0.2% of cost against that 2%+ premium — the difference is the structural reward to patience that Block B\'s trading results monetized from the other side.',
      ],
    },
    narration: '[calm] Multiply, then add — and notice the total is the size of the equity premium.',
    systemPromptContext: 'BLOCK C PROBLEM — VERIFIED: 2×1 = 2.0%; 3.5+1.1 = 4.6%. Common error: dividing c by μ (0.5%). Discussion: why does the premium reflect the MARGINAL (frequent) trader’s μ, not the patient holder’s? Prices set by the marginal investor; patient capital is inframarginal and pockets the surplus. Bekaert–Harvey–Lundblad: local liquidity risk in emerging markets priced at 85bp/MONTH — an order of magnitude larger where patient capital is scarce.',
    content: { eyebrow: 'Your turn', heading: 'Price the Illiquidity', problemTitle: 'Your Turn: Price the Illiquidity', footnote: 'Premium $= \\mu\\times c$ · AP total $=$ level $+$ risk.' },
  },

  // ── Block D: liquidity risk ──
  {
    slideId: 11, type: 'interactive', title: 'The CAPM, With Liquidity Bolted On Properly',
    contextLabel: 'Block D · LCAPM', blockId: 'D', module: 'liquidity',
    visual: 'LiquidityLab', visualProps: { mode: 'lcapm' },
    narration: '[clear] Write the CAPM for returns net of trading costs and expand the covariance: one familiar beta — and three new ones, each with a sign and a story. [thoughtful] Commonality in liquidity. Returns when the market seizes. Costs when the market falls.',
    systemPromptContext: 'BLOCK D — Acharya–Pedersen LIQUIDITY-ADJUSTED CAPM (deck formulas verbatim): the CAPM holds for NET returns: E(R−c) = rf + β·E(Rm−cm−rf) with β = cov(R−c, Rm−cm)/var$(Rm-cm)$. Expand for GROSS returns: E(R) = rf + E(c) + [β(R,Rm) + β(c,cm) − β(R,cm) − β(c,Rm)]·E(Rm−cm−rf). FOUR BETAS (sign, interpretation): (1) cov(Ri,Rm) +: standard market beta. (2) cov(ci,cm) +: COMMONALITY IN LIQUIDITY — bad to hold assets whose trading costs RISE when everyone’s do (you pay up to exit exactly when exiting is common) ⟹ raises required return. (3) −cov(Ri,cm): return sensitivity to AGGREGATE liquidity — an asset that PAYS OFF when the market becomes illiquid is a hedge ⟹ lowers required return (enters negatively). (4) −cov(ci,Rm): liquidity sensitivity to market conditions — an asset that stays CHEAP TO SELL in downturns is valuable ⟹ lowers required return; one whose costs explode in down markets (small caps, EM) must pay more. Net systematic risk = cov(Ri−ci, Rm−cm) decomposed into exactly these four. Empirics: AP calibration: liquidity RISK premium 1.1%/yr, LEVEL premium 3.5%/yr (Pastor–Stambaugh find larger risk premium but don’t control for level; Sadka similar; Bekaert–Harvey–Lundblad: LOCAL liquidity risk priced 85bp/MONTH in 19 emerging markets, global much smaller). Lux: quiz students on the SIGNS — e.g., why does a positive cov(ci,Rm) (costs rise when market rises) LOWER required return? Because the dangerous asset is the one whose costs rise when the market FALLS.',
    content: {
      eyebrow: 'Acharya & Pedersen (2005)', heading: 'The CAPM, With Liquidity Bolted On Properly',
      body: 'Assert the CAPM for what investors actually keep — returns net of trading costs — and expand the covariance: four betas fall out. The standard one, plus three liquidity risks, each priced with a sign. Commonality in liquidity: if your asset\'s costs rise when everyone\'s do, you pay to exit exactly when exits are crowded — required return up. Return sensitivity to aggregate liquidity: an asset that pays off when markets seize is a hedge — required return down. And liquidity sensitivity to market conditions: an asset that stays cheap to sell in a downturn is precious; one whose spread explodes as prices fall (small caps, emerging markets) must compensate you in advance. Calibrated: about 1.1% a year for the risks, on top of 3.5% for the level.',
      footnote: 'Click each beta for its sign, story, and worst-case asset.',
    },
  },
  {
    slideId: 12, type: 'problem', title: 'Your Turn: Compute a Net Beta',
    contextLabel: 'Block D · Your turn', blockId: 'D', module: 'liquidity',
    visual: 'QuantNumericProblem', requireCompletion: true,
    visualProps: {
      slideId: 12,
      scenario: 'For an emerging-market asset: $\\text{cov}(R,Rm) = 0.9$, $\\text{cov}(c,cm) = 0.1$, $\\text{cov}(R,cm) = -0.05$ (it does badly when markets get illiquid), $\\text{cov}(c,Rm) = -0.15$ (its costs spike when the market falls). Normalize $\\text{var}(Rm-cm) = 1$, and take the net market premium $E(Rm-cm-rf) = 6\\%$.',
      question: 'Compute the liquidity-adjusted (net) beta and the required premium over r_f + E(c).',
      given: [['cov(R,Rm)', '0.9'], ['cov(c,cm)', '0.1'], ['cov(R,cm)', '−0.05'], ['cov(c,Rm)', '−0.15'], ['var(Rm−cm)', '1'], ['Net premium', '6%']],
      answers: [
        { label: 'Net beta', value: 1.20, tolerance: 0.01 },
        { label: 'Required premium (%)', value: 7.2, tolerance: 0.05 },
      ],
      steps: [
        'Net beta = $\\beta (R,Rm) + \\beta (c,cm) - \\beta (R,cm) - \\beta (c,Rm) = 0.9 + 0.1 - (-0.05) - (-0.15) = 1.20$.',
        'Premium = 1.20 × 6% = 7.2% (over r_f plus expected costs E(c)).',
        'Read the composition: a 0.9 market beta grew to 1.2 purely from liquidity risks — commonality (+0.1), losing value when liquidity dries up (+0.05), and costs that spike in down markets (+0.15). A third of this asset\'s systematic risk never touches its returns\' covariance with the market — it lives in the trading costs.',
      ],
    },
    narration: '[clear] Four covariances, three of them about trading costs — and the beta climbs from zero-point-nine to one-point-two.',
    systemPromptContext: 'BLOCK D PROBLEM — VERIFIED: 0.9+0.1+0.05+0.15 = 1.20; 1.2×6 = 7.2%. Common error: adding all four with positive signs incorrectly is actually what happens here BECAUSE the last two covariances are negative and enter with minus signs — watch students who compute 0.9+0.1−0.05−0.15 = 0.80 (sign error, rejected). The example is deliberately an EM-style asset: negative cov(R,cm) and cov(c,Rm) are the empirically dangerous configuration (Bekaert 85bp/mo).',
    content: { eyebrow: 'Your turn', heading: 'Compute a Net Beta', problemTitle: 'Your Turn: Compute a Net Beta', footnote: '$\\beta_{\\text{net}} = \\beta(R,R_m) + \\beta(c,c_m) - \\beta(R,c_m) - \\beta(c,R_m)$.' },
  },
  {
    slideId: 13, type: 'interactive', title: 'Spirals: How Liquidity Evaporates',
    contextLabel: 'Block D · Spirals', blockId: 'D', module: 'liquidity',
    visual: 'LiquidityLab', visualProps: { mode: 'spirals' },
    narration: '[serious] Losses force position cuts. Cuts move prices against everyone positioned alike. Margins rise, risk limits tighten, and each turn of the wheel funds the next. [clear] And the exit leaves a fingerprint: a smooth slide, a sudden rebound, a lower resting place.',
    systemPromptContext: 'BLOCK D — Brunnermeier–Pedersen liquidity spirals: liquidity is PROVIDED by speculators (market makers, hedge funds, prop desks) who must FUND positions with capital W and margins m; well-funded speculators trade more → market liquidity. Feedback the OTHER way: good market liquidity lowers margins (collateral easier to sell, lower vol) → mutual feedback → SPIRALS: initial losses (e.g., credit shock) → positions reduced → prices move AWAY from fundamentals → further losses on existing positions (LOSS SPIRAL) + volatility rises, liquidity falls → margins RAISED (MARGIN SPIRAL) + risk management tightens, counterparty exposure cut (RISK-MANAGEMENT SPIRAL) → more position cuts... until a new equilibrium. Implications observed in practice: sudden liquidity dry-ups; COMMONALITY of liquidity (funding problems hit many securities at once — the +cov(ci,cm) beta’s origin); liquidity correlated with volatility (volatile collateral needs more capital); flight to quality (capital-intensive high-margin securities abandoned first); market liquidity moves with the market (funding does). RUN-FOR-THE-EXIT price path (theory, deck): prices decline MORE SMOOTHLY than a random walk (sequential forced selling), then SUDDENLY REBOUND (the distinguishing fingerprint vs fundamentals — fundamental news doesn’t un-happen), and END LOWER than they started (some investors left the market permanently). Connect: BNP currency crashes (L9) are this machine running in FX; the linear forced-trade cost function (s7) is the price of each turn of the wheel.',
    content: {
      eyebrow: 'Brunnermeier & Pedersen (2009)', heading: 'Spirals: How Liquidity Evaporates',
      body: 'Market liquidity is manufactured by leveraged speculators, and their leverage is the vulnerability: an initial loss forces position cuts; cuts move prices against everyone holding the same trade, generating new losses (the loss spiral); falling prices and rising volatility make lenders raise margins (the margin spiral); risk departments tighten limits and cut counterparties (the risk-management spiral) — and each wheel turns the others. The theory stamps a fingerprint on prices that fundamentals can\'t forge: the decline is smoother than a random walk as sellers queue, the rebound is sudden when forced selling exhausts, and the resting price is lower than the start because some of the market\'s capital didn\'t come back. Learn the fingerprint — the next slide shows it in the wild, three times.',
      footnote: 'Loss spiral · margin spiral · risk-management spiral. Then the rebound.',
    },
  },
  {
    slideId: 14, type: 'interactive', title: 'Three Exits, One Fingerprint',
    contextLabel: 'Block D · Case studies', blockId: 'D', module: 'liquidity',
    visual: 'LiquidityLab', visualProps: { mode: 'crises' },
    narration: '[serious] August 2007: a value-momentum book collapses inside the most liquid stocks on earth — invisible unless you wore long-short glasses. [thoughtful] Twenty-oh-five, converts. Twenty-ten, the flash crash. Same slide, same rebound, same missing capital.',
    systemPromptContext: 'BLOCK D — Case studies (deck): QUANT EVENT Aug 2007: certain quant equity investors hit funding problems → others ran for the exit → a value-momentum long/short portfolio was severely hit in US LARGE CAPS — “normally one of the world’s most liquid markets”; the episode was ALMOST INVISIBLE to non-quants: index levels barely moved — it must be seen through the lens of a long/short portfolio (crowding risk is portfolio-space, not asset-space). CONVERTIBLE BOND CRISIS 2005 (Mitchell–Pedersen–Pulvino): hedge fund redemptions → forced selling → converts cheapened vs theoretical value → losses → more redemptions → desks fired; slow-moving capital eventually arrived. FLASH CRASH May 6 2010, 2–3PM ET: liquidity provision withdrew in minutes; V-shaped price path = the rebound fingerprint at high frequency. GFC SPILLOVER chain: subprime credit → US quant equity → global quant (Japan) → currency markets — commonality across seemingly unrelated markets via shared funders (the BNP co-movement result at planet scale). FUNDING-LIQUIDITY MEASURES: TED spread, LIBOR–repo, on-the-run minus off-the-run spread, VIX, quantity/survey measures, Pastor–Stambaugh and Acharya–Pedersen factors. PRICING recap: AP 1.1% risk + 3.5% level; PS larger (no level control); Bekaert local EM 85bp/mo. Lux: ask which LCAPM beta each case study stresses (2007 quant: cov(ci,cm) commonality; converts: cov(Ri,cm); flash crash: the spiral itself).',
    content: {
      eyebrow: '2005 · 2007 · 2010', heading: 'Three Exits, One Fingerprint',
      body: 'August 2007: funding trouble at a few quant funds forces selling of the crowded value-momentum book, and the spiral runs to completion inside US large caps — the most liquid stocks on earth — while remaining invisible to anyone not holding the long-short portfolio; indexes barely flinched. 2005: convertible-bond redemptions force sales, converts cheapen against their own theoretical values, losses trigger more redemptions. May 6, 2010: liquidity provision withdraws for one hour and prices carve the V of a forced exit and sudden rebound at high frequency. Three markets, three speeds, one fingerprint — smooth slide, sharp recovery, missing capital — and one lesson for measurement: watch the funders (TED, on-the-run spreads, VIX), because market liquidity dies where funding liquidity dies first.',
      footnote: 'Click each case; match it to its LCAPM beta.',
    },
  },
  {
    slideId: 15, type: 'explain', title: 'The Practitioner’s Stack, Complete',
    contextLabel: 'Block D · Course capstone', blockId: 'D', module: 'liquidity',
    visual: 'LiquidityLab', visualProps: { mode: 'verdict' },
    narration: '[thoughtful] Ten lectures compress into one pipeline: find the signal, run the gauntlet, build the portfolio net of costs, and size it to survive the spiral. [clear] Markets are efficient enough to make this hard — and inefficient enough to make it worth doing. That tension was the course.',
    systemPromptContext: 'BLOCK D — Course capstone: THIS lecture’s ledger: costs matter for security choice, the decision to trade, the speed of trade (execution vs opportunity), and where to spend effort; liquidity LEVEL is priced (≈3.5%/yr); liquidity RISK is priced (≈1.1%/yr; 85bp/mo local EM); spirals make both spike together. THE FULL-COURSE PIPELINE: (L1–2) statistical machinery and the CAPM null → (L3) efficiency, the joint hypothesis, and the first anomalies → (L4) value → (L5) momentum → (L6) quality and BAB (funding constraints first appearance) → (L7) the robustness gauntlet: t≥3, robustness, out-of-sample, a story → (L8) the same signals everywhere + trend + the sports lab proving mispricing exists and limits protect it → (L9) carry: observable expected returns, crash risk from funding → (L10) the final filter: E(TC)-aware construction (FIM: patient costs ≈ 1/10 of feared; size/value/momentum survive, STR dies), liquidity premia, and spiral-survivable sizing. GROSSMAN–STIGLITZ CLOSURE: equilibrium requires just enough inefficiency to pay for the correcting; trading costs, funding constraints, and liquidity risk are the “cost of correcting” — the anomalies that survive are exactly those whose correction is expensive in these specific ways. Final Lux posture: the student now owns the full stack — statistics, factors, skepticism, implementation; encourage synthesis questions across all ten lectures.',
    content: {
      eyebrow: 'End of MGT 595', heading: 'The Practitioner’s Stack, Complete',
      body: 'The course now closes as a single pipeline. Statistics and the CAPM built the null; efficiency named the burden of proof; value, momentum, quality, trend, and carry supplied candidate premia; the robustness gauntlet decided which deserved belief. This lecture added the last two filters — what implementation costs (about a tenth of what academics feared, for patient capital, which is why size, value, and momentum survive at scale while short-term reversal dies) and what liquidity charges (3.5% for the level, 1.1% for the risk, spirals for the leverage). The synthesis is Grossman–Stiglitz, finally made quantitative: markets stay exactly inefficient enough to pay the costs of correcting them — and those costs now have numbers. Trade patiently, size survivably, and collect what the impatient leave behind.',
      footnote: 'MGT 595, complete: 10 lectures, 4 premia, 1 gauntlet, and the bill.',
    },
  },
];
