import { useState } from 'react';

/**
 * Lecture 7 — Harvey–Liu–Zhu multiple testing.
 *  mode="hurdle":     Bonferroni t-hurdle vs N with a slider (real curve points).
 *  mode="procedures": FWER vs FDR; Bonferroni/Holm/BHY thresholds + the worked 10-test example.
 *  mode="theory":     silly factors, the 1000-factor simulation, the arithmetic of luck.
 */
export default function MultipleTestingLab({ mode = 'hurdle' }) {
  if (mode === 'procedures') return <Procedures />;
  if (mode === 'theory') return <Theory />;
  return <Hurdle />;
}

// HLZ curve: t = Phi^{-1}(1 - 0.05/2N) — exact deck points
const CURVE = [
  [1, 1.960], [2, 2.241], [5, 2.576], [10, 2.807], [25, 3.090],
  [50, 3.291], [100, 3.481], [200, 3.662], [500, 3.891], [1000, 4.056],
];
const hurdleAt = (n) => {
  // log-interpolate between deck points
  if (n <= 1) return 1.96;
  for (let i = 1; i < CURVE.length; i++) {
    if (n <= CURVE[i][0]) {
      const [n0, t0] = CURVE[i - 1], [n1, t1] = CURVE[i];
      const f = (Math.log(n) - Math.log(n0)) / (Math.log(n1) - Math.log(n0));
      return t0 + f * (t1 - t0);
    }
  }
  return 4.056;
};

function Hurdle() {
  const [n, setN] = useState(316);
  const t = hurdleAt(n);
  const X = (nn) => 30 + (Math.log10(nn) / 3) * 356;
  const Y = (tt) => 130 - ((tt - 1.8) / 2.5) * 112;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 152" className="w-full">
        <line x1="30" y1="130" x2="392" y2="130" stroke="#94a3b8" />
        <line x1="30" y1="130" x2="30" y2="10" stroke="#94a3b8" />
        {[1, 10, 100, 1000].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1="130" x2={X(v)} y2="134" stroke="#94a3b8" />
            <text x={X(v)} y="145" textAnchor="middle" fontSize="8" fill="#cbd5e1">{v}</text>
          </g>
        ))}
        {[2, 3, 4].map((v) => (
          <g key={v}>
            <text x="24" y={Y(v) + 3} textAnchor="end" fontSize="8" fill="#cbd5e1">{v}</text>
            <line x1="30" y1={Y(v)} x2="392" y2={Y(v)} stroke="#e2e8f0" />
          </g>
        ))}
        <text x="36" y="16" fontSize="8.5" fill="#a3b1c2">required t-stat (5% family-wise, Bonferroni)</text>
        <text x="388" y="145" textAnchor="end" fontSize="8" fill="#a3b1c2">N tests (log)</text>
        {/* the old t=1.96 bar */}
        <line x1="30" y1={Y(1.96)} x2="392" y2={Y(1.96)} stroke="#e11d48" strokeWidth="1.3" strokeDasharray="5 4" />
        <text x="330" y={Y(1.96) + 11} fontSize="7.5" fill="#fb7185" fontWeight="700">the usual 5% bar, t = 1.96</text>
        {/* t=3 rule of thumb */}
        <line x1="30" y1={Y(3)} x2="392" y2={Y(3)} stroke="#d97706" strokeWidth="1.3" />
        <text x="36" y={Y(3) - 4} fontSize="7.5" fill="#d97706" fontWeight="700">“t ≥ 3” rule of thumb — crossed at N ≈ 20</text>
        {/* curve */}
        <polyline points={CURVE.map(([nn, tt]) => `${X(nn)},${Y(tt)}`).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.4" />
        {CURVE.map(([nn, tt]) => <circle key={nn} cx={X(nn)} cy={Y(tt)} r="2.6" fill="#3b82f6" />)}
        {/* cursor */}
        <line x1={X(n)} y1={Y(t)} x2={X(n)} y2="130" stroke="#0f172a" strokeWidth="1.3" strokeDasharray="3 3" />
        <circle cx={X(n)} cy={Y(t)} r="5" fill="#fff" stroke="#0f172a" strokeWidth="2" />
        <text x={X(n)} y={Y(t) - 9} textAnchor="middle" fontSize="9.5" fill="#334155" fontWeight="800">t = {t.toFixed(2)}</text>
      </svg>
      <div className="w-full flex items-center gap-2 text-[11px] text-yale-900">
        <span className="whitespace-nowrap font-semibold">N tested</span>
        <input type="range" min="0" max="3" step="0.01" value={Math.log10(n)}
          onChange={(e) => setN(Math.round(Math.pow(10, parseFloat(e.target.value))))} className="flex-1 accent-yale-800" />
        <span className="w-12 text-right font-mono font-bold">{n}</span>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {n < 3 ? <span><b>One test:</b> t = 1.96 means what your statistics course said it means. It is the last time it will.</span>
          : n < 100 ? <span><b>{n} tests:</b> the hurdle is already {t.toFixed(2)} — 25 tests demand t &gt; 3. Every quant desk exceeds this by lunchtime.</span>
          : n < 400 ? <span><b>{n} tests — the published literature’s neighborhood (316 factors):</b> hurdle ≈ {t.toFixed(2)}. A published t of 2.0 here is the expected best draw from noise. And by 2032 the projected bars are Bonferroni ≈ 4.0, Holm ≈ 3.8, BHY ≈ 3.4.</span>
          : <span><b>{n} tests:</b> hurdle {t.toFixed(2)}. Note how slowly it climbs — 100 → 1000 tests moves the bar only 3.48 → 4.06. The damage is done early.</span>}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">t = Φ⁻¹(1 − 0.05/2N). Bonferroni assumes independence, so this is the ceiling: correlated factors put the honest hurdle between 1.96 and the navy curve. Either way, the denominator — how many things were tried — is the number no published paper reports.</p>
    </div>
  );
}

