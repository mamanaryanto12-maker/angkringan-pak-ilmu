import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, FileText, HelpCircle, RotateCcw, Compass, SlidersHorizontal, Box } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function Navbar({
  currentStep,
  onOpenTicket,
  onOpenNotebook,
  onOpenHelp,
  onOpenWalkthrough,
  onOpen3DGallery,
  onResetGame,
  isMuted,
  onToggleSound,
  volumeLevel = soundManager.volume,
  onChangeVolume,
  hasUnreadNotes
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const steps = [
    { key: 'intro', label: 'Pembuka' },
    { key: 'act1', label: 'Babak 1' },
    { key: 'act2', label: 'Babak 2' },
    { key: 'act3', label: 'Babak 3' },
    { key: 'epilogue', label: 'Epilog' },
    { key: 'summary', label: 'Selesai' }
  ];

  const currentIdx = steps.findIndex(s => s.key === currentStep);

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onChangeVolume) {
      onChangeVolume(val);
    } else {
      soundManager.setVolume(val);
      if (isMuted && val > 0) onToggleSound();
    }
  };

  return (
    <header className="game-navbar">
      {/* Identitas Kiri: Monogram Resmi Gredupedia (Transparan Tanpa Kotak) */}
      <div className="brand-section">
        <img
          src="/assets/exhibition/logo_g_emblem.png"
          alt="Logo Resmi"
          className="brand-emblem-img"
        />
        <div className="brand-title-group">
          <h1>Angkringan Pak Ilmu</h1>
          <p>Karsa Kala #7</p>
        </div>
      </div>

      {/* Indikator Alur Permainan 1 Baris Rapi */}
      <nav className="act-progress-bar" aria-label="Alur Permainan">
        {steps.map((st, i) => {
          const isActive = st.key === currentStep;
          const isCompleted = i < currentIdx;

          return (
            <React.Fragment key={st.key}>
              <div
                className={`progress-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                title={`${i + 1}. ${st.label}`}
              >
                <span className="step-circle">{i + 1}</span>
                <span className="step-text-label">{st.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`progress-connector ${i < currentIdx ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Kontrol Navigasi & Audio */}
      <div className="nav-actions">
        <button
          className="btn-nav-help"
          onClick={() => {
            soundManager.playClickSound();
            onOpenWalkthrough();
          }}
          title="Peta & Cara Bermain"
        >
          <Compass size={16} />
          <span>Peta</span>
        </button>

        <button
          className="btn-nav-icon"
          onClick={() => {
            soundManager.playPaperRustle();
            onOpenTicket();
          }}
          title="Tiket Pesanan"
          aria-label="Tiket Pesanan"
        >
          <FileText size={17} />
        </button>

        <button
          className="btn-nav-icon"
          onClick={() => {
            soundManager.playClickSound();
            if (onOpen3DGallery) onOpen3DGallery();
          }}
          title="Koleksi Model 3D Perkakas & Rempah"
          aria-label="Koleksi 3D"
        >
          <Box size={17} color="var(--color-orange)" />
        </button>

        <button
          className="btn-nav-icon btn-nav-badge"
          onClick={() => {
            soundManager.playPaperRustle();
            onOpenNotebook();
          }}
          title="Jurnal Catatan"
          aria-label="Jurnal Catatan"
        >
          <BookOpen size={17} />
          {hasUnreadNotes && <span className="badge-dot" />}
        </button>

        <button
          className="btn-nav-icon"
          onClick={() => {
            soundManager.playClickSound();
            onOpenHelp();
          }}
          title="Bantuan & Petunjuk"
          aria-label="Bantuan"
        >
          <HelpCircle size={17} />
        </button>

        {/* Audio Controls (Mute + Pengatur Volume) */}
        <div className="audio-control-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="btn-nav-icon"
            onClick={onToggleSound}
            title={isMuted ? 'Aktifkan Musik' : 'Bisukan Musik'}
            aria-label={isMuted ? 'Aktifkan Musik' : 'Bisukan Musik'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <button
            className="btn-nav-icon"
            style={{ width: '32px', background: showVolumeSlider ? 'var(--color-teal-soft)' : undefined }}
            onClick={() => {
              soundManager.playClickSound();
              setShowVolumeSlider(v => !v);
            }}
            title="Atur Volume Suara"
            aria-label="Atur Volume"
          >
            <SlidersHorizontal size={14} />
          </button>

          {showVolumeSlider && (
            <div className="volume-popover">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                <span>Volume Audio</span>
                <span>{isMuted ? 'Bisu' : `${Math.round(volumeLevel * 100)}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volumeLevel}
                onChange={handleVolumeChange}
                style={{ width: '100%', accentColor: 'var(--color-teal)', cursor: 'pointer' }}
                aria-label="Pengatur tingkat volume"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setShowVolumeSlider(false)}
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    background: 'var(--color-teal)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="btn-nav-icon"
          onClick={() => {
            if (window.confirm("Ulangi permainan dari pembuka?")) {
              soundManager.playClickSound();
              onResetGame();
            }
          }}
          title="Mulai Ulang"
          aria-label="Mulai Ulang"
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </header>
  );
}
