import { useMemo, useState } from 'react';

/**
 * Lecture 2 — two modes:
 *  mode="twopass": month-by-month cross-sectional regressions; histogram of slopes; FM mean & t.
 *  mode="eiv": attenuation dial — Var(e) shrinks the fitted slope; "form portfolios" recovers it.
 */
export default function FamaMacbethLab({ mode = 'twopass' }) {
  if (mode === 'eiv') return <Eiv />;
  return <TwoPass />;
}

// deterministic pseudo-random
function rng(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
function gauss(r) { return Math.sqrt(-2 * Math.log(Math.max(r(), 1e-9))) * Math.cos(2 * Math.PI * r()); }

const N = 25, T = 60, TRUE_PREM = 0.6, TRUE_G1 = 0.3;

function simulate(seed) {
  const r = rng(seed);
  const betas = Array.from({ length: N }, (_, i) => 0.4 + (1.6 * i) / (N - 1) + 0.05 * gauss(r));
  const months = [];
  for (let t = 0; t < T; t += 1) {
    const shock = 4 * gauss(r); // common market shock — the reason slopes wobble
    const rets = betas.map((b) => TRUE_G1 + TRUE_PREM * b + b * shock + 1.5 * gauss(r));
    // OLS slope for this month
    const mb = betas.reduce((a, x) => a + x, 0) / N;
    const mr = rets.reduce((a, x) => a + x, 0) / N;
    let cov = 0, varb = 0;
    for (let i = 0; i < N; i += 1) { cov += (betas[i] - mb) * (rets[i] - mr); varb += (betas[i] - mb) ** 2; }
    const slope = cov / varb;
    months.push({ rets, slope, intercept: mr - slope * mb });
  }
  return { betas, months };
}

function TwoPass() {
  const [seed, setSeed] = useState(7);
  const [m, setM] = useState(1); // months revealed
  const { betas, months } = useMemo(() => simulate(seed), [seed]);
  const slopes = months.slice(0, m).map((x) => x.slope);
  const mean = slopes.reduce((a, x) => a + x, 0) / slopes.length;
  const sd = Math.sqrt(slopes.reduce((a, x) => a + (x - mean) ** 2, 0) / Math.max(slopes.length - 1, 1));
  const se = sd / Math.sqrt(slopes.length);
  const t = se > 0 ? mean / se : 0;
  const cur = months[m - 1];

  const X = (b) => 16 + ((b - 0.2) / 2.0) * 172;
  const Y = (ret) => 150 - ((ret + 8) / 22) * 135;
  // histogram of slopes
  const bins = Array(12).fill(0);
  slopes.forEach((s) => { const k = Math.max(0, Math.min(11, Math.floor(((s + 3) / 10) * 12))); bins[k] += 1; });
  const maxBin = Math.max(...bins, 1);

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-2">
      <svg viewBox="0 0 420 178" className="w-full">
        {/* scatter: this month */}
        <text x="100" y="11" textAnchor="middle" fontSize="9.5" fill="#00356b" fontWeight="700">Month {m} cross-section</text>
        <line x1="16" y1="150" x2="196" y2="150" stroke="#94a3b8" /><line x1="16" y1="150" x2="16" y2="18" stroke="#94a3b8" />
        <text x="192" y="162" textAnchor="end" fontSize="8.5" fill="#64748b">β̂ᵢ</text>
        {betas.map((b, i) => <circle key={i} cx={X(b)} cy={Y(cur.rets[i])} r="2.6" fill="#64748b" opacity="0.75" />)}
        <line x1={X(0.3)} y1={Y(cur.intercept + cur.slope * 0.3)} x2={X(2.1)} y2={Y(cur.intercept + cur.slope * 2.1)} stroke="#e11d48" strokeWidth="2.2" />
        <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#e11d48" fontWeight="700">γ̂₂,{m} = {cur.slope.toFixed(2)} %/mo</text>
        {/* histogram of slopes so far */}
        <text x="315" y="11" textAnchor="middle" fontSize="9.5" fill="#00356b" fontWeight="700">Slopes so far ({m} months)</text>
        <line x1="232" y1="150" x2="405" y2="150" stroke="#94a3b8" />
        {bins.map((c, k) => (
          <rect key={k} x={232 + k * 14.2} y={150 - (c / maxBin) * 118} width="12.5" height={(c / maxBin) * 118} fill="#00356b" opacity="0.85" rx="1.5" />
        ))}
        <line x1={232 + ((mean + 3) / 10) * 170} y1="150" x2={232 + ((mean + 3) / 10) * 170} y2="26" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
        <text x="318" y="166" textAnchor="middle" fontSize="8.5" fill="#64748b">−3 … γ̂₂,t … +7</text>
      </svg>
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={() => setM((x) => Math.min(T, x + 1))} className="px-3 py-1.5 rounded-lg bg-yale-700 text-white text-xs font-semibold hover:bg-yale-800">Next month →</button>
        <button onClick={() => setM(T)} className="px-3 py-1.5 rounded-lg bg-yale-100 text-yale-900 text-xs font-semibold hover:bg-yale-200">Run all {T}</button>
        <button onClick={() => { setSeed((s) => s + 1); setM(1); }} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">New sample</button>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 font-mono">
        FM estimate γ̄₂ = {mean.toFixed(3)} · s.e. = sd(slopes)/√T = {slopes.length > 1 ? se.toFixed(3) : '—'} · t = {slopes.length > 1 ? t.toFixed(2) : '—'} <span className="text-slate-500">(true premium 0.60)</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Each month's common market shock tilts that month's slope — the wobble you see. FM treats each slope as one draw, so the correlation across stocks is <i>absorbed</i> into the slope variation instead of faking precision.</p>
    </div>
  );
}

