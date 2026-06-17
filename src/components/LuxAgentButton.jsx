import LuxAvatar from './LuxAvatar.jsx';

function isChatOpenLabel(isOpen) {
  return isOpen ? 'Collapse Lux chat' : 'Open Lux chat';
}

/**
 * @param {{ isOpen: boolean, onClick: () => void, variant?: 'rail' | 'compact' | 'fab' }} props
 */
export default function LuxAgentButton({ isOpen, onClick, variant = 'rail' }) {
  if (variant === 'fab') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group"
        aria-label={isChatOpenLabel(isOpen)}
        aria-expanded={isOpen}
      >
        <div
          className={`relative w-14 h-14 rounded-2xl rotate-45 flex items-center justify-center shadow-xl transition-all ${
            isOpen
              ? 'bg-yale-500/25 border-2 border-pink-400/50'
              : 'bg-gradient-to-br from-yale-700 to-yale-900 border-2 border-pink-400/40 group-hover:border-pink-300/60'
          }`}
        >
          <div className="-rotate-45">
            <LuxAvatar size={44} animated={!isOpen} />
          </div>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yale-300 animate-pulse border-2 border-slate-900" />
          )}
        </div>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 w-9 h-9 rounded-xl border border-slate-700 bg-yale-800 flex items-center justify-center hover:border-yale-500/50 transition"
        aria-label="Close Lux chat"
      >
        <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-1 transition-transform ${
        isOpen ? 'scale-95' : 'hover:scale-105'
      }`}
      aria-label={isOpen ? 'Minimize Lux' : 'Chat with Lux'}
      aria-expanded={isOpen}
    >
      <div
        className={`relative w-[3.25rem] h-[3.25rem] rounded-2xl flex items-center justify-center transition-shadow ${
          isOpen
            ? 'bg-yale-500/20 border-2 border-yale-400/80 shadow-yale'
            : 'bg-yale-800 border-2 border-yale-500/50 shadow-yale group-hover:shadow-yale-lg'
        }`}
      >
        <LuxAvatar size={40} animated={!isOpen} />
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yale-400 animate-pulse border-2 border-black" />
        )}
      </div>
      <span className="text-[10px] font-bold tracking-wide text-yale-500/90 uppercase">Lux</span>
    </button>
  );
}
