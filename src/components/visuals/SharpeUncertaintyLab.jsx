import { useState } from 'react';

/**
 * Lecture 7 — overfitting and Sharpe-ratio uncertainty.
 *  mode="screen":   Type I / Type II selection schematic with a movable significance screen.
 *  mode="interval": SR standard-error calculator reproducing the deck's 0.46 vs 0.63 pair.
 */
export default function SharpeUncertaintyLab({ mode = 'screen' }) {
  if (mode === 'interval') return <Interval />;
  return <Screen />;
}

// standard normal helpers
const phi = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
const Phi = (x) => {
  // Abramowitz–Stegun approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = phi(x);
  let p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
};

function Screen() {
  const [thr, setThr] = useState(1.96);
  const falsePos = (1 - Phi(thr)) * 100;          // right tail of the no-edge N(0,1)
  const missed = Phi(thr - 2) * 100;               // left-of-screen mass of the real-edge N(2,1)
  const X = (t) => 200 + t * 36;                   // t from -4.5..4.9
  const noise = [], real = [];
  for (let t = -4.5; t <= 4.9; t += 0.1) {
    noise.push(`${X(t)},${118 - phi(t) * 220}`);
    real.push(`${X(t)},${118 - phi(t - 2) * 220}`);
  }
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 138" className="w-full">
        <line x1="18" y1="118" x2="392" y2="118" stroke="#94a3b8" />
        <polyline points={noise.join(' ')} fill="none" stroke="#00356b" strokeWidth="2" />
        <polyline points={real.join(' ')} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="6 4" />
        {/* shaded false positives */}
        <polygon points={`${X(thr)},118 ${noise.filter((p) => parseFloat(p) >= X(thr)).join(' ')} 392,118`} fill="#e11d48" opacity="0.28" />
        {/* shaded missed real */}
        <polygon points={`${X(-4.5)},118 ${real.filter((p) => parseFloat(p) <= X(thr)).join(' ')} ${X(thr)},118`} fill="#d97706" opacity="0.22" />
        <line x1={X(thr)} y1="14" x2={X(thr)} y2="118" stroke="#0f172a" strokeWidth="1.6" strokeDasharray="4 3" />
        <text x={X(thr)} y="10" textAnchor="middle" fontSize="8.5" fill="#0f172a" fontWeight="800">screen t = {thr.toFixed(2)}</text>
        <text x={X(-1.4)} y="34" textAnchor="middle" fontSize="8.5" fill="#00356b" fontWeight="700">no real edge</text>
        <text x={X(3.15)} y="34" textAnchor="middle" fontSize="8.5" fill="#d97706" fontWeight="700">real edge</text>
        <text x={X(2.75)} y="112" textAnchor="middle" fontSize="7.5" fill="#e11d48" fontWeight="700">“discovered” noise</text>
        <text x={X(0.75)} y="112" textAnchor="middle" fontSize="7.5" fill="#b45309" fontWeight="700">real, thrown away</text>
      </svg>
      <div className="w-full flex items-center gap-2 text-[11px] text-yale-900">
        <span className="whitespace-nowrap font-semibold">significance screen</span>
        <input type="range" min="0.5" max="4" step="0.02" value={thr} onChange={(e) => setThr(parseFloat(e.target.value))} className="flex-1 accent-yale-800" />
        <span className="w-12 text-right font-mono font-bold">{thr.toFixed(2)}</span>
      </div>
      <div className="w-full grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-rose-800">
          <b>Type I:</b> {falsePos.toFixed(falsePos < 1 ? 2 : 1)}% of every <i>worthless</i> signal tried clears the screen. Try 100, keep {(falsePos).toFixed(1)} frauds.
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-amber-800">
          <b>Type II:</b> {missed.toFixed(1)}% of <i>real</i> signals (true t = 2) get discarded — the invisible opportunity cost.
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Raise the bar and the frauds vanish — but you throw away half the real signals. There is no threshold that fixes this; only keeping score of everything tried does. And an optimizer makes it worse: it loads hardest on whatever looked best by chance.</p>
    </div>
  );
}

