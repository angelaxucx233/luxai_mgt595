# LuxAI — Master QA Checklist · Lectures 1–10

**How to use this:** open the app in Chrome and this file in TextEdit side by side. Work down each lecture, ticking boxes. Every problem line lists the exact numbers to type — enter them and both fields should turn **green**. If anything on screen doesn't match what a line promises, copy the line + what you saw and paste it to Claude.

All answers below were extracted programmatically from the deck files and re-verified by hand — they are the ground truth the app checks against.

**Status:** All 10 lectures built (course extended). This checklist covers the complete course.

---

## Global checks (once)

- [ ] Home catalog shows **10 available lecture cards** (01 Foundations, 02 Asset Pricing Tests, 03 Market Efficiency, 04 The Value Premium, 05 Momentum, 06 Quality & Defensive, 07 Robustness of Anomalies, 08 Other Asset Classes, 09 Carry, 10 Trading Costs & Liquidity) — nothing locked
- [ ] Each card opens to slide 1 of the right deck; slide counter shows /23, /14, /15, /14, /15, /13, /16, /14, /14, /15 respectively
- [ ] Back/forward navigation works; problem slides block "next" until solved (requireCompletion)
- [ ] Lux chat panel opens on every slide and responds in context

---

## Lecture 01 — Foundations (23 slides)

### Visual spot-checks
- [ ] s1/s2 UtilityCurveExplorer: dragging wealth slider moves the chord/curve gap (risk premium)
- [ ] s6 ReturnDistributionLab: fat-tail toggle visibly changes the histogram tails
- [ ] s9 DiversificationLab: ρ dial at −1 drives portfolio σ to ~0
- [ ] s11 FrontierExplorer (cal): CAL pivots on the risk-free point as you move σ
- [ ] s20 EstimationRiskSim: "run experiment" produces scattered out-of-sample frontiers (Jorion)
- [ ] s22 SmlExplorer: mispriced dot plots above/below the SML

### Problems — type these, expect green
- [ ] **s3**: CE = **86.6**, π = **13.4**
- [ ] **s7**: E[r] = **5**, σ = **11.62**
- [ ] **s10**: σ_p = **13.74**
- [ ] **s12**: ω* = **41**
- [ ] **s17**: r_MVP = **8**, σ_MVP = **20**
- [ ] **s23**: Required E[r] = **11.4**

### Lux spot-checks
- [ ] On s3, ask "what's the answer?" → Lux gives a hint (utility of each outcome), not the number
- [ ] On s9, ask "why does correlation matter?" → answer references the covariance term

---

## Lecture 02 — Asset Pricing Tests (14 slides)

### Visual spot-checks
- [ ] s2 SystematicRiskLab (decompose): slider splits total variance into β²σ²_m + idiosyncratic
- [ ] s4 FamaMacbethLab (twopass): stepping months accumulates γ̂ estimates; mean line settles
- [ ] s5 FamaMacbethLab (eiv): raising measurement noise flattens the fitted slope toward zero
- [ ] s9 GrsGeometry: adding the test asset pushes the tangency Sharpe up; gap = GRS intuition
- [ ] s12 CrossSectionExplorer (ff93): 5×5 grid shows returns rising with B/M within size rows

### Problems
- [ ] **s3**: Total σ = **20.59**, Systematic share = **76.4**
- [ ] **s6**: Expected fitted slope = **0.30**
- [ ] **s10**: J₁ = **0.391**
- [ ] **s13**: Expected excess return = **9.1**

### Lux spot-checks
- [ ] On s5, ask "why does noise in beta flatten the slope?" → errors-in-variables attenuation

---

## Lecture 03 — Market Efficiency (15 slides)

### Visual spot-checks
- [ ] s1 EventStudyLab (dcf): moving r or g repricing follows P = D/(r−g)
- [ ] s3 EventStudyLab (car): CAR path jumps at day 0, then drifts/flattens by scenario
- [ ] s5 RandomWalkLab (paths): regenerate produces new random walks
- [ ] s11 AnomalyGallery: tabs switch between anomalies with their stats
- [ ] s13 StubCalculator: defaults show the 3Com/Palm stub ≈ **−$60.78** — check the sign is negative

