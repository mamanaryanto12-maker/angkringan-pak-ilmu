import React, { useState, useEffect } from 'react';
import { X, Lightbulb, ChevronRight, HelpCircle, CheckCircle2, Compass } from 'lucide-react';
import { ACT_1_DATA, ACT_2_DATA, ACT_3_DATA, EPILOGUE_DATA } from '../data/gameData.js';
import { soundManager } from '../utils/audio.js';

export default function HelpModal({ isOpen, onClose, currentStep, onOpenActWelcome }) {
  const [revealedHintLevel, setRevealedHintLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setRevealedHintLevel(1);
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const guideDataMap = {
    act1: ACT_1_DATA.guide,
    act2: ACT_2_DATA.guide,
    act3: ACT_3_DATA.guide,
    epilogue: EPILOGUE_DATA.guide,
    intro: {
      title: "Panduan Memulai Permainan",
      description: "Pilih mode bermain yang kamu inginkan, lalu tekan 'Buka Angkringan Sekarang' untuk memulai malam tugasmu.",
      steps: [
        "Mode Solo: Pengalaman mandiri untuk 1 pengunjung.",
        "Mode Duo: Mode diskusi interaktif berpasangan.",
        "Tekan tombol Mulai setelah menentukan pilihan."
      ],
      hints: [
        {
          level: "Petunjuk 1 (Rekomendasi Mode)",
          text: "Gunakan Mode Solo jika kamu ingin mengeksplorasi secara santai dan mandiri."
        }
      ]
    },
    summary: {
      title: "Panduan Layar Refleksi",
      description: "Selamat, kamu telah menyelesaikan seluruh misi di Angkringan Pak Ilmu!",
      steps: [
        "Pelajari piagam pencapaian dan intisari pembelajaran yang telah kamu lewati.",
        "Gunakan tombol 'Buka Jurnal Kawruh' untuk membaca kembali catatan resep yang terkumpul.",
        "Tekan 'Mulai Sesi Baru' jika ada pengunjung pameran lain yang ingin mencoba."
      ],
      hints: [
        {
          level: "Petunjuk Pameran",
          text: "Sesi ini dapat diulang tanpa batasan untuk pengunjung berikutnya."
        }
      ]
    }
  };

  const currentGuide = guideDataMap[currentStep] || guideDataMap.act1;

  const handleRevealNextHint = () => {
    soundManager.playClickSound();
    if (currentGuide.hints && revealedHintLevel < currentGuide.hints.length) {
      setRevealedHintLevel(prev => prev + 1);
    }
  };

  const canShowActWelcome = Boolean(onOpenActWelcome) && ['act1', 'act2', 'act3', 'epilogue'].includes(currentStep);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Bantuan">
          <X size={18} />
        </button>

        <div style={{ padding: '28px 30px' }}>
          {/* Header Bantuan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: '2px solid var(--border-natural)', paddingBottom: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--color-gold-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold-deep)',
              border: '1.5px solid var(--color-gold)'
            }}>
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentGuide.title}
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--color-orange)', fontWeight: 700 }}>
                Bantuan Kontekstual & Petunjuk Bertahap
              </span>
            </div>
          </div>

          {/* Deskripsi & Ringkasan Langkah */}
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '16px' }}>
            {currentGuide.description}
          </p>

          <div style={{
            background: 'var(--bg-parchment)',
            border: '1px solid var(--border-natural)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Langkah yang Perlu Dilakukan:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentGuide.steps.map((st, i) => (
                <li key={i} style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sistem Petunjuk Bertahap */}
          {currentGuide.hints && currentGuide.hints.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Petunjuk Tambahan Bertahap:
                </span>
                {revealedHintLevel < currentGuide.hints.length && (
                  <button
                    onClick={handleRevealNextHint}
                    style={{
                      background: 'var(--color-gold-soft)',
                      color: '#8C6505',
                      border: '1px solid var(--color-gold)',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Buka Petunjuk Berikutnya <ChevronRight size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentGuide.hints.slice(0, revealedHintLevel).map((h, idx) => (
                  <div key={idx} className="hint-step-box">
                    <div className="hint-step-level">
                      <Lightbulb size={13} />
                      {h.level}
                    </div>
                    <div className="hint-step-content">
                      {h.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Tombol */}
          <div style={{
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-natural)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {canShowActWelcome ? (
              <button
                className="btn-secondary-action"
                onClick={() => {
                  onClose();
                  onOpenActWelcome();
                }}
                style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Compass size={15} />
                <span>Lihat Pengantar Babak Ini</span>
              </button>
            ) : <div />}

            <button className="btn-primary-action" onClick={onClose} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Saya Mengerti, Kembali Bermain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
