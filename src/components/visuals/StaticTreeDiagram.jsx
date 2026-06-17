import { useState } from 'react';

const LEAVES = [
  { id: 'HH', label: 'H,H', prob: '1/6', startH: true, diff: false },
  { id: 'HT', label: 'H,T', prob: '1/3', startH: true, diff: true },
  { id: 'TH', label: 'T,H', prob: '1/6', startH: false, diff: true },
  { id: 'TT', label: 'T,T', prob: '1/2', startH: false, diff: false },
];

export default function StaticTreeDiagram() {
  const [highlight, setHighlight] = useState('diff');

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setHighlight('diff')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            highlight === 'diff' ? 'bg-yale-600 text-white' : 'border border-slate-300'
          }`}
        >
          Different faces
        </button>
        <button
          type="button"
          onClick={() => setHighlight('startH')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            highlight === 'startH' ? 'bg-yale-600 text-white' : 'border border-slate-300'
          }`}
        >
          Started with H
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {LEAVES.map((leaf) => {
          const on =
            highlight === 'diff'
              ? leaf.diff
              : highlight === 'startH'
                ? leaf.startH && leaf.diff
                : false;
          return (
            <button
              key={leaf.id}
              type="button"
              onClick={() => setHighlight(leaf.diff ? 'diff' : 'all')}
              className={`rounded-lg border-2 px-2 py-2 text-xs font-mono transition ${
                on ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white opacity-60'
              }`}
            >
              <div className="font-bold">{leaf.label}</div>
              <div className="text-slate-500">{leaf.prob}</div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 text-center">
        Fair/unfair coin tree — tap to highlight paths for Bayes-style reasoning.
      </p>
    </div>
  );
}
