import React, { useState, useEffect } from 'react';
import { X, Lightbulb, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { ACT_1_DATA, ACT_2_DATA, ACT_3_DATA, EPILOGUE_DATA } from '../data/gameData.js';
import { soundManager } from '../utils/audio.js';

export default function HelpModal({ isOpen, onClose, currentStep = 'intro' }) {
  const [activeTab, setActiveTab] = useState('general');
  const [revealedHintLevel, setRevealedHintLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setRevealedHintLevel(1);
      setActiveTab(['intro', 'summary'].includes(currentStep) ? 'general' : 'current');
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const guideMap = {
    act1: ACT_1_DATA.guide,
    act2: ACT_2_DATA.guide,
    act3: ACT_3_DATA.guide,
    epilogue: EPILOGUE_DATA.guide
  };
  const currentGuide = guideMap[currentStep] || ACT_1_DATA.guide;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Bantuan">
          <X size={18} />
        </button>

        <div style={{ padding: '26px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1.5px solid var(--border-natural)', paddingBottom: '14px' }}>
            <div className="modal-icon-circle gold">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Bantuan & Cara Bermain
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Panduan singkat interaksi permainan
              </span>
            </div>
          </div>

          <div className="modal-tabs-row">
            <button
              className={`modal-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => { soundManager.playClickSound(); setActiveTab('general'); }}
            >
              Cara Main Umum
            </button>
            {currentStep !== 'intro' && currentStep !== 'summary' && (
              <button
                className={`modal-tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => { soundManager.playClickSound(); setActiveTab('current'); }}
              >
                Petunjuk Babak Ini
              </button>
            )}
          </div>

          {activeTab === 'general' && (
            <div className="help-compact-grid">
              <div className="help-compact-item">
                <strong>Tujuan Permainan</strong>
                <span>Pahami pesanan tamu, lengkapi resep warisan Pak Ilmu, lalu racik minuman hangat sesuai kebutuhan.</span>
              </div>
              <div className="help-compact-item">
                <strong>Cara Berinteraksi</strong>
                <span>Klik benda/kartu memakai mouse, tarik kartu ke wadah, atau navigasi dengan tombol Tab lalu Enter / Spasi.</span>
              </div>
              <div className="help-compact-item">
                <strong>Jika Terjadi Kesalahan</strong>
                <span>Kamu selalu diberi umpan balik singkat dan kesempatan mencoba ulang, tanpa langsung gagal.</span>
              </div>
              <div className="help-compact-item">
                <strong>Fleksibilitas Racikan</strong>
                <span>Di Babak 3, kamu bebas memilih 2 atau lebih bahan rempah sesuai konteks kondisi tamu.</span>
              </div>
            </div>
          )}

          {activeTab === 'current' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {currentGuide.description}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {currentGuide.steps.map((st, i) => (
                  <li key={i} style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>

              {currentGuide.hints && currentGuide.hints.length > 0 && (
                <div style={{ background: 'var(--bg-parchment)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-natural)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--color-orange)' }}>Petunjuk Tambahan</strong>
                    {revealedHintLevel < currentGuide.hints.length && (
                      <button
                        className="cue-toggle-btn"
                        onClick={() => {
                          soundManager.playClickSound();
                          setRevealedHintLevel(v => v + 1);
                        }}
                      >
                        <span>Lihat Petunjuk Lanjut</span>
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                  {currentGuide.hints.slice(0, revealedHintLevel).map((h, idx) => (
                    <div key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>{h.level}:</strong> {h.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1.5px solid var(--border-natural)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary-action"
              style={{ padding: '9px 22px', fontSize: '0.88rem' }}
              onClick={onClose}
            >
              <span>Kembali Bermain</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
