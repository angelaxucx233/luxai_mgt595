/**
 * Lux TTS — baked MP3 playback + live synthesis via Gemini or ElevenLabs.
 */

import { env } from '../config/env.js';
import { stripEmotionTags } from '../utils/luxSpeechText.js';
import {
  isElevenLabsConfigured,
  playElevenLabsSpeech,
  stopElevenLabsSpeech,
} from './elevenLabsService.js';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const SAMPLE_RATE = 24000;
const FALLBACK_TTS_MODELS = [
  'gemini-2.5-flash-preview-tts',
  'gemini-3.1-flash-tts-preview',
];

function usesElevenLabs() {
  return env.ttsProvider === 'elevenlabs' && isElevenLabsConfigured();
}

function ttsModelChain() {
  const primary = env.geminiTtsModel?.trim();
  if (!primary) return FALLBACK_TTS_MODELS;
  return [primary, ...FALLBACK_TTS_MODELS.filter((m) => m !== primary)];
}

export function isLuxSpeechConfigured() {
  if (usesElevenLabs()) return true;
  return Boolean(env.geminiApiKey);
}

/** @deprecated Use isLuxSpeechConfigured */
export { isElevenLabsConfigured };

function buildTtsPrompt(displayText) {
  const clean = stripEmotionTags(displayText ?? '').trim();
  if (!clean) return '';
  if (/^say /i.test(clean)) return clean;
  return `Say in a warm, friendly Socratic tutor voice: ${clean}`;
}

/**
 * @param {ArrayBuffer} pcmData
 * @param {number} sampleRate
 */
function encodeWav(pcmData, sampleRate = SAMPLE_RATE) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const pcmBytes = new Uint8Array(pcmData);
  const buffer = new ArrayBuffer(44 + pcmBytes.byteLength);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes.byteLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, pcmBytes.byteLength, true);
  new Uint8Array(buffer, 44).set(pcmBytes);

  return buffer;
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * @param {string} prompt
 * @param {AbortSignal} [signal]
 * @returns {Promise<Blob>}
 */
async function synthesizeSpeech(prompt, signal) {
  if (!isLuxSpeechConfigured()) {
    throw new Error('Gemini TTS is not configured. Set VITE_GEMINI_API_KEY in .env');
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: env.geminiTtsVoice,
          },
        },
      },
    },
  };

  let lastError = null;

  for (const model of ttsModelChain()) {
    const url = `${API_BASE}/${model}:generateContent`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.geminiApiKey,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errBody = await response.text();
        const notFound =
          response.status === 404 ||
          errBody.includes('not found') ||
          errBody.includes('NOT_FOUND');
        if (notFound) {
          lastError = new Error(`Gemini TTS model unavailable (${model}): ${errBody}`);
          continue;
        }
        throw new Error(`Gemini TTS error (${response.status}): ${errBody}`);
      }

      const json = await response.json();
      const inlineData = json.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const b64 = inlineData?.data;
      if (!b64) {
        throw new Error('Gemini TTS returned no audio data');
      }

      const pcm = base64ToArrayBuffer(b64);
      const wav = encodeWav(pcm, SAMPLE_RATE);
      return new Blob([wav], { type: 'audio/wav' });
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
      const msg = err?.message ?? String(err);
      if (!msg.includes('404') && !msg.includes('not found') && !msg.includes('NOT_FOUND')) {
        break;
      }
    }
  }

  throw lastError ?? new Error('Gemini TTS request failed');
}

let activeAudio = null;
let activeObjectUrl = null;
let activeAbortController = null;

/**
 * @param {string} url
 * @param {AbortSignal} signal
 */
function playUrl(url, signal) {
  if (signal.aborted) return Promise.resolve();

  const audio = new Audio(url);
  activeAudio = audio;

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      stopLuxSpeech();
      resolve();
    };
    audio.onerror = () => {
      stopLuxSpeech();
      reject(new Error(`Audio playback failed: ${url}`));
    };
    audio.play().catch(reject);
  });
}

/**
 * @param {Blob} blob
 * @param {AbortSignal} signal
 */
function playBlob(blob, signal) {
  if (signal.aborted) return Promise.resolve();
  if (blob.size === 0) {
    return Promise.reject(new Error('No audio data received from Gemini TTS'));
  }

  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  activeAudio = audio;
  activeObjectUrl = objectUrl;

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      stopLuxSpeech();
      resolve();
    };
    audio.onerror = () => {
      stopLuxSpeech();
      reject(new Error('Audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

export function stopLuxSpeech() {
  stopElevenLabsSpeech();
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.removeAttribute('src');
    activeAudio.load();
    activeAudio = null;
  }
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

/**
 * @param {string} text — Lux chat message (plain text)
 * @param {{ audioUrl?: string }} [options] — pre-baked MP3 for slide narration
 * @returns {Promise<void>}
 */
export async function playLuxSpeech(text, options = {}) {
  const { audioUrl } = options;
  if (!audioUrl && usesElevenLabs()) {
    stopLuxSpeech();
    const script = String(text ?? '').trim();
    if (!script) return;
    try {
      await playElevenLabsSpeech(script);
    } catch (err) {
      if (err?.name === 'AbortError') return;
      stopLuxSpeech();
      throw err;
    }
    return;
  }

  const prompt = buildTtsPrompt(text);
  if (!prompt && !audioUrl) return;

  stopLuxSpeech();

  const abortController = new AbortController();
  activeAbortController = abortController;
  const { signal } = abortController;

  try {
    if (audioUrl) {
      try {
        await playUrl(audioUrl, signal);
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
        if (!isLuxSpeechConfigured()) throw err;
        console.warn('[Lux TTS] Pre-baked audio missing, using live TTS', audioUrl);
      }
    }

    if (!isLuxSpeechConfigured()) return;

    const blob = await synthesizeSpeech(prompt, signal);
    await playBlob(blob, signal);
  } catch (err) {
    if (err?.name === 'AbortError') return;
    stopLuxSpeech();
    throw err;
  } finally {
    if (activeAbortController === abortController) {
      activeAbortController = null;
    }
  }
}
