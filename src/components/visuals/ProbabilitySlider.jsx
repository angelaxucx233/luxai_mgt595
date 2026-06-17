import { useState } from 'react';

const EXAMPLES = [
  { p: 0, label: 'Roll a 7 on a fair die', detail: 'Impossible — no outcome is 7.' },
  { p: 0.25, label: 'One specific two-coin outcome', detail: 'One of four equally likely outcomes.' },
  { p: 0.5, label: 'Flip Heads on a fair coin', detail: 'Half the sample space.' },
  { p: 1, label: 'Flip Heads or Tails', detail: 'Certain — covers all of 𝒮.' },
];

export default function ProbabilitySlider() {
  const [idx, setIdx] = useState(0);
  const ex = EXAMPLES[idx];

  return (
    <div className="w-full flex flex-col items-center gap-4 max-w-sm">
      <input
        type="range"
        min={0}
        max={EXAMPLES.length - 1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        className="w-full accent-yale-600"
      />
      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-yale-600 transition-all duration-300"
          style={{ width: `${ex.p * 100}%` }}
        />
      </div>
      <p className="text-3xl font-bold text-yale-700 tabular-nums">{ex.p}</p>
      <p className="text-sm font-semibold text-slate-800 text-center">{ex.label}</p>
      <p className="text-xs text-slate-500 text-center">{ex.detail}</p>
      <p className="text-xs text-slate-500">0 = impossible · 1 = certain · P(𝒮) = 1</p>
    </div>
  );
}
