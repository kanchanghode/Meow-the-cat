import { useEffect, useRef } from 'react';

export function AmbientSounds() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let ctx: AudioContext;
    let brownNoise: AudioBufferSourceNode;
    let sirenInterval: any;

    const startAudio = () => {
      if (audioCtxRef.current) return;
      
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // 1. Brown Noise for deep city rumble/wind
      const bufferSize = 10 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // volume compensation
      }

      brownNoise = ctx.createBufferSource();
      brownNoise.buffer = noiseBuffer;
      brownNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 250;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      brownNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      brownNoise.start();

      // 2. Occasional Siren
      const playSiren = () => {
        if (ctx.state === 'suspended') return;
        const osc = ctx.createOscillator();
        const sirenGain = ctx.createGain();
        const panner = ctx.createPanner();
        
        osc.type = 'triangle';
        // Random position for spatial effect
        panner.setPosition(Math.random() * 40 - 20, 5, Math.random() * 40 - 20);
        
        const now = ctx.currentTime;
        const duration = 6;
        for (let i = 0; i < duration; i++) {
          osc.frequency.setValueAtTime(500, now + i);
          osc.frequency.exponentialRampToValueAtTime(800, now + i + 0.5);
          osc.frequency.exponentialRampToValueAtTime(500, now + i + 1);
        }
        
        sirenGain.gain.setValueAtTime(0, now);
        sirenGain.gain.linearRampToValueAtTime(0.015, now + 1);
        sirenGain.gain.linearRampToValueAtTime(0, now + duration);

        osc.connect(sirenGain);
        sirenGain.connect(panner);
        panner.connect(ctx.destination);
        osc.start();
        osc.stop(now + duration);
      };

      // 3. Distant Traffic "Honks"
      const playHonk = () => {
        if (ctx.state === 'suspended') return;
        const osc = ctx.createOscillator();
        const honkGain = ctx.createGain();
        const panner = ctx.createPanner();

        osc.type = 'sawtooth';
        panner.setPosition(Math.random() * 60 - 30, 0, Math.random() * 60 - 30);

        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        honkGain.gain.setValueAtTime(0, now);
        honkGain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        honkGain.gain.linearRampToValueAtTime(0, now + 0.3);

        const lowPass = ctx.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.value = 800;

        osc.connect(lowPass);
        lowPass.connect(honkGain);
        honkGain.connect(panner);
        panner.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.3);
      };

      sirenInterval = setInterval(() => {
        const rand = Math.random();
        if (rand > 0.85) playSiren();
        if (rand < 0.3) playHonk();
      }, 8000);
    };

    // Start audio on first interaction
    window.addEventListener('mousedown', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });

    return () => {
      window.removeEventListener('mousedown', startAudio);
      window.removeEventListener('keydown', startAudio);
      if (sirenInterval) clearInterval(sirenInterval);
      if (brownNoise) try { brownNoise.stop(); } catch(e) {}
      if (ctx) ctx.close();
    };
  }, []);

  return null;
}
