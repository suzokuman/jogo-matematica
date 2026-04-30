import { useRef, useEffect } from "react";

// Web Audio API - sons gerados em tempo real (sem precisar de arquivos)
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
};

const playTone = (
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  startOffset = 0
) => {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
  gain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startOffset + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration);
};

const playSweep = (
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  startOffset = 0
) => {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime + startOffset);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + startOffset + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startOffset + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration);
};

export const useSoundEffects = () => {
  const playCorrect = () => {
    // Acerto EXAGERADO: arpejo ascendente brilhante + sino
    playTone(523.25, 0.15, "triangle", 0.35, 0);      // C5
    playTone(659.25, 0.15, "triangle", 0.35, 0.08);   // E5
    playTone(783.99, 0.18, "triangle", 0.35, 0.16);   // G5
    playTone(1046.5, 0.35, "triangle", 0.4, 0.24);    // C6
    playSweep(1046.5, 2093, 0.5, "sine", 0.25, 0.3);  // sweep brilhante
    playTone(1567.98, 0.4, "sine", 0.2, 0.4);         // sino agudo
  };

  const playWrong = () => {
    // Erro suave: dois tons descendentes curtos
    playTone(330, 0.12, "sawtooth", 0.18, 0);
    playTone(220, 0.18, "sawtooth", 0.18, 0.1);
  };

  return { playCorrect, playWrong };
};

const SoundEffects: React.FC = () => {
  // Desbloqueia o AudioContext na primeira interação do usuário
  useEffect(() => {
    const unlock = () => {
      const ctx = getCtx();
      if (ctx && ctx.state === "suspended") ctx.resume();
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
  return null;
};

export default SoundEffects;