### Problems
- [ ] **s4**: CAR = **5.02**
- [ ] **s7**: % variance = **1.0**, t-stat = **2.0**
- [ ] **s10**: Annual MP premium = **14.1**
- [ ] **s14**: Stub = **−14.0** (minus!), Annualized cost = **119.5**

### Lux spot-checks
- [ ] On s13, ask "how could the market allow this?" → limits to arbitrage / shorting constraints

---

## Lecture 04 — The Value Premium (14 slides)

### Visual spot-checks
- [ ] s1 LsvLab (doublesort): five sort buttons; **C/P × GS** shows corners **11.3** (glamour) and **21.5** (value); switching to **E/P × GS** shows **11.8 / 22.4**
- [ ] s2 EventStudyLab (dcf): same Gordon machine as L3 s1 renders (cross-lecture reuse)
- [ ] s3 LsvLab (years): annual bars 1968–89, three red (negative) bars at 1971/1979/1985, tallest bar **+38.5** in 1975, R and D markers under axis; caption says **19 of 22 years** positive
- [ ] s5 Ff96Scoreboard: seven rows; momentum row shows **REJECT** in red with GRS F = 4.45; clicking C/P row shows **p = 0.90 PASS**
- [ ] s6 Ff96Scoreboard (debate): three tabs (Any three portfolios / FF vs LSV / Unfinished business) all render
- [ ] s9 CharCovLab (test): five bars **0.740 / 0.817 / 0.846 / 0.866 / 0.806**; "Hide/Show risk-model prediction" toggles the dashed red rising line; "The counterattack" tab shows DFF 2000 / Berk 2001 / DT reply cards
- [ ] s11 ValueDrawdownLab (patience): with SR = 0.40, landmark dots read **1y: 34%** and **10y: 10%**; dragging SR to 1.0 pulls the whole curve down
- [ ] s12 ValueDrawdownLab (spread): clicking all five suspects strikes them out and reveals the amber "What survives: re-pricing" card; timeline shows 2000 (gold) and 2020 (red, 99th pct) peaks
- [ ] s14 ValueDrawdownLab (verdict): behavioral vs risk cards + 0.98-correlation card

### Problems
- [ ] **s4**: Value implied g = **4.0**, Glamour implied g = **7.0**
- [ ] **s7**: Three-factor alpha = **2.6**
- [ ] **s10**: Predicted spread = **0.80**, Observed spread = **0.066** (also try 0.07 — should still pass, tolerance ±0.012)
- [ ] **s13**: P(1yr) = **34.5**, P(10yr) = **10.3**
- [ ] Wrong-answer check on s4: enter **5.0** for the value stock (the classic D/P-without-subtracting error) → should be red

### Lux spot-checks
- [ ] On s4, ask "just give me g" → hint about rearranging Gordon, not the answer
- [ ] On s9, ask "who wins, DT or Fama-French?" → balanced answer citing DFF 2000 sample extension and DT's dependent-sort defense
- [ ] On s11, ask "what Sharpe makes a lost decade a 1-in-20 event?" → walks toward SR ≈ 0.52

---

## Lecture 05 — Momentum (15 slides)

