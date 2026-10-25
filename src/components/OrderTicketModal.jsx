import React from 'react';
import { X, FileText } from 'lucide-react';
import { ORDER_TICKET } from '../data/gameData.js';

export default function OrderTicketModal({ isOpen, onClose, ticketData }) {
  if (!isOpen) return null;

  const currentTicket = ticketData || ORDER_TICKET;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" onClick={e => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Tutup Tiket"
        >
          <X size={18} />
        </button>

        <div className="ticket-paper" style={{ margin: '20px' }}>
          <div className="ticket-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--color-bata)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentTicket.title}
                </h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                Pengirim: {currentTicket.sender} • {currentTicket.time}
              </span>
            </div>
            <div className="ticket-stamp">Misterius</div>
          </div>

          <div className="ticket-body">
            <p>“{currentTicket.text}”</p>

            <div style={{
              background: 'var(--color-teal-soft)',
              borderLeft: '4px solid var(--color-teal)',
              padding: '12px 16px',
              borderRadius: '4px',
              marginTop: '16px'
            }}>
              <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: '6px' }}>
                Catatan Analisis Kebutuhan:
              </h4>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: '1.5' }}>
                {currentTicket.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            paddingTop: '12px',
            borderTop: '1px dashed #C8B89E',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            fontWeight: 700
          }}>
            <span>Angkringan Pak Ilmu • Gredupedia #7</span>
            <span>Zona Dhandanggula</span>
          </div>
        </div>
      </div>
    </div>
  );
}
