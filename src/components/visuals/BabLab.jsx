import { useState } from 'react';

/**
 * Lecture 6 — Frazzini–Pedersen, Betting Against Beta.
 *  mode="theory":   interactive ψ slider pivots the SML around β=1; alpha = ψ(1−β).
 *  mode="evidence": Sharpe bars, TED-spread timing, who-holds-what.
 */
export default function BabLab({ mode = 'theory' }) {
  if (mode === 'evidence') return <Evidence />;
  return <Theory />;
}

function Theory() {
  const [psi, setPsi] = useState(1.5); // % funding tightness
  const rf = 2, mktPrem = 6;
  const lambda = mktPrem - psi;
  // chart: beta 0..2 on x, E[r] 0..10 on y
  const X = (b) => 36 + b * 172;
  const Y = (r) => 128 - r * 11.6;
  const capm = (b) => rf + b * mktPrem;
  const fund = (b) => rf + psi + b * lambda;
  const aLow = (psi * 0.5).toFixed(2); // alpha at beta 0.5
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 150" className="w-full">
        <line x1="36" y1="128" x2="390" y2="128" stroke="#94a3b8" />
        <line x1="36" y1="128" x2="36" y2="8" stroke="#94a3b8" />
        <text x="386" y="140" textAnchor="end" fontSize="8.5" fill="#a3b1c2">β</text>
        <text x="14" y="14" fontSize="8.5" fill="#a3b1c2">E[r]%</text>
        {[0.5, 1, 1.5, 2].map((b) => (
          <text key={b} x={X(b)} y="140" textAnchor="middle" fontSize="8" fill="#cbd5e1">{b}</text>
        ))}
        {/* CAPM line */}
        <line x1={X(0)} y1={Y(capm(0))} x2={X(2)} y2={Y(capm(2))} stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="5 4" />
        <text x={X(1.72)} y={Y(capm(1.72)) - 6} fontSize="8" fill="#cbd5e1">CAPM</text>
        {/* funding line */}
        <line x1={X(0)} y1={Y(fund(0))} x2={X(2)} y2={Y(fund(2))} stroke="#3b82f6" strokeWidth="2.4" />
        <text x={X(1.62)} y={Y(fund(1.62)) + 13} fontSize="8.5" fill="#93b8e8" fontWeight="700">funding CAPM</text>
        {/* pivot at beta=1 */}
        <circle cx={X(1)} cy={Y(capm(1))} r="3.5" fill="#0f766e" />
        <text x={X(1) + 6} y={Y(capm(1)) - 6} fontSize="8" fill="#5eead4" fontWeight="700">pivot: β = 1</text>
        {/* alpha wedge at beta 0.5 */}
        <line x1={X(0.5)} y1={Y(capm(0.5))} x2={X(0.5)} y2={Y(fund(0.5))} stroke="#059669" strokeWidth="2.4" />
        <text x={X(0.5) - 5} y={(Y(capm(0.5)) + Y(fund(0.5))) / 2 + 3} textAnchor="end" fontSize="8.5" fill="#34d399" fontWeight="800">+α</text>
        {/* alpha wedge at beta 1.5 */}
        <line x1={X(1.5)} y1={Y(capm(1.5))} x2={X(1.5)} y2={Y(fund(1.5))} stroke="#e11d48" strokeWidth="2.4" />
        <text x={X(1.5) + 5} y={(Y(capm(1.5)) + Y(fund(1.5))) / 2 + 3} fontSize="8.5" fill="#fb7185" fontWeight="800">−α</text>
      </svg>
      <div className="w-full flex items-center gap-2 text-[11px] text-yale-900">
        <span className="whitespace-nowrap font-semibold">funding tightness ψ</span>
        <input type="range" min="0" max="3" step="0.1" value={psi} onChange={(e) => setPsi(parseFloat(e.target.value))} className="flex-1 accent-yale-800" />
        <span className="w-14 text-right font-mono font-bold">{psi.toFixed(1)}%</span>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        λ = E[r<sub>M</sub>]−r<sub>f</sub>−ψ = <b>{lambda.toFixed(1)}%</b> · CAPM-alpha = ψ(1−β): a β=0.5 stock earns <b className="text-emerald-700">+{aLow}%</b>, a β=1.5 stock <b className="text-rose-600">−{aLow}%</b>. {psi === 0 ? 'At ψ = 0 the two lines coincide — the CAPM is the special case of no constraints.' : 'Tighter funding ⟹ flatter line ⟹ bigger BAB prize.'}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">1969: Fischer Black finds exactly this in Wells Fargo’s data. The bank declines to trade it — “the nearly unique instance when Fischer lost his cool.” Nine decades of stocks and six of bonds have kept drawing the too-flat line.</p>
    </div>
  );
}

