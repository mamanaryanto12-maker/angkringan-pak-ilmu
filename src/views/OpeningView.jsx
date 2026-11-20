import React from 'react';
import { Users, User, ArrowRight, Compass, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import Angkringan3DViewer from '../components/Angkringan3DViewer.jsx';

export default function OpeningView({
  onStartGame,
  gameMode,
  setGameMode,
  onOpenWalkthrough,
  onOpenHelp,
  sessionIndex = 0,
  isMuted = false,
  onToggleSound,
  volumeLevel = soundManager.volume,
  onChangeVolume
}) {
  const handleStart = () => {
    soundManager.startBgm();
    soundManager.playClickSound();
    onStartGame();
  };

  const handleToggleSound = () => {
    if (onToggleSound) {
      onToggleSound();
    } else {
      soundManager.toggleMute();
    }
    soundManager.playClickSound();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onChangeVolume) {
      onChangeVolume(val);
    } else {
      soundManager.setVolume(val);
    }
  };

  return (
    <div className="opening-stage">
      {/* Bagian Atas: Identitas Resmi Gredupedia & Judul Tanpa Kotak Kaku */}
      <div className="opening-hero-header">
        {/* Logo Asli Pameran (Transparan, Tanpa Kotak Merah & Tanpa Teks Duplikat) */}
        <img
          src="/assets/exhibition/gredupedia_logo.png"
          alt="Logo Pameran"
          className="opening-brand-logo"
        />

        {/* Identitas Tema Pameran */}
        <p className="opening-theme-identity">
          Karsa Kala Saka Rasa Tujumu Makna
        </p>

        {/* Ornamen Divider Resmi dari Aset Pameran */}
        <img
          src="/assets/exhibition/ornamen_divider.png"
          alt=""
          className="opening-ornament-divider"
          aria-hidden="true"
        />

        {/* Hierarki Tipografi: "Malam Ini..." Regular (400) -> "Angkringan Pak Ilmu" Bold (700/800) */}
        <div className="opening-title-stack">
          <p className="opening-eyebrow-regular">Malam Ini...</p>
          <h1 className="opening-main-bold">Angkringan Pak Ilmu</h1>
          <h2 className="opening-subtitle">Pesanan yang Tak Biasa</h2>
        </div>

        <p className="opening-brief-hook">
          Jaga gerobak angkringan, pahami kisah setiap pengunjung, dan racik kehangatan yang tepat makna.
        </p>
      </div>

      {/* Panggung Visual 3D Model Gerobak Angkringan Tradisional */}
      <Angkringan3DViewer modelPath="/assets/models/angkringan.glb" />

      {/* Panel Kontrol Ringkas di Atas Lapisan Tanah Hangat */}
      <div className="opening-controls-dock">
        {/* Pemilihan Mode Ringkas */}
        <div className="opening-mode-switch" role="group" aria-label="Pilih Mode Bermain">
          <button
            className={`mode-pill-btn ${gameMode === 'solo' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClickSound();
              setGameMode('solo');
            }}
          >
            <User size={16} />
            <span>Solo</span>
          </button>
          <button
            className={`mode-pill-btn ${gameMode === 'duo' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClickSound();
              setGameMode('duo');
            }}
          >
            <Users size={16} />
            <span>Duo</span>
          </button>
        </div>

        {/* Tombol Mulai Bermain */}
        <button className="btn-primary-action opening-start-btn" onClick={handleStart}>
          <span>Buka Angkringan</span>
          <ArrowRight size={19} />
        </button>

        {/* Bantuan, Peta, dan Pengatur Suara */}
        <div className="opening-secondary-row">
          <button
            className="btn-secondary-action"
            onClick={() => {
              soundManager.playClickSound();
              if (onOpenHelp) onOpenHelp();
            }}
          >
            <HelpCircle size={16} color="var(--color-orange)" />
            <span>Bantuan</span>
          </button>

          <button
            className="btn-secondary-action"
            onClick={() => {
              soundManager.playClickSound();
              onOpenWalkthrough();
            }}
          >
            <Compass size={16} color="var(--color-teal)" />
            <span>Alur 3 Babak</span>
          </button>

          <div className="opening-audio-pill">
            <button
              className="audio-pill-toggle"
              onClick={handleToggleSound}
              title={isMuted ? 'Aktifkan Musik' : 'Bisukan Musik'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="var(--color-teal-dark)" />}
              <span>{isMuted ? 'Bisu' : 'Audio'}</span>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volumeLevel}
              onChange={handleVolumeChange}
              aria-label="Volume musik latar"
              className="opening-volume-slider"
            />
          </div>
        </div>

        <div className="opening-session-foot">
          <span>Sesi Pengunjung #{sessionIndex + 1}</span>
          <span>•</span>
          <span>Durasi 5–7 Menit</span>
        </div>
      </div>
    </div>
  );
}
