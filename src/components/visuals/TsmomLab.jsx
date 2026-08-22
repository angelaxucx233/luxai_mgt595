import { useState } from 'react';

/**
 * Lecture 8 — Moskowitz–Ooi–Pedersen, Time Series Momentum.
 *  mode="definition": TS vs XS + the 2x2 literature map.
 *  mode="everywhere": REAL 1880-2017 trend Sharpe bars, class-filterable.
 *  mode="smile":      REAL ten worst 60/40 drawdowns vs trend-following.
 *  mode="mechanism":  impulse response + hedgers/speculators + roll returns.
 */
export default function TsmomLab({ mode = 'definition' }) {
  if (mode === 'everywhere') return <Everywhere />;
  if (mode === 'smile') return <Smile />;
  if (mode === 'mechanism') return <Mechanism />;
  return <Definition />;
}

function Definition() {
  const [sel, setSel] = useState('ts');
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        <button onClick={() => setSel('xs')} className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${sel === 'xs' ? 'border-teal-600 bg-teal-50' : 'border-yale-200 bg-white'}`}>
          <div className="font-bold text-teal-800">Cross-sectional momentum</div>
          <div className="text-slate-600 mt-0.5">Did you beat your <i>peers</i>? Winners-minus-losers, relative ranks (JT, L5).</div>
        </button>
        <button onClick={() => setSel('ts')} className={`rounded-xl border px-3 py-2 text-left text-[11px] transition ${sel === 'ts' ? 'border-yale-800 bg-yale-50' : 'border-yale-200 bg-white'}`}>
          <div className="font-bold text-yale-900">Time-series momentum</div>
          <div className="text-slate-600 mt-0.5">Is your <i>own</i> past 12-month excess return positive? Long if yes, short if no.</div>
        </button>
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[46px]">
        {sel === 'ts'
          ? <span><b>Why it’s the purer question:</b> the random walk says your own past return predicts nothing — TSMOM tests that head-on. And every under/over-reaction theory (BSV, DHS, Hong–Stein) is a theory of <i>absolute</i> prices; none says anything about beating peers.</span>
          : <span><b>The familiar version:</b> relative momentum can profit even if no asset trends — dispersion in means is enough. That’s exactly why it can’t cleanly test the random walk. The decomposition below shows how much of it was secretly time-series all along.</span>}
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-yale-200 text-[10.5px] text-slate-800">
        <table className="w-full">
          <thead><tr className="bg-yale-800 text-white">
            <th className="px-2 py-1.5 text-left font-semibold"></th>
            <th className="px-2 py-1.5 text-left font-semibold">Cross-sectional</th>
            <th className="px-2 py-1.5 text-left font-semibold">Time series</th>
          </tr></thead>
          <tbody>
            <tr className="bg-white"><td className="px-2 py-1.5 font-semibold text-slate-600">n mo → n mo</td><td className="px-2 py-1.5 text-slate-500">—</td><td className="px-2 py-1.5">“Autocorrelation” — Fama–French ’88, Lo–MacKinlay ’88</td></tr>
            <tr className="bg-yale-50"><td className="px-2 py-1.5 font-semibold text-slate-600">m mo → n mo</td><td className="px-2 py-1.5">“Standard momentum” — JT ’93, AMP</td><td className="px-2 py-1.5 font-bold text-yale-900">Moskowitz–Ooi–Pedersen ← the gap</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">58 liquid futures — equity indices, duration-scaled bond futures, currency forwards, 24 commodities. Panel regressions: the sign of the own past return predicts positively for lookbacks up to ~12 months, then reverses beyond.</p>
    </div>
  );
}

// REAL embedded chart data (AQR 1880-2017, gross Sharpe per instrument) — subset per class, exact values
const TREND = {
  Equities: [['Australia ASX', 0.86], ['Spain IBEX', 0.68], ['Canada TSX', 0.55], ['Italy MIB', 0.52], ['Japan Topix', 0.46], ['Russell 2000', 0.45], ['France CAC', 0.44], ['Netherlands AEX', 0.43], ['S&P 500', 0.41], ['Germany DAX', 0.34], ['UK FTSE', 0.21]],
  Bonds: [['Germany 5yr', 1.02], ['Germany 10yr', 0.85], ['Italy 10yr', 0.73], ['US 10yr', 0.67], ['US 5yr', 0.64], ['Japan 10yr', 0.55], ['US 2yr', 0.55], ['UK 10yr', 0.53], ['Canada 10yr', 0.52], ['Australia 10yr', 0.49], ['US 30yr', 0.44], ['Australia 3yr', 0.06]],
  Currencies: [['USD/JPY', 0.60], ['USD/GBP', 0.56], ['EUR/SEK', 0.38], ['USD/AUD', 0.37], ['EUR/NOK', 0.35], ['EUR/JPY', 0.34], ['EUR/CHF', 0.31], ['USD/EUR', 0.30], ['EUR/GBP', 0.30], ['USD/CAD', 0.28], ['JPY/AUD', 0.24], ['AUD/NZD', 0.08]],
  Commodities: [['Gas oil', 0.60], ['Brent', 0.59], ['Zinc', 0.50], ['Cotton', 0.47], ['WTI crude', 0.45], ['Sugar', 0.43], ['Copper', 0.41], ['Wheat', 0.37], ['Corn', 0.37], ['Nat gas', 0.36], ['Gold', 0.33], ['Aluminum', 0.31], ['Soybeans', 0.23], ['Nickel', 0.18], ['Silver', 0.16], ['Hogs', 0.14], ['Coffee', 0.12], ['Cocoa', 0.08]],
};
const TCOL = { Equities: '#3b82f6', Bonds: '#2dd4bf', Currencies: '#a78bfa', Commodities: '#d97706' };

function Everywhere() {
  const [cls, setCls] = useState('Bonds');
  const rows = TREND[cls];
  const bw = Math.min(26, 356 / rows.length - 4);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {Object.keys(TREND).map((k) => (
          <button key={k} onClick={() => setCls(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${cls === k ? 'text-white' : 'bg-white text-yale-900 border-yale-200'}`}
            style={cls === k ? { background: TCOL[k], borderColor: TCOL[k] } : {}}>{k}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 158" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">trend-following Sharpe by instrument, 1880–2017 (AQR, gross) — real data</text>
        <line x1="22" y1="128" x2="392" y2="128" stroke="#94a3b8" />
        <line x1="22" y1={128 - 0.5 * 110} x2="392" y2={128 - 0.5 * 110} stroke="#e2e8f0" strokeDasharray="3 3" />
        <text x="16" y={128 - 0.5 * 110 + 3} textAnchor="end" fontSize="7.5" fill="#cbd5e1">0.5</text>
        {rows.map(([l, v], i) => (
          <g key={l}>
            <rect x={28 + i * (bw + 4)} y={128 - v * 110} width={bw} height={v * 110} fill={TCOL[cls]} opacity={0.55 + 0.45 * (v / 1.05)} rx="2.5" />
            <text x={28 + i * (bw + 4) + bw / 2} y={128 - v * 110 - 3} textAnchor="middle" fontSize="6.5" fill={TCOL[cls]} fontWeight="700">{v.toFixed(2)}</text>
            <text x={28 + i * (bw + 4) + bw / 2} y="140" fontSize="6" fill="#a3b1c2" transform={`rotate(-38 ${28 + i * (bw + 4) + bw / 2} 140)`} textAnchor="end">{l}</text>
          </g>
        ))}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {cls === 'Bonds' && <span><b>The quiet champion:</b> German 5-year notes at 1.02 — the best trend Sharpe of all 66 instruments. Rates trend because central banks move in long, telegraphed cycles.</span>}
        {cls === 'Equities' && <span><b>Every index positive</b> across up to 137 years — the ASX at 0.86 down to the FTSE at 0.21. No single market is spectacular; the portfolio is.</span>}
        {cls === 'Currencies' && <span><b>Even floating rates trend</b> — every pair positive except AUD/NZD (0.08), two economies so similar there is rarely a trend to ride.</span>}
        {cls === 'Commodities' && <span><b>Positive nearly everywhere</b>, from gas oil (0.60) to cocoa (0.08). Softs trend least — supply shocks reverse fast; energy trends most.</span>}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Diversified 12M TSMOM across all 58 liquid instruments: ~9–10% vol, large alpha to standard factors, robust across lookback/holding grids — and it subsumes cross-sectional momentum (the Lo–MacKinlay decomposition traces both to the same auto-covariance).</p>
    </div>
  );
}

