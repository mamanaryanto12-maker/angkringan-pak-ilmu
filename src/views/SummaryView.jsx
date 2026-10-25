import React from 'react';
import { Award, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { GAME_INFO, EPILOGUE_DATA } from '../data/gameData.js';

export default function SummaryView({ onRestartGame, onOpenNotebook }) {
  return (
    <div className="game-content-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        maxWidth: '880px',
        width: '100%',
        background: '#FFFDF9',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-natural)',
        boxShadow: 'var(--shadow-elevated)',
        padding: '40px 36px',
        position: 'relative'
      }}>
        {/* Header Sertifikat */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-natural)', paddingBottom: '26px', marginBottom: '28px' }}>
          <img
            src="/assets/Bunga_Wijayakusuma.PNG"
            alt="Bunga Wijayakusuma"
            style={{
              width: '76px',
              height: '76px',
              objectFit: 'contain',
              marginBottom: '14px',
              filter: 'drop-shadow(0 4px 12px rgba(216, 84, 127, 0.35))'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          <span style={{
            fontSize: '0.8rem',
            color: 'var(--color-teal-dark)',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {EPILOGUE_DATA.exhibitionBadge.authority}
          </span>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            Piagam Peracik Kawruh Dhandanggula
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Dianugerahkan kepada pembelajar yang telah menuntaskan perjalanan di Angkringan Pak Ilmu
          </p>
        </div>

        {/* Rangkuman 3 Zona Macapat Dhandanggula */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '30px' }}>
          {/* Zona 1 */}
          <div style={{
            background: '#FFF',
            border: '1.5px solid var(--border-natural)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            borderTop: '4px solid var(--color-orange)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-orange)', fontWeight: 800, textTransform: 'uppercase' }}>
              Babak 1 • Aku Berkarya
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 8px 0' }}>
              Kepekaan Eksplorasi
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Meraba potensi rempah dan piranti seduh, mengenali tanda-tanda yang belum tertata menjadi modal awal berkarya.
            </p>
          </div>

          {/* Zona 2 */}
          <div style={{
            background: '#FFF',
            border: '1.5px solid var(--border-natural)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            borderTop: '4px solid var(--color-teal)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-teal-dark)', fontWeight: 800, textTransform: 'uppercase' }}>
              Babak 2 • Kita Berkarya
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 8px 0' }}>
              Kolaborasi & Struktur
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Menyatukan serpihan catatan resep kuno dan menyusun urutan logis agar pengetahuan dapat dipelajari dan diuji bersama.
            </p>
          </div>

          {/* Zona 3 */}
          <div style={{
            background: '#FFF',
            border: '1.5px solid var(--border-natural)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px',
            borderTop: '4px solid var(--color-gold-deep)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <span style={{ fontSize: '0.74rem', color: '#8C6505', fontWeight: 800, textTransform: 'uppercase' }}>
              Babak 3 • Kontribusi Nyata
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 8px 0' }}>
              Empati Pelayanan
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Menerapkan ramuan yang tepat untuk menjawab kebutuhan nyata sesama dan meringankan beban di tengah dinginnya malam.
            </p>
          </div>
        </div>

        {/* Kutipan Penutup */}
        <div style={{
          background: 'var(--color-teal-soft)',
          border: '1.5px solid var(--color-teal)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px 24px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <span style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--color-teal-dark)', display: 'block', fontWeight: 800 }}>
            “Saka Rasa, Tumuju Makna: Dari Kepekaan Meraba Rasa, Menuju Keluhuran Menemukan Makna.”
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
            Toples Kawruh telah menerima catatan hikmahmu. Terima kasih telah menjadi bagian dari Gredupedia #7!
          </span>
        </div>

        {/* Tombol Aksi */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary-action"
            onClick={onOpenNotebook}
            style={{ padding: '14px 24px', fontSize: '0.96rem' }}
          >
            <BookOpen size={18} />
            <span>Buka Kembali Jurnal Kawruh</span>
          </button>

          <button
            className="btn-primary-action"
            onClick={() => {
              soundManager.playClickSound();
              onRestartGame();
            }}
            style={{ padding: '14px 34px', fontSize: '1rem' }}
          >
            <RotateCcw size={18} />
            <span>Mulai Sesi Baru (Pengunjung Berikutnya)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
