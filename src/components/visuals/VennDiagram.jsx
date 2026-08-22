import { useState } from 'react';

const SCENARIOS = {
  and: {
    label: 'A AND B',
    subtitle: 'Intersection — must be in both',
    highlight: 'intersection',
    outcomes: ['H₁T₂'],
    outcomeText: '{ H₁T₂ }',
  },
  or: {
    label: 'A OR B',
    subtitle: 'Union — in A, B, or both',
    highlight: 'union',
    outcomes: ['H₁H₂', 'H₁T₂', 'T₁H₂'],
    outcomeText: '{ H₁H₂, H₁T₂, T₁H₂ }',
  },
};

export default function VennDiagram({ mode = 'toggle', highlightOnly = null }) {
  const [op, setOp] = useState(highlightOnly ?? 'and');
  const active = SCENARIOS[op];
  const showToggle = mode !== 'static';

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {showToggle && (
        <div className="flex gap-2">
          {['and', 'or'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setOp(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                op === key
                  ? 'border-yale-600 bg-yale-600 text-white'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
      )}

      <svg viewBox="0 0 280 140" className="w-full max-w-[280px]">
        <circle
          cx="105"
          cy="70"
          r="52"
          fill={active.highlight === 'union' ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.08)'}
          stroke="#2563eb"
          strokeWidth="2"
        />
        <circle
          cx="175"
          cy="70"
          r="52"
          fill={active.highlight === 'union' ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.08)'}
          stroke="#dc2626"
          strokeWidth="2"
        />
        <ellipse
          cx="140"
          cy="70"
          rx="32"
          ry="48"
          fill={
            active.highlight === 'intersection' || active.highlight === 'union'
              ? 'rgba(120,53,15,0.35)'
              : 'transparent'
          }
          className={active.highlight === 'intersection' ? 'animate-pulse' : ''}
        />
        <text x="72" y="72" textAnchor="middle" fill="#6b98fa" fontSize="14" fontWeight="bold">
          A
        </text>
        <text x="208" y="72" textAnchor="middle" fill="#f17474" fontSize="14" fontWeight="bold">
          B
        </text>
      </svg>

      <p className="text-sm font-semibold text-slate-800">{active.label}</p>
      <p className="text-xs text-slate-500">{active.subtitle}</p>
      <p className="font-mono text-sm text-yale-800 bg-white border border-slate-200 rounded-lg px-3 py-2">
        {active.outcomeText}
      </p>
      <p className="text-[11px] text-slate-500">
        A = 1st coin Heads · B = at least one Tails
      </p>
    </div>
  );
}
