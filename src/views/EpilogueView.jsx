import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, RotateCcw, Lightbulb, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio.js';
import { EPILOGUE_DATA } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function EpilogueView({ onCompleteEpilogue, onOpenHelp }) {
  const [placedWords, setPlacedWords] = useState([]);
  const [isNoteSubmitted, setIsNoteSubmitted] = useState(false);

  const availableTokens = EPILOGUE_DATA.tokens;

  const handleToggleWord = (token) => {
    soundManager.playClickSound();

    if (placedWords.some(t => t.id === token.id)) {
      setPlacedWords(prev => prev.filter(t => t.id !== token.id));
    } else {
      const nextWords = [...placedWords, token];
      setPlacedWords(nextWords);

      const currentSentence = nextWords.map(t => t.text).join(' ');
      if (currentSentence === EPILOGUE_DATA.correctSentence) {
        soundManager.playPlaceSuccess();
      }
    }
  };

  const handleResetWords = () => {
    soundManager.playClickSound();
    setPlacedWords([]);
  };

  const currentSentence = placedWords.map(t => t.text).join(' ');
  const isSentenceCorrect = currentSentence === EPILOGUE_DATA.correctSentence;
  const isAllWordsPlaced = placedWords.length === availableTokens.length;

  const handleSubmitToJar = () => {
    soundManager.playActCompletion();
    setIsNoteSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#FDC631', '#358C88', '#EE7217', '#D8547F']
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  return (
    <div className="game-content-area" style={{ justifyContent: 'center' }}>
      <div className="epilogue-stage">
        {/* Header Epilog */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-gold-soft)',
          border: '1.5px solid var(--color-gold-deep)',
          padding: '6px 16px',
          borderRadius: '24px',
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#8C6505',
          letterSpacing: '0.8px',
          marginBottom: '10px',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={15} />
          Epilog Simbolik Pameran
        </div>

        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Toples Kawruh Pak Ilmu
        </h2>

        {/* Panduan Kontekstual Epilog */}
        <div style={{ maxWidth: '780px', width: '100%', margin: '0 auto 16px auto' }}>
          <MiniGameGuideBanner
            tag="Epilog Simbolik • Toples Kawruh"
            title="Cara Merumuskan & Menyimpan Pesan Hikmah"
            steps={[
              "Ketuk kata-kata di pool atas secara berurutan untuk menyusun kalimat hikmah penutup.",
              "Jika salah memasukkan urutan, ketuk kata yang terpasang pada kotak kalimat di bawah untuk membatalkannya, atau klik 'Atur Ulang'.",
              "Setelah kalimat berbunyi 'Pengetahuan Menjadi Berarti Ketika Dibagikan', tekan tombol 'Masukkan Pelajaran ke Toples Kawruh'.",
              "Pesan hikmahmu akan tersimpan abadi di dalam toples kaca untuk diteruskan kepada pengunjung pameran berikutnya."
            ]}
            tip="Kalimat ini merangkum filosofi Gredupedia #7 Karsa Kala: karya dan pengetahuan baru menemukan arti sejatinya saat dibagikan untuk meringankan beban sesama."
            onOpenHelp={onOpenHelp}
          />
        </div>

        {/* Visual Toples Kawruh dengan Gambar Asli toples.png */}
        <div className="toples-kawruh-visual">
          <img
            src="/background/toples.png"
            alt="Toples Kawruh Pak Ilmu"
            className="toples-official-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          {isNoteSubmitted && (
            <div style={{
              position: 'absolute',
              bottom: '18px',
              background: '#FFFDF9',
              color: 'var(--color-teal-dark)',
              border: '1.5px solid var(--color-teal)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-medium)',
              animation: 'snapInPiece 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={16} color="var(--color-teal)" />
              <span>Kawruh Berhasil Tersimpan di Toples!</span>
            </div>
          )}
        </div>

        {/* INTERAKSI WORD PUZZLE */}
        {!isNoteSubmitted ? (
          <div className="word-puzzle-assembly">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Ketuk Kata di Bawah untuk Menyusun Pesan Hikmah ({placedWords.length} / {availableTokens.length} kata):
              </span>
              {placedWords.length > 0 && (
                <button
                  onClick={handleResetWords}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  title="Kosongkan susunan kata"
                >
                  <RotateCcw size={14} />
                  Atur Ulang
                </button>
              )}
            </div>

            {/* Pool Kata */}
            <div className="word-tokens-pool">
              {availableTokens.map((token) => {
                const isPlaced = placedWords.some(t => t.id === token.id);

                return (
                  <button
                    key={token.id}
                    className={`word-token-chip ${isPlaced ? 'placed' : ''}`}
                    onClick={() => handleToggleWord(token)}
                    title={isPlaced ? 'Kata ini telah terpasang di bawah' : 'Klik untuk menambahkan kata ini'}
                  >
                    {token.text}
                  </button>
                );
              })}
            </div>

            {/* Kotak Susunan Kalimat Target */}
            <div className="word-sentence-target">
              {placedWords.length === 0 ? (
                <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  (Ketuk kata di atas secara berurutan...)
                </span>
              ) : (
                placedWords.map((token) => (
                  <div
                    key={token.id}
                    className="word-placed-pill"
                    onClick={() => handleToggleWord(token)}
                    title="Klik untuk membatalkan kata ini"
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{token.text}</span>
                    <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>✕</span>
                  </div>
                ))
              )}
            </div>

            {/* Umpan Balik Kalimat */}
            {isAllWordsPlaced && !isSentenceCorrect && (
              <div style={{
                marginTop: '12px',
                background: 'var(--color-bata-soft)',
                border: '1px solid var(--color-bata)',
                color: 'var(--color-bata-dark)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>Susunan kata belum tepat. Klik kata yang keliru untuk membatalkannya atau klik 'Atur Ulang'.</span>
              </div>
            )}

            {isSentenceCorrect && (
              <div style={{
                marginTop: '12px',
                background: 'var(--color-teal-soft)',
                border: '1px solid var(--color-teal)',
                color: 'var(--color-teal-dark)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>Kalimat Hikmah Sempurna Terangkai! Siap dimasukkan ke Toples Kawruh.</span>
              </div>
            )}

            {/* Tombol Masukkan ke Toples */}
            <div style={{ marginTop: '22px' }}>
              <button
                className="btn-primary-action"
                disabled={!isSentenceCorrect}
                onClick={handleSubmitToJar}
                style={{ padding: '14px 34px', fontSize: '1rem' }}
              >
                <span>Masukkan Pelajaran ke Toples Kawruh</span>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* TAMPILAN SETELAH KAWRUH DIMASUKKAN */
          <div style={{
            background: 'rgba(255, 255, 255, 0.96)',
            border: '2px solid var(--color-teal)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 32px',
            maxWidth: '700px',
            margin: '20px 0',
            textAlign: 'center',
            boxShadow: 'var(--shadow-elevated)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-teal-dark)',
              fontWeight: 800,
              fontSize: '0.9rem',
              marginBottom: '12px'
            }}>
              <CheckCircle2 size={20} />
              Hikmah Berhasil Diabadikan
            </div>

            <blockquote style={{
              fontSize: '1.08rem',
              fontStyle: 'italic',
              lineHeight: '1.7',
              color: 'var(--text-primary)',
              marginBottom: '24px'
            }}>
              “{EPILOGUE_DATA.reflectionMessage}”
            </blockquote>

            <button
              className="btn-primary-action"
              onClick={onCompleteEpilogue}
              style={{ padding: '14px 36px', fontSize: '1.02rem' }}
            >
              <span>Lihat Ringkasan & Piagam Pengkarya</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
