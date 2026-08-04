import { useApp } from '../context/AppContext.jsx';
import { getSlidesForLecture } from '../data/slidesData.jsx';

export default function Header({ lectureLabel }) {
  const { currentSlide, totalSlides, goToSlide, lectureSlug } = useApp();
  const deck = getSlidesForLecture(lectureSlug ?? '01');

  const titleOf = (n) => deck[n - 1]?.title ?? `Slide ${n}`;

  return (
    <header className="shrink-0 z-20 px-4 md:px-6 py-3 flex items-center gap-4 bg-black border-b border-slate-800">
      <select
        value={currentSlide}
        onChange={(e) => goToSlide(Number(e.target.value))}
        aria-label="Jump to slide"
        className="shrink-0 max-w-[220px] rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-1.5 outline-none hover:border-slate-500 focus:border-yale-500 cursor-pointer"
      >
        {Array.from({ length: totalSlides }, (_, i) => {
          const n = i + 1;
          return (
            <option key={n} value={n}>
              {n} · {titleOf(n)}
            </option>
          );
        })}
      </select>

      <div className="flex-1 flex items-center justify-center gap-1.5 max-w-md mx-auto min-w-0">
        {Array.from({ length: totalSlides }, (_, i) => {
          const n = i + 1;
          const active = n === currentSlide;
          const done = n < currentSlide;
          return (
            <button
              key={n}
              type="button"
              onClick={() => goToSlide(n)}
              aria-label={`Go to slide ${n}: ${titleOf(n)}`}
              title={`${n} · ${titleOf(n)}`}
              className={`h-1.5 flex-1 min-w-[6px] rounded-full transition-all cursor-pointer hover:h-2.5 ${
                active ? 'bg-yale-500' : done ? 'bg-yale-500/40 hover:bg-yale-500/70' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          );
        })}
      </div>

      {lectureLabel && (
        <div className="text-right hidden sm:block shrink-0 max-w-[240px]">
          <span className="block text-xs text-slate-400 truncate" title={lectureLabel}>
            {lectureLabel}
          </span>
          <span className="block text-[10px] text-slate-600 font-mono mt-0.5">
            {currentSlide}/{totalSlides}
          </span>
        </div>
      )}
    </header>
  );
}
