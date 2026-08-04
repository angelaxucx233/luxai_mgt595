/**
 * Centralized Vite environment variable access.
 * Required .env keys (see .env.example):
 *   VITE_ANTHROPIC_API_KEY   — Lux tutor chat (Claude)
 *   VITE_ANTHROPIC_MODEL     — default claude-sonnet-4-6
 * Legacy (only if you switch back to Gemini):
 *   VITE_GEMINI_API_KEY, VITE_GEMINI_MODEL
 * TTS provider: gemini | elevenlabs (default elevenlabs)
 *   VITE_GEMINI_TTS_MODEL  (default gemini-2.5-flash-preview-tts)
 *   VITE_GEMINI_TTS_VOICE  (default Sulafat)
 * ElevenLabs TTS:
 *   VITE_ELEVENLABS_API_KEY
 *   VITE_ELEVENLABS_VOICE_ID
 *   VITE_ELEVENLABS_MODEL  (eleven_v3 for emotion audio tags)
 */
export const env = {
  /** Anthropic (Lux tutor) */
  anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
  /** @type {string} Primary Claude model; service falls back automatically */
  anthropicModel: import.meta.env.VITE_ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',

  /** Legacy Gemini (unused when anthropicService is wired) */
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
  /** @type {string} */
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

export function assertAnthropicConfigured() {
  if (!env.anthropicApiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env');
  }
}

/** Legacy — kept so any old imports don't break. */
export function assertGeminiConfigured() {
  if (!env.geminiApiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in .env');
  }
}
