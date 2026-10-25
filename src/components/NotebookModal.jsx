import React from 'react';
import { X, Feather } from 'lucide-react';

export default function NotebookModal({ isOpen, onClose, collectedNotes, inspectedObjects }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Jurnal">
          <X size={18} />
        </button>

        <div style={{ padding: '28px 30px' }}>
          {/* Header Jurnal dengan Gambar Asli */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px', borderBottom: '2px solid var(--border-natural)', paddingBottom: '16px' }}>
            <img
              src="/background/jurnallusuh.png"
              alt="Jurnal Lusuh Pak Ilmu"
              style={{
                width: '54px',
                height: '54px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(70, 50, 20, 0.15))'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Jurnal Kawruh Pak Ilmu
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-orange)', fontWeight: 700 }}>
                Catatan Hikmah & Panduan Racikan Tradisional
              </p>
            </div>
          </div>

          {/* Bagian 1: Potongan Catatan yang Ditemukan */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Feather size={16} color="var(--color-orange)" />
              Potongan Catatan Resep ({collectedNotes.length} / 3 Terkumpul)
            </h3>

            {collectedNotes.length === 0 ? (
              <div style={{
                background: 'var(--bg-parchment)',
                border: '1.5px dashed var(--border-strong)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.88rem'
              }}>
                Belum ada sobekan catatan yang kamu temukan. Periksa sudut-sudut gerobak angkringan pada Babak 1.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {collectedNotes.map((note) => (
                  <div key={note.id} className="note-scrap-item">
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-bata)', display: 'block', marginBottom: '2px' }}>
                        Ditemukan di: {note.foundAt}
                      </span>
                      “{note.text}”
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bagian 2: Catatan Objek yang Pernah Diperiksa */}
          <div>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Pengamatan Piranti & Rempah ({inspectedObjects.length} Teramati)
            </h3>
            {inspectedObjects.length === 0 ? (
              <div style={{
                background: 'var(--bg-parchment)',
                border: '1.5px dashed var(--border-strong)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.88rem'
              }}>
                Klik benda-benda di meja angkringan untuk mencatat fungsinya ke dalam jurnal ini.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {inspectedObjects.map((obj) => (
                  <div key={obj.id} style={{
                    background: '#FFF',
                    border: '1.5px solid var(--border-natural)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '0.84rem',
                    boxShadow: 'var(--shadow-paper)'
                  }}>
                    <strong style={{ color: 'var(--color-teal-dark)', display: 'block', marginBottom: '4px' }}>
                      {obj.name}
                    </strong>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: '1.45', display: 'block' }}>
                      {obj.clue}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filosofi Dhandanggula */}
          <div style={{
            marginTop: '22px',
            background: 'var(--color-teal-soft)',
            border: '1.5px solid var(--color-teal)',
            borderRadius: '8px',
            padding: '14px 18px',
            fontSize: '0.84rem',
            lineHeight: '1.55',
            color: 'var(--text-primary)'
          }}>
            <strong style={{ color: 'var(--color-teal-dark)', display: 'block', marginBottom: '4px' }}>
              Filosofi Macapat Dhandanggula:
            </strong>
            Dhandanggula menggambarkan fase kematangan manusia saat cipta, rasa, dan karsa telah terpadu selaras, siap disumbangkan untuk kemaslahatan sesama.
          </div>
        </div>
      </div>
    </div>
  );
}
