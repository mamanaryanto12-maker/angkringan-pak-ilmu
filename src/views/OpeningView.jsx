import React from 'react';
import { Sparkles, Users, User, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { GAME_INFO } from '../data/gameData.js';

export default function OpeningView({ onStartGame, gameMode, setGameMode, onOpenWalkthrough }) {
  const handleStart = () => {
    soundManager.startNightAmbience();
    soundManager.playClickSound();
    onStartGame();
  };

  return (
    <div className="game-content-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        maxWidth: '840px',
        width: '100%',
        textAlign: 'center',
        padding: '40px 36px',
        background: 'rgba(255, 255, 255, 0.94)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-natural)',
        boxShadow: 'var(--shadow-elevated)',
        position: 'relative'
      }}>
        {/* Ornamen Bunga Wijayakusuma Resmi */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img
            src="/assets/Bunga_Wijayakusuma.PNG"
            alt="Bunga Wijayakusuma Gredupedia"
            style={{
              width: '88px',
              height: '88px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(216, 84, 127, 0.35))'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Tagline Pameran */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-orange-soft)',
          border: '1.5px solid var(--color-orange)',
          padding: '6px 16px',
          borderRadius: '24px',
          fontSize: '0.82rem',
          fontWeight: 800,
          color: 'var(--color-orange)',
          letterSpacing: '0.8px',
          marginBottom: '16px',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={15} />
          {GAME_INFO.exhibition} • {GAME_INFO.tagline}
        </div>

        {/* Judul Karya */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '0.2px',
          lineHeight: '1.2',
          marginBottom: '6px'
        }}>
          {GAME_INFO.title}
        </h1>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-teal)',
          letterSpacing: '0.6px',
          marginBottom: '20px'
        }}>
          “{GAME_INFO.subtitle}”
        </h2>

        {/* Narasi Pengantar */}
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.65',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 26px auto',
          textAlign: 'center'
        }}>
          Malam ini kamu dipercaya menjaga <strong>Angkringan Pak Ilmu</strong> di sudut Yogyakarta. 
          Gemercik hujan mulai turun saat seorang pelanggan misterius datang membawa tiket pesanan yang tak biasa. 
          Eksplorasi gerobak, pecahkan teka-teki resep kuno, dan temukan bagaimana pengetahuan menjadi bermakna saat dipersembahkan untuk sesama.
        </p>

        {/* Pilihan Mode Permainan (Solo / Duo) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <button
            onClick={() => {
              soundManager.playClickSound();
              setGameMode('solo');
            }}
            style={{
              flex: '1',
              maxWidth: '280px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: gameMode === 'solo' ? 'var(--color-teal)' : '#FFF',
              border: `2px solid ${gameMode === 'solo' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
              color: gameMode === 'solo' ? '#FFF' : 'var(--text-primary)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: gameMode === 'solo' ? '0 6px 18px rgba(53, 140, 136, 0.3)' : 'var(--shadow-soft)'
            }}
          >
            <User size={26} color={gameMode === 'solo' ? '#FFF' : 'var(--color-teal)'} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>Mode Solo</div>
              <div style={{ fontSize: '0.78rem', color: gameMode === 'solo' ? '#E0F4F2' : 'var(--text-muted)' }}>
                Petualangan Mandiri (Disarankan)
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setGameMode('duo');
            }}
            style={{
              flex: '1',
              maxWidth: '280px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: gameMode === 'duo' ? 'var(--color-teal)' : '#FFF',
              border: `2px solid ${gameMode === 'duo' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
              color: gameMode === 'duo' ? '#FFF' : 'var(--text-primary)',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: gameMode === 'duo' ? '0 6px 18px rgba(53, 140, 136, 0.3)' : 'var(--shadow-soft)'
            }}
          >
            <Users size={26} color={gameMode === 'duo' ? '#FFF' : 'var(--color-teal)'} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>Mode Duo</div>
              <div style={{ fontSize: '0.78rem', color: gameMode === 'duo' ? '#E0F4F2' : 'var(--text-muted)' }}>
                Diskusi Bersama Teman Pameran
              </div>
            </div>
          </button>
        </div>

        {/* Tombol Aksi Utama & Panduan */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary-action"
            style={{ padding: '14px 24px', fontSize: '0.96rem' }}
            onClick={() => {
              soundManager.playClickSound();
              onOpenWalkthrough();
            }}
          >
            <Compass size={18} color="var(--color-teal)" />
            <span>Cara Bermain & Peta Babak</span>
          </button>

          <button
            className="btn-primary-action"
            style={{
              fontSize: '1.05rem',
              padding: '14px 34px'
            }}
            onClick={handleStart}
          >
            <span>Buka Angkringan Sekarang</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Informasi Pameran */}
        <div style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-natural)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="var(--color-teal)" />
            Karya Resmi Pameran Teknologi Pendidikan UNY
          </span>
          <span>•</span>
          <span>Estimasi Sesi: {GAME_INFO.targetDuration}</span>
        </div>
      </div>
    </div>
  );
}
