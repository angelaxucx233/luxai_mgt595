import { getAudioContext, playTone } from './audioContext.js';

/** Short cash-register “cha-ching” for correct Your Turn checks. */
export function playChaChing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    playTone(ctx, { freq: 480, start: t, duration: 0.07, volume: 0.14, type: 'triangle' });
    playTone(ctx, { freq: 1520, start: t + 0.055, duration: 0.38, volume: 0.2 });
    playTone(ctx, { freq: 2280, start: t + 0.06, duration: 0.3, volume: 0.1 });
    playTone(ctx, { freq: 3040, start: t + 0.065, duration: 0.22, volume: 0.06 });
  } catch (err) {
    console.warn('[playChaChing]', err);
  }
}
