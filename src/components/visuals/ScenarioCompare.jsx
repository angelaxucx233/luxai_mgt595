import { useState } from 'react';

const SCENARIOS = {
  coins: {
    title: 'Flip a coin twice',
    rows: [
      ['P(2nd H | 1st H)', '1/2', 'unchanged'],
      ['Independent?', 'Yes', 'ok'],
    ],
  },
  cards: {
    title: 'Draw 2 cards (no replacement)',
    rows: [
      ['P(2nd ♥ | 1st ♥)', '12/51', 'changed'],
      ['Independent?', 'No', 'no'],
    ],
  },
};

export default function ScenarioCompare() {
  const [key, setKey] = useState('coins');
  const s = SCENARIOS[key];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-2 w-full max-w-sm">
        {Object.entries(SCENARIOS).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKey(k)}
            className={`flex-1 py-3 px-2 rounded-xl text-xs font-semibold border-2 transition ${
              key === k
                ? 'border-yale-600 bg-yale-50 text-yale-800'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {v.title}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm rounded-xl border border-slate-200 overflow-hidden">
        {s.rows.map(([label, val, kind], i) => (
          <div
            key={i}
            className={`flex justify-between px-4 py-3 border-t border-slate-100 first:border-0 ${
              i % 2 ? 'bg-slate-50' : 'bg-white'
            }`}
          >
            <span className="text-sm text-slate-600">{label}</span>
            <span
              className={`text-sm font-bold font-mono ${
                kind === 'ok' ? 'text-yale-700' : kind === 'no' ? 'text-rose-600' : 'text-slate-800'
              }`}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center max-w-xs">
        Independent means learning B does not change P(A). Cards without replacement are dependent.
      </p>
    </div>
  );
}
