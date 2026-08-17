import { useState } from 'react';

/**
 * Lecture 9 — KMP Carry: the global evidence.
 *  mode="returns": REAL Sharpe bars carry vs EW per class + the Global Carry Factor.
 *  mode="anatomy": static/dynamic decomposition + correlations + vs value & momentum.
 *  mode="risks":   liquidity/vol exposures + expansions vs drawdowns + the three episodes.
 *  mode="verdict": the fourth pillar.
 */
export default function GlobalCarryLab({ mode = 'returns' }) {
  if (mode === 'anatomy') return <Anatomy />;
  if (mode === 'risks') return <Risks />;
  if (mode === 'verdict') return <Verdict />;
  return <Returns />;
}

// REAL Sharpe ratios (KMP): carry strategy vs EW passive-long, per class
const SR = [
  { k: 'Equities', c: 0.88, e: 0.32 }, { k: 'FI 10Y', c: 0.52, e: 0.74 },
  { k: 'FI slope', c: 0.66, e: 0.29 }, { k: 'Treasuries', c: 0.68, e: 0.29 },
  { k: 'Comdty', c: 0.60, e: 0.08 }, { k: 'FX', c: 0.68, e: 0.36 },
  { k: 'Credit', c: 0.47, e: 0.34 }, { k: 'Calls', c: 0.37, e: -0.23 }, { k: 'Puts', c: 1.80, e: -1.01 },
];

function Returns() {
  const [sel, setSel] = useState(8);
  const s = SR[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 158" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">Sharpe ratios: carry long-short (navy) vs passive equal-weight long (grey) — real data</text>
        <line x1="24" y1="106" x2="392" y2="106" stroke="#94a3b8" />
        {SR.map((x, i) => (
          <g key={x.k} onClick={() => setSel(i)} className="cursor-pointer" opacity={sel === i ? 1 : 0.6}>
            <rect x={30 + i * 40} y={x.e >= 0 ? 106 - x.e * 46 : 106} width="12" height={Math.abs(x.e) * 46} fill="#94a3b8" rx="2" />
            <rect x={44 + i * 40} y={106 - x.c * 46} width="12" height={x.c * 46} fill="#00356b" rx="2" />
            <text x={50 + i * 40} y={102 - x.c * 46} textAnchor="middle" fontSize="6.8" fill="#00356b" fontWeight="800">{x.c.toFixed(2)}</text>
            <text x={43 + i * 40} y="150" textAnchor="middle" fontSize="6.6" fill={sel === i ? '#0f172a' : '#94a3b8'} fontWeight="700" transform={`rotate(-24 ${43 + i * 40} 150)`}>{x.k}</text>
          </g>
        ))}
      </svg>
      <div className="w-full grid grid-cols-4 gap-1.5 text-center">
        {[['mean', '6.75%'], ['vol', '6.12%'], ['Sharpe', '1.10'], ['skew', '−0.02']].map(([l, v]) => (
          <div key={l} className="rounded-xl border-2 border-yale-800 bg-yale-50 px-1 py-1.5">
            <div className="text-[15px] font-extrabold text-yale-900">{v}</div>
            <div className="text-[8.5px] uppercase tracking-wide text-slate-500 font-bold">GCF {l}</div>
          </div>
        ))}
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[48px]">
        {sel === 8 ? <span><b>Puts, the extreme case:</b> passively <i>buying</i> index puts torches money at a −1.01 Sharpe (you’re paying the insurance premium, L2/L6); sorting the same puts by carry flips it to +1.80. Carry finds which insurance is rich.</span>
          : sel === 4 ? <span><b>Commodities:</b> passive long earns almost nothing (SR 0.08) — but the carry <i>sort</i> inside commodities earns 0.60. The class average hides enormous cross-sectional predictability.</span>
          : sel === 1 ? <span><b>FI 10Y, the one exception:</b> passive long bonds (0.74) beat the carry sort (0.52) in-sample — the great bond bull market. The slope and Treasury versions still favor carry.</span>
          : <span><b>{s.k}:</b> carry {s.c.toFixed(2)} vs passive {s.e.toFixed(2)}. The expectations hypothesis — carry predicts nothing — fails here as everywhere.</span>}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">The headline: currency carry’s infamous skew (−0.68) nearly vanishes in the diversified factor (−0.02) — each class crashes on its own schedule, so the global book keeps the premium and diversifies the elevator.</p>
    </div>
  );
}

