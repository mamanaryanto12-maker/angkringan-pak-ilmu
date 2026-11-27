import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Lightbulb, ArrowRight, Compass } from 'lucide-react';
import { CONTEXTUAL_HELP_GUIDES } from '../data/gameData.js';
import { soundManager } from '../utils/audio.js';

export default function HelpModal({ isOpen, onClose, currentStep = 'intro', activeSubStep = null }) {
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('current');
    }
  }, [isOpen, currentStep, activeSubStep]);

  if (!isOpen) return null;

  const lookupKey = activeSubStep && CONTEXTUAL_HELP_GUIDES[activeSubStep]
    ? activeSubStep
    : (CONTEXTUAL_HELP_GUIDES[currentStep] ? currentStep : 'intro');
  const guide = CONTEXTUAL_HELP_GUIDES[lookupKey];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Bantuan Permainan">
      <div className="modal-dialog-card" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Bantuan">
          <X size={18} />
        </button>

        <div style={{ padding: '24px 26px' }}>
          {/* Header Kontekstual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', borderBottom: '1.5px solid var(--border-natural)', paddingBottom: '12px' }}>
            <div className="modal-icon-circle gold">
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Bantuan: {guide.title}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Panduan singkat sesuai aktivitas yang sedang dibuka
              </span>
            </div>
          </div>

          <div className="modal-tabs-row">
            <button
              className={`modal-tab-btn ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => { soundManager.playClickSound(); setActiveTab('current'); }}
            >
              Panduan Aktivitas Ini
            </button>
            <button
              className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => { soundManager.playClickSound(); setActiveTab('overview'); }}
            >
              Ringkasan Alur Game
            </button>
          </div>

          {activeTab === 'current' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Tujuan Utama */}
              <div style={{
                background: 'var(--color-teal-soft)',
                borderLeft: '4px solid var(--color-teal)',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--color-teal-dark)'
              }}>
                Tujuan: {guide.goal}
              </div>

              {/* Langkah Berurutan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {guide.steps.map((stepText, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: 'var(--bg-cream)',
                      border: '1px solid var(--border-natural)',
                      borderRadius: '8px',
                      padding: '10px 12px'
                    }}
                  >
                    <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--color-orange)',
                      color: '#FFF',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 600 }}>
                      {stepText}
                    </span>
                  </div>
                ))}
              </div>

              {/* Petunjuk Cepat */}
              {guide.tip && (
                <div style={{
                  background: 'var(--color-gold-soft)',
                  border: '1px solid var(--color-gold-deep)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.84rem',
                  color: '#6E4A04',
                  lineHeight: '1.45'
                }}>
                  <Lightbulb size={16} color="var(--color-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Petunjuk:</strong> {guide.tip}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="help-compact-grid">
              <div className="help-compact-item">
                <strong>Babak 1: Pesanan Pertama</strong>
                <span>Cari 3 sobekan resep di meja gerobak, lalu pilah Rempah dan Peralatan.</span>
              </div>
              <div className="help-compact-item">
                <strong>Babak 2: Resep yang Hilang</strong>
                <span>Susun puzzle naskah, urutkan 4 tahap seduh, dan pasangkan khasiat rempah.</span>
              </div>
              <div className="help-compact-item">
                <strong>Babak 3: Racikan untuk Tamu</strong>
                <span>Pahami cerita tamu, pilih rempah & suhu, lalu sajikan dengan sapaan hangat.</span>
              </div>
              <div className="help-compact-item">
                <strong>Epilog: Toples Kawruh</strong>
                <span>Rangkai kalimat hikmah lalu simpan ke dalam toples kaca Pak Ilmu.</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1.5px solid var(--border-natural)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary-action"
              style={{ padding: '9px 22px', fontSize: '0.88rem' }}
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
            >
              <span>Mengerti, Lanjut Main</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
