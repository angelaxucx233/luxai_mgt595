/**
 * Fair penny-style coins for coin experiment slides.
 * Default 2-coin row: Coin 1 shows Heads, Coin 2 shows Tails.
 */

import FairPennyCoin from './FairPennyCoin.jsx';

const FACE_CYCLE = ['heads', 'tails', 'heads'];

export default function FairCoinRow({ coinCount = 2, faces }) {
  const count = Math.max(1, Math.min(coinCount, 4));
  const resolvedFaces =
    faces ??
    Array.from({ length: count }, (_, i) => FACE_CYCLE[i % FACE_CYCLE.length]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-end justify-center gap-5 sm:gap-8">
        {resolvedFaces.slice(0, count).map((face, i) => (
          <FairPennyCoin
            key={`coin-${i}`}
            face={face}
            size={88}
            showCaption
            caption={`Coin ${i + 1} · ${face === 'heads' ? 'Heads' : 'Tails'}`}
          />
        ))}
      </div>
      {count === 2 && (
        <p className="text-xs text-slate-500 text-center max-w-sm">
          Two distinct fair pennies — each can land heads or tails independently.
        </p>
      )}
    </div>
  );
}