// REAL % dynamic (KMP decomposition)
const DYN = [['Equities', 101], ['FI slope', 99], ['Puts', 100], ['Calls', 111], ['FI 10Y', 86], ['Comdty', 64], ['FX', 58], ['Treasuries', 42], ['Credit', 30]];

function Anatomy() {
  const [tab, setTab] = useState('dyn');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['dyn', 'Timing vs tilt'], ['corr', 'Diversification'], ['vm', 'vs value & momentum']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'dyn' && (
        <>
          <svg viewBox="0 0 400 136" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">share of carry profits from DYNAMIC positions (timing), by class — real data</text>
            {DYN.map(([l, v], i) => (
              <g key={l}>
                <rect x="96" y={20 + i * 12.5} width={Math.min(v, 115) * 2.3} height="9" fill={v >= 80 ? '#00356b' : v >= 50 ? '#0f766e' : '#d97706'} opacity="0.85" rx="2.5" />
                <text x="92" y={27.5 + i * 12.5} textAnchor="end" fontSize="7.5" fill="#334155" fontWeight="600">{l}</text>
                <text x={100 + Math.min(v, 115) * 2.3} y={27.5 + i * 12.5} fontSize="7.5" fill="#0f172a" fontWeight="800">{v}%</text>
              </g>
            ))}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Split E[profit] into a <b>static tilt</b> (average weights × average returns) and a <b>dynamic part</b> (positions bigger exactly when returns are bigger). Equities: 101% dynamic — the tilt contributes <i>nothing</i>. Carry is a timing signal: live evidence that expected returns move, readable off today’s term structure. Only Treasuries and credit are mostly tilts.
          </div>
        </>
      )}
      {tab === 'corr' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
            <div className="font-bold text-yale-900 mb-1">Correlations of carry strategies across classes:</div>
            <div className="flex flex-wrap gap-1">
              {[['FX–credit', 0.31], ['equities–FI', 0.17], ['FX–comdty', 0.11], ['equities–comdty', 0.03], ['most pairs', '≈ 0.0–0.17']].map(([l, v]) => (
                <div key={l} className="rounded-full bg-yale-50 border border-yale-100 px-2.5 py-1 text-[10px] text-yale-900"><b>{l}:</b> {v}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            <b>The 1.10 Sharpe is diversification doing its work</b> — nine sleeves averaging ~0.65 each, nearly uncorrelated, is Lecture 1’s formula compounding across asset classes. The same arithmetic as slide 3 of Lecture 8, one level up.
          </div>
        </div>
      )}
      {tab === 'vm' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
            <div className="font-bold text-yale-900 mb-1">Regress carry returns on passive-long + value + momentum + TSMOM:</div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[['GCF α', '0.53%/mo', 't = 6.52'], ['with all controls', '0.44%/mo', 't = 5.51'], ['information ratio', '1.05–1.24', 'net of V&M']].map(([l, v, t]) => (
                <div key={l} className="rounded-lg bg-yale-50 border border-yale-100 px-1.5 py-1.5">
                  <div className="text-[14px] font-extrabold text-yale-900">{v}</div>
                  <div className="text-[8.5px] text-slate-500">{l} · {t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            <b>Three signals, three paychecks:</b> value = where price has drifted from fundamentals (backward, slow); momentum = where price has recently run (backward, fast); carry = what the curve pays you to wait (forward, model-free). Each survives controlling for the others — the market prices all three separately.
          </div>
        </div>
      )}
    </div>
  );
}

// REAL expansions vs drawdowns (annualized means) and exposures
const STATES = [
  { k: 'Equities', up: 15.03, dn: -6.15 }, { k: 'FI 10Y', up: 10.84, dn: -13.90 },
  { k: 'Comdty', up: 21.49, dn: -13.23 }, { k: 'FX', up: 10.06, dn: -6.81 },
];

function Risks() {
  const [tab, setTab] = useState('states');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['states', 'Expansions vs drawdowns'], ['exp', 'Exposures'], ['epi', 'The three episodes']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'states' && (
        <>
          <svg viewBox="0 0 400 128" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">annualized carry returns in carry expansions (green) vs drawdowns (red) — real data</text>
            <line x1="26" y1="76" x2="392" y2="76" stroke="#94a3b8" />
            {STATES.map((x, i) => (
              <g key={x.k}>
                <rect x={48 + i * 90} y={76 - x.up * 2.1} width="26" height={x.up * 2.1} fill="#059669" rx="3" />
                <rect x={78 + i * 90} y="76" width="26" height={-x.dn * 2.1} fill="#e11d48" rx="3" />
                <text x={61 + i * 90} y={72 - x.up * 2.1} textAnchor="middle" fontSize="7.5" fill="#059669" fontWeight="800">+{x.up.toFixed(1)}</text>
                <text x={91 + i * 90} y={76 - x.dn * 2.1 + 10} textAnchor="middle" fontSize="7.5" fill="#e11d48" fontWeight="800">{x.dn.toFixed(1)}</text>
                <text x={76 + i * 90} y="122" textAnchor="middle" fontSize="8" fill="#334155" fontWeight="700">{x.k}</text>
              </g>
            ))}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            State-dependence is what a risk premium <i>requires</i>: steady pay, concentrated pain. Compare trend-following (L8), which swings the <i>other</i> way in crises — carry and trend charge for opposite states, which is why serious books hold both.
          </div>
        </>
      )}
      {tab === 'exp' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
            <div className="font-bold text-yale-900 mb-1">Carry-strategy loadings (real, with t-stats):</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5">
                <div className="font-bold text-rose-800">Liquidity shocks: +</div>
                <div className="text-rose-700 text-[10px]">FX +0.88 (t 3.6) · credit +1.24 (t 3.8) · puts +0.57 · comdty +0.26 — carry bleeds when liquidity dries up.</div>
              </div>
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5">
                <div className="font-bold text-rose-800">Volatility changes: −</div>
                <div className="text-rose-700 text-[10px]">FX −1.03 (t −6.5) · FI −0.54 · comdty −0.42 — vol spikes are carry’s enemy in every class…</div>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 mt-1.5">
              <div className="font-bold text-emerald-800">…except Treasuries: vol loading +0.54 (t 2.9)</div>
              <div className="text-emerald-700 text-[10px]">Flight-to-quality: the safe-haven exception that proves the mechanism.</div>
            </div>
          </div>
        </div>
      )}
      {tab === 'epi' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          {[
            ['Aug 1972 – Sep 1975', '−19.6%', 'the oil-shock recession'],
            ['Mar 1980 – Jun 1982', '−26.8%', 'the Volcker double-dip'],
            ['Aug 2008 – Feb 2009', '−7.2%', 'the global financial crisis'],
          ].map(([d, r, n]) => (
            <div key={d} className="rounded-xl border border-rose-200 bg-white px-3 py-2 flex items-center justify-between">
              <div><div className="font-bold text-yale-900">{d}</div><div className="text-slate-500 text-[10px]">{n}</div></div>
              <div className="text-[17px] font-extrabold text-rose-600">{r}</div>
            </div>
          ))}
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            Forty years, exactly three drawdowns — <b>every one spans a global recession</b>. Not crash risk (global skew −0.02); recession-liquidity-volatility risk, amplified by Block B’s funding spirals. A premium with a legible bill.
          </div>
        </div>
      )}
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5 text-[11px]">
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[['Value', 'L4', 'price vs anchor'], ['Momentum', 'L5', 'recent run'], ['Trend', 'L8', 'own past sign'], ['Carry', 'L9', 'paid to wait']].map(([k, l, d]) => (
          <div key={k} className={`rounded-xl border-2 px-1 py-2 ${k === 'Carry' ? 'border-yale-800 bg-yale-50' : 'border-yale-200 bg-white'}`}>
            <div className="font-extrabold text-yale-900">{k}</div>
            <div className="text-[8.5px] text-slate-500">{l} · {d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
        <b>The gauntlet, applied (L7):</b> alpha t-stats 5.5–6.5 ✓ · robust across nine classes and both constructions ✓ · out-of-sample every time a new class is added — and a century old in FX ✓ · two live stories: a recession-liquidity-volatility premium, plus funding-constrained amplification ✓. Carry passes.
      </div>
      <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
        <b>What carry proves that nothing else in the course does:</b> expected returns vary over time and across assets, and part of that variation is <i>printed on today’s screen</i> — no estimation, no history. The expectations hypothesis dies in nine asset classes simultaneously. One caveat stamped on everything: gross of trading costs. Lecture 10 sends the bill.
      </div>
    </div>
  );
}
