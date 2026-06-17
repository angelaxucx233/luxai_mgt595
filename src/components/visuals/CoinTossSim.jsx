import { useState } from 'react';

export default function CoinTossSim() {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);

  const toss = () => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      const heads = Math.random() < 0.5;
      const label = heads ? 'H' : 'T';
      setResult(label);
      setLog((prev) => [label, ...prev].slice(0, 6));
      setFlipping(false);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={toss}
        disabled={flipping}
        className={`relative w-24 h-24 rounded-full border-4 border-amber-600 shadow-lg transition-transform duration-500 ${
          flipping ? 'animate-spin' : 'hover:scale-105'
        }`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, #fde68a, #d4af37 55%, #b8860b)',
        }}
        aria-label="Toss coin"
      >
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-amber-900">
          {flipping ? '…' : result ?? '¢'}
        </span>
      </button>

      <button
        type="button"
        onClick={toss}
        disabled={flipping}
        className="px-5 py-2 rounded-full bg-yale-600 text-white text-sm font-semibold hover:bg-yale-500 disabled:opacity-50"
      >
        Toss coin
      </button>

      {log.length > 0 && (
        <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Outcome log
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {log.map((o, i) => (
              <span
                key={`${o}-${i}`}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  o === 'H' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {o}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Each toss is one fine outcome — H or T, not both.
          </p>
        </div>
      )}
    </div>
  );
}
