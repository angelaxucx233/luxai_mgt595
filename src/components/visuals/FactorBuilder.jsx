import { useState } from 'react';

/** Lecture 2 — FF93 2×3 sort. Click SMB or HML to highlight which portfolios feed it and with what weight. */
export default function FactorBuilder() {
  const [factor, setFactor] = useState('SMB');
  const cells = [
    { id: 'SL', row: 'S', col: 'L' }, { id: 'SM', row: 'S', col: 'M' }, { id: 'SH', row: 'S', col: 'H' },
    { id: 'BL', row: 'B', col: 'L' }, { id: 'BM', row: 'B', col: 'M' }, { id: 'BH', row: 'B', col: 'H' },
  ];
  const weight = (c) => {
    if (factor === 'SMB') return c.row === 'S' ? '+⅓' : '−⅓';
    if (c.col === 'H') return '+½';
    if (c.col === 'L') return '−½';
    return '0';
  };
  const tone = (w) => (w.startsWith('+') ? 'bg-emerald-600 text-white' : w === '0' ? 'bg-slate-100 text-slate-400' : 'bg-rose-600 text-white');

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {['SMB', 'HML'].map((f) => (
          <button key={f} onClick={() => setFactor(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${factor === f ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="w-full">
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div />
          <div className="text-[10px] text-slate-500 font-semibold">Low BE/ME</div>
          <div className="text-[10px] text-slate-500 font-semibold">Medium</div>
          <div className="text-[10px] text-slate-500 font-semibold">High BE/ME</div>
          <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-end pr-1">Small</div>
          {cells.slice(0, 3).map((c) => { const w = weight(c); return (
            <div key={c.id} className={`rounded-xl py-4 text-sm font-mono font-bold transition-colors ${tone(w)}`}>{c.id}<div className="text-[11px] font-black">{w}</div></div>
          ); })}
          <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-end pr-1">Big</div>
          {cells.slice(3).map((c) => { const w = weight(c); return (
            <div key={c.id} className={`rounded-xl py-4 text-sm font-mono font-bold transition-colors ${tone(w)}`}>{c.id}<div className="text-[11px] font-black">{w}</div></div>
          ); })}
        </div>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 font-mono text-center">
        {factor === 'SMB'
          ? 'SMB = ⅓(SL+SM+SH) − ⅓(BL+BM+BH) — long every small box, short every big box'
          : 'HML = ½(SH+BH) − ½(SL+BL) — long the value column, short the growth column, medium sits out'}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Splits use NYSE breakpoints (median size; 30/70 BE/ME) so NASDAQ's thousands of tiny stocks don't swamp the small boxes. Each box is value-weighted and rebuilt every June. Because SMB nets out value exposure and HML nets out size exposure, Corr(SMB,HML) ≈ 0 by construction.</p>
    </div>
  );
}
