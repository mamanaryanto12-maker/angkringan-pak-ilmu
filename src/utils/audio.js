// ==========================================================================
// ANGKRINGAN PAK ILMU — AUDIO ENGINE (BACKSOUND RESMI JOGJA + SFX ORGANIK)
// Memutar backsound lokal '/audio/backsound-jogja.mp3' (loop) + efek Web Audio
// ==========================================================================

const BGM_TRACK_URL = '/audio/backsound-jogja.mp3';

class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.55;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;

    this.bgmAudio = null;
    this.isBgmPlaying = false;
    this.ambienceSource = null;
    this.ambienceFilter = null;
    this.ambienceGain = null;

    this.isRainMode = false;
  }

  ensureBgmAudio() {
    if (!this.bgmAudio && typeof Audio !== 'undefined') {
      const audio = new Audio(BGM_TRACK_URL);
      audio.loop = true;
      audio.preload = 'auto';
      audio.muted = this.isMuted;
      audio.volume = this.computeBgmVolume();
      this.bgmAudio = audio;
    }
    return this.bgmAudio;
  }

  computeBgmVolume() {
    if (this.isMuted) return 0;
    return Math.max(0, Math.min(1, this.volume * 0.65));
  }

  syncBgmVolume() {
    if (!this.bgmAudio) return;
    this.bgmAudio.muted = this.isMuted;
    this.bgmAudio.volume = this.computeBgmVolume();
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(newVol) {
    this.volume = Math.max(0, Math.min(1, newVol));
    this.syncBgmVolume();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.04
      );
    }
    return this.volume;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.syncBgmVolume();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.04
      );
    }
    if (this.isMuted) {
      if (this.bgmAudio && !this.bgmAudio.paused) {
        this.bgmAudio.pause();
      }
      this.isBgmPlaying = false;
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  setWeatherAmbience(isRain) {
    this.isRainMode = Boolean(isRain);
    if (!this.ctx || !this.ambienceFilter || !this.ambienceGain) return;
    const t = this.ctx.currentTime;
    if (this.isRainMode) {
      this.ambienceFilter.frequency.setTargetAtTime(950, t, 0.4);
      this.ambienceGain.gain.setTargetAtTime(0.08, t, 0.4);
    } else {
      this.ambienceFilter.frequency.setTargetAtTime(260, t, 0.4);
      this.ambienceGain.gain.setTargetAtTime(0.0, t, 0.4);
    }
  }

  startBgm() {
    this.init();
    if (this.ctx) {
      this.startAmbienceLoop();
    }

    const audio = this.ensureBgmAudio();
    this.syncBgmVolume();

    if (!this.isMuted && audio && audio.paused) {
      this.isBgmPlaying = true;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        return playPromise
          .then(() => true)
          .catch(() => {
            this.isBgmPlaying = false;
            return false;
          });
      }
      return Promise.resolve(true);
    }

    return Promise.resolve(this.isBgmPlaying);
  }

  startNightAmbience() {
    this.startBgm();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    if (this.ambienceSource) {
      try {
        this.ambienceSource.stop();
      } catch {}
      this.ambienceSource = null;
    }
  }

  startAmbienceLoop() {
    if (!this.ctx || !this.bgmGain || this.ambienceSource) return;
    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.025 * white) / 1.025;
        lastOut = data[i];
        data[i] *= 1.3;
      }

      this.ambienceSource = this.ctx.createBufferSource();
      this.ambienceSource.buffer = buffer;
      this.ambienceSource.loop = true;

      this.ambienceFilter = this.ctx.createBiquadFilter();
      this.ambienceFilter.type = 'lowpass';
      this.ambienceFilter.frequency.setValueAtTime(this.isRainMode ? 950 : 260, this.ctx.currentTime);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.isRainMode ? 0.08 : 0.0, this.ctx.currentTime);

      this.ambienceSource.connect(this.ambienceFilter);
      this.ambienceFilter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.bgmGain);
      this.ambienceSource.start();
    } catch {}
  }

  playClickSound() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(190, t + 0.06);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  playPaperRustle() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.11);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1350, t);
    filter.Q.setValueAtTime(2.2, t);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.13, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    noise.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    noise.start(t);
  }

  playPlaceSuccess() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [528, 792].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.065);
      g.gain.setValueAtTime(0.0001, t + idx * 0.065);
      g.gain.linearRampToValueAtTime(0.13, t + idx * 0.065 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.065 + 0.32);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t + idx * 0.065);
      osc.stop(t + idx * 0.065 + 0.33);
    });
  }

  playGentleWrong() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, t);
    osc.frequency.exponentialRampToValueAtTime(185, t + 0.2);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.21);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  playCupServe() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(290, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.14);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.16);

    setTimeout(() => {
      if (this.isMuted || !this.ctx || !this.sfxGain) return;
      const t2 = this.ctx.currentTime;
      const chime = this.ctx.createOscillator();
      const chimeG = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(660, t2);
      chimeG.gain.setValueAtTime(0.0001, t2);
      chimeG.gain.linearRampToValueAtTime(0.07, t2 + 0.02);
      chimeG.gain.exponentialRampToValueAtTime(0.001, t2 + 0.42);
      chime.connect(chimeG);
      chimeG.connect(this.sfxGain);
      chime.start(t2);
      chime.stop(t2 + 0.44);
    }, 80);
  }

  playActCompletion() {
    this.init();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const notes = [440, 495, 586.7, 660, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.11);
      g.gain.setValueAtTime(0.0001, t + i * 0.11);
      g.gain.linearRampToValueAtTime(0.14, t + i * 0.11 + 0.025);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.11 + 0.65);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t + i * 0.11);
      osc.stop(t + i * 0.11 + 0.68);
    });
  }
}

export const soundManager = new ProceduralAudioEngine();
