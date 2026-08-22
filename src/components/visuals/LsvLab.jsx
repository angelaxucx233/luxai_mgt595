import { useState } from 'react';

/**
 * Lecture 4 — LSV (1994) with the paper's real numbers.
 *  mode="doublesort": panel picker across the five Table II sorts; corner returns highlighted.
 *  mode="years": Figure 2 annual value−glamour bars 1968–89 with recession/decline markers.
 */
export default function LsvLab({ mode = 'doublesort' }) {
  if (mode === 'years') return <Years />;
  return <DoubleSort />;
}

const PANELS = [
  { id: 'cpgs', name: 'C/P × GS', axes: ['cash-flow yield', 'past sales growth'], glamour: 11.3, value: 21.5 },
  { id: 'epgs', name: 'E/P × GS', axes: ['earnings yield', 'past sales growth'], glamour: 11.8, value: 22.4 },
  { id: 'bmgs', name: 'B/M × GS', axes: ['book-to-market', 'past sales growth'], glamour: 13.2, value: 20.4 },
  { id: 'epbm', name: 'E/P × B/M', axes: ['earnings yield', 'book-to-market'], glamour: 11.6, value: 18.9 },
  { id: 'bmcp', name: 'B/M × C/P', axes: ['book-to-market', 'cash-flow yield'], glamour: 11.1, value: 19.4 },
];

function DoubleSort() {
  const [sel, setSel] = useState('cpgs');
  const p = PANELS.find((x) => x.id === sel);
  const spread = (p.value - p.glamour).toFixed(1);
  // stylized 3x3 grid: corners real, middles interpolated
  const mid = (p.glamour + p.value) / 2;
  const grid = [
    [p.value, (p.value + mid) / 2, mid],
    [(p.value + mid) / 2, mid, (p.glamour + mid) / 2],
    [mid, (p.glamour + mid) / 2, p.glamour],
  ];
  const heat = (v) => {
    const x = (v - p.glamour) / (p.value - p.glamour);
    return `rgb(${Math.round(225 - x * 190)},${Math.round(230 - x * 165)},${Math.round(240 - x * 130)})`;
  };
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PANELS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${sel === x.id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{x.name}</button>
        ))}
      </div>
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-4 gap-1 text-center">
          <div />
          <div className="text-[9.5px] text-slate-500 font-semibold">low {p.axes[1]}</div>
          <div className="text-[9.5px] text-slate-500 font-semibold">·</div>
          <div className="text-[9.5px] text-slate-500 font-semibold">high {p.axes[1]}</div>
          {grid.map((row, i) => [
            <div key={`l${i}`} className="text-[9.5px] text-slate-500 font-semibold flex items-center justify-end pr-1">
              {i === 0 ? `high ${p.axes[0]}` : i === 2 ? `low ${p.axes[0]}` : '·'}
            </div>,
            ...row.map((v, j) => {
              const isValue = i === 0 && j === 0;
              const isGlam = i === 2 && j === 2;
              const real = isValue || isGlam;
              return (
                <div key={`${i}-${j}`} className={`rounded-lg py-3 text-[12px] font-mono font-bold ${real ? 'ring-2' : ''} ${isValue ? 'ring-emerald-500' : isGlam ? 'ring-rose-500' : ''}`}
                  style={{ background: heat(v), color: (v - p.glamour) / (p.value - p.glamour) > 0.6 ? 'white' : '#1e293b' }}>
                  {v.toFixed(1)}
                  {isValue && <div className="text-[8.5px] font-black text-emerald-100">VALUE</div>}
                  {isGlam && <div className="text-[8.5px] font-black text-rose-700">GLAMOUR</div>}
                </div>
              );
            }),
          ])}
        </div>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>{p.name}:</b> glamour corner {p.glamour}%/yr, value corner {p.value}%/yr — a <b>{spread}-point</b> spread. Corner cells are LSV’s published Table II returns (year-1 averages); interior cells are illustrative interpolation.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Cheap and boring beats expensive and exciting under every definition of “cheap.” Sorting on past growth too isolates the stocks the market is extrapolating hardest — and widens the gap.</p>
    </div>
  );
}

// LSV Figure 2 — real annual bars
const YEARS = [
  [1968, 14.0], [1969, 6.5], [1970, 0.5], [1971, -14.5], [1972, 13.5], [1973, 15.5], [1974, 7.0],
  [1975, 38.5], [1976, 22.5], [1977, 22.5], [1978, 4.0], [1979, -18.0], [1980, 11.0], [1981, 24.0],
  [1982, 12.0], [1983, 25.5], [1984, 5.5], [1985, -2.5], [1986, 20.0], [1987, 11.5], [1988, 9.0], [1989, 1.0],
];
const REC = new Set([1969, 1970, 1973, 1974, 1975, 1980, 1982]);
const DOWN = new Set([1970, 1974, 1978, 1981, 1986]);

function Years() {
  const X = (i) => 26 + i * 16.6;
  const Y = (v) => 92 - (v / 42) * 78;
  const wins = YEARS.filter(([, v]) => v > 0).length;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2">
      <svg viewBox="0 0 400 148" className="w-full">
        <line x1="20" y1={Y(0)} x2="394" y2={Y(0)} stroke="#94a3b8" />
        {YEARS.map(([yr, v], i) => (
          <g key={yr}>
            <rect x={X(i)} y={v >= 0 ? Y(v) : Y(0)} width="12" height={Math.abs(Y(v) - Y(0))}
              fill={v >= 0 ? '#3b82f6' : '#e11d48'} rx="1.5" />
            {i % 3 === 0 && <text x={X(i) + 6} y="136" textAnchor="middle" fontSize="7.5" fill="#a3b1c2">{yr}</text>}
            {REC.has(yr) && <text x={X(i) + 6} y="112" textAnchor="middle" fontSize="7" fill="#a3b1c2" fontWeight="700">R</text>}
            {DOWN.has(yr) && <text x={X(i) + 6} y="121" textAnchor="middle" fontSize="7" fill="#fb7185" fontWeight="700">D</text>}
          </g>
        ))}
        <text x="24" y="12" fontSize="8.5" fill="#a3b1c2">value − glamour, annual (%)</text>
        <text x={X(7) + 6} y={Y(38.5) - 4} textAnchor="middle" fontSize="8" fill="#93b8e8" fontWeight="700">+38.5</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        Value beats glamour in <b>{wins} of 22 years</b> — and in <b>every</b> 5-year window. The three losing years (’71, ’79, ’85) include no recession bottoms; value wins right through <b>R</b> (NBER recessions) and <b>D</b> (down-market years).
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">This is LSV’s risk test. A premium that never concentrates its pain in bad states isn’t behaving like compensation for bearing them.</p>
    </div>
  );
}
