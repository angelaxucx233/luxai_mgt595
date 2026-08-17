import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getSlideByIndex, getTotalSlides } from '../data/slidesData.jsx';
import { buildSandboxSrcDoc } from '../utils/sandboxParser.js';
import { getSlideNarration } from '../utils/slideNarration.js';
import { slideNarrationAudioUrl } from '../utils/narrationAudio.js';
import { LUX_LINES, stripEmotionTags } from '../utils/luxSpeechText.js';
import {
  sendTutorMessage,
  getOfflineTutorReply,
  isGeminiConfigured,
} from '../services/anthropicService.js';
import {
  isLuxSpeechConfigured,
  playLuxSpeech,
  stopLuxSpeech,
} from '../services/geminiTtsService.js';
import {
  createProblemWork,
  formatStudentWorkForTutor,
  getTemplate,
} from '../data/problemTemplates.js';

const AppContext = createContext(null);

export function AppProvider({ children, lectureSlug = '01' }) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = useMemo(() => getTotalSlides(lectureSlug), [lectureSlug]);
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  const [sandboxSrcDoc, setSandboxSrcDoc] = useState(null);
  const [problemWork, setProblemWork] = useState(null);
  const [showPracticeOffer, setShowPracticeOffer] = useState(false);
  const [lessonPhase, setLessonPhase] = useState('entering');
  const lastNarratedSlideId = useRef(null);
  const problemWorkCacheRef = useRef({});
  const [completedSlideTasks, setCompletedSlideTasks] = useState({});

  const activeSlide = useMemo(
    () => getSlideByIndex(currentSlide, lectureSlug),
    [currentSlide, lectureSlug]
  );

  useEffect(() => {
    setCurrentSlide(1);
    problemWorkCacheRef.current = {};
  }, [lectureSlug]);

  const initProblemForSlide = useCallback((slide) => {
    if (slide.type !== 'problem') {
      setProblemWork(null);
      setShowPracticeOffer(false);
      return;
    }
    const cached = problemWorkCacheRef.current[slide.slideId];
    if (cached?.submitted && cached?.isCorrect) {
      setProblemWork(cached);
      setShowPracticeOffer(true);
      return;
    }
    setProblemWork(
      createProblemWork(slide.problemTemplateId, slide.problemParams ?? {})
    );
    setShowPracticeOffer(false);
  }, []);

  useEffect(() => {
    initProblemForSlide(activeSlide);
  }, [activeSlide, initProblemForSlide]);

  const appendMessage = useCallback((role, text, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        text,
        ...extra,
      },
    ]);
  }, []);

  /** Add Lux reply to chat only — no audio (use speakChatMessage for voice). */
  const addLuxReply = useCallback(
    (text, { displayText, ...extra } = {}) => {
      const chatText = (displayText ?? stripEmotionTags(text) ?? text)?.trim();
      if (chatText) appendMessage('assistant', chatText, extra);
    },
    [appendMessage]
  );

  const addLuxReplySequence = useCallback(
    (lines) => {
      for (const line of lines) {
        const chatText = (line.display ?? stripEmotionTags(line.speech ?? '') ?? '').trim();
        if (chatText) appendMessage('assistant', chatText);
      }
    },
    [appendMessage]
  );

  const stopSpeaking = useCallback(() => {
    stopLuxSpeech();
    setSpeakingMessageId(null);
  }, []);

  const setSlideTaskComplete = useCallback((slideId, complete) => {
    setCompletedSlideTasks((prev) => ({ ...prev, [slideId]: complete }));
  }, []);

  const isSlideTaskComplete = useCallback(
    (slideId) => Boolean(completedSlideTasks[slideId]),
    [completedSlideTasks]
  );

  /** Slide narration → pre-baked MP3; chat replies → live Gemini TTS. */
  /** Convert $...$ math into speakable plain text for TTS. */
  const speakableText = (text) => {
    if (typeof text !== 'string' || !text.includes('$')) return text;
    let out = '';
    let i = 0;
    const nd = (from) => {
      let j = from;
      while (j < text.length) {
        j = text.indexOf('$', j);
        if (j === -1) return -1;
        if (j > 0 && text[j - 1] === '\\') {
          j += 1;
          continue;
        }
        return j;
      }
      return -1;
    };
    while (i < text.length) {
      const a = nd(i);
      if (a === -1) {
        out += text.slice(i);
        break;
      }
      const b = nd(a + 1);
      if (b === -1) {
        out += text.slice(i);
        break;
      }
      const inner = text.slice(a + 1, b);
      if (inner.length > 0 && !/^[0-9]/.test(inner)) {
        out +=
          text.slice(i, a) +
          inner
            .replace(/\\text\{([^}]*)\}/g, '$1')
            .replace(/\\[a-zA-Z]+/g, (w) => ' ' + w.slice(1) + ' ')
            .replace(/[{}]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        i = b + 1;
      } else {
        out += text.slice(i, a + 1);
        i = a + 1;
      }
    }
    return out;
  };

  const speakChatMessage = useCallback(
    async (messageId) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg || msg.role !== 'assistant') return;

      const isSlideNarration = msg.narrationSource === 'slide' && msg.slideId != null;
      if (!isSlideNarration && !isLuxSpeechConfigured()) {
        console.warn('[Lux TTS] Set VITE_GEMINI_API_KEY in .env');
        return;
      }

      stopSpeaking();
      setSpeakingMessageId(messageId);

      try {
        const audioUrl = isSlideNarration
          ? slideNarrationAudioUrl(lectureSlug, msg.slideId)
          : undefined;
        await playLuxSpeech(speakableText(msg.text), { audioUrl });
      } catch (err) {
        console.warn('[Lux TTS]', err?.message ?? err);
      } finally {
        setSpeakingMessageId((id) => (id === messageId ? null : id));
      }
    },
    [messages, stopSpeaking, lectureSlug]
  );

  const beginLesson = useCallback(() => {
    lastNarratedSlideId.current = null;
    setLessonPhase('active');
  }, []);

  useEffect(() => {
    if (lessonPhase !== 'active') return;
    const slideId = activeSlide.slideId;
    if (lastNarratedSlideId.current === slideId) return;
    lastNarratedSlideId.current = slideId;

    const narration = getSlideNarration(activeSlide);
    if (narration) {
      addLuxReply(narration, {
        narrationSource: 'slide',
        slideId: activeSlide.slideId,
      });
    }
  }, [lessonPhase, activeSlide, addLuxReply]);

  useEffect(() => () => stopLuxSpeech(), []);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen((v) => !v), []);

  const closeVizPanel = useCallback(() => {
    setVizPanel(null);
    setSandboxSrcDoc(null);
  }, []);

  const activateSandbox = useCallback((html) => {
    setSandboxSrcDoc(buildSandboxSrcDoc(html));
    setVizPanel('sandbox');
    setIsChatOpen(true);
  }, []);

  const regenerateProblemWork = useCallback(
    (templateId, params) => {
      const tpl = getTemplate(templateId);
      if (!tpl) return;
      const merged = tpl.randomizeParams
        ? { ...tpl.randomizeParams(), ...params }
        : { ...tpl.defaultParams, ...params };
      if (activeSlide?.slideId) {
        delete problemWorkCacheRef.current[activeSlide.slideId];
      }
      setProblemWork(createProblemWork(templateId, merged));
      setShowPracticeOffer(false);
    },
    [activeSlide]
  );

  const goToSlide = useCallback(
    (target) => {
      if (target < 1 || target > totalSlides) return;
      setCurrentSlide(target);
      closeVizPanel();
    },
    [closeVizPanel, totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const updateProblemInput = useCallback((field, value) => {
    setProblemWork((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inputs: { ...prev.inputs, [field]: value },
        submitted: false,
        isCorrect: null,
      };
    });
  }, []);

  const setActiveField = useCallback((field) => {
    setProblemWork((prev) => (prev ? { ...prev, activeField: field } : prev));
  }, []);

  const checkProblemAnswer = useCallback(() => {
    if (!problemWork) return;
    const tpl = getTemplate(problemWork.templateId);
    if (!tpl) return;
    const { ok } = tpl.validate(problemWork.inputs, problemWork.params);
    const updated = {
      ...problemWork,
      submitted: true,
      isCorrect: ok,
      attempts: problemWork.attempts + 1,
    };
    if (ok && activeSlide.slideId) {
      problemWorkCacheRef.current[activeSlide.slideId] = updated;
    }
    setProblemWork(updated);
    if (ok) {
      setShowPracticeOffer(true);
      setIsChatOpen(true);
      const lines = [];
      if (activeSlide.postProblemSummary) {
        lines.push(activeSlide.postProblemSummary);
      }
      const continueLine = tpl?.randomizeParams
        ? LUX_LINES.problemContinueWithPractice
        : LUX_LINES.problemContinue;
      lines.push(continueLine);
      addLuxReplySequence(lines);
    }
  }, [problemWork, addLuxReplySequence, activeSlide]);

  const requestAnotherPractice = useCallback(() => {
    if (!problemWork) return;
    const tpl = getTemplate(problemWork.templateId);
    if (tpl?.randomizeParams) {
      regenerateProblemWork(problemWork.templateId, tpl.randomizeParams());
      addLuxReply(LUX_LINES.freshProblem.display);
    }
  }, [problemWork, regenerateProblemWork, addLuxReply]);

  const sendChatMessage = useCallback(
    async (userText) => {
      const trimmed = userText.trim();
      if (!trimmed) return;

      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, text: m.text }));

      appendMessage('user', trimmed);
      setIsChatLoading(true);

      const studentWorkContext = formatStudentWorkForTutor(problemWork, activeSlide);

      try {
        let reply;
        let sandboxHtml = null;
        let practiceRegeneration = null;

        if (!isGeminiConfigured()) {
          const offline = getOfflineTutorReply(
            trimmed,
            activeSlide.contextLabel,
            /another|more practice|yes/i.test(trimmed)
          );
          reply = offline.reply;
          sandboxHtml = offline.sandboxHtml;
          if (offline.useLocalRandomize && problemWork) {
            const tpl = getTemplate(problemWork.templateId);
            if (tpl?.randomizeParams) {
              regenerateProblemWork(problemWork.templateId, tpl.randomizeParams());
            }
          }
        } else {
          const result = await sendTutorMessage(
            trimmed,
            activeSlide.systemPromptContext,
            studentWorkContext,
            history
          );
          reply = result.reply;
          sandboxHtml = result.sandboxHtml;
          practiceRegeneration = result.practiceRegeneration;
        }

        if (practiceRegeneration?.templateId) {
          regenerateProblemWork(
            practiceRegeneration.templateId,
            practiceRegeneration.params
          );
          if (!reply) {
            reply = 'New practice problem loaded — same idea, new numbers.';
          }
        }

        if (reply) {
          addLuxReply(reply);
        }
        if (sandboxHtml) activateSandbox(sandboxHtml);
      } catch (err) {
        addLuxReply(`Something went wrong: ${err.message}`);
      } finally {
        setIsChatLoading(false);
      }
    },
    [
      messages,
      activeSlide,
      problemWork,
      appendMessage,
      activateSandbox,
      regenerateProblemWork,
      addLuxReply,
    ]
  );

  const value = useMemo(
    () => ({
      lectureSlug,
      currentSlide,
      totalSlides,
      activeSlide,
      messages,
      isChatLoading,
      isChatOpen,
      speakingMessageId,
      vizPanel,
      sandboxSrcDoc,
      problemWork,
      showPracticeOffer,
      openChat,
      closeChat,
      toggleChat,
      closeVizPanel,
      appendMessage,
      goToSlide,
      nextSlide,
      prevSlide,
      sendChatMessage,
      speakChatMessage,
      stopSpeaking,
      setSlideTaskComplete,
      isSlideTaskComplete,
      activateSandbox,
      updateProblemInput,
      setActiveField,
      checkProblemAnswer,
      requestAnotherPractice,
      lessonPhase,
      setLessonPhase,
      beginLesson,
      addLuxReply,
    }),
    [
      lectureSlug,
      currentSlide,
      totalSlides,
      activeSlide,
      messages,
      isChatLoading,
      isChatOpen,
      speakingMessageId,
      vizPanel,
      sandboxSrcDoc,
      problemWork,
      showPracticeOffer,
      openChat,
      closeChat,
      toggleChat,
      closeVizPanel,
      appendMessage,
      goToSlide,
      nextSlide,
      prevSlide,
      sendChatMessage,
      speakChatMessage,
      stopSpeaking,
      setSlideTaskComplete,
      isSlideTaskComplete,
      activateSandbox,
      updateProblemInput,
      setActiveField,
      checkProblemAnswer,
      requestAnotherPractice,
      lessonPhase,
      beginLesson,
      addLuxReply,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
