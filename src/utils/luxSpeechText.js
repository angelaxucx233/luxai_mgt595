/**
 * Eleven v3 audio tags — bracket cues like [excited] stay in TTS only;
 * chat UI shows clean text without tags.
 */

const TAG_PATTERN = /\[[^\]]+\]\s*/g;

export function stripEmotionTags(text) {
  if (!text) return '';
  return text.replace(TAG_PATTERN, '').replace(/\s+/g, ' ').trim();
}

/** Scripted Lux lines: speech (with v3 tags) → display (chat bubbles). */
export const LUX_LINES = {
  chatWelcome: {
    display:
      'Ask me anything when you need a hint. Tap the speaker on any reply to hear my voice.',
  },
  problemContinue: {
    speech:
      '[excited] Awesome! [encouraging] Hit Continue when you are ready for the next slide.',
    display: 'Awesome! Hit Continue when you are ready for the next slide.',
  },
  problemContinueWithPractice: {
    speech:
      '[excited] Awesome! [encouraging] Hit Continue for the next slide. [inquisitive] Want fresh numbers? Tap Another example below.',
    display:
      'Awesome! Hit Continue for the next slide. Want fresh numbers? Tap Another example below.',
  },
  correctAnswer: {
    speech:
      '[excited] Nice work! [inquisitive] Want another example with different numbers? Say yes, or tap Another example.',
    display:
      'Nice work! Want another example with different numbers? Say yes, or tap "Another example".',
  },
  freshProblem: {
    speech: '[encouraging] Fresh numbers loaded — give this one a try!',
    display: 'Fresh numbers loaded — give this one a try!',
  },
  wrongAnswer: {
    speech: '[gentle] Not quite yet. [thoughtful] Take another look — you\'re closer than you think.',
    display: 'Not quite yet. Take another look — you\'re closer than you think.',
  },
};
