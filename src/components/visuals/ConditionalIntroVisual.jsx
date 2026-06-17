import { useState } from 'react';

export default function ConditionalIntroVisual() {
  const [cloudy, setCloudy] = useState(false);
  const rainBefore = 20;
  const rainAfter = 80;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className={`relative w-full max-w-sm rounded-2xl border-2 overflow-hidden transition-colors duration-500 ${
          cloudy ? 'border-slate-400 bg-slate-200' : 'border-sky-200 bg-sky-50'
        }`}
      >
        <svg viewBox="0 0 320 120" className="w-full h-28" aria-hidden>
          {!cloudy ? (
            <>
              <circle cx="260" cy="36" r="28" fill="#fbbf24" opacity="0.9" />
              <circle cx="248" cy="32" r="22" fill="#fde68a" />
            </>
          ) : (
            <>
              <ellipse cx="120" cy="52" rx="48" ry="28" fill="#94a3b8" />
              <ellipse cx="170" cy="48" rx="40" ry="24" fill="#cbd5e1" />
              <ellipse cx="210" cy="56" rx="44" ry="26" fill="#94a3b8" />
            </>
          )}
          <rect x="0" y="88" width="320" height="32" fill={cloudy ? '#64748b' : '#38bdf8'} opacity="0.35" />
        </svg>

        <div className="px-5 pb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Will it rain today?
          </p>
          <p
            className={`text-4xl font-bold tabular-nums transition-all duration-500 ${
              cloudy ? 'text-yale-600 scale-105' : 'text-slate-700'
            }`}
          >
            {cloudy ? rainAfter : rainBefore}%
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {cloudy ? 'P(rain | clouds)' : 'P(rain)'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCloudy((v) => !v)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition ${
          cloudy
            ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
            : 'border-yale-500 bg-yale-50 text-yale-800 hover:bg-yale-100'
        }`}
      >
        {cloudy ? '☀️ Clear skies again' : '☁️ Look outside — clouds!'}
      </button>

      <div className="font-mono text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 text-yale-800 w-full max-w-sm text-center">
        {cloudy ? (
          <>
            P(rain | clouds) = <span className="font-bold">{rainAfter}%</span>
          </>
        ) : (
          <>P(rain) = {rainBefore}%</>
        )}
      </div>
    </div>
  );
}