// REAL embedded data: ten largest 60/40 drawdowns 1880–2015, vs trend net of 2/20
const DD = [
  { l: 'Feb–Aug 1893', p: -12.3, t: 8.6 },
  { l: 'Oct 1906–Dec 1907', p: -16.8, t: 26.5 },
  { l: 'Dec 1916–Dec 1917', p: -12.1, t: 25.6 },
  { l: 'Sep 1929–Jun 1932', p: -62.3, t: 36.1, note: 'The Great Depression: 34 months of trend to ride down.' },
  { l: 'Mar 1937–Mar 1938', p: -32.5, t: -8.1, note: 'Miss #1: a fast crash — the 12M signal never flipped short in time.' },
  { l: 'Dec 1968–Jun 1970', p: -19.9, t: 54.8 },
  { l: 'Jan 1973–Sep 1974', p: -30.6, t: 95.4, note: 'Stagflation: equities down, commodities and rates trending hard — trend’s best crisis ever.' },
  { l: 'Sep–Nov 1987', p: -18.0, t: -2.4, note: 'Miss #2: the crash took one day. No trend develops in a day.' },
  { l: 'Sep 2000–Sep 2002', p: -21.2, t: 26.4 },
  { l: 'Nov 2007–Feb 2009', p: -30.5, t: 21.6, note: 'The GFC: a bear market that developed over 16 months — trend flipped short by mid-2008.' },
];

