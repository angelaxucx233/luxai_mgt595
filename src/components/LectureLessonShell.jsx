import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import LuxAvatar from './LuxAvatar.jsx';
import LuxAgentButton from './LuxAgentButton.jsx';
import Header from './Header.jsx';
import ChatDrawer from './ChatDrawer.jsx';
import { LUX_CHAT_WIDTH } from '../constants/layout.js';
import { stopLuxSpeech } from '../services/geminiTtsService.js';
import { playBubbleSound } from '../utils/playBubbleSound.js';

/** Total lesson row width — fixed so Lux bulb and controls never shift when chat toggles */
const LESSON_ROW_MAX = 1120;

function TopControlButton({ onClick, label, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-lg bg-slate-900/95 border ${
        active
          ? 'border-yale-500 text-yale-400'
          : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  );
}

export default function LectureLessonShell({ courseId, lectureLabel, children }) {
  const navigate = useNavigate();
  const {
    lessonPhase,
    beginLesson,
    isChatOpen,
    toggleChat,
    stopSpeaking,
    speakingMessageId,
  } = useApp();
  const [showShell, setShowShell] = useState(false);

  useEffect(() => {
    playBubbleSound();
    const t1 = setTimeout(() => setShowShell(true), 700);
    const t2 = setTimeout(() => beginLesson(), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [beginLesson]);

  const handleClose = () => {
    stopLuxSpeech();
    navigate(`/course/${courseId}`);
  };

  const isEntering = lessonPhase === 'entering';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/55 backdrop-blur-sm">
      {isEntering && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none z-50">
          <div className="animate-lux-dive mt-[8vh]">
            <LuxAvatar size={72} animated />
          </div>
        </div>
      )}

      {/* Fixed-width row: only inner chat column width changes; bulb anchor never moves */}
      <div
        className={`relative w-full mx-auto h-[min(92vh,860px)] transition-opacity duration-300 ${
          showShell ? 'animate-lesson-shell-in opacity-100' : 'opacity-0'
        }`}
        style={{ maxWidth: `min(96vw, ${LESSON_ROW_MAX}px)` }}
      >
        {/* Top-left controls — pinned to row corner */}
        <div className="absolute top-0 left-0 z-30 flex flex-col gap-2">
          <TopControlButton onClick={handleClose} label="Close lesson">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </TopControlButton>
          <TopControlButton
            onClick={stopSpeaking}
            label="Stop Lux voice"
            active={Boolean(speakingMessageId)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {speakingMessageId ? (
                <path d="M23 9l-6 6M17 9l6 6" />
              ) : (
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              )}
            </svg>
          </TopControlButton>
        </div>

        {/* Lux bulb — fixed to bottom-left of lesson row (never shifts) */}
        <div className="absolute bottom-4 left-4 z-40">
          <LuxAgentButton
            isOpen={isChatOpen}
            onClick={toggleChat}
            variant="fab"
          />
        </div>

        <div className="flex items-stretch h-full w-full">
          {/* Chat — collapses; slide absorbs freed width */}
          <div
            className="shrink-0 h-full overflow-hidden transition-[width] duration-300 ease-out"
            style={{ width: isChatOpen ? LUX_CHAT_WIDTH : 0 }}
            aria-hidden={!isChatOpen}
          >
            <div
              className="h-full flex flex-col"
              style={{ width: LUX_CHAT_WIDTH, paddingBottom: 88 }}
            >
              <div className="flex-1 min-h-0 mt-24 rounded-[2rem] border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden">
                <ChatDrawer variant="lesson" />
              </div>
            </div>
          </div>

          {/* Slide — full-bleed black panel */}
          <div className="flex flex-1 min-w-0 h-full rounded-[2rem] border border-slate-700/80 bg-black shadow-2xl overflow-hidden transition-[flex-grow] duration-300 ease-out">
            <div className="flex-1 flex flex-col min-w-0">
              <Header lectureLabel={lectureLabel} />
              <div className="flex-1 min-h-0">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
