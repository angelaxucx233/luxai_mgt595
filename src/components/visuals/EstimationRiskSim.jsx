import { useMemo, useState } from 'react';

/**
 * Jorion (1992)-style Monte Carlo. Three "bond markets" with true mu and V.
 * Each replicate: draw T returns, re-estimate, form the tangency, EVALUATE AT TRUE PARAMS.
 * Toggle short sales; resample. mode='intro' shows the concentration story only.
 */
const TRUE = {
  mu: [0.06, 0.08, 0.1],
  sd: [0.08, 0.1, 0.13],
  rho: [
    [1, 0.4, 0.3],
    [0.4, 1, 0.5],
    [0.3, 0.5, 1],
  ],
  rf: 0.03,
};

function cov() {
  const V = [];
  for (let i = 0; i < 3; i++) {
    V.push([]);
    for (let j = 0; j < 3; j++) V[i].push(TRUE.rho[i][j] * TRUE.sd[i] * TRUE.sd[j]);
  }
  return V;
}

function inv3(m) {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [
    [A / det, -(b * i - c * h) / det, (b * f - c * e) / det],
    [B / det, (a * i - c * g) / det, -(a * f - c * d) / det],
    [C / det, -(a * h - b * g) / det, (a * e - b * d) / det],
  ];
}

function chol(V) {
  const L = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j <= i; j++) {
      let s = V[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-10)) : s / L[j][j];
    }
  return L;
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function tangency(mu, V, rf, allowShorts) {
  const Vi = inv3(V);
  const ex = mu.map((m) => m - rf);
  let w = [0, 1, 2].map((i) => Vi[i][0] * ex[0] + Vi[i][1] * ex[1] + Vi[i][2] * ex[2]);
  if (!allowShorts) w = w.map((x) => Math.max(0, x));
  const s = w.reduce((p, q) => p + q, 0);
  if (Math.abs(s) < 1e-9) return [1 / 3, 1 / 3, 1 / 3];
  return w.map((x) => x / s);
}

function portMoments(w, mu, V) {
  const e = w[0] * mu[0] + w[1] * mu[1] + w[2] * mu[2];
  let v = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) v += w[i] * w[j] * V[i][j];
  return { e, s: Math.sqrt(Math.max(v, 0)) };
}

function simulate(allowShorts, nSims = 250, T = 60) {
  const V = cov();
  const L = chol(V);
  const pts = [];
  for (let s = 0; s < nSims; s++) {
    // draw T periods, compute sample mu and V
    const draws = [];
    for (let t = 0; t < T; t++) {
      const z = [randn(), randn(), randn()];
      draws.push([0, 1, 2].map((i) => TRUE.mu[i] + L[i][0] * z[0] + L[i][1] * z[1] + L[i][2] * z[2]));
    }
    const m = [0, 1, 2].map((i) => draws.reduce((p, d) => p + d[i], 0) / T);
    const Vs = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const d of draws)
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) Vs[i][j] += ((d[i] - m[i]) * (d[j] - m[j])) / (T - 1);
    const w = tangency(m, Vs, TRUE.rf, allowShorts);
    pts.push(portMoments(w, TRUE.mu, V)); // EVALUATED AT TRUE PARAMETERS
  }
  return pts;
}

export default function EstimationRiskSim({ mode = 'lab' }) {
  const [allowShorts, setAllowShorts] = useState(false);
  const [seed, setSeed] = useState(0);
  const V = useMemo(cov, []);
  const trueT = useMemo(() => portMoments(tangency(TRUE.mu, V, TRUE.rf, false), TRUE.mu, V), [V]);
  const pts = useMemo(() => simulate(allowShorts), [allowShorts, seed]);

  if (mode === 'intro') {
    return (
      <div className="w-full max-w-lg flex flex-col gap-3 text-sm">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-yale-800 mb-2">Jorion's frontier, top point (1978–88 global bonds)</p>
          <div className="flex h-8 w-full rounded-lg overflow-hidden text-[10px] text-white font-bold">
            <div className="bg-rose-600 flex items-center justify-center" style={{ width: '98%' }}>Japanese Yen 98%</div>
            <div className="bg-slate-400 flex items-center justify-center" style={{ width: '2%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Avg return 15.42%, σ 17.31% — a corner solution built on the noisiest estimate in the sample.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-yale-800 mb-2">The world index over the same period</p>
          <div className="flex h-8 w-full rounded-lg overflow-hidden text-[10px] text-white font-bold">
            <div className="bg-yale-600 flex items-center justify-center" style={{ width: '46%' }}>USD 46%</div>
            <div className="bg-yale-400 flex items-center justify-center" style={{ width: '27%' }}>GBP 27%</div>
            <div className="bg-amber-500 flex items-center justify-center" style={{ width: '14%' }}>Yen 14%</div>
            <div className="bg-slate-400 flex items-center justify-center" style={{ width: '13%' }}>other</div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Diversified — and statistically hard to distinguish from the "optimum."</p>
        </div>
      </div>
    );
  }

  const X = (s) => 45 + ((s - 0.04) / 0.2) * 360;
  const Y = (e) => 200 - ((e - 0.04) / 0.09) * 180;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 215" className="w-full">
        <line x1="45" y1="200" x2="405" y2="200" stroke="#94a3b8" />
        <line x1="45" y1="200" x2="45" y2="15" stroke="#94a3b8" />
        <text x="400" y="213" textAnchor="end" fontSize="10" fill="#a3b1c2">σ (true)</text>
        <text x="42" y="12" textAnchor="end" fontSize="10" fill="#a3b1c2">E (true)</text>
        {pts.map((p, i) => (
          <circle key={i} cx={X(p.s)} cy={Y(p.e)} r="2.4" fill={allowShorts ? '#e11d48' : '#3b82f6'} opacity="0.35" />
        ))}
        <circle cx={X(trueT.s)} cy={Y(trueT.e)} r="6" fill="#d97706" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={X(trueT.s) + 9} y={Y(trueT.e) + 4} fontSize="10" fill="#f59e0b" fontWeight="700">true tangency</text>
      </svg>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-lg bg-yale-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yale-700"
        >
          Resample 250 histories
        </button>
        <button
          onClick={() => setAllowShorts((v) => !v)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${allowShorts ? 'bg-rose-600 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >
          {allowShorts ? 'Short sales: ALLOWED' : 'Short sales: banned'}
        </button>
      </div>
      <p className="text-xs text-slate-500 text-center">
        Each dot: the tangency from one simulated 5-year history, scored at the TRUE parameters.
        {allowShorts ? ' Figure C: the cloud explodes — freedom amplifies estimation error.' : ' Figure A: constraints keep the cloud tight.'}
      </p>
    </div>
  );
}