function Smile() {
  const [sel, setSel] = useState(6);
  const d = DD[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 168" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">ten largest 60/40 drawdowns, 1880–2015 — 60/40 (grey) vs trend net of 2/20 (navy). Real data.</text>
        <line x1="20" y1="92" x2="392" y2="92" stroke="#94a3b8" />
        {DD.map((x, i) => (
          <g key={x.l} onClick={() => setSel(i)} className="cursor-pointer" opacity={sel === i ? 1 : 0.55}>
            <rect x={26 + i * 37} y="92" width="14" height={-x.p * 0.72} fill="#94a3b8" rx="2" />
            <rect x={42 + i * 37} y={x.t >= 0 ? 92 - x.t * 0.72 : 92} width="14" height={Math.abs(x.t) * 0.72} fill={x.t >= 0 ? '#3b82f6' : '#e11d48'} rx="2" />
            <text x={41 + i * 37} y={x.t >= 0 ? 92 - x.t * 0.72 - 3 : 92 - 3} textAnchor="middle" fontSize="6.3" fill={x.t >= 0 ? '#3b82f6' : '#e11d48'} fontWeight="800">{x.t > 0 ? '+' : ''}{x.t.toFixed(0)}</text>
            <text x={41 + i * 37} y={92 - x.p * 0.72 + 8} textAnchor="middle" fontSize="6.3" fill="#a3b1c2">{x.p.toFixed(0)}</text>
          </g>
        ))}
        <text x="200" y="164" textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="700">positive in 8 of the 10 worst episodes a balanced portfolio has ever had</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[52px]">
        <b>{d.l}:</b> 60/40 {d.p.toFixed(1)}% · trend {d.t > 0 ? '+' : ''}{d.t.toFixed(1)}%.{' '}
        {d.note || 'A bear market that unfolded over months — long enough for the 12-month signal to flip short and ride it.'}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">The “TSMOM smile”: regressed on market returns and squared market returns, trend shows positive convexity — best in large moves of either sign. Not crash risk, not compensation for bad times: it delivers <i>in</i> them. The failures are the fast crashes (1937, Oct 1987): no months, no trend.</p>
    </div>
  );
}

function Mechanism() {
  const [tab, setTab] = useState('impulse');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['impulse', 'The impulse response'], ['who', 'Who pays whom']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'impulse' ? (
        <>
          <svg viewBox="0 0 400 132" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">cumulative response to a return shock (stylized shape of the paper’s figure)</text>
            <line x1="26" y1="104" x2="392" y2="104" stroke="#94a3b8" />
            <path d="M 30 100 C 90 72, 150 48, 210 40 C 250 35, 280 40, 330 52 C 355 58, 375 62, 390 64" fill="none" stroke="#3b82f6" strokeWidth="2.4" />
            <line x1="210" y1="24" x2="210" y2="104" stroke="#e2e8f0" strokeDasharray="4 3" />
            <text x="120" y="30" fontSize="8.5" fill="#5eead4" fontWeight="700">continuation ≈ 12 months</text>
            <text x="300" y="30" fontSize="8.5" fill="#fb7185" fontWeight="700">partial reversal</text>
            <text x="210" y="118" textAnchor="middle" fontSize="8" fill="#cbd5e1">~12 mo</text>
            <text x="120" y="98" fontSize="8" fill="#a3b1c2">under-reaction builds the trend…</text>
            <text x="268" y="98" fontSize="8" fill="#a3b1c2">…delayed over-reaction ends it</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Split the futures return into spot price change + roll return</b> and the two theories separate: the <b>price-change</b> component continues and then <i>reverses</i> — over-reaction lives in prices; the <b>roll-return</b> component (the futures curve’s tilt) is <i>persistent</i> and never reverses — that is hedging pressure, a payment, not a mistake. Same horizon map as Lecture 5’s equity momentum.
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 112" className="w-full">
            <rect x="30" y="26" width="150" height="60" rx="9" fill="#3b82f6" />
            <text x="105" y="50" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="800">Speculators</text>
            <text x="105" y="66" textAnchor="middle" fontSize="7.5" fill="#bfdbfe">positioned WITH the trend (CFTC)</text>
            <rect x="220" y="26" width="150" height="60" rx="9" fill="#d97706" />
            <text x="295" y="50" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="800">Hedgers</text>
            <text x="295" y="66" textAnchor="middle" fontSize="7.5" fill="#fef3c7">lean against it — paying via the curve</text>
            <path d="M 220 56 C 205 56 195 56 180 56" stroke="#059669" strokeWidth="2.2" markerEnd="url(#tArr)" fill="none" />
            <defs><marker id="tArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#059669" /></marker></defs>
            <text x="200" y="104" textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="700">the roll return: the fee flowing from hedgers to trend-followers</text>
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            Speculator positions, spot changes, and roll returns all predict TSMOM returns. The picture: trends form from slow information diffusion; speculators who ride them also absorb hedgers’ inventory risk and collect the curve for it. “A Trending Walk Down Wall Street.”
          </div>
        </>
      )}
    </div>
  );
}
