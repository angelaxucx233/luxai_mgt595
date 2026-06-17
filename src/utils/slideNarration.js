/** Spoken narration for Lux on each slide (ElevenLabs / chat). */
export function getSlideNarration(slide) {
  if (slide.narration) return slide.narration;

  if (slide.type === 'explain' && slide.content) {
    const { heading, body, footnote, quote } = slide.content;
    return [heading, body, quote, footnote].filter(Boolean).join(' ');
  }

  if (slide.type === 'problem') {
    return `${slide.title}. Take your time — tap the chat if you want a hint.`;
  }

  return '';
}
