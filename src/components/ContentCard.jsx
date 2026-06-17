export default function ContentCard({ children, footer, variant = 'explain' }) {
  const isProblem = variant === 'problem';

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-0 w-full max-w-2xl mx-auto px-4">
      <div
        className={`w-full flex-1 flex flex-col min-h-0 rounded-[2rem] border shadow-yale overflow-hidden ${
          isProblem
            ? 'border-yale-400 bg-white shadow-lg shadow-yale-900/10'
            : 'border-slate-200 bg-white'
        }`}
      >
        {isProblem && (
          <div className="shrink-0 h-1 bg-gradient-to-r from-yale-500 via-yale-400 to-yale-600" aria-hidden />
        )}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-10 overflow-y-auto min-h-[280px]">
          {isProblem && (
            <span className="mb-4 text-xs font-semibold tracking-widest text-yale-700 uppercase">
              Your turn
            </span>
          )}
          {children}
        </div>
        {footer && (
          <div
            className={`shrink-0 border-t px-6 py-4 flex gap-3 justify-center ${
              isProblem ? 'border-yale-200 bg-white' : 'border-slate-200'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
