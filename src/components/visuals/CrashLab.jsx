import { useState } from 'react';

/**
 * Lecture 5 — Daniel–Moskowitz momentum crashes, real numbers.
 *  mode="anatomy": WML monthly-return histogram (real freq data) + moments + episode cards.
 *  mode="betas": market-state toggle → winner/loser/WML betas.
 *  mode="dynamic": Sharpe bars WML/const-σ/dynamic + region table.
 *  mode="verdict": closing cards.
 */
export default function CrashLab({ mode = 'anatomy' }) {
  if (mode === 'betas') return <Betas />;
  if (mode === 'dynamic') return <Dynamic />;
  if (mode === 'verdict') return <Verdict />;
  return <Anatomy />;
}

// real histogram frequencies from the deck's tikz
const HIST = [[-25, 1], [-22, 1], [-19, 1], [-16, 2], [-13, 3], [-9.5, 5], [-6.4, 9], [-3.3, 20], [-0.2, 55], [2.9, 108], [6, 95], [9.1, 45], [12.2, 14], [15.3, 4]];

function Anatomy() {
  const [tab, setTab] = useState('dist');
  const X = (r) => 30 + ((r + 27) / 45) * 360;
  const Y = (f) => 118 - (f / 110) * 102;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['dist', 'The distribution'], ['episodes', 'The two great crashes']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'dist' && (
        <>
          <svg viewBox="0 0 400 134" className="w-full">
            <line x1="24" y1="118" x2="394" y2="118" stroke="#94a3b8" />
            {HIST.map(([r, f]) => (
              <rect key={r} x={X(r) - 10} y={Y(f)} width="20" height={118 - Y(f)} fill={r < -5 ? '#e11d48' : '#00356b'} rx="2" />
            ))}
            <text x={X(-25)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">−25</text>
            <text x={X(-13)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">−13</text>
            <text x={X(-0.2)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">0</text>
            <text x={X(9.1)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">+9</text>
            <text x={X(15.3)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">+15</text>
            <text x="28" y="12" fontSize="8.5" fill="#64748b">WML monthly returns, 1927–2011 (frequency)</text>
            <text x={X(-18)} y="60" fontSize="8.5" fill="#e11d48" fontWeight="800">the tail that ends careers →</text>
          </svg>
          <div className="w-full grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[10.5px] text-slate-700 font-mono leading-relaxed">
              mean 9.0% · sd 16.2%<br />Sharpe 0.6 · skew <b className="text-rose-600">−3.0</b><br />kurtosis <b>28.7</b>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[10.5px] text-slate-700 leading-relaxed">
              WML portfolio (1927–2010): mean 14.4%, SR 0.52, β <b>−0.54</b>, α 18.4% (t 6.5), monthly skew <b className="text-rose-600">−6.32</b>. Worst months: −79, −60, −46, −44, −42%.
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">Like being short an out-of-the-money put (the carry-trade analogy): small steady gains, rare enormous losses. April 2009 was the worst month since August 1932 — and in the ten worst months, the 2-year market was negative and the <b>contemporaneous</b> month positive nearly every time. Crashes are bear-market <i>rebounds</i>.</p>
        </>
      )}
      {tab === 'episodes' && (
        <div className="w-full flex flex-col gap-2">
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>July–August 1932.</b> Off the Depression bottom the market rose <b>+82%</b> in two months. Past losers gained <b>+236%</b>; past winners +30%. WML: <b>−206 points</b>.
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>March–May 2009.</b> Off the financial-crisis bottom the market rose <b>+29%</b>. Losers gained <b>+156%</b>; winners +6.5%. WML: <b>−149 points</b>.
          </div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Same mechanism, 77 years apart: momentum is <i>short</i> the beaten-down names, and it is exactly those names that rocket when the market turns. For scale, the long side alone is glorious — $1 in winners (1947–2007) grew to <b>$44,290</b> vs $738 in the market and $1.37 in losers. The crashes live entirely in the short leg.
          </div>
        </div>
      )}
    </div>
  );
}

const BETA_STATES = [
  { id: 'normal', name: 'Normal market', loser: 1.2, winner: 1.0, wml: 0.05, note: 'In calm times winners and losers have similar market exposure — WML is nearly beta-neutral (β ≈ 0.05), which is why the CAPM can\u2019t explain the premium.' },
  { id: 'bear', name: 'Bear market', loser: 2.0, winner: 1.1, wml: -0.74, note: 'After big market declines the loser portfolio fills with crushed, levered firms; its beta climbs and WML\u2019s beta drops by ≈0.79 (to ≈ −0.74).' },
  { id: 'rebound', name: 'Bear market + up month', loser: 3.7, winner: 1.0, wml: -1.44, note: 'The crash state. Loser equity behaves like an out-of-the-money call (Merton 1974) — 1930s loser beta ≈2.5, 2009 ≈3.7 — a further −0.70 on WML. β ≈ −1.44: a +10% market month implies WML ≈ −14%.' },
];

function Betas() {
  const [sel, setSel] = useState(0);
  const s = BETA_STATES[sel];
  const bar = (v, color, label) => (
    <div className="flex items-center gap-2">
      <span className="w-16 text-[10px] text-slate-500 text-right">{label}</span>
      <div className="flex-1 h-5 bg-slate-100 rounded-md relative overflow-visible">
        <div className="absolute top-0 bottom-0 rounded-md transition-all duration-500"
          style={{ left: v >= 0 ? '38%' : `${38 + v * 9.5}%`, width: `${Math.abs(v) * 9.5}%`, background: color }} />
        <div className="absolute top-0 bottom-0 w-px bg-slate-400" style={{ left: '38%' }} />
      </div>
      <span className="w-12 text-[11px] font-mono font-bold" style={{ color }}>{v.toFixed(2)}</span>
    </div>
  );
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {BETA_STATES.map((x, i) => (
          <button key={x.id} onClick={() => setSel(i)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${sel === i ? (i === 2 ? 'bg-rose-600 text-white border-rose-600' : 'bg-yale-700 text-white border-yale-700') : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{x.name}</button>
        ))}
      </div>
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-3 flex flex-col gap-2">
        {bar(s.loser, '#e11d48', 'loser β')}
        {bar(s.winner, '#00356b', 'winner β')}
        {bar(s.wml, s.wml < -1 ? '#e11d48' : '#d97706', 'WML β')}
      </div>
      <div className={`w-full rounded-xl border px-3 py-2 text-[11px] ${sel === 2 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-yale-50 border-yale-100 text-yale-900'}`}>{s.note}</div>
      <p className="text-[11px] text-slate-500 leading-snug">The fix follows from the diagnosis: estimate the rolling beta (42-day window, 10 market lags — Grundy–Martin) and hedge it out; the hedged strategy sails through 1932. And the pattern replicates in every equity market <i>and</i> in commodities and currencies — which aren\u2019t levered equity claims, a wrinkle the Merton story can\u2019t cover alone.</p>
    </div>
  );
}

const DYN = [
  { name: '1927–1950', w: 0.14, c: 0.40, d: 0.58 },
  { name: '1950–1975', w: 0.90, c: 1.04, d: 1.34 },
  { name: '1975–2000', w: 0.93, c: 1.09, d: 1.39 },
  { name: '2000–2011', w: 0.02, c: 0.22, d: 0.63 },
  { name: 'Full 1927–2011', w: 0.52, c: 0.87, d: 1.12 },
];
const REGIONS = [
  ['Europe', 0.46, 1.13], ['Japan', 0.07, 0.42], ['UK', 0.47, 0.89], ['US', 0.28, 0.65],
  ['Commodities', 0.59, 0.80], ['Currencies', 0.30, 0.65], ['All assets', 0.75, 1.14],
];

function Dynamic() {
  const [tab, setTab] = useState('us');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['us', 'US, by period'], ['world', 'Everywhere else']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'us' && (
        <>
          <svg viewBox="0 0 400 158" className="w-full">
            {DYN.map((x, i) => (
              <g key={x.name}>
                <text x="86" y={22 + i * 28} textAnchor="end" fontSize="8.5" fill={i === 4 ? '#00356b' : '#475569'} fontWeight={i === 4 ? '800' : '400'}>{x.name}</text>
                {[['w', '#94a3b8'], ['c', '#d97706'], ['d', '#0f766e']].map(([k, col], j) => (
                  <g key={k}>
                    <rect x="92" y={10 + i * 28 + j * 6} width={x[k] * 200} height="5" fill={col} rx="2" />
                    <text x={96 + x[k] * 200} y={15 + i * 28 + j * 6} fontSize="7" fill={col} fontWeight="700">{x[k].toFixed(2)}</text>
                  </g>
                ))}
              </g>
            ))}
            <g transform="translate(96,152)">
              <rect width="10" height="5" fill="#94a3b8" rx="1" /><text x="14" y="5" fontSize="7.5" fill="#64748b">static WML</text>
              <rect x="76" width="10" height="5" fill="#d97706" rx="1" /><text x="90" y="5" fontSize="7.5" fill="#64748b">constant-σ</text>
              <rect x="156" width="10" height="5" fill="#0f766e" rx="1" /><text x="170" y="5" fontSize="7.5" fill="#64748b">dynamic (μ̂/σ̂²)</text>
            </g>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>Sharpe 0.52 → 0.87 → 1.12.</b> Constant-σ (Barroso–Santa-Clara) fixes the volatility; the dynamic rule w = μ̂/(2λσ̂²) also cuts exposure when the forecast <i>mean</i> is low — after 2-year market declines, in high vol — and that extra channel is the whole 0.87→1.12 gap. In 2000–11 it turns 0.02 into 0.63. Skewness flips from negative to positive: the crashes are removed, not diluted.
          </div>
        </>
      )}
      {tab === 'world' && (
        <>
          <div className="w-full rounded-xl border border-slate-200 overflow-hidden text-[11px]">
            <div className="grid grid-cols-[1fr_90px_90px] bg-yale-900 text-white font-semibold">
              <div className="px-3 py-1.5">Market</div><div className="px-2 py-1.5 text-right">Static WML</div><div className="px-2 py-1.5 text-right">Dynamic</div>
            </div>
            {REGIONS.map(([name, w, d]) => (
              <div key={name} className={`grid grid-cols-[1fr_90px_90px] border-t border-slate-100 font-mono ${name === 'Japan' ? 'bg-amber-50' : name === 'All assets' ? 'bg-emerald-50/60' : 'bg-white'}`}>
                <div className="px-3 py-1.5 text-slate-700 font-sans font-semibold">{name}</div>
                <div className="px-2 py-1.5 text-right text-slate-500">{w.toFixed(2)}</div>
                <div className="px-2 py-1.5 text-right text-emerald-700 font-bold">{d.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">Dynamic weighting raises the Sharpe in <b>every</b> market and asset class — and <b>resurrects Japan</b> (0.07 → 0.42), the one place static momentum famously fails. The fully dynamic all-asset combination reaches <b>1.22</b> — roughly four times static US momentum. Dynamic also <i>spans</i> constant-σ: alpha one direction, zero the other.</p>
        </>
      )}
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2">
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
        <b>Confident:</b> large, monotone, robust across a century, every market, every asset class; the fourth factor (Carhart UMD); much of it is industry momentum; the danger is <i>conditional crash risk</i> at market turning points — not constant volatility.
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>Open:</b> will crowding erode it (post-publication alpha was <i>larger</i> — but the future needn\u2019t repeat)? Risk or behavior — does the crash tail rationalize part of the premium, and which behavioral model wins? Falling trading costs cut both ways.
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>The investor\u2019s job:</b> size the exposure to survive the crashes; hedge or scale the time-varying betas that cause them. And note the symmetry with Lecture 4 — value is slow <i>over</i>reaction, momentum is fast <i>under</i>reaction: held together, each insures the other\u2019s worst years (2000–03: momentum suffered, value shone).
      </div>
    </div>
  );
}
