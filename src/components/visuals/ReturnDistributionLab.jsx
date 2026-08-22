import { useState } from 'react';

/** Normal density with mu/sigma sliders, 1σ and 2σ bands; optional fat-tail (Student-t-like) overlay. */
export default function ReturnDistributionLab({ tailToggle = false }) {
  const [mu, setMu] = useState(8);
  const [sigma, setSigma] = useState(15);
  const [fat, setFat] = useState(false);

  const lo = -60, hi = 80;
  const X = (x) => 40 + ((x - lo) / (hi - lo)) * 350;
  const normPdf = (x) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
  // Student-t with nu=3 scaled to same sigma-ish scale (illustrative fat tails)
  const nu = 3;
  const tScale = sigma / Math.sqrt(nu / (nu - 2));
  const tPdf = (x) => {
    const z = (x - mu) / tScale;
    const c = 0.3676; // Gamma(2)/ (sqrt(3*pi) Gamma(1.5)) for nu=3
    return (c / tScale) * Math.pow(1 + (z * z) / nu, -(nu + 1) / 2);
  };
  const peak = normPdf(mu);
  const Y = (p) => 195 - (p / (peak * 1.15)) * 170;

  const path = (pdf) =>
    Array.from({ length: 141 }, (_, i) => {
      const x = lo + ((hi - lo) * i) / 140;
      return `${i === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(pdf(x)).toFixed(1)}`;
    }).join(' ');

  const band = (k) => {
    const a = mu - k * sigma, b = mu + k * sigma;
    let d = `M${X(a).toFixed(1)},195 `;
    for (let i = 0; i <= 60; i++) {
      const x = a + ((b - a) * i) / 60;
      d += `L${X(x).toFixed(1)},${Y(normPdf(x)).toFixed(1)} `;
    }
    return d + `L${X(b).toFixed(1)},195 Z`;
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 215" className="w-full">
        <line x1="40" y1="195" x2="400" y2="195" stroke="#94a3b8" />
        <path d={band(2)} fill="#3b82f6" opacity="0.18" />
        <path d={band(1)} fill="#3b82f6" opacity="0.35" />
        <path d={path(normPdf)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        {fat && <path d={path(tPdf)} fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="6 4" />}
        <line x1={X(mu)} y1="195" x2={X(mu)} y2={Y(peak)} stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x={X(mu)} y={Y(peak) - 6} textAnchor="middle" fontSize="10" fill="#d97706" fontWeight="600">μ = {mu}%</text>
        <text x={X(mu - sigma)} y="208" textAnchor="middle" fontSize="9" fill="#a3b1c2">−σ</text>
        <text x={X(mu + sigma)} y="208" textAnchor="middle" fontSize="9" fill="#a3b1c2">+σ</text>
        <text x={X(mu - 2 * sigma)} y="208" textAnchor="middle" fontSize="9" fill="#a3b1c2">−2σ</text>
        <text x={X(mu + 2 * sigma)} y="208" textAnchor="middle" fontSize="9" fill="#a3b1c2">+2σ</text>
        {fat && <text x="350" y="40" fontSize="10" fill="#fb7185" fontWeight="600">fat tails</text>}
      </svg>

      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-28">μ = {mu}%</span>
        <input type="range" min={-10} max={25} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-28">σ = {sigma}%</span>
        <input type="range" min={5} max={30} value={sigma} onChange={(e) => setSigma(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      {tailToggle && (
        <button
          onClick={() => setFat((f) => !f)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${fat ? 'bg-rose-600 text-white' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >
          {fat ? 'Fat tails: ON (kurtosis ≫ 3)' : 'Overlay fat tails'}
        </button>
      )}
      <div className="grid grid-cols-2 gap-2 w-full text-center text-xs">
        <div className="rounded-lg bg-yale-50 p-2">
          <p className="text-slate-500">P(μ ± 1σ)</p>
          <p className="font-bold text-yale-700">68.26%</p>
        </div>
        <div className="rounded-lg bg-yale-50 p-2">
          <p className="text-slate-500">P(μ ± 2σ)</p>
          <p className="font-bold text-yale-700">95.50%</p>
        </div>
      </div>
      {tailToggle && fat && (
        <p className="text-xs text-slate-500 text-center">
          Fama (1965): under normality a 4σ day should hit once in 50 years. The data: about four times every five years.
        </p>
      )}
    </div>
  );
}