// worked example: HLZ Table 4 — cutoffs 0.5% / 0.60% / 0.85%, discoveries 10/3/4/6
const PROCS = [
  { k: 'single', l: 'Single tests', disc: 10, col: '#94a3b8', formula: 'p(i) ≤ 5%', shape: 'no adjustment', note: 'All ten p-values clear 5%. Ten “discoveries” — this is the literature’s default, and the problem.' },
  { k: 'bonf', l: 'Bonferroni', disc: 3, col: '#3b82f6', formula: 'p(i) ≤ α/M = 0.5%', shape: 'flat — every test faces the same bar', note: 'Controls FWER: the probability of even ONE false discovery. Harshest; assumes independence. Tests 4, 7, 8 survive.' },
  { k: 'holm', l: 'Holm', disc: 4, col: '#0f766e', formula: 'p(i) ≤ α/(M−i+1)', shape: 'convex step-down — loosens after the strong pass', note: 'Also controls FWER, uniformly less conservative: the bar rises as you walk down the ordered list. Adds test 9.' },
  { k: 'bhy', l: 'BHY', disc: 6, col: '#d97706', formula: 'p(i) ≤ (i/M)·α/c(M), c(10)=2.93', shape: 'linear step-up — buys discoveries at a fixed error rate', note: 'Controls FDR — the expected FRACTION of discoveries that are false — and is valid under arbitrary correlation. Six survive.' },
];

