import React, { useState } from 'react';
import { X, BookOpen, Compass, ArrowRight, Lightbulb, FileText, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function WalkthroughModal({ isOpen, onClose, onStartFromWalkthrough }) {
  const [activeTab, setActiveTab] = useState('acts');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Peta">
          <X size={18} />
        </button>

        <div style={{ padding: '26px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: '1.5px solid var(--border-natural)', paddingBottom: '14px' }}>
            <div className="modal-icon-circle teal">
              <Compass size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Peta Alur Permainan
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-teal-dark)', fontWeight: 600 }}>
                Angkringan Pak Ilmu • Karsa Kala Saka Rasa Tumuju Makna
              </p>
            </div>
          </div>

          <div className="modal-tabs-row">
            <button
              className={`modal-tab-btn ${activeTab === 'acts' ? 'active' : ''}`}
              onClick={() => { soundManager.playClickSound(); setActiveTab('acts'); }}
            >
              Alur 3 Babak
            </button>
            <button
              className={`modal-tab-btn ${activeTab === 'controls' ? 'active' : ''}`}
              onClick={() => { soundManager.playClickSound(); setActiveTab('controls'); }}
            >
              Fungsi Tombol
            </button>
          </div>

          {activeTab === 'acts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="walk-item b1">
                <strong>Babak 1: Pesanan Pertama (Aku Berkarya)</strong>
                <span>Periksa benda gerobak untuk mencari 3 sobekan resep, lalu tata Bahan Rempah ke Wadah Rempah dan perkakas ke Rak Peralatan.</span>
              </div>
              <div className="walk-item b2">
                <strong>Babak 2: Resep yang Hilang (Kita Berkarya)</strong>
                <span>Rangkai puzzle naskah Pembuka–Isi–Penutup, urutkan 4 tahap menyeduh, dan pasangkan rempah dengan kebutuhan tamu.</span>
              </div>
              <div className="walk-item b3">
                <strong>Babak 3: Untuk Siapa Racikan Ini? (Berkontribusi)</strong>
                <span>Pahami cerita tamu malam hujan, racik kombinasi rempah bebas, lalu sajikan dengan tutur kata santun.</span>
              </div>
              <div className="walk-item b4">
                <strong>Epilog: Toples Kawruh</strong>
                <span>Susun kalimat hikmah lalu simpan ke toples kenangan pameran.</span>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="control-help-tile">
                <strong><FileText size={15} color="var(--color-bata)" /> Tiket Pesanan</strong>
                <span>Membaca ulang pesanan pengunjung yang datang.</span>
              </div>
              <div className="control-help-tile">
                <strong><BookOpen size={15} color="var(--color-teal)" /> Jurnal Catatan</strong>
                <span>Melihat sobekan resep & fungsi benda yang ditemukan.</span>
              </div>
              <div className="control-help-tile">
                <strong><Lightbulb size={15} color="var(--color-gold-deep)" /> Bantuan</strong>
                <span>Petunjuk bertahap bila mengalami kebingungan.</span>
              </div>
              <div className="control-help-tile">
                <strong><RotateCcw size={15} color="var(--color-bata)" /> Mulai Ulang</strong>
                <span>Mengembalikan permainan untuk pengunjung berikutnya.</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: '22px', paddingTop: '14px', borderTop: '1.5px solid var(--border-natural)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary-action"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
              onClick={() => {
                soundManager.playClickSound();
                onClose();
                if (onStartFromWalkthrough) onStartFromWalkthrough();
              }}
            >
              <span>Lanjut Bermain</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
