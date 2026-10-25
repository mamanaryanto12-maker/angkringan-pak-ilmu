// ==========================================================================
// ANGKRINGAN PAK ILMU — WEB AUDIO PROCEDURAL ENGINE
// Menghasilkan efek suara organik dan suasana malam tanpa ketergantungan file luar
// ==========================================================================

class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientGain = null;
    this.ambientOscillators = [];
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.05,
        this.ctx ? this.ctx.currentTime : 0
      );
    }
    return this.isMuted;
  }

  // Efek kertas catatan dibuka / disentuh
  playPaperRustle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  // Efek klik objek angkringan
  playClickSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Efek meletakkan bahan / drop puzzle berhasil
  playPlaceSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Gamelan Pelog laras sederhana (540Hz & 810Hz)
    [540, 810].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.28);
    });
  }

  // Efek penyerahan racikan / selesai babak
  playActCompletion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Nada pencerahan Slendro: 440, 528, 660, 792, 990
    const notes = [440, 528, 660, 792, 990];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.65);
    });
  }

  // Ambience malam angkringan yang tenang
  startNightAmbience() {
    if (this.isAmbientPlaying || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Desau angin malam halus (Brown noise filter)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(this.ambientGain);
      noise.start();

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Ambience audio initialization prevented by browser autoplay policy:', e);
    }
  }
}

export const soundManager = new ProceduralAudioEngine();
