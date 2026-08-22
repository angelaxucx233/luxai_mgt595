import { useState } from 'react';

/** Lecture 3 — 3Com/Palm stub calculator + the real 2000 stub timeline + the six negative stubs. */

// Downsampled real stub path (trading days from 3/2/00, $/share) from Lamont–Thaler Fig. 5
const STUB = [[0, -63], [2, -60], [5, -59], [8, -52], [10, -47.5], [12, -38], [15, -34], [18, -31], [21, -32.3], [25, -30.5], [29, -32], [32, -34.5], [36, -28], [40, -21], [43, -18.8], [47, -14.2], [50, -13.5], [54, -8.4], [58, -7.3], [62, -5.8], [66, -2.3], [70, -2], [73, 0.3], [76, 3.4], [80, 0.4], [84, 1.3], [88, 0.5], [92, 1], [96, -0.2], [100, 1.7], [103, 5], [104, 12.5], [108, 11.9], [113, 11.8], [118, 16.3], [123, 14], [128, 11.8], [133, 13.6], [138, 13.2], [143, 11.6], [148, 9]];
const SIX = [
  ['Creative / UBID', -74.81], ['HNC / Retek', -49.01], ['Daisytek / PFSWeb', -13.72],
  ['Metamor / Xpedior', -5.26], ['3Com / Palm', -62.68], ['Methode / Stratos', -20.86],
];

export default function StubCalculator() {
  const [parent, setParent] = useState(81.81);
  const [issuer, setIssuer] = useState(95.06);
  const ratio = 1.5;
  const implied = ratio * issuer;
  const stub = parent - implied;
  const [showTimeline, setShowTimeline] = useState(false);

  const X = (d) => 24 + (d / 148) * 366;
  const Y = (v) => 30 + ((32 - v) / 102) * 96;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full grid grid-cols-2 gap-2">
        <label className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          3Com (parent) $
          <input type="number" step="0.01" value={parent} onChange={(e) => setParent(+e.target.value || 0)}
            className="w-full text-lg font-mono font-bold text-yale-900 outline-none" />
        </label>
        <label className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          Palm (issuer) $
          <input type="number" step="0.01" value={issuer} onChange={(e) => setIssuer(+e.target.value || 0)}
            className="w-full text-lg font-mono font-bold text-yale-900 outline-none" />
        </label>
      </div>
      <div className="w-full rounded-2xl bg-yale-900 text-white px-4 py-3 grid grid-cols-3 gap-2 text-center">
        <div><div className="text-[9.5px] uppercase tracking-wide text-yale-100/60">Palm inside 3Com</div><div className="font-mono font-bold">1.5 × {issuer.toFixed(2)}</div><div className="font-mono text-sm">= ${implied.toFixed(2)}</div></div>
        <div><div className="text-[9.5px] uppercase tracking-wide text-yale-100/60">3Com trades at</div><div className="font-mono font-bold text-lg">${parent.toFixed(2)}</div></div>
        <div><div className="text-[9.5px] uppercase tracking-wide text-yale-100/60">Stub (rest of 3Com)</div><div className={`font-mono font-black text-lg ${stub < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>${stub.toFixed(2)}</div></div>
      </div>
      {stub < 0 && (
        <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-800">
          The market is pricing 3Com's profitable non-Palm businesses at <b>less than zero</b> (≈ −$25B at the real 3/2/00 prices). The trade: buy 1 share of 3Com, short {ratio} shares of Palm — you're paid ${(-stub).toFixed(2)} today for an asset worth at worst $0, converging at the announced spin-off.
        </div>
      )}
      <button onClick={() => setShowTimeline((s) => !s)} className="px-3 py-1.5 rounded-lg bg-yale-100 text-yale-900 text-xs font-semibold hover:bg-yale-200">
        {showTimeline ? 'Hide' : 'Show'} the real 2000 timeline
      </button>
      {showTimeline && (
        <>
          <svg viewBox="0 0 400 140" className="w-full">
            <line x1="24" y1={Y(0)} x2="390" y2={Y(0)} stroke="#e2e8f0" />
            <line x1="24" y1="126" x2="390" y2="126" stroke="#94a3b8" /><line x1="24" y1="126" x2="24" y2="10" stroke="#94a3b8" />
            <polyline points={STUB.map(([d, v]) => `${X(d)},${Y(v)}`).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.2" />
            {[[12.5, '3/20 accel. announced', -46], [47, '5/8 IRS approves', 6], [104, '7/27 distribution', 22]].map(([d, label, ly]) => (
              <g key={label}>
                <line x1={X(d)} y1={Y(32)} x2={X(d)} y2={Y(-70)} stroke="#e11d48" strokeDasharray="3 3" strokeWidth="1" />
                <text x={X(d) + 3} y={Y(ly)} fontSize="8" fill="#f59e0b" fontWeight="700">{label}</text>
              </g>
            ))}
            <text x="28" y="18" fontSize="8.5" fill="#a3b1c2">stub $/share · 3/2/00 → 9/18/00</text>
          </svg>
          <div className="w-full grid grid-cols-2 gap-1 text-[10.5px]">
            {SIX.map(([name, v]) => (
              <div key={name} className="flex justify-between rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 font-mono">
                <span className="text-slate-600">{name}</span><span className="font-bold text-rose-700">{v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Why did the stub persist for months? Palm was nearly impossible to borrow — rebates went negative, and the options market priced the shorting cost at ≈119%/yr. The law of one price broke in public, and the toll gate kept it broken.</p>
    </div>
  );
}
