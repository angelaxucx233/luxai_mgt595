/**
 * Pre-baked slide narration MP3s from agents/bake_narration_audio.py
 * → public/audio/lecture04/slide_01.mp3
 */

/** @param {string | number} lectureSlug e.g. "04" or "4" */
export function lectureSlugToAudioDir(lectureSlug) {
  const n = String(lectureSlug).replace(/^0+/, '') || '0';
  return `lecture${String(n).padStart(2, '0')}`;
}

/** @param {string | number} lectureSlug @param {number} slideId */
export function slideNarrationAudioUrl(lectureSlug, slideId) {
  const dir = lectureSlugToAudioDir(lectureSlug);
  const id = String(slideId).padStart(2, '0');
  return `/audio/${dir}/slide_${id}.mp3`;
}
