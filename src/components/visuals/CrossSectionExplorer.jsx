import { useState } from 'react';

/**
 * Lecture 2 — real published numbers.
 *  mode="ff92": FF92 Table III specification picker (avg slopes, t-stats).
 *  mode="ff93": FF93 5×5 size×BE/ME heatmap — mean excess returns / CAPM alphas / 3-factor alphas / HML loadings + GRS row.
 */
export default function CrossSectionExplorer({ mode = 'ff92' }) {
  if (mode === 'ff93') return <FF93 />;
  return <FF92 />;
}

const SPECS = [
  { id: 'b', name: 'β alone', rows: [['β', 0.15, 0.46]], verdict: 'Slope indistinguishable from zero. Beta alone explains nothing.' },
  { id: 'me', name: 'ln(ME) alone', rows: [['ln(ME)', -0.15, -2.58]], verdict: 'Size works: smaller ⟹ higher average returns.' },
  { id: 'bme', name: 'β + ln(ME)', rows: [['β', -0.37, -1.21], ['ln(ME)', -0.17, -3.41]], verdict: 'Control for size and β even flips negative (insignificantly). Size survives.' },
  { id: 'bm', name: 'ln(BE/ME) alone', rows: [['ln(BE/ME)', 0.50, 5.71]], verdict: 'The strongest variable in the table: value pays.' },
  { id: 'joint', name: 'ln(ME) + ln(BE/ME)', rows: [['ln(ME)', -0.11, -1.99], ['ln(BE/ME)', 0.35, 4.44]], verdict: 'The FF92 headline pair: both survive jointly; between them they absorb leverage and E/P.' },
];

