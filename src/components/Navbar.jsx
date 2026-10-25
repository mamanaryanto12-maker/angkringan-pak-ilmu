import React from 'react';
import { Volume2, VolumeX, BookOpen, FileText, HelpCircle, RotateCcw, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function Navbar({
  currentStep,
  onOpenTicket,
  onOpenNotebook,
  onOpenHelp,
  onOpenWalkthrough,
  onResetGame,
  isMuted,
  onToggleSound,
  hasUnreadNotes
}) {
  const steps = [
    { key: 'intro', label: 'Pembuka' },
    { key: 'act1', label: 'Babak 1' },
    { key: 'act2', label: 'Babak 2' },
    { key: 'act3', label: 'Babak 3' },
    { key: 'epilogue', label: 'Epilog' },
    { key: 'summary', label: 'Refleksi' }
  ];

  const currentIdx = steps.findIndex(s => s.key === currentStep);

  return (
    <header className="game-navbar">
      {/* Brand & Logo Wijayakusuma Resmi */}
      <div className="brand-section">
        <img
          src="/assets/Bunga_Wijayakusuma.PNG"
          alt="Bunga Wijayakusuma"
          className="brand-flower-icon"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="brand-title-group">
          <h1>Angkringan Pak Ilmu</h1>
          <p>Karsa Kala #7 • Zona Dhandanggula</p>
        </div>
      </div>

      {/* Indikator Progres Babak */}
      <nav className="act-progress-bar" aria-label="Alur Cerita">
        {steps.map((st, i) => {
          const isActive = st.key === currentStep;
          const isCompleted = i < currentIdx;

          return (
            <React.Fragment key={st.key}>
              <div
                className={`progress-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                title={`Langkah ${i + 1}: ${st.label}`}
              >
                <div className="step-circle">{i + 1}</div>
                <span className="step-text-label">{st.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`progress-connector ${i < currentIdx ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Tombol Kontrol Pameran */}
      <div className="nav-actions">
        {/* Tombol Panduan Cara Bermain */}
        <button
          className="btn-nav-help"
          onClick={() => {
            soundManager.playClickSound();
            onOpenWalkthrough();
          }}
          title="Panduan Cara Bermain & Peta Babak"
          aria-label="Panduan Bermain"
        >
          <Compass size={17} />
          <span>Panduan</span>
        </button>

        {/* Tiket Pesanan */}
        <button
          className="btn-nav-icon"
          onClick={() => {
            soundManager.playPaperRustle();
            onOpenTicket();
          }}
          title="Buka Tiket Pesanan Misterius"
          aria-label="Tiket Pesanan"
        >
          <FileText size={18} />
        </button>

        {/* Jurnal / Catatan Kawruh */}
        <button
          className="btn-nav-icon btn-nav-badge"
          onClick={() => {
            soundManager.playPaperRustle();
            onOpenNotebook();
          }}
          title="Buka Jurnal Kawruh"
          aria-label="Jurnal Kawruh"
        >
          <BookOpen size={18} />
          {hasUnreadNotes && <span className="badge-dot" />}
        </button>

        {/* Petunjuk Kontekstual Babak */}
        <button
          className="btn-nav-icon"
          onClick={() => {
            soundManager.playClickSound();
            onOpenHelp();
          }}
          title="Petunjuk Misi Babak Ini"
          aria-label="Petunjuk Babak"
        >
          <HelpCircle size={18} />
        </button>

        {/* Audio Mute/Unmute */}
        <button
          className="btn-nav-icon"
          onClick={onToggleSound}
          title={isMuted ? 'Nyalakan Suara Organik' : 'Bisukan Suara'}
          aria-label="Kontrol Audio"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Mulai Ulang Sesi */}
        <button
          className="btn-nav-icon"
          onClick={() => {
            if (window.confirm("Mulai ulang petualangan dari awal? Progres saat ini akan dikembalikan ke pembuka untuk pengunjung berikutnya.")) {
              soundManager.playClickSound();
              onResetGame();
            }
          }}
          title="Mulai Ulang Permainan"
          aria-label="Reset Game"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
