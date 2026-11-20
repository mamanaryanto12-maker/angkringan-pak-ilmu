import React from 'react';
import { X, ArrowRight, Scroll } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function RecipeManuscriptModal({ isOpen, onClose, puzzleData, onContinueToSequence }) {
  if (!isOpen || !puzzleData) return null;

  const pieces = puzzleData.pieces || [];
  const fullText = pieces.map(p => p.text).join(' ');

  const handleContinue = () => {
    soundManager.playClickSound();
    onClose();
    if (onContinueToSequence) onContinueToSequence();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card manuscript-popup" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Naskah">
          <X size={18} />
        </button>

        {/* Tajuk Naskah dengan Ornamen Resmi Pameran */}
        <div className="manuscript-header">
          <img src="/assets/exhibition/ukiran.png" alt="" className="manuscript-corner-carving" aria-hidden="true" />
          <div className="manuscript-seal">
            <Scroll size={22} />
          </div>
          <span className="manuscript-kicker">Naskah Lengkap Tersusun</span>
          <h2>{puzzleData.title}</h2>
        </div>

        <div className="manuscript-body">
          {/* Naskah Utuh dalam Bingkai Kertas */}
          <div className="manuscript-full-scroll">
            <p className="manuscript-full-text">“{fullText}”</p>
            <img src="/assets/exhibition/ornamen_bawah.png" alt="" className="manuscript-divider-flourish" aria-hidden="true" />
          </div>

          {/* Ringkasan Visual Struktur 3 Bagian */}
          <div className="manuscript-structure-grid">
            <div className="manuscript-part-chip">
              <img src="/assets/tools/naskah_pembuka.svg" alt="Pembuka" />
              <strong>1. Pembuka</strong>
              <span>Sapaan tamu & memilih bahan awal</span>
            </div>
            <div className="manuscript-part-chip">
              <img src="/assets/tools/naskah_isi.svg" alt="Isi" />
              <strong>2. Isi</strong>
              <span>Memarkan rempah & tuang air didih</span>
            </div>
            <div className="manuscript-part-chip">
              <img src="/assets/tools/naskah_penutup.svg" alt="Penutup" />
              <strong>3. Penutup</strong>
              <span>Aduk manis & sajikan hangat ramah</span>
            </div>
          </div>

          <div className="manuscript-actions">
            <button className="btn-secondary-action" onClick={onClose}>
              Lihat Bingkai
            </button>
            <button className="btn-primary-action" onClick={handleContinue}>
              <span>Lanjut ke Urutan Seduh</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
