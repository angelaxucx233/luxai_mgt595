import { useState } from 'react';

const STEPS = [
  {
    title: 'Start with the condition',
    detail: 'B = “1st coin is Heads.” Only 3 outcomes remain.',
    highlightB: true,
    highlightA: false,
    fraction: null,
  },
  {
    title: 'Find A inside B',
    detail: 'A = “2nd coin is Heads.” Which kept outcomes also have A?',
    highlightB: true,
    highlightA: true,
    fraction: null,
  },
  {
    title: 'Count to get P(A | B)',
    detail: '1 favorable outcome out of 3 possible → P(A | B) = 1/3',
    highlightB: true,
    highlightA: true,
    fraction: '1/3',
  },
];

const OUTCOMES = [
  { id: 'hh', label: 'H₁H₂', inB: true, inA: true },
  { id: 'ht', label: 'H₁T₂', inB: true, inA: false },
  { id: 'th', label: 'T₁H₂', inB: false, inA: true },
  { id: 'tt', label: 'T₁T₂', inB: false, inA: false },
];

export default function ConditionalCountingVisual() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-yale-100 text-yale-800 font-semibold">
          B: 1st = H
        </span>
        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
          A: 2nd = H
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {OUTCOMES.map((outcome) => {
          const inUniverse = current.highlightB ? outcome.inB : true;
          const isTarget = current.highlightA && outcome.inB && outcome.inA;
          const faded = current.highlightB && !outcome.inB;

          return (
            <div
              key={outcome.id}
              className={`rounded-xl border-2 px-4 py-3 font-mono text-center text-sm font-bold transition-all duration-300 ${
                faded
                  ? 'border-slate-200 bg-slate-100 text-slate-300 opacity-25'
                  : isTarget
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                    : inUniverse
                      ? 'border-yale-500 bg-yale-50 text-yale-800'
                      : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {outcome.label}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-sm text-center space-y-1">
        <p className="text-sm font-bold text-slate-800">{current.title}</p>
        <p className="text-xs text-slate-600">{current.detail}</p>
        {current.fraction && (
          <p className="font-mono text-lg text-yale-700 font-bold pt-1">
            P(A | B) = {current.fraction}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-full text-sm font-semibold border border-slate-300 text-slate-600 disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-yale-600 text-white hover:bg-yale-500 disabled:opacity-30"
        >
          {step === STEPS.length - 1 ? 'Done' : 'Next step'}
        </button>
      </div>
    </div>
  );
}
