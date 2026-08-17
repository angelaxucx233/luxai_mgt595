import { useState } from 'react';

/**
 * Lecture 4 — Daniel–Titman (1997).
 *  mode="models": the three return-generating hypotheses + Test 1.
 *  mode="test": Table III loading-quintile bars (real flat row) with risk-prediction overlay + the replies.
 */
export default function CharCovLab({ mode = 'models' }) {
  if (mode === 'test') return <Test />;
  return <Models />;
}

function Models() {
  const [sel, setSel] = useState(0);
  const MODELS = [
    { name: 'Model 1 · Distress factor', eq: 'E[r] = rf + Σβλ + θ·λ_D', body: 'A real distress factor with its own premium λ_D; B/M proxies the loading θ. Prediction: when a firm becomes distressed, its covariation should switch ON.', verdict: 'Killed by Test 1: pre- vs post-formation SDs barely change. High-B/M stocks co-moved BEFORE they were distressed — the correlation comes from industry and region, not a switched-on risk.' },
    { name: 'Model 2 · Time-varying premia', eq: 'E[r] = rf + Σβ·λ(t−1)', body: 'No distress factor: distressed firms happen to load on factors whose premia were recently negative, so B/M merely times the factors.', verdict: 'Faces Test 2: hold the characteristic fixed and vary the loading — returns should still track the loading.' },
    { name: 'Model 3 · Characteristics', eq: 'E[r] = a + b·θ', body: 'Returns track what the stock IS, with no link to the covariance structure at all.', verdict: 'The radical option: it implies an asymptotic arbitrage — two stocks with identical risk but different characteristics earn different returns.' },
  ];
  const m = MODELS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {MODELS.map((x, i) => (
          <button key={x.name} onClick={() => setSel(i)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${sel === i ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{x.name}</button>
        ))}
      </div>
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-2">
        <div className="font-mono text-sm font-bold text-yale-900 text-center">{m.eq}</div>
        <div className="text-xs text-slate-600 leading-snug">{m.body}</div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] text-amber-900">{m.verdict}</div>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Note whose theory is on trial: covariance pricing is exactly the <b>FF risk</b> prediction. LSV’s behavioral story is silent about covariances — DT’s test can wound FF, not LSV.</p>
    </div>
  );
}

const OBS = [0.740, 0.817, 0.846, 0.866, 0.806]; // DT Table III average row, real
function Test() {
  const [showRisk, setShowRisk] = useState(true);
  const [tab, setTab] = useState('data');
  const lam = 0.4; // illustrative HML premium %/mo
  const pred = [0, 0.5, 1.0, 1.5, 2.0].map((h) => 0.72 + h * lam * 0.5); // scaled illustration line
  const X = (i) => 55 + i * 74;
  const Y = (v) => 130 - ((v - 0.6) / 1.2) * 110;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['data', 'The test'], ['replies', 'The counterattack']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'data' && (
        <>
          <svg viewBox="0 0 400 152" className="w-full">
            <line x1="40" y1="130" x2="392" y2="130" stroke="#94a3b8" /><line x1="40" y1="130" x2="40" y2="12" stroke="#94a3b8" />
            <text x="44" y="12" fontSize="8.5" fill="#64748b">avg return (%/mo), characteristic held fixed</text>
            {OBS.map((v, i) => (
              <g key={i}>
                <rect x={X(i) - 20} y={Y(v)} width="40" height={130 - Y(v)} fill="#00356b" rx="3" />
                <text x={X(i)} y={Y(v) - 5} textAnchor="middle" fontSize="9.5" fill="#00356b" fontWeight="800">{v.toFixed(3)}</text>
                <text x={X(i)} y="143" textAnchor="middle" fontSize="8.5" fill="#64748b">Q{i + 1}</text>
              </g>
            ))}
            {showRisk && (
              <>
                <polyline points={pred.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke="#e11d48" strokeWidth="2.4" strokeDasharray="6 4" />
                <text x={X(4) - 4} y={Y(pred[4]) - 7} textAnchor="end" fontSize="9" fill="#e11d48" fontWeight="700">risk model: rising with loading</text>
              </>
            )}
            <text x="216" y="152" textAnchor="middle" fontSize="8.5" fill="#64748b">HML-loading quintile (low → high), size & B/M fixed</text>
          </svg>
          <div className="w-full flex items-center gap-2">
            <button onClick={() => setShowRisk((s) => !s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${showRisk ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'}`}>
              {showRisk ? 'Hide' : 'Show'} the risk-model prediction
            </button>
            <div className="flex-1 rounded-xl bg-yale-50 border border-yale-100 px-3 py-1.5 text-[11px] text-yale-900 font-mono">
              Observed Q5−Q1 = 0.806−0.740 = 0.066 — <b>flat</b>.
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">DT Table III, actual average row (1973–93). With the characteristic fixed, a higher distress <i>loading</i> earns nothing extra. Being value pays; co-moving like value doesn’t.</p>
        </>
      )}
      {tab === 'replies' && (
        <div className="w-full flex flex-col gap-2">
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900"><b>Davis–Fama–French (2000):</b> extend the window to 1927–1997 and the DT result <b>disappears</b> — the loading premium returns. The 1973–93 gap looks like a sample feature, not a law.</div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900"><b>Berk (2001), “Sorting Out Sorts”:</b> a dependent sort (characteristic first, loading second) is biased toward failing to reject the characteristic model — use independent sorts.</div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900"><b>DT’s reply:</b> the dependence is the <i>point</i> — it’s the only way to hold the characteristic fixed while moving the loading; an independent sort re-confounds exactly what the test must separate.</div>
          <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700"><b>And a quiet worry:</b> betas are estimated with error; characteristics are measured without. In a horse race, the error-free variable can win mechanically. Ask which stocks have precise betas — and check whether that pattern shows in the table.</div>
        </div>
      )}
    </div>
  );
}
