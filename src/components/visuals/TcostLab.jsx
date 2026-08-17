import { useState } from 'react';

/**
 * Lecture 10 — trading costs.
 *  mode="shortfall":  implementation shortfall identity + the effort diagnosis.
 *  mode="literature": KS 2004 TAQ costs + the century decline.
 *  mode="anatomy":    the FIM $1.7T database + market-impact anatomy (11 = 8.5 + 2.5).
 *  mode="verdict":    1/10 costs; survivors and casualties; the TE frontier.
 */
export default function TcostLab({ mode = 'shortfall' }) {
  if (mode === 'literature') return <Literature />;
  if (mode === 'anatomy') return <Anatomy />;
  if (mode === 'verdict') return <Verdict />;
  return <Shortfall />;
}

function Shortfall() {
  const [speed, setSpeed] = useState(50);
  const exec = 20 + speed * 1.0;          // fast trading -> high execution costs
  const opp = 20 + (100 - speed) * 1.0;   // slow trading -> high opportunity costs
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full rounded-xl border border-yale-200 bg-white px-3 py-2 text-center text-[12px]">
        <span className="font-bold text-yale-900">Shortfall</span>
        <span className="text-slate-500"> = paper return − real return = </span>
        <span className="font-bold text-amber-700">execution costs</span>
        <span className="text-slate-500"> + </span>
        <span className="font-bold text-purple-700">opportunity costs</span>
      </div>
      <div className="w-full px-1">
        <div className="flex justify-between text-[10px] text-slate-500 font-semibold"><span>patient / passive</span><span>trading speed</span><span>fast / aggressive</span></div>
        <input type="range" min="0" max="100" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-full accent-yale-800" />
      </div>
      <svg viewBox="0 0 400 96" className="w-full">
        <rect x="40" y="26" width={exec * 2.2} height="22" fill="#d97706" rx="4" />
        <text x={46 + exec * 2.2} y="41" fontSize="9" fill="#d97706" fontWeight="800">execution {exec.toFixed(0)} bp</text>
        <rect x="40" y="56" width={opp * 2.2} height="22" fill="#7c3aed" rx="4" />
        <text x={46 + opp * 2.2} y="71" fontSize="9" fill="#7c3aed" fontWeight="800">opportunity {opp.toFixed(0)} bp</text>
        <text x="40" y="16" fontSize="8.5" fill="#64748b">one dial — patience — moves cost between the two components (total: {(exec + opp).toFixed(0)} bp)</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>The diagnosis chart:</b> shortfall low → your problem is the strategy, not the trading. Dominated by <span className="text-amber-700 font-semibold">execution</span> → slow down, supply liquidity. Dominated by <span className="text-purple-700 font-semibold">opportunity</span> → speed up and pay. A change pays off iff the component you reduce falls more than the other rises. Fast-decaying signals (reversal, news) can’t wait; value can.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Paper portfolio: fills any size at the bid-ask midpoint, instantly. Everything your fund loses to that ideal — spreads, impact, and the trades you never got — is the shortfall. E(TC) = f(order size, speed, volume, volatility, float, date…).</p>
    </div>
  );
}

function Literature() {
  const [tab, setTab] = useState('ks');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['ks', 'Korajczyk–Sadka'], ['century', 'A century of costs']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'ks' ? (
        <>
          <div className="w-full overflow-hidden rounded-xl border border-yale-200 text-[11px]">
            <table className="w-full">
              <thead><tr className="bg-yale-800 text-white">
                <th className="px-2 py-1.5 text-left font-semibold">Monthly cost, extreme momentum winners</th>
                <th className="px-2 py-1.5 text-center font-semibold">Equal-wt</th>
                <th className="px-2 py-1.5 text-center font-semibold">Value-wt</th>
              </tr></thead>
              <tbody>
                <tr className="bg-white"><td className="px-2 py-1.5">Effective spread (actual vs midpoint)</td><td className="px-2 py-1.5 text-center font-bold">0.19%</td><td className="px-2 py-1.5 text-center font-bold">0.12%</td></tr>
                <tr className="bg-yale-50"><td className="px-2 py-1.5">Quoted spread (posted bid–ask)</td><td className="px-2 py-1.5 text-center font-bold">0.26%</td><td className="px-2 py-1.5 text-center font-bold">0.17%</td></tr>
                <tr className="bg-white"><td className="px-2 py-1.5">Price impact (TAQ, rises with size)</td><td className="px-2 py-1.5 text-center text-slate-500" colSpan="2">→ small break-even fund sizes</td></tr>
              </tbody>
            </table>
          </div>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>The literature’s verdict:</b> spreads alone drag momentum 1.4–3%/yr, price impact caps its capacity — most anomalies significantly bound by costs. <b>The buried assumptions:</b> you demand liquidity, all at once, at the <i>average</i> TAQ trade’s price — and the average trade includes the informed, the impatient, and the panicked. Whether an arbitrageur pays that is the next slide’s question.
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 108" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">one-way trading costs over the century (stylized shape of Jones’s figure)</text>
            <line x1="30" y1="88" x2="390" y2="88" stroke="#94a3b8" />
            <path d="M 36 34 C 100 40, 150 36, 200 48 C 260 62, 320 76, 384 82" fill="none" stroke="#00356b" strokeWidth="2.4" />
            <text x="60" y="28" fontSize="8" fill="#64748b">fixed commissions era</text>
            <text x="250" y="52" fontSize="8" fill="#64748b">May Day 1975 · decimalization</text>
            <text x="330" y="100" fontSize="8" fill="#059669" fontWeight="700">record lows</text>
            <text x="60" y="100" fontSize="8" fill="#94a3b8">1900</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Costs collapsed; turnover answered — NYSE daily turnover ran 54% in 1994 and 99% by 2004. Cheaper trading doesn’t reduce total spend; it reprices <i>which strategies exist</i>. Grossman–Stiglitz again: the cost of correcting sets how much mispricing survives.
          </div>
        </>
      )}
    </div>
  );
}

