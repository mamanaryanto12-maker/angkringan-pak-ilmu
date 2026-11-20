import React from 'react';
import { RotateCcw, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { EPILOGUE_DATA } from '../data/gameData.js';

export default function SummaryView({ onRestartGame, onOpenNotebook }) {
  return (
    <div className="game-content-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="summary-certificate-frame">
        {/* Ornamen Bawah/Atas Aset Pameran */}
        <div className="certificate-header">
          <img
            src="/assets/exhibition/gredupedia_logo.png"
            alt="Logo Pameran"
            className="certificate-logo"
          />

          <span className="certificate-authority">
            {EPILOGUE_DATA.exhibitionBadge.authority}
          </span>

          <h2>Piagam Peracik Kawruh</h2>
          <p className="certificate-subtitle">
            Menyelesaikan perjalanan Angkringan Pak Ilmu — {EPILOGUE_DATA.exhibitionBadge.motto}
          </p>

          <img src="/assets/exhibition/ornamen_divider.png" alt="" className="certificate-divider" aria-hidden="true" />
        </div>

        {/* Rangkuman 3 Zona Singkat */}
        <div className="certificate-zones-grid">
          <div className="zone-summary-card z1">
            <span>Babak 1 • Aku Berkarya</span>
            <h4>Kepekaan Mengamati</h4>
            <p>Mengenali fungsi bahan rempah dan peralatan angkringan.</p>
          </div>

          <div className="zone-summary-card z2">
            <span>Babak 2 • Kita Berkarya</span>
            <h4>Menyusun Pengetahuan</h4>
            <p>Merangkai struktur naskah dan urutan seduh yang runtut.</p>
          </div>

          <div className="zone-summary-card z3">
            <span>Babak 3 • Berkontribusi</span>
            <h4>Empati Pelayanan</h4>
            <p>Menyesuaikan racikan hangat dengan kebutuhan nyata sesama.</p>
          </div>
        </div>

        <div className="certificate-motto-banner">
          “Saka Rasa, Tumuju Makna — Dari Kepekaan Rasa Menuju Karya Bermakna.”
        </div>

        <div className="certificate-actions">
          <button className="btn-secondary-action" onClick={onOpenNotebook}>
            <BookOpen size={17} />
            <span>Buka Jurnal Catatan</span>
          </button>

          <button
            className="btn-primary-action"
            onClick={() => {
              soundManager.playClickSound();
              onRestartGame();
            }}
          >
            <RotateCcw size={17} />
            <span>Mulai Sesi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
