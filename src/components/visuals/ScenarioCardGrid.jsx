import { useState } from 'react';

const SCENARIOS = [
  {
    id: 'elections',
    label: 'Elections',
    accent: 'bg-yale-600',
    question:
      'Polls show 52% support for your candidate. What is the probability they actually win on election night?',
  },
  {
    id: 'crypto',
    label: 'Crypto',
    accent: 'bg-yale-500',
    question:
      'Bitcoin has swung wildly this month. What is the chance it rises 10% before the month ends?',
  },
  {
    id: 'medical',
    label: 'Medical Test',
    accent: 'bg-yale-700',
    question:
      'A screening test is 95% accurate. If you test positive, what is the real probability you are sick?',
  },
  {
    id: 'ufc',
    label: 'UFC',
    accent: 'bg-slate-800',
    question:
      'A fighter wins 7 of 10 similar matchups. How should we reason about the outcome before the bell?',
  },
];

function ScenarioCard({ scenario, flipped, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flipped}
      aria-label={`${scenario.label}. ${flipped ? scenario.question : 'Tap to reveal the probability question'}`}
      className="group relative h-36 w-full [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-yale-500 focus-visible:ring-offset-2 rounded-2xl"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 ${scenario.accent} text-white shadow-yale [backface-visibility:hidden]`}
        >
          <span className="text-lg font-bold tracking-tight">{scenario.label}</span>
          <span className="text-xs text-white/80 font-medium">Tap to reveal</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-yale-500 bg-yale-50 px-4 py-3 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm text-slate-800 leading-snug">{scenario.question}</p>
        </div>
      </div>
    </button>
  );
}

export default function ScenarioCardGrid() {
  const [flipped, setFlipped] = useState(() => new Set());

  const toggle = (id) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealedCount = flipped.size;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 w-full">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            flipped={flipped.has(scenario.id)}
            onToggle={() => toggle(scenario.id)}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        {revealedCount === 0
          ? 'Flip each card to see the probability question hiding behind everyday uncertainty.'
          : `${revealedCount} of ${SCENARIOS.length} revealed — we cannot predict the future, but we can measure how likely each path is.`}
      </p>
    </div>
  );
}