function Procedures() {
  const [sel, setSel] = useState(1);
  const p = PROCS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {PROCS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${sel === i ? 'text-white' : 'bg-white text-yale-900 border-yale-200'}`}
            style={sel === i ? { background: x.col, borderColor: x.col } : {}}>{x.l}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 118" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">HLZ’s ten ordered tests — discoveries under {p.l}</text>
        {Array.from({ length: 10 }, (_, i) => {
          // which tests survive per panel (HLZ Table 4): single: all; bonf: ranks 1-3; holm: 1-4; bhy: 1-6 (by order)
          const survive = sel === 0 ? true : sel === 1 ? i < 3 : sel === 2 ? i < 4 : i < 6;
          return (
            <g key={i}>
              <rect x={24 + i * 37} y={survive ? 34 : 52} width="28" height={survive ? 52 : 34}
                fill={survive ? p.col : '#e2e8f0'} rx="4" />
              <text x={38 + i * 37} y={survive ? 28 : 48} textAnchor="middle" fontSize="8"
                fill={survive ? p.col : '#94a3b8'} fontWeight="700">{survive ? '✓' : '✗'}</text>
              <text x={38 + i * 37} y="100" textAnchor="middle" fontSize="7.5" fill="#cbd5e1">p({i + 1})</text>
            </g>
          );
        })}
        <text x="200" y="114" textAnchor="middle" fontSize="8.5" fill="#e2e8f0" fontWeight="700">{p.disc} of 10 declared discoveries</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>{p.l}:</b> <span className="font-mono">{p.formula}</span> · {p.shape}. {p.note}
      </div>
      <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>Applied to the literature:</b> of the 296 significant published factors, <b>158</b> are false under Bonferroni, <b>142</b> under Holm, <b>132</b> under BHY — a ~20% spread. The conclusion does not depend on the method: roughly half the zoo is noise. Medicine got there first (Ioannidis 2005): “most claimed research findings are false.”
      </div>
    </div>
  );
}

const LUCK = [
  { t: '2.0', n: '121' }, { t: '2.5', n: '393' }, { t: '3.0', n: '8,329' },
  { t: '3.5', n: '408,234' }, { t: '5.0', n: '4.4×10¹¹' },
];

function Theory() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
        {[
          ['“Are Investors Moonstruck?”', 'buy near full moons, sell near new moons'],
          ['“Sports Sentiment and Stock Returns”', 'buy the World Cup winner’s market, sell the loser’s'],
          ['“A Temperature Anomaly”', 'buy when it’s cold, sell when it’s hot'],
        ].map(([h, d]) => (
          <div key={h} className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-rose-800">
            <div className="font-bold">{h}</div>
            <div className="text-rose-600">{d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>All three are real published papers.</b> A purely data-driven search cannot distinguish book-to-price from lunar phases — only a theory requirement can, and it filters them out <i>before</i> any t-stat is computed. The honest cost: theory also filters out real effects that lack a story yet (the peso problem cuts both ways).
      </div>
      <svg viewBox="0 0 400 128" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">random tests needed to produce one fluke at each t-stat (log scale)</text>
        <line x1="26" y1="104" x2="392" y2="104" stroke="#94a3b8" />
        {LUCK.map((x, i) => {
          const h = [18, 24, 40, 58, 84][i];
          return (
            <g key={x.t}>
              <rect x={40 + i * 72} y={104 - h} width="48" height={h} fill={i < 2 ? '#94a3b8' : i < 4 ? '#3b82f6' : '#d97706'} rx="4" />
              <text x={64 + i * 72} y={104 - h - 5} textAnchor="middle" fontSize="8" fill="#e2e8f0" fontWeight="800">{x.n}</text>
              <text x={64 + i * 72} y="117" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">t = {x.t}</text>
            </g>
          );
        })}
        <line x1="26" y1="80" x2="392" y2="80" stroke="#e11d48" strokeWidth="1.2" strokeDasharray="5 4" />
        <text x="30" y="60" fontSize="7.5" fill="#fb7185" fontWeight="700">≈ the 400 tests the literature has actually run</text>
      </svg>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>The simulation behind the rule:</b> test 1,000 factors of which 100 are truly real. A t = 1.95 screen yields <b>143 discoveries — 49 of them junk</b>. Near t = 3 the junk is essentially gone while nearly all real factors survive. “t ≥ 3” isn’t a convention: it’s the level where flukes require more searching than the field has plausibly done. (And the equal-weighted index of survivors has t &gt; 11 — over a <b>trillion</b> trials to fake.)
      </div>
    </div>
  );
}
