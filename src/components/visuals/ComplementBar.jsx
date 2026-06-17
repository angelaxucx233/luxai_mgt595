import { useState } from 'react';

export default function ComplementBar() {
  const [useComplement, setUseComplement] = useState(false);
  const pA = 0.75;
  const pNotA = 0.25;

  return (
    <div className="w-full flex flex-col items-center gap-4 max-w-sm">
      <p className="text-sm font-semibold text-slate-700 text-center">
        Event A: at least one Heads (two coins)
      </p>

      <div className="w-full h-10 rounded-xl overflow-hidden flex border border-slate-300">
        <div
          className="h-full bg-yale-600 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
          style={{ width: `${pA * 100}%` }}
        >
          P(A)={pA}
        </div>
        <div
          className="h-full bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-bold transition-all duration-500"
          style={{ width: `${pNotA * 100}%` }}
        >
          P(not A)={pNotA}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setUseComplement((v) => !v)}
        className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-yale-500 text-yale-800 hover:bg-yale-50"
      >
        {useComplement ? 'Direct count' : 'Use complement trick'}
      </button>

      <div className="text-sm text-slate-600 text-center bg-white border border-slate-200 rounded-xl px-4 py-3">
        {useComplement ? (
          <>
            <p>
              <span className="font-mono text-yale-800">P(not A)</span> = only T₁T₂ ={' '}
              <strong>1/4</strong>
            </p>
            <p className="mt-2 font-mono text-yale-800">
              P(A) = 1 − 1/4 = <strong>3/4</strong>
            </p>
          </>
        ) : (
          <p>
            Add H₁H₂ + H₁T₂ + T₁H₂ = <strong>3/4</strong>
          </p>
        )}
      </div>

      <p className="font-mono text-xs text-slate-500">P(not A) = 1 − P(A)</p>
    </div>
  );
}