### Visual spot-checks
- [ ] s1 MomentumLab (horizons): seven bars; 1mo (−0.82), 36mo, 60mo red; 12mo tallest navy at **0.58**; clicking a bar updates the caption
- [ ] s2 MomentumLab (deciles): toggle between raw returns (P1 0.46 → P10 1.63) and 3-factor alphas (P1 **−0.67** red → P10 **+0.87**); caption cites WML alpha **1.53, t = 5.93**
- [ ] s4 MomentumLab (decompose): three bars — factor-timing bar points LEFT (negative, red); clicking each shows its story
- [ ] s5 MomentumLab (industry): five horizontal bars; "Industry-neutral" is grey with **0.08 (t 0.91) ✗**; "Random industries" points slightly left
- [ ] s7 MomentumEvidence (oos): "Across time" table shows post-publication row alpha **1.17 (3.27)**; "Across everything else" shows Japan **0.12** grey and EW-all **0.81** amber
- [ ] s8 MomentumEvidence (states): bear-market row shows mkt −4.43 grey left, WML **+1.46** teal right
- [ ] s9 CrashLab (anatomy): histogram with red left tail; moments card shows skew **−3.0** / kurtosis **28.7**; "two great crashes" tab shows 1932 (+236% losers) and 2009 (+156%) cards
- [ ] s10 CrashLab (betas): clicking "Bear market + up month" turns the button red and animates loser β to **3.7**, WML β to **−1.44**
- [ ] s12 CrashLab (dynamic): US-by-period bars end 0.52/0.87/**1.12**; "Everywhere else" table shows Japan 0.07 → **0.42** highlighted amber
- [ ] s14 UnderreactionGallery: four tabs; PEAD chart top line ends **+4.3%**, bottom **−3.5%**; Customer tab shows the +3.9% jump and +4.7% drift annotation

### Problems
- [ ] **s3**: Simple = **14.0**, Compounded = **20.0**
- [ ] **s6**: Industry share = **81.4**
- [ ] **s11**: β = **−1.44** (minus!), Implied return = **−14.4** (minus!)
- [ ] **s13**: Constant-vol weight = **0.5**, Dynamic weight = **1.0**
- [ ] Wrong-answer check on s13: enter **0.05** for the dynamic weight (forgetting to square σ̂) → should be red

### Lux spot-checks
- [ ] On s8, ask "so is momentum a risk premium?" → cites the bear-market +1.46 sign problem
- [ ] On s11, ask "why is the beta so negative?" → Merton option story
- [ ] On s15, ask "should I hold value or momentum?" → mentions holding both (opposite errors, mutual diversification)

---

## Lecture 06 — Quality & Defensive Investing (13 slides)

### Visual spot-checks
- [ ] s1 ProfitabilityLab (map): six clickable definition cards; navy QUALITY vs amber VALUE boxes with red "each is implicitly SHORT the other" arrows
- [ ] s2 ProfitabilityLab (sorts): "Decile sorts" tab shows green **0.31** (t 2.49) and amber **0.52** (t 4.49) bars with the "alpha exceeds the spread" card; "Fama–MacBeth" tab shows **0.75** (t 5.49) vs **1.00** (t 8.99, industry-demeaned)
- [ ] s3 ProfitabilityLab (double): "Double sorts" bars read **31 → 58** (profitability) and **41 → 68** (value) bp/mo; "Value insurance" tab shows two crossing curves; "The measure zoo" shows 6 cards with gross profitability highlighted navy, spanning alpha 2.34–4.62%/yr
- [ ] s5 BabLab (theory): ψ slider pivots the navy funding line around the teal β=1 dot; at ψ = 1.5 the readout says λ = **4.5%** and a β=0.5 stock earns **+0.75%**; at ψ = 0 the lines coincide and the caption says so
- [ ] s6 BabLab (evidence): Sharpe bars **SMB 0.25 / HML 0.39 / UMD 0.50 / BAB 0.75**; "Who holds what" shows mutual funds **1.12** and Berkshire **0.77** diverging around β = 1
- [ ] s8 QmjLab (score): Gordon formula in four colors; four clickable component buttons; amber card citing R² **0.05–0.31** and the three hypotheses (a)(b)(c)
- [ ] s9 QmjLab (results): deciles tab shows H−L card **0.97** (t 8.55) with beta **−0.38**; "Flight to quality" scatter slopes down; "The verdict" strikes out (a) and (b), keeps (c) green
- [ ] s11 BuffettDecomposer: "The split" tree shows L ≈ **1.6**-to-1 float line; "The regression" bars **12.1%** (t 3.19) → **6.3%** (t 1.58 — n.s.) with six loadings incl. **BAB 0.29 / QMJ 0.43**; "Systematic Buffett" shows three tracking curves
- [ ] s13 QmjLab (verdict): four synthesis cards + navy L7 teaser card citing 132–158 false factors

### Problems
- [ ] **s4**: GP/A = **0.20**, Competitor GP/A = **0.15**
- [ ] **s7**: λ = **4.5**, alpha at β=0.5 = **0.75**
- [ ] **s10**: P/B = **3.0**, implied r = **12.5**
- [ ] **s12**: Absorbed alpha = **5.8**, share = **47.9**
- [ ] Wrong-answer check on s4: enter **0.40** for GP/A (gross margin — dividing by revenue instead of assets) → should be red

### Lux spot-checks
- [ ] On s4, ask "why not use net income?" → explains earnings management further down the income statement, without giving the answers
- [ ] On s7, ask "why does the line pivot at beta 1?" → funding constraints leave the market portfolio itself priced correctly
- [ ] On s11, ask "so Buffett is just a formula?" → balanced: factors explain ~half, but he identified them decades early with unrunnable leverage

---

## Lecture 07 — Robustness of Anomalies (16 slides)

### Visual spot-checks
- [ ] s1 SharpeUncertaintyLab (screen): two bell curves (navy no-edge, amber real-edge); dragging the screen slider updates both the red Type I and amber Type II cards live; at t = 1.96 Type I ≈ **2.5%**
- [ ] s2 SharpeUncertaintyLab (interval): at SR 0.80, T 60, the toggle flips SE **0.46 → 0.63** and P(SR<0) **4.1% → 10.3%**; deck-pair caption appears at exactly those settings
- [ ] s4 MultipleTestingLab (hurdle): navy curve through **1.96 (N=1) / 3.09 (25) / 3.48 (100) / 4.06 (1000)**; red dashed t=1.96 line; amber t=3 line crossed at N ≈ 20; slider near 316 triggers the "published literature's neighborhood" caption
- [ ] s5 MultipleTestingLab (procedures): four procedure buttons; discoveries read **10 / 3 / 4 / 6**; amber card cites **158 / 142 / 132** false factors
- [ ] s7 DecayLab (decay): three clickable bars **0.582 / 0.402 / 0.264**; "The mechanism" tab shows volume **0.092 → 0.187** and short interest **0.166 → 0.315** with p = 0.000
- [ ] s9 DecayLab (bayes): seven clickable bars **35.0 / 55.6 / 61.3 / 82.4 / 75.6 / 82.4 / 82.4** (Nokia note on bar 2); "Shrinkage" tab has κ slider + the 0.26–0.57 vs 0.90 slope card; "The world test" shows dev-ex-US **60.5 / 31.1 / 80.7**
- [ ] s11 DecayLab (tradable): 2×2 grid **48 / 26 / 19 / 7** bp with **99/92/80/67%** positive; corner captions "era alone: −60%" and "together: −85%"; "Four papers" tab shows the HLZ/MP/JKP/CW map
- [ ] s13 MultipleTestingLab (theory): three real silly-factor papers (moon, World Cup, temperature); luck bars **121 / 393 / 8,329 / 408,234 / 4.4×10¹¹** with the ~400-tests red line; simulation card: 143 discoveries, 49 junk
- [ ] s14 FactorGauntlet (gauntlet): four criteria strip; Value robustness bars **3.6/5.3/4.5/1.8/2.5** + gold composite **3.5**; Value OOS **3.62/4.49/2.93**; Momentum 16-bar grid with exactly one grey bar (**1.10**, 3mo/3mo) below the red t=2 line; Momentum OOS **2.78/4.49/5.99** with the "most convincing number" card
- [ ] s16 FactorGauntlet (verdict): citation bars with first five navy (**Value 72.1 … FSQ 18.3**) and the 90% callout; navy closing-rule card; HXZ 64%/85% footnote

### Problems
- [ ] **s3**: SE = **0.097**, CI lower bound = **0.31**
- [ ] **s6**: Per-test p = **0.05** (percent!), required t = **3.48**
- [ ] **s8**: Trading-attributable decay = **32**, share = **55.2**
- [ ] **s10**: κ = **0.80**, posterior alpha = **0.40**
- [ ] **s12**: Era-only decline = **60.4**, total decline = **85.4**
- [ ] **s15**: Mean of five = **3.54**, range = **3.5**
- [ ] Wrong-answer check on s6: enter **3.29** for the t-stat (forgetting the two-sided split) → should be red
- [ ] Wrong-answer check on s3: enter **0.092** for SE (dropping the SR²/2 term) → should be red

### Lux spot-checks
- [ ] On s6, ask "isn't Bonferroni too harsh?" → yes for correlated tests; the honest hurdle sits between 1.96 and the curve; BHY handles dependence
- [ ] On s8, ask "which side of the decay would a risk premium explain?" → the first drop only; nothing statistical happens at a publication date
- [ ] On s10, ask "so is OOS decay a crisis?" → shrinkage prediction: JKP −47% vs MP −58%, roughly what κ < 1 implies
- [ ] On s14, ask "why is 5.99 > 4.49 so convincing?" → no selection bias can manufacture strength in a sample nobody selected

---

---

## Lecture 08 — Other Asset Classes (14 slides) ★ NEW

### Visual spot-checks
- [ ] s1 EverywhereLab (map): clicking each of the 5 class cards swaps the value translation (commodities card says "spot price of 5 years ago")
- [ ] s2 EverywhereLab (results): clicking the **Japan** bar group shows the rose "No momentum in Japan? So what?" card; other groups show the free-lunch card
- [ ] s4 EverywhereLab (comovement): "Liquidity risk" tab shows value **+ (t = 3.8)** and momentum **− (t = −3.2)** bars
- [ ] s6 TsmomLab (everywhere): Bonds filter shows **Germany 5yr at 1.02** as tallest bar; Commodities shows Cocoa at 0.08 as shortest
- [ ] s8 TsmomLab (smile): 1973–74 episode card reads 60/40 **−30.6%** vs trend **+95.4%**; 1937 and Oct-1987 bars are red (the two misses)
- [ ] s10 TsmomLab (mechanism): "Who pays whom" tab shows Speculators/Hedgers boxes with roll-return arrow
- [ ] s11 SportsLab (lab): Spread contract card shows payoffs **$210 / $110 / $0**
- [ ] s13 SportsLab (results): H3 row is highlighted with "what the data chose" badge; Fama & Thaler quote cards render

### Problems — type these, expect green
- [ ] **s3**: combo volatility = **0.447**, combo Sharpe = **0.89**
- [ ] **s7**: commodity position = **1.33**, bond position = **6.67**
- [ ] **s9**: 1973–74 spread = **126**, GFC spread = **52.1**
- [ ] **s12**: break-even win rate = **52.38**, edge at 55% = **5.0**
- [ ] Wrong-answer trap: on s3 enter **0.652** for volatility (forgot the 2 in covariance) → red
- [ ] Wrong-answer trap: on s12 enter **50** for break-even (110/220 confusion) → red

### Lux spot-checks
- [ ] On s2, ask "why is momentum weak in Japan?" → answer references negative V-M correlation and value's strong Japanese run, not data mining
- [ ] On s8, ask "is trend-following crash insurance?" → answer distinguishes slow bear markets (works) from fast crashes like Oct 1987 (doesn't)
- [ ] On s13, ask "could this be a risk premium?" → answer cites idiosyncratic bets + terminal date: risk premia are impossible in this laboratory

---

## Lecture 09 — Carry (14 slides) ★ NEW

### Visual spot-checks
- [ ] s1 CarryLab (concept): "World frozen" toggle makes the futures line converge up to spot with the green C = (S−F)/F arrow
- [ ] s2 CarryLab (classes): Bonds card shows the slope + roll-down formula and the yield-curve figure with "you, next year" dot
- [ ] s4 FxCrashLab (carry): Skewness tab shows AUD **−0.32** (red, low) through JPY **+0.32** (green, high); Insurance tab shows JPY risk reversal **+1.06**
- [ ] s6 FxCrashLab (predict): Returns tab bars fade 2.17 → −0.04 across t+1…t+10; Crash-risk tab shows **−23.9** at t+1 still ≈ −21 at t+7
- [ ] s7 FxCrashLab (unwind): VIX tab shows the four red coefficient bars (−1.47 / −1.29 / −5.33 / −0.43); Earthquake tab shows risk-down/price-up pair
- [ ] s9 GlobalCarryLab (returns): Puts bar = **1.80** with grey EW at −1.01; the four GCF stat cards read 6.75% / 6.12% / 1.10 / −0.02
- [ ] s11 GlobalCarryLab (anatomy): Timing-vs-tilt tab shows Equities at **101%** dynamic, Credit at 30%
- [ ] s12 GlobalCarryLab (risks): Episodes tab lists −19.6% / −26.8% / −7.2%, all labeled as recessions

### Problems — type these, expect green
- [ ] **s3**: futures carry = **2.04**, bond carry = **2.7**
- [ ] **s5**: carry = **6.22**, net return = **4.22**
- [ ] **s10**: GCF Sharpe = **1.10**, puts SR gap = **2.81**
- [ ] **s13**: currencies swing = **16.87**, commodities swing = **34.72**
- [ ] Wrong-answer trap: on s3 enter **2.00** for futures carry (divided by S instead of F) → red
- [ ] Wrong-answer trap: on s5 enter **8.22** for net return (added the yen move) → red

### Lux spot-checks
- [ ] On s4, ask "what does 'up the stairs, down the elevator' mean?" → answer ties negative skewness to high-carry currencies specifically
- [ ] On s7, ask "why does insurance get pricier after a crash?" → answer explains slow-moving capital / constrained sellers (earthquake pricing)
- [ ] On s9, ask "so is carry just crash risk?" → answer contrasts currency skew −0.68 with GCF skew −0.02 and pivots to recession/liquidity/vol risk

---

## Lecture 10 — Trading Costs & Liquidity (15 slides) ★ NEW

### Visual spot-checks
- [ ] s1 TcostLab (shortfall): dragging the speed slider trades execution bp against opportunity bp in opposite directions
- [ ] s3 TcostLab (literature): KS table shows effective **0.19/0.12** and quoted **0.26/0.17**
- [ ] s4 TcostLab (anatomy): "completed" phase shows **permanent 8.5 bp / temporary 2.5 bp / average ≈ 11 bp** annotations
- [ ] s6 MarketImpactLab (function): at 5% DTV labels read total **18.5**, permanent **11.9**, temporary **10.2**; histogram tab shows the 1.4M bar at 0–0.5%
- [ ] s7 MarketImpactLab (endogeneity): inflow curve ends at **25.7** vs non-inflow **20.8**; story tab shows passive-√ vs aggressive-linear cards
- [ ] s11 LiquidityLab (lcapm): four beta buttons; the cov(c,cm) card explains commonality with a + sign; footer shows 1.1% + 3.5% and 85 bp/mo
- [ ] s13 LiquidityLab (spirals): the wheel shows loss/margin/risk-management arrows; exit tab shows smooth-slide → sudden-rebound → ends-lower path
- [ ] s14 LiquidityLab (crises): Aug-2007 card notes the episode was invisible without the long/short lens; each case lists its LCAPM beta

### Problems — type these, expect green
- [ ] **s2**: shortfall = **120**, opportunity cost = **50**
- [ ] **s5**: temporary MI = **2.5**, annual drag = **0.55**
- [ ] **s10**: μ×c premium = **2.0**, AP total = **4.6**
- [ ] **s12**: net beta = **1.20**, required premium = **7.2**
- [ ] Wrong-answer trap: on s12 enter **0.80** for net beta (sign error on the two negative covariances) → red
- [ ] Wrong-answer trap: on s5 enter **0.125** for annual drag (used only the temporary component) → red

### Lux spot-checks
- [ ] On s6, ask "why is the impact curve concave?" → answer distinguishes permanent-linear from temporary-√ and previews the endogeneity story
- [ ] On s8, ask "so was Chen–Welch wrong?" → answer reconciles: thin gross edge AND cheap patient trading are both true; anomalies arbitraged toward the cost boundary
- [ ] On s15, ask "what's the one-sentence course summary?" → answer lands on Grossman–Stiglitz with the cost numbers attached

---

## Cross-cutting regression checks (after any new install)

- [ ] `npx vite build` passes in the fork (the installer runs this automatically)
- [ ] Lecture 1 s3 still accepts 86.6 / 13.4 (guards against registry accidents)
- [ ] EventStudyLab still works on BOTH L3 s1/s3 and L4 s2 (shared component)
- [ ] No console errors in Chrome DevTools (⌥⌘J) while paging through a full lecture
- [ ] L6 s2 and L7 s4 both render after install (guards the shared SlideVisual registry)
- [ ] Commit and push after QA passes: `git add -A && git commit -m "Add lectures 6-7" && git push`
