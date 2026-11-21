import React from 'react';
import { ArrowRight, Compass, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import Angkringan3DViewer from '../components/Angkringan3DViewer.jsx';

export default function OpeningView({
  onStartGame,
  onOpenWalkthrough,
  onOpenHelp,
  sessionIndex = 0
}) {
  const handleStart = () => {
    soundManager.startBgm();
    soundManager.playClickSound();
    onStartGame();
  };

  return (
    <div className="opening-stage">
      {/* Header Elegan: Logo Pameran, Identitas Tema & Judul Cerita */}
      <div className="opening-hero-header">
        <img
          src="/assets/exhibition/gredupedia_logo.png"
          alt="Logo Pameran Gredupedia"
          className="opening-brand-logo"
        />

        <p className="opening-theme-identity">
          Karsa Kala Saka Rasa Tujumu Makna
        </p>

        <img
          src="/assets/exhibition/ornamen_divider.png"
          alt=""
          className="opening-ornament-divider"
          aria-hidden="true"
        />

        <div className="opening-title-stack">
          <p className="opening-eyebrow-regular">Malam Ini...</p>
          <h1 className="opening-main-bold">Angkringan Pak Ilmu</h1>
          <h2 className="opening-subtitle">Pesanan yang Tak Biasa</h2>
        </div>

        <p className="opening-brief-hook">
          Jaga gerobak angkringan, pahami kisah setiap pengunjung, dan racik kehangatan yang tepat makna.
        </p>
      </div>

      {/* Pusat Visual Utama: 3D Model Gerobak Angkringan Tradisional */}
      <Angkringan3DViewer modelPath="/assets/models/angkringan.glb" />

      {/* Panel Aksi Sederhana & Terfokus */}
      <div className="opening-controls-dock">
        {/* Tombol Utama Mulai Permainan */}
        <button className="btn-primary-action opening-start-btn" onClick={handleStart}>
          <span>Buka Angkringan</span>
          <ArrowRight size={20} />
        </button>

        {/* Tombol Sekunder Bantuan & Alur */}
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
