import { useState } from 'react';

/**
 * Lecture 2 — two modes:
 *  mode="cmlsml": dual panel; securities inside the frontier in sigma-space collapse onto the SML in beta-space.
 *  mode="decompose": beta & idiosyncratic sliders splitting sigma^2 = beta^2 sigmaM^2 + sigma_eps^2.
 */
export default function SystematicRiskLab({ mode = 'cmlsml' }) {
  if (mode === 'decompose') return <Decompose />;
  return <CmlSml />;
}

const SECURITIES = [
  { id: 1, beta: 1.0, sigma: 30, name: 'Sec 1' },
  { id: 2, beta: 0.75, sigma: 24, name: 'Sec 2' },
  { id: 3, beta: 0.5, sigma: 32, name: 'Sec 3' },
  { id: 4, beta: 0.2, sigma: 27, name: 'Sec 4' },
];

function CmlSml() {
  const rf = 3, mktE = 9, mktSig = 16; // %
  const prem = mktE - rf;
  const [sel, setSel] = useState(1);
  const Er = (b) => rf + b * prem;

  // Panel A (sigma space)
  const XA = (s) => 18 + (s / 40) * 175;
  const YA = (e) => 165 - ((e - 0) / 13) * 150;
  // frontier: sigma(mu) = sqrt(smin^2 + k*(mu-mumin)^2)
  const frontier = [];
  for (let mu = 4.4; mu <= 12.5; mu += 0.25) frontier.push(`${XA(Math.sqrt(100 + 9 * (mu - 6) ** 2))},${YA(mu)}`);
  // Panel B (beta space)
  const XB = (b) => 232 + (b / 1.4) * 165;
  const YB = YA;

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-2">
      <svg viewBox="0 0 420 196" className="w-full">
        {/* Panel A */}
        <text x="100" y="11" textAnchor="middle" fontSize="9.5" fill="#00356b" fontWeight="700">A · σ-space (CML)</text>
        <line x1="18" y1="165" x2="200" y2="165" stroke="#94a3b8" />
        <line x1="18" y1="165" x2="18" y2="16" stroke="#94a3b8" />
        <text x="196" y="177" textAnchor="end" fontSize="8.5" fill="#64748b">σ (%)</text>
        <polyline points={frontier.join(' ')} fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <line x1={XA(0)} y1={YA(rf)} x2={XA(38)} y2={YA(rf + (prem / mktSig) * 38)} stroke="#00356b" strokeWidth="2.2" />
        <text x={XA(25)} y={YA(rf + (prem / mktSig) * 25) - 6} fontSize="8.5" fill="#00356b" fontWeight="700">CML</text>
        <circle cx={XA(mktSig)} cy={YA(mktE)} r="4.5" fill="#d97706" stroke="#00356b" />
        <text x={XA(mktSig) - 6} y={YA(mktE) - 7} fontSize="8.5" fill="#b45309" fontWeight="700">M</text>
        {SECURITIES.map((s) => (
          <g key={s.id} onClick={() => setSel(s.id)} className="cursor-pointer">
            <line x1={XA(Math.sqrt(100 + 9 * (Er(s.beta) - 6) ** 2))} y1={YA(Er(s.beta))} x2={XA(39)} y2={YA(Er(s.beta))} stroke="#e2e8f0" strokeDasharray="3 3" />
            <circle cx={XA(s.sigma)} cy={YA(Er(s.beta))} r={sel === s.id ? 6 : 4} fill={sel === s.id ? '#e11d48' : '#f87171'} stroke="white" strokeWidth="1.2" />
            {sel === s.id && <text x={XA(s.sigma)} y={YA(Er(s.beta)) - 8} textAnchor="middle" fontSize="8.5" fill="#e11d48" fontWeight="700">{s.name}</text>}
          </g>
        ))}
        {/* Panel B */}
        <text x="315" y="11" textAnchor="middle" fontSize="9.5" fill="#00356b" fontWeight="700">B · β-space (SML)</text>
        <line x1="232" y1="165" x2="405" y2="165" stroke="#94a3b8" />
        <line x1="232" y1="165" x2="232" y2="16" stroke="#94a3b8" />
        <text x="401" y="177" textAnchor="end" fontSize="8.5" fill="#64748b">β</text>
        <line x1={XB(0)} y1={YB(rf)} x2={XB(1.35)} y2={YB(Er(1.35))} stroke="#00356b" strokeWidth="2.2" />
        <text x={XB(1.15)} y={YB(Er(1.15)) - 7} fontSize="8.5" fill="#00356b" fontWeight="700">SML</text>
        <circle cx={XB(1)} cy={YB(mktE)} r="4.5" fill="#d97706" stroke="#00356b" />
        {SECURITIES.map((s) => (
          <circle key={s.id} cx={XB(s.beta)} cy={YB(Er(s.beta))} r={sel === s.id ? 6 : 4}
            fill={sel === s.id ? '#e11d48' : '#f87171'} stroke="white" strokeWidth="1.2"
            className="cursor-pointer" onClick={() => setSel(s.id)} />
        ))}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {(() => { const s = SECURITIES.find((x) => x.id === sel); return (
          <span><b>{s.name}</b>: σ = {s.sigma}% puts it deep <i>inside</i> the frontier in Panel A — yet with β = {s.beta} it sits <b>exactly on the SML</b> at E[r] = {Er(s.beta).toFixed(1)}%. Only efficient portfolios touch the CML; <b>every</b> asset must touch the SML.</span>
        ); })()}
      </div>
    </div>
  );
}