function Eiv() {
  const [noise, setNoise] = useState(0.09); // Var(e)
  const [grouped, setGrouped] = useState(false);
  const varB = 0.09;
  const effNoise = grouped ? noise / 5 : noise;
  const factor = varB / (varB + effNoise);
  const fitted = TRUE_PREM * factor;
  const pts = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: grouped ? 12 : 40 }, () => {
      const b = 0.5 + 1.4 * r();
      const bhat = b + Math.sqrt(effNoise) * gauss(r);
      const ret = 0.3 + TRUE_PREM * b + (grouped ? 0.35 : 0.8) * gauss(r);
      return { bhat, ret };
    });
  }, [effNoise, grouped]);
  const X = (b) => 20 + ((b - 0) / 2.6) * 350;
  const Y = (ret) => 140 - ((ret + 0.4) / 2.6) * 122;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2">
      <label className="w-full text-xs text-slate-600 flex items-center gap-2">
        <span className="w-44">Beta noise Var(e) = <b className="text-yale-900">{noise.toFixed(2)}</b></span>
        <input type="range" min="0" max="0.36" step="0.01" value={noise} onChange={(e) => setNoise(+e.target.value)} className="flex-1 accent-rose-600" />
      </label>
      <svg viewBox="0 0 400 158" className="w-full">
        <line x1="20" y1="140" x2="390" y2="140" stroke="#94a3b8" /><line x1="20" y1="140" x2="20" y2="12" stroke="#94a3b8" />
        <text x="386" y="152" textAnchor="end" fontSize="9" fill="#64748b">β̂ (noisy)</text>
        {pts.map((p, i) => <circle key={i} cx={X(p.bhat)} cy={Y(p.ret)} r={grouped ? 4 : 2.6} fill={grouped ? '#0f766e' : '#64748b'} opacity="0.75" />)}
        {/* true line */}
        <line x1={X(0.3)} y1={Y(0.3 + TRUE_PREM * 0.3)} x2={X(2.2)} y2={Y(0.3 + TRUE_PREM * 2.2)} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 4" />
        <text x={X(2.02)} y={Y(0.3 + TRUE_PREM * 2.1) - 6} fontSize="8.5" fill="#94a3b8">true (0.60)</text>
        {/* attenuated fit through center (1.2, 0.3+0.6*1.2) */}
        <line x1={X(1.2 - 1)} y1={Y(1.02 - fitted * 1)} x2={X(1.2 + 1)} y2={Y(1.02 + fitted * 1)} stroke="#e11d48" strokeWidth="2.4" />
        <text x={X(2.24)} y={Y(1.02 + fitted * 1) + 3} fontSize="9" fill="#e11d48" fontWeight="700">{fitted.toFixed(2)}</text>
      </svg>
      <div className="w-full flex items-center justify-between gap-2">
        <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 font-mono flex-1">
          γ̂₂ = 0.60 × {varB.toFixed(2)}/({varB.toFixed(2)}+{effNoise.toFixed(3)}) = <b>{fitted.toFixed(2)} %/mo</b>
        </div>
        <button onClick={() => setGrouped((g) => !g)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${grouped ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-900 hover:bg-teal-200'}`}>
          {grouped ? 'Portfolios ✓ (noise ÷5)' : 'Form portfolios'}
        </button>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Noise in the regressor drags the slope toward zero — attenuation. Grouping into portfolios diversifies the estimation error away (but sort on β first, or you also destroy the spread that identifies the premium).</p>
    </div>
  );
}