function Anatomy() {
  const [phase, setPhase] = useState(2);
  const phases = ['formation', 'execution', 'completed'];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full grid grid-cols-4 gap-1.5 text-center">
        {[['$1.7T', 'traded 1998–2016'], ['9,543', 'stocks'], ['21', 'markets'], ['0', 'HF trades included']].map(([v, l]) => (
          <div key={l} className="rounded-xl border border-yale-200 bg-white px-1 py-1.5">
            <div className="text-[15px] font-extrabold text-yale-900">{v}</div>
            <div className="text-[8px] uppercase tracking-wide text-slate-500 font-bold leading-tight">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {phases.map((p, i) => (
          <button key={p} onClick={() => setPhase(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${phase === i ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{p}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 134" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">price around a buy order (the deck’s worked example — real averages)</text>
        <line x1="30" y1="104" x2="390" y2="104" stroke="#94a3b8" />
        <line x1="30" y1="104" x2="120" y2="104" stroke="#00356b" strokeWidth="2.2" />
        {phase >= 1 && <path d="M 120 104 C 160 96, 200 82, 250 78" fill="none" stroke="#d97706" strokeWidth="2.4" />}
        {phase >= 2 && <path d="M 250 78 C 290 82, 330 85, 384 86" fill="none" stroke="#00356b" strokeWidth="2.2" />}
        <line x1="120" y1="46" x2="120" y2="104" stroke="#e2e8f0" strokeDasharray="4 3" />
        <line x1="250" y1="46" x2="250" y2="104" stroke="#e2e8f0" strokeDasharray="4 3" />
        <text x="120" y="122" textAnchor="middle" fontSize="7.5" fill="#94a3b8">order submitted</text>
        <text x="250" y="122" textAnchor="middle" fontSize="7.5" fill="#94a3b8">order completed</text>
        {phase >= 2 && (
          <>
            <path d="M 366 104 L 366 88" stroke="#059669" strokeWidth="1.6" markerEnd="url(#aArr)" />
            <text x="372" y="98" fontSize="7.5" fill="#059669" fontWeight="800">permanent 8.5 bp</text>
            <path d="M 256 78 L 256 88" stroke="#e11d48" strokeWidth="1.6" markerEnd="url(#aArr)" />
            <text x="262" y="76" fontSize="7.5" fill="#e11d48" fontWeight="800">temporary 2.5 bp decays</text>
            <text x="186" y="66" fontSize="8" fill="#d97706" fontWeight="800">average impact ≈ 11 bp</text>
          </>
        )}
        <defs><marker id="aArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#334155" /></marker></defs>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {phase === 0 && <span><b>Formation:</b> the model picks the trade at price P_theory. The algorithms can’t choose <i>whether</i> to trade — only how patiently (mostly within a day) — which is what makes these costs interpretable as exogenous.</span>}
        {phase === 1 && <span><b>Execution:</b> orders are sliced, randomized, and worked with <i>liquidity-providing</i> limit orders — buy at the bid or below, sell at the ask or above. The price drifts against the order as it fills.</span>}
        {phase === 2 && <span><b>Completed:</b> the price partially reverses. What remains — <b>8.5 bp</b> — is permanent impact: the market genuinely repriced. The <b>2.5 bp</b> that decays was the rent on immediacy. Total: <b>11 bp</b> per average trade.</span>}
      </div>
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5 text-[11px]">
      <div className="rounded-xl border-2 border-yale-800 bg-yale-50 px-3 py-2 text-center">
        <span className="text-[15px] font-extrabold text-yale-900">Realized costs ≈ 1/10 of the literature’s estimates</span>
        <div className="text-[10px] text-slate-500">break-even capacities many times larger — measured, not modeled, on $1.7T of live trades</div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2">
          <div className="font-bold text-emerald-800">Survive at scale</div>
          <div className="text-emerald-700 mt-0.5">Size · Value · Momentum — net returns positive at institutional capacity, using actual dollars traded and realized costs. “No estimation here.”</div>
        </div>
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2">
          <div className="font-bold text-rose-800">Casualty</div>
          <div className="text-rose-700 mt-0.5">Short-term reversal — turnover so high that even one-tenth-priced trading devours it. Some paper anomalies really are just paper.</div>
        </div>
      </div>
      <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
        <div className="font-bold text-yale-900">Why the literature was 10× too high</div>
        <div className="text-slate-600 mt-0.5">1) The <b>average trade’s</b> cost ≠ a patient arbitrageur’s cost — averages include the informed and the panicked. 2) Portfolios and execution can be designed <b>endogenously to costs</b>: supply liquidity, slice, wait.</div>
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
        <b>The constructive tool:</b> optimize against E(TC) subject to tracking error to the paper factor — tiny tolerated style drift buys large gains in net Sharpe and capacity. Build the portfolio net of costs; don’t bill the paper portfolio afterwards. And the L7 reconciliation: Chen–Welch’s thin gross edge and FIM’s cheap trading are both true — anomalies were arbitraged <i>toward</i> the cost boundary, and the boundary sits 10× lower than academics assumed.
      </div>
    </div>
  );
}
