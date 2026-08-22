import { useMemo, useState } from 'react';

/**
 * Lecture 3 — two modes:
 *  mode="paths": random-walk paths with drift/sigma sliders and ±2σ√t cone.
 *  mode="autocorr": true-ρ slider, simulated estimate with SE=1/√T; own-vs-cross decomposition.
 */
export default function RandomWalkLab({ mode = 'paths' }) {
  if (mode === 'autocorr') return <Autocorr />;
  return <Paths />;
}

function rng(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
function gauss(r) { return Math.sqrt(-2 * Math.log(Math.max(r(), 1e-9))) * Math.cos(2 * Math.PI * r()); }

function Paths() {
  const [mu, setMu] = useState(0.5);
  const [sig, setSig] = useState(2);
  const [seed, setSeed] = useState(3);
  const Tn = 60;
  const paths = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 6 }, () => {
      let p = 0; const pts = [0];
      for (let t = 1; t <= Tn; t += 1) { p += mu + sig * gauss(r); pts.push(p); }
      return pts;
    });
  }, [mu, sig, seed]);
  const lim = Math.max(20, mu * Tn + 2 * sig * Math.sqrt(Tn) + 5);
  const X = (t) => 24 + (t / Tn) * 360;
  const Y = (p) => 90 - (p / lim) * 78;

  const cone = [];
  for (let t = 0; t <= Tn; t += 2) cone.push(`${X(t)},${Y(mu * t + 2 * sig * Math.sqrt(t))}`);
  for (let t = Tn; t >= 0; t -= 2) cone.push(`${X(t)},${Y(mu * t - 2 * sig * Math.sqrt(t))}`);

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 180" className="w-full">
        <line x1="24" y1="90" x2="390" y2="90" stroke="#e2e8f0" />
        <line x1="24" y1="172" x2="24" y2="8" stroke="#94a3b8" />
        <line x1="24" y1="172" x2="390" y2="172" stroke="#94a3b8" />
        <polygon points={cone.join(' ')} fill="#3b82f6" opacity="0.08" />
        <polyline points={Array.from({ length: 31 }, (_, i) => `${X(i * 2)},${Y(mu * i * 2)}`).join(' ')} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 4" />
        {paths.map((p, i) => (
          <polyline key={i} points={p.map((v, t) => `${X(t)},${Y(v)}`).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="1.3" opacity="0.55" />
        ))}
        <text x="386" y="168" textAnchor="end" fontSize="8.5" fill="#a3b1c2">t</text>
        <text x={X(44)} y={Y(mu * 44) - 6} fontSize="8.5" fill="#f59e0b" fontWeight="700">E[P_t] = μt</text>
        <text x={X(50)} y={Y(mu * 50 + 2 * sig * Math.sqrt(50)) - 5} fontSize="8.5" fill="#93b8e8">±2σ√t</text>
      </svg>
      <div className="w-full flex gap-3">
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-20">μ = <b className="text-yale-900">{mu.toFixed(1)}</b></span>
          <input type="range" min="-1" max="2" step="0.1" value={mu} onChange={(e) => setMu(+e.target.value)} className="flex-1 accent-amber-600" />
        </label>
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-20">σ = <b className="text-yale-900">{sig.toFixed(1)}</b></span>
          <input type="range" min="0.5" max="5" step="0.25" value={sig} onChange={(e) => setSig(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
        <button onClick={() => setSeed((s) => s + 1)} className="px-3 py-1.5 rounded-lg bg-yale-100 text-yale-900 text-xs font-semibold hover:bg-yale-200">Resample</button>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">P_t = μ + P_{'{t−1}'} + ε_t: the mean grows like μt, the variance like σ²t — the cone widens as √t. A drift is <i>predictability</i>, but it can be a risk premium: this is why a martingale is neither necessary nor sufficient for efficiency.</p>
    </div>
  );
}

function Autocorr() {
  const [rho, setRho] = useState(0.1);
  const [T, setT] = useState(400);
  const [seed, setSeed] = useState(5);
  const { est, pts } = useMemo(() => {
    const r = rng(seed);
    const rets = [gauss(r)];
    for (let t = 1; t < T; t += 1) rets.push(rho * rets[t - 1] + Math.sqrt(1 - rho * rho) * gauss(r));
    let cov = 0, v = 0; const m = rets.reduce((a, x) => a + x, 0) / T;
    for (let t = 1; t < T; t += 1) { cov += (rets[t] - m) * (rets[t - 1] - m); }
    for (let t = 0; t < T; t += 1) v += (rets[t] - m) ** 2;
    return { est: cov / v, pts: rets.slice(0, 161) };
  }, [rho, T, seed]);
  const se = 1 / Math.sqrt(T);
  const t = est / se;
  const X = (a) => 20 + ((a + 3.4) / 6.8) * 172;
  const Y = (b) => 150 - ((b + 3.4) / 6.8) * 132;

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 420 168" className="w-full">
        <text x="105" y="11" textAnchor="middle" fontSize="9.5" fill="#93b8e8" fontWeight="700">r_t vs r_(t−1) — your sample</text>
        <line x1="20" y1="150" x2="192" y2="150" stroke="#94a3b8" /><line x1="20" y1="150" x2="20" y2="18" stroke="#94a3b8" />
        {pts.slice(1).map((v, i) => <circle key={i} cx={X(pts[i])} cy={Y(v)} r="1.9" fill="#64748b" opacity="0.6" />)}
        <line x1={X(-3)} y1={Y(-3 * est)} x2={X(3)} y2={Y(3 * est)} stroke="#e11d48" strokeWidth="2.2" />
        {/* own vs cross bars */}
        <text x="315" y="11" textAnchor="middle" fontSize="9.5" fill="#93b8e8" fontWeight="700">The stock/portfolio puzzle</text>
        {[['stock own-autocorr', -0.04, '#e11d48'], ['cross-autocorr (lead–lag)', 0.14, '#0f766e'], ['⟹ portfolio autocorr', 0.10, '#3b82f6']].map(([name, v, c], i) => (
          <g key={name}>
            <text x="238" y={44 + i * 40} fontSize="8.5" fill="#a3b1c2">{name}</text>
            <rect x={v < 0 ? 315 + v * 380 : 315} y={50 + i * 40} width={Math.abs(v) * 380} height="14" fill={c} rx="3" />
            <text x={v < 0 ? 315 + v * 380 - 4 : 315 + v * 380 + 4} y={61 + i * 40} fontSize="9" fill={c} fontWeight="700" textAnchor={v < 0 ? 'end' : 'start'}>{v > 0 ? '+' : ''}{v.toFixed(2)}</text>
            <line x1="315" y1={48 + i * 40} x2="315" y2={66 + i * 40} stroke="#94a3b8" />
          </g>
        ))}
      </svg>
      <div className="w-full flex gap-3 items-center">
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-24">true ρ = <b className="text-yale-900">{rho.toFixed(2)}</b></span>
          <input type="range" min="-0.3" max="0.3" step="0.01" value={rho} onChange={(e) => setRho(+e.target.value)} className="flex-1 accent-rose-600" />
        </label>
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-20">T = <b className="text-yale-900">{T}</b></span>
          <input type="range" min="60" max="1200" step="20" value={T} onChange={(e) => setT(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
        <button onClick={() => setSeed((s) => s + 1)} className="px-3 py-1.5 rounded-lg bg-yale-100 text-yale-900 text-xs font-semibold hover:bg-yale-200">Resample</button>
      </div>
      <div className={`w-full rounded-xl px-3 py-2 text-[11.5px] font-mono border ${Math.abs(t) >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
        ρ̂ = {est.toFixed(3)} · SE = 1/√T = {se.toFixed(3)} · t = {t.toFixed(2)} {Math.abs(t) >= 2 ? '— "significant"' : '— undetectable'} · R² = ρ̂² = {(est * est * 100).toFixed(1)}% of variance
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Right panel: individual stocks' own-autocorrelation is slightly <i>negative</i>, yet portfolios are <i>positive</i> — arithmetic forces the cross-autocovariances (large stocks leading small) to be large and positive. Caveat: bid–ask bounce and stale prices can fake both signs.</p>
    </div>
  );
}
