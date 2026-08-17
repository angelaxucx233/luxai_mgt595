import { useState } from 'react';

/**
 * Lecture 9 — Brunnermeier–Nagel–Pedersen, Carry Trades and Currency Crashes.
 *  mode="carry":   the trade + the real cross-section (returns, skewness, risk reversals).
 *  mode="predict": real predictive panel regressions by horizon.
 *  mode="unwind":  VIX/TED unwinds + earthquake insurance + co-movement.
 *  mode="verdict": why the puzzle survives.
 */
export default function FxCrashLab({ mode = 'carry' }) {
  if (mode === 'predict') return <Predict />;
  if (mode === 'unwind') return <Unwind />;
  if (mode === 'verdict') return <Verdict />;
  return <Carry />;
}

// REAL cross-sectional stats (BNP Table 1, 1986–2006; risk reversals 1998–2006)
const FX = [
  { k: 'NZD', diff: 0.9, z: 1.3, skew: -0.297, rr: -0.467 },
  { k: 'AUD', diff: 0.6, z: 0.9, skew: -0.322, rr: -0.426 },
  { k: 'NOK', diff: 0.5, z: 0.7, skew: -0.019, rr: 0.350 },
  { k: 'GBP', diff: 0.5, z: 0.9, skew: -0.094, rr: 0.009 },
  { k: 'CAD', diff: 0.2, z: 0.4, skew: -0.143, rr: -0.099 },
  { k: 'EUR', diff: -0.1, z: 0.3, skew: 0.131, rr: 0.329 },
  { k: 'CHF', diff: -0.4, z: -0.1, skew: 0.144, rr: 0.409 },
  { k: 'JPY', diff: -0.7, z: -0.4, skew: 0.318, rr: 1.059 },
];

