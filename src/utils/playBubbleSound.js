import { getAudioContext } from './audioContext.js';

function playBubblePop(ctx, start, { pitch = 1, volume = 0.12 } = {}) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(520 * pitch, start);
  filter.frequency.exponentialRampToValueAtTime(1400 * pitch, start + 0.09);
  filter.Q.value = 6;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(280 * pitch, start);
  osc.frequency.exponentialRampToValueAtTime(920 * pitch, start + 0.11);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.16);
}

/** Light bubbly pops when a lecture opens. */
export function playBubbleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    playBubblePop(ctx, t, { pitch: 1, volume: 0.11 });
    playBubblePop(ctx, t + 0.09, { pitch: 1.35, volume: 0.1 });
    playBubblePop(ctx, t + 0.17, { pitch: 0.9, volume: 0.09 });
    playBubblePop(ctx, t + 0.24, { pitch: 1.55, volume: 0.08 });
  } catch (err) {
    console.warn('[playBubbleSound]', err);
  }
}
