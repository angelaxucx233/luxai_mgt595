import { useState } from 'react';

const OUTCOMES = [
  { id: 'hh', label: 'H₁H₂', inEvent: true },
  { id: 'ht', label: 'H₁T₂', inEvent: true },
  { id: 'th', label: 'T₁H₂', inEvent: true },
  { id: 'tt', label: 'T₁T₂', inEvent: false },
];

export default function MathAccumulator() {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id, inEvent) => {
    if (!inEvent) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const count = selected.size;
  const equation =
    count === 0
      ? 'P(A) = ?'
      : `P(A) = ${Array(count).fill('1/4').join(' + ')} = ${count}/4`;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-slate-700">Event A: at least one Heads</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {OUTCOMES.map((o) => {
          const on = selected.has(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id, o.inEvent)}
              disabled={!o.inEvent}
              className={`rounded-xl border-2 px-3 py-3 font-mono font-bold transition ${
                !o.inEvent
                  ? 'border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed'
                  : on
                    ? 'border-yale-500 bg-yale-50 text-yale-800'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-yale-400'
              }`}
            >
              {o.label}
              {on && <span className="block text-[10px] text-yale-600 mt-1">+1/4</span>}
            </button>
          );
        })}
      </div>
      <p className="font-mono text-base text-yale-800 bg-white border border-slate-200 rounded-xl px-4 py-3 w-full text-center">
        {equation}
      </p>
    </div>
  );
}