function Carry() {
  const [panel, setPanel] = useState('skew');
  const yv = (c) => (panel === 'z' ? c.z : panel === 'skew' ? c.skew : c.rr);
  const scale = panel === 'z' ? 34 : panel === 'skew' ? 110 : 38;
  const label = panel === 'z' ? 'mean carry return z (%/qtr)' : panel === 'skew' ? 'skewness of daily returns' : 'risk reversal (price of crash insurance)';
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
          <div className="text-[9px] uppercase tracking-wide text-rose-500 font-bold">Funding currency</div>
          <div className="font-bold text-rose-900">Borrow JPY at 0.87%</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="text-[9px] uppercase tracking-wide text-emerald-600 font-bold">Investment currency</div>
          <div className="font-bold text-emerald-900">Deposit AUD at 7.09%</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[['z', 'Returns'], ['skew', 'Skewness'], ['rr', 'Insurance price']].map(([k, l]) => (
          <button key={k} onClick={() => setPanel(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${panel === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 150" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">{label} vs interest differential i*−i — real data, 8 currencies vs USD</text>
        <line x1="36" y1="82" x2="388" y2="82" stroke="#e2e8f0" />
        <line x1="36" y1="130" x2="388" y2="130" stroke="#94a3b8" />
        <text x="200" y="144" textAnchor="middle" fontSize="8" fill="#64748b">carry i*−i (low → high)</text>
        {[...FX].sort((a, b) => a.diff - b.diff).map((c, i) => {
          const v = yv(c);
          return (
            <g key={c.k}>
              <circle cx={56 + i * 44} cy={82 - v * scale} r="9" fill={v >= 0 ? '#0f766e' : '#e11d48'} opacity="0.88" />
              <text x={56 + i * 44} y={85 - v * scale} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="800">{c.k}</text>
              <text x={56 + i * 44} y={82 - v * scale + (v >= 0 ? -13 : 19)} textAnchor="middle" fontSize="7" fill={v >= 0 ? '#0f766e' : '#e11d48'} fontWeight="700">{v.toFixed(panel === 'z' ? 1 : 2)}</text>
              <text x={56 + i * 44} y="126" textAnchor="middle" fontSize="7" fill="#94a3b8">{c.diff.toFixed(1)}</text>
            </g>
          );
        })}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[52px]">
        {panel === 'z' && <span><b>UIP violated on average:</b> returns rise with the interest differential — NZD and AUD pay, JPY costs. The differential is not offset by depreciation. But look at the other two tabs before celebrating.</span>}
        {panel === 'skew' && <span><b>The ruler-straight pattern:</b> skewness falls as carry rises — AUD/NZD crash <i>down</i> (−0.32, −0.30), JPY crashes <i>up</i> (+0.32). “Up by the stairs, down by the elevator” — and the elevator is reserved for exactly the currencies that pay.</span>}
        {panel === 'rr' && <span><b>The options market knows:</b> risk reversals — the price of crash insurance — rank the currencies in the same order. Yen crash-protection is the most expensive in the set (+1.06); insuring the Kiwi against its own collapse is priced cheapest to sell (−0.47). CFTC positions complete it: speculators are long carry almost in proportion to the differential.</span>}
      </div>
    </div>
  );
}

// REAL panel regression coefficients on i*−i (BNP Table 2, quarterly)
const HORIZ = [
  { t: 1, z: 2.17, fut: 8.26, sk: -23.92 }, { t: 2, z: 2.24, fut: 8.06, sk: -23.20 },
  { t: 3, z: 1.87, fut: 5.96, sk: -23.65 }, { t: 4, z: 1.50, fut: 6.41, sk: -23.28 },
  { t: 5, z: 1.11, fut: 5.87, sk: -23.49 }, { t: 6, z: 0.76, fut: 4.72, sk: -22.24 },
  { t: 7, z: 0.68, fut: 3.05, sk: -21.23 }, { t: 8, z: 0.44, fut: 1.51, sk: -16.96 },
  { t: 9, z: 0.27, fut: 0.66, sk: -12.90 }, { t: 10, z: -0.04, fut: -0.96, sk: -11.14 },
];

function Predict() {
  const [row, setRow] = useState('z');
  const cfg = {
    z: { get: (h) => h.z, scale: 26, col: '#0f766e', lab: 'future excess return z(t+τ)', note: 'Coefficient +2.17 next quarter, fading to zero by τ = 10: carry predicts returns for roughly two years — the forward premium puzzle with a half-life.' },
    fut: { get: (h) => h.fut, scale: 7, col: '#00356b', lab: 'speculator futures positions(t+τ)', note: 'Capital chases the differential (+8.26 next quarter) and stays for six — the crowd assembles exactly where the crash risk is building.' },
    sk: { get: (h) => h.sk, scale: 2.4, col: '#e11d48', lab: 'skewness of returns in quarter t+τ', note: '−23.9 next quarter and still −21 seven quarters out: today’s carry forecasts a persistently crash-shaped distribution more than two years ahead. The profit and the fragility are the same forecast.' },
  }[row];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['z', 'Returns'], ['fut', 'Positions'], ['sk', 'Crash risk']].map(([k, l]) => (
          <button key={k} onClick={() => setRow(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${row === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 140" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">panel regression: {cfg.lab} on today’s i*−i — real coefficients</text>
        <line x1="30" y1="76" x2="392" y2="76" stroke="#94a3b8" />
        {HORIZ.map((h, i) => {
          const v = cfg.get(h);
          return (
            <g key={h.t}>
              <rect x={38 + i * 36} y={v >= 0 ? 76 - v * cfg.scale : 76} width="20" height={Math.abs(v) * cfg.scale} fill={cfg.col} opacity="0.85" rx="2.5" />
              <text x={48 + i * 36} y={v >= 0 ? 72 - v * cfg.scale : 76 + Math.abs(v) * cfg.scale + 8} textAnchor="middle" fontSize="6.5" fill={cfg.col} fontWeight="700">{v.toFixed(1)}</text>
              <text x={48 + i * 36} y="134" textAnchor="middle" fontSize="7" fill="#94a3b8">t+{h.t}</text>
            </g>
          );
        })}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">{cfg.note}</div>
      <p className="text-[11px] text-slate-500 leading-snug">Quarterly panel, 8 currencies, country fixed effects, 1986–2006. The VAR version runs the same movie: a carry shock lifts cumulated returns above the UIP line, pulls speculators in for ~2 quarters, and bends skewness sharply negative before it mean-reverts.</p>
    </div>
  );
}

function Unwind() {
  const [tab, setTab] = useState('vix');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['vix', 'The VIX unwind'], ['eq', 'Earthquake insurance'], ['co', 'Co-movement']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'vix' && (
        <>
          <svg viewBox="0 0 400 118" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">weekly effect of ΔVIX × sign(carry) — real coefficients</text>
            <line x1="208" y1="22" x2="208" y2="100" stroke="#e2e8f0" />
            {[['carry positions Δ (this wk)', -1.47], ['carry positions Δ (next wk)', -1.29], ['risk reversals Δ (insurance)', -5.33], ['carry return z', -0.43]].map(([l, v], i) => (
              <g key={l}>
                <rect x={208 - Math.abs(v) * 26} y={26 + i * 19} width={Math.abs(v) * 26} height="13" fill="#e11d48" opacity="0.85" rx="3" />
                <text x={214} y={36 + i * 19} fontSize="8" fill="#334155">{l}</text>
                <text x={202 - Math.abs(v) * 26} y={36 + i * 19} textAnchor="end" fontSize="8" fill="#e11d48" fontWeight="800">{v}</text>
              </g>
            ))}
            <text x="200" y="113" textAnchor="middle" fontSize="8" fill="#64748b">a volatility spike hits positions, insurance prices, and returns at once (TED spikes: same signs)</text>
          </svg>
          <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>Funding is the trigger:</b> when VIX or TED jumps, speculators’ funding tightens, carry positions shrink this week <i>and</i> next, the trade bleeds, and crash insurance gets pricier — the unwind in real time. This is Brunnermeier–Pedersen’s spiral running in FX (the full machine is Lecture 10’s finale).
          </div>
        </>
      )}
      {tab === 'eq' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
            <div className="font-bold text-yale-900">After carry losses (z_t ↓):</div>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5"><b className="text-emerald-800">Future skewness rises</b><div className="text-emerald-700 text-[10px]">coeff −3.34 on z: the crash happened; the risk is spent.</div></div>
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5"><b className="text-rose-800">Insurance price rises</b><div className="text-rose-700 text-[10px]">RiskRev on z: +7.87 — protection gets <i>dearer</i> as risk falls.</div></div>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-amber-900">
            “The price of insurance goes up after an earthquake, although the risk of another earthquake is low.” Only one thing produces that: the natural insurance sellers are the same constrained speculators who just took the loss. <b>Slow-moving capital</b> — remember the phrase; it prices half of Lecture 10.
          </div>
        </div>
      )}
      {tab === 'co' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
            <div className="font-bold text-yale-900 mb-1">Pairwise FX correlation regressed on |i₁ − i₂|:</div>
            <div className="flex items-end gap-3">
              <div className="text-[22px] font-extrabold text-yale-900">−10.89</div>
              <div className="text-slate-500 pb-1">(−16.4 with time FE, −13.4 with pair FE)</div>
            </div>
            <div className="text-slate-600 mt-1">Currencies with <b>similar</b> interest rates co-move: funding currencies together, investment currencies together — regardless of geography or trade links.</div>
          </div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            <b>Carry trading manufactures its own factor.</b> The common owner — the levered carry crowd — becomes the common shock: when funding tightens, everything they hold falls together. Crowding turns idiosyncratic currencies into a correlated asset class, and a correlated unwind into a systemic event.
          </div>
        </div>
      )}
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5 text-[11px]">
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['The mispricing', 'UIP fails: carry earns 2.17 per unit of differential next quarter. Speculators are paid to correct it.', '#0f766e'],
          ['The police force', 'Correcting it needs leverage; leverage needs funding; funding dies in VIX/TED spikes — precisely when the trade crashes.', '#e11d48'],
          ['The equilibrium', 'Endogenous crash risk limits the arbitrage, so the puzzle survives — partially corrected, permanently profitable, permanently dangerous.', '#00356b'],
        ].map(([h, d, c]) => (
          <div key={h} className="rounded-xl border bg-white px-2.5 py-2" style={{ borderColor: c }}>
            <div className="font-bold" style={{ color: c }}>{h}</div>
            <div className="text-slate-600 mt-0.5 leading-snug">{d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
        <b>Third costume for one idea:</b> BAB’s funding constraints (L6), the sports book’s vig (L8), and now forced unwinds at the bottom — each is a cost of correcting that lets a documented mispricing persist in equilibrium. The crash risk here is <i>endogenous</i>: forecast by the carry itself, timed by funding, and priced in advance by the options market — which pure exogenous-disaster stories cannot explain.
      </div>
      <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
        <b>The open question:</b> is the elevator intrinsic to carry — or just to currencies? KMP’s answer is next: diversify carry across nine asset classes and the skewness comes out at <b>−0.02</b>.
      </div>
    </div>
  );
}
