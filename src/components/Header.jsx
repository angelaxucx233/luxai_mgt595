import { useApp } from '../context/AppContext.jsx';

export default function Header({ lectureLabel }) {
  const { currentSlide, totalSlides } = useApp();

  return (
    <header className="shrink-0 z-20 px-4 md:px-6 py-3 flex items-center gap-4 bg-black border-b border-slate-800">
      <div className="flex-1 flex items-center justify-center gap-1.5 max-w-md mx-auto min-w-0">
        {Array.from({ length: totalSlides }, (_, i) => {
          const n = i + 1;
          const active = n === currentSlide;
          const done = n < currentSlide;
          return (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                active ? 'bg-yale-500' : done ? 'bg-yale-500/40' : 'bg-slate-700'
              }`}
            />
          );
        })}
      </div>

      {lectureLabel && (
        <div className="text-right hidden sm:block shrink-0 max-w-[240px]">
          <span
            className="block text-xs text-slate-400 truncate"
            title={lectureLabel}
          >
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