function Interval() {
  const [T, setT] = useState(60);
  const [sr, setSr] = useState(0.8);
  const [fat, setFat] = useState(false);
  // deck convention: annual SR, monthly T; convert SR to monthly inside the variance formula
  const srm = sr / Math.sqrt(12);
  const skew = fat ? -3.1 : 0, kurt = fat ? 19.9 : 3;
  const varm = (1 / (T - 1)) * (1 + 0.25 * srm * srm * kurt - srm * skew);
  const se = Math.sqrt(varm) * Math.sqrt(12);
  const lo = sr - 2 * se, hi = sr + 2 * se;
  const pNeg = Phi(-sr / se) * 100;
  const X = (v) => 200 + v * 62;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 96" className="w-full">
        <line x1="14" y1="58" x2="392" y2="58" stroke="#94a3b8" />
        {[-1, 0, 1, 2].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1="55" x2={X(v)} y2="61" stroke="#94a3b8" />
            <text x={X(v)} y="74" textAnchor="middle" fontSize="8" fill="#94a3b8">{v}</text>
          </g>
        ))}
        <line x1={X(0)} y1="14" x2={X(0)} y2="58" stroke="#e2e8f0" />
        <line x1={Math.max(X(lo), 14)} y1="38" x2={Math.min(X(hi), 392)} y2="38" stroke={fat ? '#d97706' : '#00356b'} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx={X(sr)} cy="38" r="5" fill={fat ? '#d97706' : '#00356b'} />
        <text x={X(sr)} y="24" textAnchor="middle" fontSize="9.5" fill="#0f172a" fontWeight="800">SR̂ = {sr.toFixed(2)}</text>
        <text x={Math.max(X(lo), 20)} y="52" textAnchor="middle" fontSize="8" fill="#64748b">{lo.toFixed(2)}</text>
        <text x={Math.min(X(hi), 386)} y="52" textAnchor="middle" fontSize="8" fill="#64748b">{hi.toFixed(2)}</text>
        <text x="200" y="92" textAnchor="middle" fontSize="8.5" fill="#64748b">95% confidence interval for the annualized Sharpe ratio</text>
      </svg>
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-yale-900">
        <label className="flex items-center gap-2"><span className="w-8 font-semibold">SR</span>
          <input type="range" min="0.2" max="1.5" step="0.05" value={sr} onChange={(e) => setSr(parseFloat(e.target.value))} className="flex-1 accent-yale-800" />
          <span className="w-9 text-right font-mono">{sr.toFixed(2)}</span></label>
        <label className="flex items-center gap-2"><span className="w-8 font-semibold">T</span>
          <input type="range" min="24" max="360" step="12" value={T} onChange={(e) => setT(parseInt(e.target.value))} className="flex-1 accent-yale-800" />
          <span className="w-9 text-right font-mono">{T}</span></label>
      </div>
      <button onClick={() => setFat(!fat)}
        className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${fat ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-yale-900 border-yale-200'}`}>
        {fat ? 'strategy B: skew −3.1, kurt 19.9 (selling insurance)' : 'strategy A: symmetric (skew 0, kurt 3) — click to sell insurance'}
      </button>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        SE = <b>{se.toFixed(2)}</b> · 95% CI [{lo.toFixed(2)}, {hi.toFixed(2)}] · P(realized SR̂ &lt; 0) = <b>{pNeg.toFixed(1)}%</b>.
        {T === 60 && Math.abs(sr - 0.8) < 0.03 && (fat
          ? ' — the deck’s strategy B: same 0.80 point estimate, a 38%-wider error bar, and more than double the chance of a negative realized Sharpe.'
          : ' — the deck’s strategy A. Now click the insurance toggle: the point estimate won’t move; the evidence will.')}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Var(SR̂) = (1/(T−1))(1 + SR²·kurt/4 − SR·skew). Negative skew and fat tails widen the interval — a smooth track record from an insurance-seller says less than it looks like it says. Jackknife the months and you’ll see the same thing without any formula.</p>
    </div>
  );
}