function Decompose() {
  const sigM = 15;
  const [beta, setBeta] = useState(1.2);
  const [sigE, setSigE] = useState(10);
  const sysVar = beta * beta * sigM * sigM;
  const idiVar = sigE * sigE;
  const totVar = sysVar + idiVar;
  const totSig = Math.sqrt(totVar);
  const share = (sysVar / totVar) * 100;
  const rf = 3, prem = 6;
  const req = rf + beta * prem;
  const W = 360;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="w-full flex flex-col gap-2">
        <label className="text-xs text-slate-600 flex items-center gap-2">
          <span className="w-28">β = <b className="text-yale-900">{beta.toFixed(2)}</b></span>
          <input type="range" min="0" max="2" step="0.05" value={beta} onChange={(e) => setBeta(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
        <label className="text-xs text-slate-600 flex items-center gap-2">
          <span className="w-28">σ(ε) = <b className="text-yale-900">{sigE}%</b></span>
          <input type="range" min="0" max="40" step="1" value={sigE} onChange={(e) => setSigE(+e.target.value)} className="flex-1 accent-amber-600" />
        </label>
      </div>
      <svg viewBox="0 0 400 92" className="w-full">
        <text x="20" y="14" fontSize="10" fill="#334155" fontWeight="600">Variance: {totVar.toFixed(0)} %²  (σ = {totSig.toFixed(2)}%)</text>
        <rect x="20" y="22" width={(sysVar / Math.max(totVar, 1)) * W} height="26" fill="#00356b" rx="3" />
        <rect x={20 + (sysVar / Math.max(totVar, 1)) * W} y="22" width={(idiVar / Math.max(totVar, 1)) * W} height="26" fill="#d97706" rx="3" />
        <text x={20 + Math.max((sysVar / Math.max(totVar, 1)) * W * 0.5, 34)} y="39" textAnchor="middle" fontSize="9.5" fill="white" fontWeight="700">β²σ²_M = {sysVar.toFixed(0)}</text>
        {idiVar > totVar * 0.12 && (
          <text x={20 + (sysVar / Math.max(totVar, 1)) * W + (idiVar / Math.max(totVar, 1)) * W * 0.5} y="39" textAnchor="middle" fontSize="9.5" fill="white" fontWeight="700">σ²(ε) = {idiVar.toFixed(0)}</text>
        )}
        <text x="20" y="68" fontSize="10" fill="#00356b" fontWeight="600">Priced (systematic): {share.toFixed(1)}%</text>
        <text x="380" y="68" textAnchor="end" fontSize="10" fill="#b45309" fontWeight="600">Diversifiable: {(100 - share).toFixed(1)}%</text>
        <text x="20" y="86" fontSize="10.5" fill="#0f766e" fontWeight="700">Required return: r_f + β·premium = {req.toFixed(1)}%  — depends only on the navy bar</text>
      </svg>
      <p className="text-[11px] text-slate-500 leading-snug">Push σ(ε) to 40 with β = 0: total risk explodes, required return stays at r_f = 3%. Held inside a diversified portfolio, the amber piece averages away — nobody pays you to bear it.</p>
    </div>
  );
}
