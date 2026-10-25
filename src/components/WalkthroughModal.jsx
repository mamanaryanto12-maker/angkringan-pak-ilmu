import React, { useState } from 'react';
import { X, BookOpen, Compass, Layers, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function WalkthroughModal({ isOpen, onClose, onStartFromWalkthrough }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'acts' | 'controls'

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '740px' }} onClick={e => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Tutup Panduan"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '28px 32px' }}>
          {/* Header Panduan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '2px solid var(--border-natural)', paddingBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-teal-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-teal-dark)',
              border: '1.5px solid var(--color-teal)'
            }}>
              <Compass size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Panduan Bermain Angkringan Pak Ilmu
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-teal)', fontWeight: 700 }}>
                Gredupedia #7: Karsa Kala • Petunjuk Pengunjung Pameran
              </p>
            </div>
          </div>

          {/* Tab Pilihan Panduan */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => { soundManager.playClickSound(); setActiveTab('overview'); }}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'overview' ? 'var(--color-teal)' : 'var(--bg-parchment)',
                color: activeTab === 'overview' ? '#FFF' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.86rem',
                border: '1px solid var(--border-strong)'
              }}
            >
              Cerita & Peran
            </button>
            <button
              onClick={() => { soundManager.playClickSound(); setActiveTab('acts'); }}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'acts' ? 'var(--color-teal)' : 'var(--bg-parchment)',
                color: activeTab === 'acts' ? '#FFF' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.86rem',
                border: '1px solid var(--border-strong)'
              }}
            >
              Peta 3 Babak
            </button>
            <button
              onClick={() => { soundManager.playClickSound(); setActiveTab('controls'); }}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'controls' ? 'var(--color-teal)' : 'var(--bg-parchment)',
                color: activeTab === 'controls' ? '#FFF' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.86rem',
                border: '1px solid var(--border-strong)'
              }}
            >
              Tombol & Bantuan
            </button>
          </div>

          {/* Konten Tab 1: Cerita & Peran */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: '#FFF',
                border: '1px solid var(--border-natural)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                fontSize: '0.92rem'
              }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Peran Anda Malam Ini:
                </strong>
                Anda dipercaya mengelola gerobak <strong>Angkringan Pak Ilmu</strong> di sudut Yogyakarta pada malam yang dingin dan mulai diguyur hujan. 
                Seorang pelanggan misterius meninggalkan tiket pesanan yang penuh kiasan. 
                Tugas Anda bukan sekadar menjual minuman, melainkan belajar mengamati kebutuhan, menghubungkan petunjuk rempah, dan memberikan kehangatan sejati bagi sesama.
              </div>

              <div style={{
                background: 'var(--color-gold-soft)',
                borderLeft: '4px solid var(--color-gold-deep)',
                borderRadius: '0 8px 8px 0',
                padding: '14px 18px',
                fontSize: '0.88rem',
                color: '#5C4304',
                lineHeight: '1.5'
              }}>
                <strong>Gagasan Utama:</strong> Belajar melalui pengalaman mandiri (*Aku Berkarya*), memadukan gagasan bersama (*Kita Berkarya*), dan mempersembahkan hasil karya untuk membantu orang lain (*Karya Kita Berkontribusi*).
              </div>
            </div>
          )}

          {/* Konten Tab 2: Peta 3 Babak */}
          {activeTab === 'acts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                background: '#FFF',
                border: '1px solid var(--border-natural)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                borderLeft: '4px solid var(--color-orange)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-orange)', marginBottom: '4px' }}>
                  Babak 1: Pesanan Pertama (Aku Berkarya)
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  Klik 6 benda di gerobak untuk mengamati fungsinya dan menemukan 3 sobekan catatan rahasia. Selanjutnya, kelompokkan rempah alami vs piranti seduh.
                </div>
              </div>

              <div style={{
                background: '#FFF',
                border: '1px solid var(--border-natural)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                borderLeft: '4px solid var(--color-teal)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-teal-dark)', marginBottom: '4px' }}>
                  Babak 2: Resep yang Hilang (Kita Berkarya)
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  Rakit naskah resep kuno melalui Jigsaw Puzzle 4 slot, susun 4 tahapan seduh secara logis, dan cocokkan khasiat rempah dengan keluhan raga/jiwa.
                </div>
              </div>

              <div style={{
                background: '#FFF',
                border: '1px solid var(--border-natural)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                borderLeft: '4px solid var(--color-gold-deep)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#8C6505', marginBottom: '4px' }}>
                  Babak 3: Untuk Siapa Racikan Ini? (Karya Kita Berkontribusi)
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  Misi 'Hangat di Tengah Hujan': Analisis kebutuhan Mas Danang, atur takaran rempah yang seimbang, dan sajikan dengan tutur kata penuh budi pekerti Yogyakarta.
                </div>
              </div>

              <div style={{
                background: '#FFF',
                border: '1px solid var(--border-natural)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                borderLeft: '4px solid var(--color-pink)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-pink)', marginBottom: '4px' }}>
                  Epilog: Toples Kawruh
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  Susun kalimat hikmah "Pengetahuan Menjadi Berarti Ketika Dibagikan" dan abadikan ke dalam Toples Kawruh untuk pengunjung berikutnya.
                </div>
              </div>
            </div>
          )}

          {/* Konten Tab 3: Tombol & Bantuan */}
          {activeTab === 'controls' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#FFF', border: '1px solid var(--border-natural)', padding: '12px 14px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.88rem', marginBottom: '2px' }}>
                  📄 Tiket Pesanan
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Buka kapan saja untuk membaca kembali pesan dan keluhan pelanggan.
                </span>
              </div>

              <div style={{ background: '#FFF', border: '1px solid var(--border-natural)', padding: '12px 14px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.88rem', marginBottom: '2px' }}>
                  📖 Jurnal Kawruh
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Menyimpan otomatis semua sobekan catatan dan petunjuk rempah yang kamu temukan.
                </span>
              </div>

              <div style={{ background: '#FFF', border: '1px solid var(--border-natural)', padding: '12px 14px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.88rem', marginBottom: '2px' }}>
                  💡 Tombol Petunjuk (Bantuan)
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Menyediakan petunjuk bertahap level 1, 2, dan 3 jika kamu ragu langkah berikutnya.
                </span>
              </div>

              <div style={{ background: '#FFF', border: '1px solid var(--border-natural)', padding: '12px 14px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.88rem', marginBottom: '2px' }}>
                  🔄 Tombol Mulai Ulang
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Mengembalikan permainan ke pembuka untuk dicoba oleh pengunjung berikutnya.
                </span>
              </div>
            </div>
          )}

          {/* Footer Modal */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-natural)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Estimasi durasi: 5 hingga 7 menit per sesi.
            </span>

            <button
              className="btn-primary-action"
              onClick={() => {
                soundManager.playClickSound();
                onClose();
                if (onStartFromWalkthrough) onStartFromWalkthrough();
              }}
            >
              <span>Mengerti, Masuk ke Gerobak</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