const ETABS = [
  { k: 'sharpe', l: 'Sharpe ratios' },
  { k: 'ted', l: 'Funding shocks' },
  { k: 'holders', l: 'Who holds what' },
];

function Evidence() {
  const [tab, setTab] = useState('sharpe');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {ETABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === t.k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'sharpe' && (
        <>
          <svg viewBox="0 0 400 140" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">annualized Sharpe ratio, US stocks (Frazzini–Pedersen)</text>
            <line x1="26" y1="116" x2="390" y2="116" stroke="#94a3b8" />
            {[
              { l: 'SMB', v: 0.25, c: '#94a3b8' }, { l: 'HML', v: 0.39, c: '#94a3b8' },
              { l: 'UMD', v: 0.50, c: '#94a3b8' }, { l: 'BAB', v: 0.75, c: '#3b82f6' },
            ].map((b, i) => (
              <g key={b.l}>
                <rect x={50 + i * 88} y={116 - b.v * 124} width="56" height={b.v * 124} fill={b.c} rx="4" />
                <text x={78 + i * 88} y={116 - b.v * 124 - 5} textAnchor="middle" fontSize="10" fill={b.c} fontWeight="800">{b.v.toFixed(2)}</text>
                <text x={78 + i * 88} y="130" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">{b.l}</text>
              </g>
            ))}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>BAB beats the classics</b> — long low-beta levered to β = 1, short high-beta delevered to β = 1. And it isn’t a stock quirk: alphas decline in beta across Treasuries, credit, indices, FX, and commodities; anything with leverage <i>built in</i> (options, levered ETFs) earns significantly negative returns per unit of exposure.
          </div>
        </>
      )}
      {tab === 'ted' && (
        <>
          <svg viewBox="0 0 400 128" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">3-yr BAB return (navy) vs 3-yr TED spread, inverted (amber) — stylized</text>
            <line x1="20" y1="70" x2="392" y2="70" stroke="#e2e8f0" />
            <path d="M 24 44 C 70 32, 110 60, 150 50 C 200 38, 240 92, 285 98 C 320 102, 360 52, 388 40" fill="none" stroke="#3b82f6" strokeWidth="2.2" />
            <path d="M 24 52 C 70 40, 110 66, 150 58 C 200 46, 240 98, 285 104 C 320 108, 360 60, 388 48" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 4" />
            <text x="262" y="118" textAnchor="middle" fontSize="8.5" fill="#fb7185" fontWeight="700">funding squeeze ⟹ BAB losses</text>
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>Proposition 3, confirmed.</b> The two series move together: when the TED spread spikes, leveraged investors are forced to delever, and BAB — a leverage trade — loses contemporaneously. When constraints ease, the underpricing of low beta reasserts itself. The factor’s losses are timed to its own mechanism.
          </div>
        </>
      )}
      {tab === 'holders' && (
        <>
          <svg viewBox="0 0 400 118" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">average beta of holdings</text>
            <line x1="200" y1="24" x2="200" y2="100" stroke="#e2e8f0" />
            <text x="200" y="112" textAnchor="middle" fontSize="8" fill="#cbd5e1">β = 1</text>
            {[
              { l: 'Mutual funds', b: 1.12, y: 34 }, { l: 'Individuals', b: 1.08, y: 54 },
              { l: 'LBO deals', b: 0.85, y: 74 }, { l: 'Berkshire', b: 0.77, y: 94 },
            ].map((r) => (
              <g key={r.l}>
                <text x="14" y={r.y + 3} fontSize="8.5" fill="#cbd5e1" fontWeight="600">{r.l}</text>
                <rect x={r.b >= 1 ? 200 : 200 - (1 - r.b) * 340} y={r.y - 7} width={Math.abs(r.b - 1) * 340} height="14"
                  fill={r.b >= 1 ? '#e11d48' : '#059669'} rx="3" opacity="0.85" />
                <text x={r.b >= 1 ? 200 + (r.b - 1) * 340 + 5 : 200 - (1 - r.b) * 340 - 5} y={r.y + 3}
                  textAnchor={r.b >= 1 ? 'start' : 'end'} fontSize="9" fill={r.b >= 1 ? '#e11d48' : '#059669'} fontWeight="800">{r.b.toFixed(2)}</text>
              </g>
            ))}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Proposition 5.</b> MPT says everyone holds the same portfolio; the data reject it in exactly the BAB direction. Constrained investors (funds barred from leverage, individuals) reach for beta; unconstrained investors (Berkshire with insurance float, LBO funds) buy <i>safe</i> assets and apply the leverage themselves. Slide 11 makes that quantitative.
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Betas illustrative of the paper’s Figure — direction and ordering are the tested prediction.</p>
    </div>
  );
}
