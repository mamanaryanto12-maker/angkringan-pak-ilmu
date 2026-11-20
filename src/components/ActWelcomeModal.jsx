import React from 'react';
import { X, ArrowRight, Sparkles, HeartHandshake, Puzzle, Search } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function ActWelcomeModal({ isOpen, onClose, currentStep }) {
  if (!isOpen) return null;

  const actData = {
    act1: {
      badge: "Zona Aku Berkarya",
      title: "Babak 1: Pesanan Pertama",
      icon: Search,
      narrative: "Kamu menjaga gerobak Pak Ilmu malam ini. Amati benda di meja gerobak lalu tata bahan dan peralatan dengan rapi.",
      steps: [
        { num: 1, title: "Amati Gerobak", desc: "Klik benda meja & cari 3 sobekan resep." },
        { num: 2, title: "Tata Wadah", desc: "Pisahkan Bahan Rempah & Rak Peralatan." }
      ]
    },
    act2: {
      badge: "Zona Kita Berkarya",
      title: "Babak 2: Resep yang Hilang",
      icon: Puzzle,
      narrative: "Sobekan catatan tadi adalah bagian dari resep kuno Pak Ilmu. Satukan naskah, urutan seduh, dan pasangan rempahnya.",
      steps: [
        { num: 1, title: "Puzzle Naskah", desc: "Susun bagian Pembuka, Isi, dan Penutup." },
        { num: 2, title: "Urutan & Rempah", desc: "Atur tahap menyeduh & cocokkan bahan." }
      ]
    },
    act3: {
      badge: "Zona Berkontribusi",
      title: "Babak 3: Untuk Siapa Racikan Ini?",
      icon: HeartHandshake,
      narrative: "Seorang tamu datang di tengah malam dingin Yogyakarta. Pahami kebutuhannya dan racik minuman yang paling sesuai.",
      steps: [
        { num: 1, title: "Pahami Tamu", desc: "Simak cerita pengunjung yang singgah." },
        { num: 2, title: "Racik & Sajikan", desc: "Pilih 2+ rempah bebas & ucapkan salam hangat." }
      ]
    },
    epilogue: {
      badge: "Epilog",
      title: "Toples Kawruh",
      icon: Sparkles,
      narrative: "Tutup perjalananmu dengan merangkai pesan hikmah dan menyimpannya untuk pengunjung berikutnya.",
      steps: [
        { num: 1, title: "Susun Hikmah", desc: "Rangkai kata menjadi kalimat pesan utuh." },
        { num: 2, title: "Simpan Toples", desc: "Masukkan pesan ke dalam Toples Kawruh." }
      ]
    }
  };

  const current = actData[currentStep];
  if (!current) return null;
  const IconComp = current.icon;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={18} />
        </button>

        <div style={{ padding: '26px 28px' }}>
          <div className="act-welcome-header">
            <div className="act-welcome-icon-box">
              <IconComp size={24} />
            </div>
            <div>
              <span className="act-zone-kicker">{current.badge}</span>
              <h2 style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {current.title}
              </h2>
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '16px' }}>
            {current.narrative}
          </p>

          <div className="act-welcome-steps-2col">
            {current.steps.map((st) => (
              <div key={st.num} className="act-welcome-step-card">
                <div className="act-welcome-step-num">{st.num}</div>
                <strong>{st.title}</strong>
                <span>{st.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary-action"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
            >
              <span>Mulai Babak Ini</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
