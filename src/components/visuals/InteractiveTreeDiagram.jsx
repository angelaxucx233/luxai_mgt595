import { useState } from 'react';

const PATHS = {
  HH: { label: 'H then H', prob: '1/2 × 1/2 = 1/4', steps: ['H', 'H'] },
  HT: { label: 'H then T', prob: '1/2 × 1/2 = 1/4', steps: ['H', 'T'] },
  TH: { label: 'T then H', prob: '1/2 × 1/2 = 1/4', steps: ['T', 'H'] },
  TT: { label: 'T then T', prob: '1/2 × 1/2 = 1/4', steps: ['T', 'T'] },
};

export default function InteractiveTreeDiagram() {
  const [path, setPath] = useState([]);

  const extend = (branch) => {
    if (path.length >= 2) return;
    setPath((p) => [...p, branch]);
  };

  const reset = () => setPath([]);

  const key = path.join('');
  const result = path.length === 2 ? PATHS[key] : null;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <svg viewBox="0 0 300 160" className="w-full max-w-[300px]">
        <circle cx="40" cy="80" r="8" fill="#3b82f6" />
        <line x1="48" y1="70" x2="120" y2="40" stroke="#64748b" strokeWidth="2" />
        <line x1="48" y1="90" x2="120" y2="120" stroke="#64748b" strokeWidth="2" />
        <text x="85" y="35" fontSize="11" fill="#a3b1c2">
          1/2 H
        </text>
        <text x="85" y="130" fontSize="11" fill="#a3b1c2">
          1/2 T
        </text>
        <circle cx="120" cy="40" r="6" fill={path[0] === 'H' ? '#2563eb' : '#cbd5e1'} />
        <circle cx="120" cy="120" r="6" fill={path[0] === 'T' ? '#2563eb' : '#cbd5e1'} />
        {path[0] === 'H' && (
          <>
            <line x1="126" y1="35" x2="200" y2="25" stroke="#2563eb" strokeWidth="2" />
            <line x1="126" y1="45" x2="200" y2="55" stroke="#2563eb" strokeWidth="2" />
            <circle cx="200" cy="25" r="5" fill={path[1] === 'H' ? '#f59e0b' : '#e2e8f0'} />
            <circle cx="200" cy="55" r="5" fill={path[1] === 'T' ? '#f59e0b' : '#e2e8f0'} />
          </>
        )}
        {path[0] === 'T' && (
          <>
            <line x1="126" y1="115" x2="200" y2="105" stroke="#2563eb" strokeWidth="2" />
            <line x1="126" y1="125" x2="200" y2="135" stroke="#2563eb" strokeWidth="2" />
            <circle cx="200" cy="105" r="5" fill={path[1] === 'H' ? '#f59e0b' : '#e2e8f0'} />
            <circle cx="200" cy="135" r="5" fill={path[1] === 'T' ? '#f59e0b' : '#e2e8f0'} />
          </>
        )}
      </svg>

      <div className="flex gap-2 flex-wrap justify-center">
        {path.length < 1 && (
          <>
            <button type="button" onClick={() => extend('H')} className="px-4 py-2 rounded-full bg-yale-600 text-white text-sm font-semibold">
              1st: H
            </button>
            <button type="button" onClick={() => extend('T')} className="px-4 py-2 rounded-full bg-slate-600 text-white text-sm font-semibold">
              1st: T
            </button>
          </>
        )}
        {path.length === 1 && (
          <>
            <button type="button" onClick={() => extend('H')} className="px-4 py-2 rounded-full bg-yale-600 text-white text-sm font-semibold">
              2nd: H
            </button>
            <button type="button" onClick={() => extend('T')} className="px-4 py-2 rounded-full bg-slate-600 text-white text-sm font-semibold">
              2nd: T
            </button>
          </>
        )}
        {path.length > 0 && (
          <button type="button" onClick={reset} className="px-3 py-2 rounded-full border border-slate-300 text-sm">
            Reset
          </button>
        )}
      </div>

      {result && (
        <p className="font-mono text-sm text-yale-800 bg-yale-50 border border-yale-200 rounded-lg px-3 py-2">
          {result.label}: {result.prob}
        </p>
      )}
      <p className="text-xs text-slate-500">Multiply probabilities along a path.</p>
    </div>
  );
}
