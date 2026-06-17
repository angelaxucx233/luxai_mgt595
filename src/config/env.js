/**
 * Centralized Vite environment variable access.
 * Required .env keys (see .env.example):
 *   VITE_GEMINI_API_KEY
 *   VITE_GEMINI_MODEL  (e.g. gemini-3-flash — see geminiService model aliases)
 * TTS provider: gemini | elevenlabs (default elevenlabs)
 * Gemini TTS optional:
 *   VITE_GEMINI_TTS_MODEL  (default gemini-2.5-flash-preview-tts)
 *   VITE_GEMINI_TTS_VOICE  (default Sulafat)
 * ElevenLabs TTS (Lisa Manoban voice):
 *   VITE_ELEVENLABS_API_KEY
 *   VITE_ELEVENLABS_VOICE_ID
 *   VITE_ELEVENLABS_MODEL  (eleven_v3 for emotion audio tags)
 */
export const env = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
  /** @type {string} Primary model; falls back automatically if unavailable */
  geminiModel: import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-3-flash',
  /** @type {'gemini' | 'elevenlabs'} */
  ttsProvider: (import.meta.env.VITE_TTS_PROVIDER ?? 'elevenlabs').toLowerCase(),
  /** @type {string} Gemini TTS model */
  geminiTtsModel: import.meta.env.VITE_GEMINI_TTS_MODEL ?? 'gemini-2.5-flash-preview-tts',
  /** @type {string} Prebuilt Gemini voice name */
  geminiTtsVoice: import.meta.env.VITE_GEMINI_TTS_VOICE ?? 'Sulafat',
  elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY ?? '',
  elevenLabsVoiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID ?? '',
  /** @type {string} ElevenLabs TTS model — use eleven_v3 for emotion audio tags */
  elevenLabsModel: import.meta.env.VITE_ELEVENLABS_MODEL ?? 'eleven_v3',
};

export function assertGeminiConfigured() {
  if (!env.geminiApiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in .env');
  }
}
