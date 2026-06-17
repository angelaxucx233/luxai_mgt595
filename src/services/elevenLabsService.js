/**
 * ElevenLabs TTS — VITE_ELEVENLABS_* env vars.
 * Uses Eleven v3 (eleven_v3) for inline audio tags: [excited], [whispers], etc.
 */

import { env } from '../config/env.js';

const API_KEY = env.elevenLabsApiKey;
const VOICE_ID = env.elevenLabsVoiceId;
const MODEL_ID = env.elevenLabsModel;
const OUTPUT_FORMAT = 'mp3_44100_128';
const MIME = 'audio/mpeg';

export function isElevenLabsConfigured() {
  return Boolean(API_KEY && VOICE_ID);
}

function voiceSettings() {
  const isV3 = MODEL_ID.includes('v3');
  return {
    stability: isV3 ? 0.35 : 0.5,
    similarity_boost: 0.75,
  };
}

function requestBody(text) {
  return JSON.stringify({
    text,
    model_id: MODEL_ID,
    voice_settings: voiceSettings(),
  });
}

function streamUrl() {
  return `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream?output_format=${OUTPUT_FORMAT}`;
}

function bufferedUrl() {
  return `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
}

async function postTts(url, text, signal) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: MIME,
      'xi-api-key': API_KEY,
    },
    body: requestBody(text),
    signal,
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errBody}`);
  }

  if (!response.body) {
    throw new Error('ElevenLabs returned no response body');
  }

  return response;
}

async function fetchSpeechStream(text, signal) {
  if (!isElevenLabsConfigured()) {
    throw new Error(
      'ElevenLabs is not configured. Set VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID in .env'
    );
  }

  try {
    return await postTts(streamUrl(), text, signal);
  } catch (err) {
    if (signal?.aborted) throw err;
    return postTts(bufferedUrl(), text, signal);
  }
}

async function readStreamToBlob(body, signal) {
  const reader = body.getReader();
  const chunks = [];

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel();
        throw new DOMException('Aborted', 'AbortError');
      }
      const { done, value } = await reader.read();
      if (done) break;
      if (value?.byteLength) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return new Blob(chunks, { type: MIME });
}

export async function synthesizeElevenLabsSpeech(text, signal) {
  const response = await fetchSpeechStream(text, signal);
  return readStreamToBlob(response.body, signal);
}

let activeAudio = null;
let activeObjectUrl = null;
let activeAbortController = null;

function playBlob(blob, signal) {
  if (signal.aborted) return Promise.resolve();
  if (blob.size === 0) {
    return Promise.reject(new Error('No audio data received from ElevenLabs'));
  }

  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  activeAudio = audio;
  activeObjectUrl = objectUrl;

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      stopElevenLabsSpeech();
      resolve();
    };
    audio.onerror = () => {
      stopElevenLabsSpeech();
      reject(new Error('Audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

export function stopElevenLabsSpeech() {
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
 * @param {string} text — speech script (tags OK for eleven_v3)
 * @returns {Promise<void>}
 */
export async function playElevenLabsSpeech(text) {
  const trimmed = text?.trim();
  if (!trimmed) return;

  stopElevenLabsSpeech();

  if (!isElevenLabsConfigured()) return;

  const abortController = new AbortController();
  activeAbortController = abortController;
  const { signal } = abortController;

  try {
    const blob = await synthesizeElevenLabsSpeech(trimmed, signal);
    await playBlob(blob, signal);
  } catch (err) {
    if (err?.name === 'AbortError') return;
    stopElevenLabsSpeech();
    throw err;
  } finally {
    if (activeAbortController === abortController) {
      activeAbortController = null;
    }
  }
}
