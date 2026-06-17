import { useState } from 'react';

const BLUE = '#2563eb';
const RED = '#dc2626';

export default function UrnDrawSim({ blueBalls = 2, redBalls = 2 }) {
  const [blue, setBlue] = useState(blueBalls);
  const [red, setRed] = useState(redBalls);
  const [drawn, setDrawn] = useState([]);
  const total = blue + red;

  const draw = (color) => {
    if (total === 0) return;
    if (color === 'blue' && blue > 0) {
      setBlue((b) => b - 1);
      setDrawn((d) => [...d, 'blue']);
    }
    if (color === 'red' && red > 0) {
      setRed((r) => r - 1);
      setDrawn((d) => [...d, 'red']);
    }
  };

  const reset = () => {
    setBlue(blueBalls);
    setRed(redBalls);
    setDrawn([]);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-32 rounded-b-3xl border-2 border-slate-400 bg-sky-50/80 flex flex-wrap items-end justify-center gap-1 p-3 pb-4">
            {Array.from({ length: blue }).map((_, i) => (
              <span key={`b${i}`} className="w-5 h-5 rounded-full" style={{ background: BLUE }} />
            ))}
            {Array.from({ length: red }).map((_, i) => (
              <span key={`r${i}`} className="w-5 h-5 rounded-full" style={{ background: RED }} />
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {blue} blue · {red} red
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={blue === 0}
            onClick={() => draw('blue')}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-30"
          >
            Draw blue
          </button>
          <button
            type="button"
            disabled={red === 0}
            onClick={() => draw('red')}
            className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold disabled:opacity-30"
          >
            Draw red
          </button>
          <button type="button" onClick={reset} className="px-3 py-1 text-xs text-slate-500 underline">
            Reset urn
          </button>
        </div>
      </div>

      {drawn.length > 0 && (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-500">Drawn:</span>
          {drawn.map((c, i) => (
            <span
              key={i}
              className="w-6 h-6 rounded-full"
              style={{ background: c === 'blue' ? BLUE : RED }}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 text-center max-w-xs">
        Without replacement — each draw changes what is left. That is dependence.
      </p>
    </div>
  );
}