function FF92() {
  const [spec, setSpec] = useState('b');
  const s = SPECS.find((x) => x.id === spec);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {SPECS.map((x) => (
          <button key={x.id} onClick={() => setSpec(x.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${spec === x.id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="w-full rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-3 bg-yale-900 text-white text-[11px] font-semibold">
          <div className="px-3 py-1.5">Variable</div><div className="px-3 py-1.5 text-right">Avg slope (%/mo)</div><div className="px-3 py-1.5 text-right">t-stat</div>
        </div>
        {s.rows.map(([name, slope, t]) => (
          <div key={name} className="grid grid-cols-3 text-xs border-t border-slate-100 bg-white">
            <div className="px-3 py-2 font-mono text-slate-700">{name}</div>
            <div className="px-3 py-2 text-right font-mono font-bold text-yale-900">{slope.toFixed(2)}</div>
            <div className={`px-3 py-2 text-right font-mono font-bold ${Math.abs(t) >= 2 ? 'text-emerald-700' : 'text-rose-600'}`}>({t.toFixed(2)}) {Math.abs(t) >= 2 ? '✓' : '✗'}</div>
          </div>
        ))}
      </div>
      <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">{s.verdict}</div>
      <p className="text-[10.5px] text-slate-500">FF92 Table III, actual published values. 7/1963–12/1990, ≈2,267 stocks/month. |t| ≥ 2 marked significant.</p>
    </div>
  );
}

// FF93 published 5×5 grids (rows: Small→Big; cols: Low BE/ME → High)
const MEANS = [
  [0.39, 0.70, 0.79, 0.88, 1.01], [0.44, 0.71, 0.85, 0.84, 1.02], [0.43, 0.66, 0.68, 0.81, 0.97],
  [0.48, 0.35, 0.57, 0.77, 1.05], [0.40, 0.36, 0.32, 0.56, 0.59]];
const CAPM_A = [
  [-0.22, 0.15, 0.30, 0.42, 0.54], [-0.18, 0.17, 0.36, 0.39, 0.53], [-0.16, 0.15, 0.23, 0.39, 0.50],
  [-0.05, -0.14, 0.12, 0.35, 0.57], [-0.04, -0.07, -0.07, 0.20, 0.21]];
const FF3_A = [
  [-0.34, -0.12, -0.05, 0.01, 0.00], [-0.11, -0.01, 0.08, 0.03, 0.02], [-0.11, 0.04, -0.04, 0.05, 0.05],
  [0.09, -0.22, -0.08, 0.03, 0.13], [0.21, -0.05, -0.13, -0.05, -0.16]];
const HML_H = [
  [-0.29, 0.08, 0.26, 0.40, 0.62], [-0.52, 0.01, 0.26, 0.46, 0.70], [-0.38, 0.00, 0.32, 0.51, 0.68],
  [-0.42, 0.04, 0.30, 0.56, 0.74], [-0.46, 0.00, 0.21, 0.57, 0.76]];

const VIEWS = [
  { id: 'mean', name: 'Mean excess returns', data: MEANS, range: [0.3, 1.05], note: 'Table 1: returns rise with BE/ME (left→right) and fall with size (top→bottom). The raw pattern any model must explain.' },
  { id: 'capm', name: 'CAPM alphas', data: CAPM_A, range: [-0.4, 0.6], note: 'Table 9a(ii): the whole value column glows — CAPM misses the value premium (α up to 0.57%/mo, t≈3.7).' },
  { id: 'ff3', name: '3-factor alphas', data: FF3_A, range: [-0.4, 0.6], note: 'Table 9a(iv): nearly everything extinguished. The survivors: small-growth −0.34 (t −3.16) and big-growth +0.21 (t 3.27).' },
  { id: 'hml', name: 'HML loadings h', data: HML_H, range: [-0.55, 0.8], note: 'Table 6: h rises monotonically with BE/ME inside every size row (|t| up to 25) — HML captures genuine common variation.' },
];
const GRS = [['Bond only', 2.09], ['CAPM', 1.91], ['SMB+HML', 1.78], ['3-factor', 1.56], ['5-factor', 1.66]];

function heat(v, [lo, hi]) {
  const x = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  // diverge around 0 for alphas/loadings; simple ramp is fine visually
  const r = Math.round(225 - x * 190), g = Math.round(235 - x * 180), b = Math.round(245 - x * 138);
  return `rgb(${r},${g},${b})`;
}

function FF93() {
  const [view, setView] = useState('mean');
  const v = VIEWS.find((x) => x.id === view);
  const sizes = ['Small', '2', '3', '4', 'Big'];
  const bms = ['Low', '2', '3', '4', 'High'];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {VIEWS.map((x) => (
          <button key={x.id} onClick={() => setView(x.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${view === x.id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="w-full">
        <div className="grid" style={{ gridTemplateColumns: '52px repeat(5, 1fr)' }}>
          <div />
          {bms.map((b) => <div key={b} className="text-center text-[10px] text-slate-500 font-semibold pb-1">{b}</div>)}
          {v.data.map((row, i) => (
            [<div key={`l${i}`} className="text-[10px] text-slate-500 font-semibold flex items-center">{sizes[i]}</div>,
              ...row.map((val, j) => (
                <div key={`${i}-${j}`} className="m-0.5 rounded-md text-center py-2 text-[11px] font-mono font-bold"
                  style={{ background: heat(val, v.range), color: (val - v.range[0]) / (v.range[1] - v.range[0]) > 0.62 ? 'white' : '#1e293b' }}>
                  {val.toFixed(2)}
                </div>
              ))]
          ))}
        </div>
        <div className="flex justify-between text-[9.5px] text-slate-500 px-14 pt-0.5"><span>← growth (low BE/ME)</span><span>value (high BE/ME) →</span></div>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">{v.note}</div>
      <div className="w-full flex items-center gap-1.5">
        <span className="text-[10px] text-slate-500 font-semibold shrink-0">GRS F:</span>
        {GRS.map(([name, f]) => (
          <div key={name} className={`flex-1 rounded-lg px-1 py-1 text-center border ${f === 1.56 ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
            <div className="text-[9px] text-slate-500 leading-none">{name}</div>
            <div className={`text-[11px] font-mono font-bold ${f === 1.56 ? 'text-emerald-700' : 'text-slate-700'}`}>{f.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <p className="text-[10.5px] text-slate-500">FF93, 25 size×BE/ME portfolios, 7/1963–12/1991 (342 months). All models rejected; three-factor least.</p>
    </div>
  );
}
