import { useState } from 'react';

const STEPS = [
  { title: 'Step 1 — List outcomes', cols: ['Outcome', '', ''], rows: [] },
  {
    title: 'Step 2 — Assign P(ω)',
    cols: ['Outcome', 'P(ω)', ''],
    rows: [
      ['1', '1/6', ''],
      ['2', '1/6', ''],
      ['3', '1/6', ''],
      ['4', '1/6', ''],
      ['5', '1/6', ''],
      ['6', '1/6', ''],
    ],
  },
  {
    title: 'Step 3 — Mark event A (≥ 4)',
    cols: ['Outcome', 'P(ω)', 'In A?'],
    rows: [
      ['1', '1/6', ''],
      ['2', '1/6', ''],
      ['3', '1/6', ''],
      ['4', '1/6', '✓'],
      ['5', '1/6', '✓'],
      ['6', '1/6', '✓'],
    ],
  },
  {
    title: 'Step 4 — Add probabilities',
    cols: ['Outcome', 'P(ω)', 'In A?'],
    rows: [
      ['4', '1/6', '✓'],
      ['5', '1/6', '✓'],
      ['6', '1/6', '✓'],
    ],
    sum: 'P(A) = 1/6 + 1/6 + 1/6 = 3/6 = 1/2',
  },
];

export default function NeverFailTableDemo() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <p className="text-sm font-bold text-slate-800">{current.title}</p>
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-yale-600 text-white">
            <tr>
              {current.cols.map((c, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold">
                  {c || ' '}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 ? 'bg-slate-50' : 'bg-white'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 border-t border-slate-100 font-mono">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {current.sum && (
        <p className="font-mono text-sm font-bold text-yale-700">{current.sum}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-3 py-1.5 rounded-full text-sm border border-slate-300 disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === STEPS.length - 1}
          onClick={() => setStep((s) => s + 1)}
          className="px-3 py-1.5 rounded-full text-sm bg-yale-600 text-white disabled:opacity-30"
        >
          Next step
        </button>
      </div>
    </div>
  );
}
