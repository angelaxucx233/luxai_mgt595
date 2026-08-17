import { useState } from 'react';

/**
 * Lecture 6 — Frazzini–Kabiller–Pedersen, "Buffett's Alpha".
 * Single component, three internal tabs: the split, the regression, the replication.
 */
export default function BuffettDecomposer() {
  const [tab, setTab] = useState('split');
  const TABS = [
    { k: 'split', l: 'The split' },
    { k: 'reg', l: 'The regression' },
    { k: 'sys', l: 'Systematic Buffett' },
  ];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === t.k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{t.l}</button>
        ))}
      </div>

      {tab === 'split' && (
        <>
          <svg viewBox="0 0 400 150" className="w-full">
            <rect x="120" y="10" width="160" height="32" rx="7" fill="#00356b" />
            <text x="200" y="30" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="800">Berkshire Hathaway</text>
            <line x1="160" y1="42" x2="92" y2="66" stroke="#94a3b8" strokeWidth="1.4" />
            <line x1="240" y1="42" x2="308" y2="66" stroke="#94a3b8" strokeWidth="1.4" />
            <rect x="20" y="66" width="150" height="42" rx="7" fill="#0f766e" />
            <text x="95" y="83" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800">Stock picker</text>
            <text x="95" y="98" textAnchor="middle" fontSize="8" fill="#ccfbf1">public equities — observed via 13F filings</text>
            <rect x="230" y="66" width="150" height="42" rx="7" fill="#d97706" />
            <text x="305" y="83" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800">CEO</text>
            <text x="305" y="98" textAnchor="middle" fontSize="8" fill="#fef3c7">private companies — inferred from the identity</text>
            <text x="200" y="128" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="700">Leverage L = (Total Assets − Cash) / Equity ≈ 1.6-to-1</text>
            <text x="200" y="143" textAnchor="middle" fontSize="8.5" fill="#64748b">— financed largely by insurance float: cheap, stable, and never subject to a margin call</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Berkshire’s return decomposes into a weighted, levered mix of the public book and the private book. The private return is backed out of the balance-sheet identity — no guessing required. Now regress the whole thing on factors.
          </div>
        </>
      )}

      {tab === 'reg' && (
        <>
          <svg viewBox="0 0 400 158" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">annualized alpha of Berkshire</text>
            <line x1="26" y1="126" x2="230" y2="126" stroke="#94a3b8" />
            <g>
              <rect x="46" y={126 - 12.1 * 8} width="64" height={12.1 * 8} fill="#00356b" rx="4" />
              <text x="78" y={126 - 12.1 * 8 - 6} textAnchor="middle" fontSize="10.5" fill="#00356b" fontWeight="800">12.1%</text>
              <text x="78" y="140" textAnchor="middle" fontSize="8" fill="#64748b">4-factor</text>
              <text x="78" y="151" textAnchor="middle" fontSize="7.5" fill="#94a3b8">t = 3.19</text>
            </g>
            <g>
              <rect x="140" y={126 - 6.3 * 8} width="64" height={6.3 * 8} fill="#94a3b8" rx="4" />
              <text x="172" y={126 - 6.3 * 8 - 6} textAnchor="middle" fontSize="10.5" fill="#64748b" fontWeight="800">6.3%</text>
              <text x="172" y="140" textAnchor="middle" fontSize="8" fill="#64748b">+ BAB + QMJ</text>
              <text x="172" y="151" textAnchor="middle" fontSize="7.5" fill="#e11d48" fontWeight="700">t = 1.58 — n.s.</text>
            </g>
            <g>
              <rect x="252" y="20" width="136" height="118" rx="8" fill="#f0f7ff" stroke="#bfdbfe" />
              <text x="320" y="36" textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">the six loadings</text>
              {[
                ['MKT', '+', '#059669'], ['SMB', '− (large!)', '#e11d48'], ['HML', '+ (cheap)', '#059669'],
                ['UMD', '≈ 0', '#94a3b8'], ['BAB', '0.29 (t 2.67)', '#00356b'], ['QMJ', '0.43 (t 2.34)', '#00356b'],
              ].map(([k, v, c], i) => (
                <g key={k}>
                  <text x="264" y={52 + i * 15} fontSize="8.5" fill="#334155" fontWeight="700">{k}</text>
                  <text x="300" y={52 + i * 15} fontSize="8.5" fill={c} fontWeight="700">{v}</text>
                </g>
              ))}
            </g>
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>Buffett buys cheap, large, safe, quality stocks — with leverage.</b> Add BAB and QMJ and both load significantly; the alpha falls from 12.1% to 6.3% and loses statistical significance. Nearly half the legend is systematic factor exposure.
          </div>
        </>
      )}

      {tab === 'sys' && (
        <>
          <svg viewBox="0 0 400 122" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">cumulative return, log scale (stylized shape of the paper’s figure)</text>
            <path d="M 24 104 C 90 92, 150 74, 210 56 C 270 38, 330 26, 390 14" fill="none" stroke="#00356b" strokeWidth="2.4" />
            <path d="M 24 104 C 90 94, 150 78, 210 61 C 270 44, 330 32, 390 21" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M 24 104 C 90 98, 150 90, 210 80 C 270 70, 330 62, 390 54" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="2 3" />
            <text x="300" y="14" fontSize="8.5" fill="#00356b" fontWeight="700">Berkshire public book</text>
            <text x="252" y="40" fontSize="8.5" fill="#d97706" fontWeight="700">systematic Buffett-style</text>
            <text x="320" y="66" fontSize="8.5" fill="#94a3b8">market, same vol</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            A rules-based portfolio — cheap, safe, quality stocks, levered like Berkshire — <b>tracks Buffett’s public book</b>. The honest reading doesn’t diminish him: he identified BAB and QMJ four decades before academia named them, built a leverage source immune to margin calls, and never once got shaken out. Genius = ex-ante factor identification + implementation + discipline.
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Frazzini, Kabiller &amp; Pedersen, “Buffett’s Alpha.” The most famous track record in investing, rendered as a regression you can audit.</p>
    </div>
  );
}
