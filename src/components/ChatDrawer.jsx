import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MathText, RichText } from './visuals/MathTex.jsx';
import { isLuxSpeechConfigured } from '../services/geminiTtsService.js';
import { isGeminiConfigured } from '../services/anthropicService.js';
import { LUX_LINES } from '../utils/luxSpeechText.js';

function SpeakerButton({ onClick, isSpeaking, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isSpeaking ? 'Stop voice' : 'Hear Lux speak'}
      title={
        disabled
          ? 'Add VITE_GEMINI_API_KEY in .env for voice'
          : isSpeaking
            ? 'Stop'
            : 'Hear Lux speak'
      }
      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition ${
        disabled
          ? 'opacity-30 cursor-not-allowed text-slate-500'
          : isSpeaking
            ? 'bg-yale-600 text-white animate-pulse'
            : 'bg-slate-700/80 text-slate-300 hover:bg-yale-600 hover:text-white'
      }`}
    >
      {isSpeaking ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
    </button>
  );
}

function ChatBubble({
  text,
  role,
  isActive,
  messageId,
  isSpeaking,
  onSpeak,
  canSpeak,
}) {
  const isUser = role === 'user';

  if (isActive) {
    return (
      <div className={`flex w-full gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <SpeakerButton
            onClick={() => (isSpeaking ? onSpeak?.(null) : onSpeak?.(messageId))}
            isSpeaking={isSpeaking}
            disabled={!canSpeak}
          />
        )}
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-2.5 max-w-[85%] ${
            isUser
              ? 'bg-slate-600 text-white'
              : 'bg-slate-800 text-white border border-teal-400/70 shadow-[0_0_14px_rgba(45,212,191,0.12)]'
          }`}
        >
          <RichText text={text} />
        </p>
      </div>
    );
  }

  return (
    <div className={`flex w-full gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <SpeakerButton
          onClick={() => (isSpeaking ? onSpeak?.(null) : onSpeak?.(messageId))}
          isSpeaking={isSpeaking}
          disabled={!canSpeak}
        />
      )}
      <p
        className={`text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-2.5 max-w-[85%] opacity-35 ${
          isUser
            ? 'bg-slate-800/50 text-slate-500'
            : 'bg-slate-900/40 text-slate-500 border border-transparent'
        }`}
      >
        <RichText text={text} />
      </p>
    </div>
  );
}

/**
 * @param {{ variant?: 'lesson' | 'sidebar' }} props
 */
export default function ChatDrawer({ variant = 'sidebar' }) {
  const {
    messages,
    isChatLoading,
    sendChatMessage,
    speakChatMessage,
    stopSpeaking,
    speakingMessageId,
  } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const isLesson = variant === 'lesson';
  const canSpeakLive = isLuxSpeechConfigured();

  const visibleMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  const latestMessageId = useMemo(() => {
    if (visibleMessages.length === 0) return null;
    return visibleMessages[visibleMessages.length - 1].id;
  }, [visibleMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages.length, isChatLoading]);

  const handleSpeak = (messageId) => {
    if (messageId === null) {
      stopSpeaking();
      return;
    }
    speakChatMessage(messageId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isChatLoading) return;
    setInput('');
    await sendChatMessage(text);
  };

  return (
    <div
      className={`flex flex-col min-w-0 h-full bg-slate-950/95 ${
        isLesson ? '' : 'border-l border-slate-700'
      }`}
      style={isLesson ? { width: '100%' } : { width: 320 }}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 min-h-0">
        {visibleMessages.length === 0 && !isChatLoading && (
          <ChatBubble
            role="assistant"
            isActive
            messageId="welcome"
            canSpeak={false}
            text={
              isGeminiConfigured()
                ? LUX_LINES.chatWelcome.display
                : 'Add VITE_GEMINI_API_KEY to chat with Lux.'
            }
          />
        )}
        {visibleMessages.map((msg) => (
          <ChatBubble
            key={msg.id}
            messageId={msg.id}
            text={msg.text}
            role={msg.role}
            isActive={msg.id === latestMessageId && !isChatLoading}
            isSpeaking={speakingMessageId === msg.id}
            onSpeak={handleSpeak}
            canSpeak={
              msg.role === 'assistant' &&
              (canSpeakLive || msg.narrationSource === 'slide')
            }
          />
        ))}
        {isChatLoading && (
          <div className="flex justify-start w-full">
            <p className="text-xs text-slate-500 animate-pulse px-1">Lux is thinking…</p>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-3 border-t border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How can I help?"
          disabled={isChatLoading}
          className="w-full bg-slate-800 border border-slate-600 rounded-full px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-yale-500/60"
        />
      </form>
    </div>
  );
}
