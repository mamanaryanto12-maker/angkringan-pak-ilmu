import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle, Puzzle, ListOrdered, GitCompare, ArrowUp, ArrowDown, Lightbulb, Compass, Check } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_2_DATA } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act2View({ onCompleteAct, gameMode, onOpenHelp }) {
  const [subTab, setSubTab] = useState('puzzle'); // 'puzzle' | 'sequence' | 'matching'
  
  // State 1: Jigsaw Puzzle (4 slot)
  const [placedPieces, setPlacedPieces] = useState([null, null, null, null]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState(null);

  // State 2: Sequencing (Urutan Seduh)
  const [sequenceOrder, setSequenceOrder] = useState([
    ACT_2_DATA.sequenceSteps[2], // Step 3
    ACT_2_DATA.sequenceSteps[0], // Step 1
    ACT_2_DATA.sequenceSteps[3], // Step 4
    ACT_2_DATA.sequenceSteps[1], // Step 2
  ]);
  const [seqFeedback, setSeqFeedback] = useState(null);

  // State 3: Matching Pairs
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchFeedback, setMatchFeedback] = useState(null);

  // Jigsaw Handlers
  const handleSelectPiece = (piece) => {
    soundManager.playClickSound();
    setSelectedPiece(piece);
    setPuzzleFeedback(null);
  };

  const handlePlacePieceInSlot = (slotIdx) => {
    if (!selectedPiece) {
      setPuzzleFeedback({
        type: 'info',
        message: 'Pilih salah satu sobekan resep di kolom kiri terlebih dahulu sebelum mengeklik slot.'
      });
      return;
    }

    if (selectedPiece.slot === slotIdx) {
      soundManager.playPlaceSuccess();
      const updated = [...placedPieces];
      updated[slotIdx] = selectedPiece;
      setPlacedPieces(updated);
      setSelectedPiece(null);
      setPuzzleFeedback({
        type: 'success',
        message: `Kepingan ${slotIdx + 1} pas terpasang pada bingkai naskah!`
      });
    } else {
      soundManager.playClickSound();
      setPuzzleFeedback({
        type: 'error',
        message: `Sobekan ini belum pas pada Slot ${slotIdx + 1}. Perhatikan alur teks resep dari membakar jahe (1), mememarkan sereh (2), menyeduh air panas (3), hingga mengaduk gula aren (4).`
      });
    }
  };

  const isPuzzleComplete = placedPieces.every(p => p !== null);

  // Sequencing Handlers
  const moveSequenceItem = (idx, direction) => {
    soundManager.playClickSound();
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sequenceOrder.length) return;

    const updated = [...sequenceOrder];
    const temp = updated[idx];
    updated[idx] = updated[newIdx];
    updated[newIdx] = temp;
    setSequenceOrder(updated);

    const isCorrect = updated.every((step, i) => step.correctOrder === i + 1);
    if (isCorrect) {
      soundManager.playPlaceSuccess();
      setSeqFeedback({
        type: 'success',
        message: 'Luar biasa! Seluruh 4 tahapan peracikan wedang telah tersusun runtut dari empati mendengarkan hingga menyajikan.'
      });
    } else {
      setSeqFeedback(null);
    }
  };

  const isSequenceComplete = sequenceOrder.every((step, i) => step.correctOrder === i + 1);

  // Matching Handlers
  const handleSelectCondition = (item) => {
    soundManager.playClickSound();
    setSelectedCondition(item);
    setMatchFeedback(null);
  };

  const handleSelectRemedy = (item) => {
    if (!selectedCondition) {
      soundManager.playClickSound();
      setMatchFeedback({
        type: 'info',
        message: 'Pilih keluhan di kolom kiri (Kondisi & Keluhan) terlebih dahulu sebelum memilih racikan.'
      });
      return;
    }

    if (selectedCondition.id === item.id) {
      soundManager.playPlaceSuccess();
      setMatchedPairs(prev => [...prev, item.id]);
      setSelectedCondition(null);
      setMatchFeedback({
        type: 'success',
        message: `Tepat sekali! ${item.explanation}`
      });
    } else {
      soundManager.playClickSound();
      setMatchFeedback({
        type: 'error',
        message: 'Kombinasi rempah tersebut belum tepat untuk meredakan keluhan ini. Telaah kembali khasiat rimpangnya.'
      });
    }
  };

  const isMatchingComplete = matchedPairs.length === ACT_2_DATA.matchingPairs.length;
  const completedChallengesCount = (isPuzzleComplete ? 1 : 0) + (isSequenceComplete ? 1 : 0) + (isMatchingComplete ? 1 : 0);
  const isAct2Ready = isPuzzleComplete && isSequenceComplete && isMatchingComplete;

  return (
    <div className="game-content-area">
      {/* Header Babak */}
      <div className="act-header-banner">
        <div>
          <div className="act-subtitle">
            <Sparkles size={14} />
            Zona {ACT_2_DATA.zone} {gameMode === 'duo' && '• Diskusi Bersama'}
          </div>
          <h2 className="act-main-title">{ACT_2_DATA.title}</h2>
        </div>

        {/* Status Ringkas Sub-Misi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { soundManager.playClickSound(); setSubTab('puzzle'); }}
            style={{
              background: isPuzzleComplete ? 'var(--color-teal-soft)' : (subTab === 'puzzle' ? 'var(--color-gold-soft)' : '#FFF'),
              border: `1.5px solid ${isPuzzleComplete ? 'var(--color-teal)' : (subTab === 'puzzle' ? 'var(--color-gold-deep)' : 'var(--border-strong)')}`,
              color: isPuzzleComplete ? 'var(--color-teal-dark)' : 'var(--text-primary)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isPuzzleComplete ? <Check size={13} color="var(--color-teal)" /> : <span>1.</span>}
            Puzzle: {isPuzzleComplete ? 'Selesai ✓' : 'Belum'}
          </button>

          <button
            onClick={() => { soundManager.playClickSound(); setSubTab('sequence'); }}
            style={{
              background: isSequenceComplete ? 'var(--color-teal-soft)' : (subTab === 'sequence' ? 'var(--color-gold-soft)' : '#FFF'),
              border: `1.5px solid ${isSequenceComplete ? 'var(--color-teal)' : (subTab === 'sequence' ? 'var(--color-gold-deep)' : 'var(--border-strong)')}`,
              color: isSequenceComplete ? 'var(--color-teal-dark)' : 'var(--text-primary)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isSequenceComplete ? <Check size={13} color="var(--color-teal)" /> : <span>2.</span>}
            Urutan Seduh: {isSequenceComplete ? 'Selesai ✓' : 'Belum'}
          </button>

          <button
            onClick={() => { soundManager.playClickSound(); setSubTab('matching'); }}
            style={{
              background: isMatchingComplete ? 'var(--color-teal-soft)' : (subTab === 'matching' ? 'var(--color-gold-soft)' : '#FFF'),
              border: `1.5px solid ${isMatchingComplete ? 'var(--color-teal)' : (subTab === 'matching' ? 'var(--color-gold-deep)' : 'var(--border-strong)')}`,
              color: isMatchingComplete ? 'var(--color-teal-dark)' : 'var(--text-primary)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isMatchingComplete ? <Check size={13} color="var(--color-teal)" /> : <span>3.</span>}
            Khasiat: {matchedPairs.length} / 3 {isMatchingComplete && '✓'}
          </button>
        </div>
      </div>

      {/* Navigasi 3 Sub-Tantangan */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            soundManager.playClickSound();
            setSubTab('puzzle');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'puzzle' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${subTab === 'puzzle' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
            color: subTab === 'puzzle' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'puzzle' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <Puzzle size={17} />
          <span>1. Jigsaw Resep Kuno {isPuzzleComplete && '✓'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClickSound();
            setSubTab('sequence');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'sequence' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${subTab === 'sequence' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
            color: subTab === 'sequence' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'sequence' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <ListOrdered size={17} />
          <span>2. Urutan Seduh {isSequenceComplete && '✓'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClickSound();
            setSubTab('matching');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'matching' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${subTab === 'matching' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
            color: subTab === 'matching' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'matching' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <GitCompare size={17} />
          <span>3. Khasiat & Raga ({matchedPairs.length} / 3) {isMatchingComplete && '✓'}</span>
        </button>
      </div>

      {/* TANTANGAN 1: JIGSAW PUZZLE RESEP KUNO */}
      {subTab === 'puzzle' && (
        <div>
          <MiniGameGuideBanner
            tag="Tantangan 1 • Jigsaw Resep Kuno"
            title="Cara Menyusun Kertas Resep Kuno Pak Ilmu"
            steps={[
              "Pilih salah satu sobekan resep di panel kiri (klik kepingan hingga berwarna oranye).",
              "Klik slot kosong pada bingkai kanan (Slot 1 sampai 4) sesuai alur teks resep kuno.",
              "Susun keempat kepingan hingga seluruh formula Wedang Uwuh Luhur terbaca utuh dan bermakna."
            ]}
            tip="Kepingan 1 bercerita tentang jahe bakar, kepingan 2 tentang sereh dan cengkeh, kepingan 3 tentang guyuran air mendidih, dan kepingan 4 tentang adukan gula aren."
            onOpenHelp={onOpenHelp}
          />

          {puzzleFeedback && (
            <div style={{
              background: puzzleFeedback.type === 'success' ? 'var(--color-teal-soft)' : (puzzleFeedback.type === 'info' ? 'var(--color-gold-soft)' : 'var(--color-bata-soft)'),
              borderLeft: `4px solid ${puzzleFeedback.type === 'success' ? 'var(--color-teal)' : (puzzleFeedback.type === 'info' ? 'var(--color-gold-deep)' : 'var(--color-bata)')}`,
              padding: '12px 18px',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.88rem',
              color: puzzleFeedback.type === 'success' ? 'var(--color-teal-dark)' : (puzzleFeedback.type === 'info' ? '#8C6505' : 'var(--color-bata-dark)'),
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              {puzzleFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{puzzleFeedback.message}</span>
            </div>
          )}

          <div className="puzzle-assembly-arena">
            {/* Pool Kepingan Resep */}
            <div className="puzzle-pieces-pool">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-orange)', textTransform: 'uppercase' }}>
                  Kepingan Sobekan Resep:
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {placedPieces.filter(Boolean).length} / 4 Terpasang
                </span>
              </div>

              {ACT_2_DATA.puzzlePieces.map((piece) => {
                const isPlaced = placedPieces.some(p => p && p.id === piece.id);
                const isSelected = selectedPiece && selectedPiece.id === piece.id;

                if (isPlaced) {
                  return (
                    <div
                      key={piece.id}
                      style={{
                        background: 'var(--bg-parchment)',
                        border: '1.5px dashed var(--border-strong)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-teal-dark)',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      ✓ {piece.title} Telah Terpasang di Bingkai
                    </div>
                  );
                }

                return (
                  <div
                    key={piece.id}
                    className={`puzzle-piece-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPiece(piece)}
                    style={{ position: 'relative' }}
                  >
                    {!isSelected && (
                      <div className="interactive-cue-badge" style={{ fontSize: '0.66rem' }}>
                        👆 Klik Kepingan
                      </div>
                    )}
                    <span className="piece-slot-indicator">{piece.title}</span>
                    <p className="piece-text">“{piece.text}”</p>
                    <span style={{ fontSize: '0.74rem', color: isSelected ? 'var(--color-orange)' : 'var(--color-teal-dark)', fontWeight: 800 }}>
                      {isSelected ? '👉 Sekarang Klik Slot Kosong di Kanan' : 'Klik untuk Memilih'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Target Papan Bingkai 4 Slot */}
            <div className="puzzle-target-board">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>
                  Bingkai Naskah Resep Kuno (4 Bagian):
                </span>
                {isPuzzleComplete && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-teal)', fontWeight: 800 }}>
                    Naskah Utuh Terbaca ✓
                  </span>
                )}
              </div>

              {[0, 1, 2, 3].map((slotIdx) => {
                const placed = placedPieces[slotIdx];
                const isReadyToPlace = !placed && selectedPiece !== null;

                return (
                  <div
                    key={slotIdx}
                    className={`puzzle-slot ${placed ? 'filled' : 'slot-ready'} ${isReadyToPlace ? 'slot-highlight-pulse' : ''}`}
                    onClick={() => handlePlacePieceInSlot(slotIdx)}
                    style={{ position: 'relative' }}
                  >
                    {placed ? (
                      <div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-teal)', fontWeight: 800, textTransform: 'uppercase' }}>
                          Bagian {slotIdx + 1} ✓
                        </span>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5', marginTop: '4px', fontStyle: 'italic' }}>
                          “{placed.text}”
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '0.8rem', color: isReadyToPlace ? 'var(--color-gold-deep)' : 'var(--text-muted)', fontWeight: 800 }}>
                          Slot Bagian #{slotIdx + 1}
                        </span>
                        <p style={{ fontSize: '0.78rem', color: isReadyToPlace ? 'var(--color-orange)' : 'var(--text-muted)', marginTop: '4px', fontWeight: isReadyToPlace ? 700 : 500 }}>
                          {selectedPiece ? '👉 Klik untuk Merekatkan Kepingan ke Sini' : 'Pilih kepingan di kiri terlebih dahulu'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigasi Sukses Jigsaw */}
          {isPuzzleComplete && (
            <div className="discovery-toast-card" style={{ marginTop: '20px' }}>
              <div className="discovery-toast-text">
                <h5>Naskah Resep Berhasil Direkonstruksi!</h5>
                <p>Formula Wedang Uwuh Luhur telah terbaca secara utuh. Lanjutkan ke langkah berikutnya untuk menyusun urutan peracikan.</p>
              </div>
              <button
                className="btn-primary-action"
                style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                onClick={() => {
                  soundManager.playClickSound();
                  setSubTab('sequence');
                }}
              >
                <span>Lanjut ke Tantangan 2: Urutan Seduh</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TANTANGAN 2: SEQUENCING URUTAN PROSES SEDUH */}
      {subTab === 'sequence' && (
        <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}>
          <MiniGameGuideBanner
            tag="Tantangan 2 • Urutan Seduh"
            title="Cara Menyusun 4 Tahapan Peracikan Wedang"
            steps={[
              "Perhatikan 4 kartu tahapan peracikan di bawah yang posisinya masih acak.",
              "Klik tombol panah ke atas (▲) atau ke bawah (▼) untuk memindahkan urutan kartu.",
              "Urutkan secara kronologis: (1) Mendengarkan keluhan, (2) Mememarkan jahe & sereh, (3) Mengguyur air mendidih, (4) Melarutkan gula aren & menyajikan."
            ]}
            tip="Pak Ilmu selalu mengajarkan: empati mendengarkan harus mendahului tindakan menyentuh rempah."
            onOpenHelp={onOpenHelp}
          />

          {seqFeedback && (
            <div style={{
              background: 'var(--color-teal-soft)',
              borderLeft: '4px solid var(--color-teal)',
              padding: '12px 18px',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.9rem',
              color: 'var(--color-teal-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={18} />
              <span>{seqFeedback.message}</span>
            </div>
          )}

          <div className="sequencing-list">
            {sequenceOrder.map((step, idx) => {
              const isStepCorrect = step.correctOrder === idx + 1;

              return (
                <div key={step.id} className="sequence-card" style={{
                  border: isStepCorrect ? '2px solid var(--color-teal)' : '1.5px solid var(--border-natural)',
                  background: isStepCorrect ? '#FAFCFB' : '#FFF'
                }}>
                  <div
                    className="sequence-badge"
                    style={{
                      background: isStepCorrect ? 'var(--color-teal)' : '#D0C4B0',
                      color: isStepCorrect ? '#FFF' : 'var(--text-primary)'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="sequence-desc">
                    {step.text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isStepCorrect && (
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                        Posisi Tepat ✓
                      </span>
                    )}
                    <div className="sequence-controls">
                      <button
                        className="seq-btn"
                        disabled={idx === 0}
                        onClick={() => moveSequenceItem(idx, -1)}
                        title="Pindahkan Ke Atas"
                        aria-label="Pindahkan langkah ini ke atas"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        className="seq-btn"
                        disabled={idx === sequenceOrder.length - 1}
                        onClick={() => moveSequenceItem(idx, 1)}
                        title="Pindahkan Ke Bawah"
                        aria-label="Pindahkan langkah ini ke bawah"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigasi Sukses Urutan Seduh */}
          {isSequenceComplete && (
            <div className="discovery-toast-card" style={{ marginTop: '20px' }}>
              <div className="discovery-toast-text">
                <h5>Urutan Peracikan Telah Selaras!</h5>
                <p>Tahapan seduh wedang tradisional telah tersusun kronologis. Saatnya mencocokkan ramuan rempah dengan kondisi raga.</p>
              </div>
              <button
                className="btn-primary-action"
                style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                onClick={() => {
                  soundManager.playClickSound();
                  setSubTab('matching');
                }}
              >
                <span>Lanjut ke Tantangan 3: Khasiat & Raga</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TANTANGAN 3: MATCHING PAIRS */}
      {subTab === 'matching' && (
        <div>
          <MiniGameGuideBanner
            tag="Tantangan 3 • Khasiat & Raga"
            title="Cara Mencocokkan Kondisi Jiwa & Raga dengan Rempah"
            steps={[
              "Pilih salah satu kartu kondisi/keluhan di kolom kiri (Kondisi Jiwa atau Raga).",
              "Pilih racikan rempah penyembuh yang tepat di kolom kanan.",
              "Ulangi hingga ketiga pasangan keluhan dan khasiat rempah terhubung dengan benar."
            ]}
            tip="Jahe emprit mengatasi hawa dingin di tulang, cengkeh & sereh menenangkan pikiran lelah, dan gula aren memulihkan tenaga fisik."
            onOpenHelp={onOpenHelp}
          />

          {matchFeedback && (
            <div style={{
              background: matchFeedback.type === 'success' ? 'var(--color-teal-soft)' : (matchFeedback.type === 'info' ? 'var(--color-gold-soft)' : 'var(--color-bata-soft)'),
              borderLeft: `4px solid ${matchFeedback.type === 'success' ? 'var(--color-teal)' : (matchFeedback.type === 'info' ? 'var(--color-gold-deep)' : 'var(--color-bata)')}`,
              padding: '12px 18px',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.9rem',
              color: matchFeedback.type === 'success' ? 'var(--color-teal-dark)' : (matchFeedback.type === 'info' ? '#8C6505' : 'var(--color-bata-dark)'),
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              {matchFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{matchFeedback.message}</span>
            </div>
          )}

          <div className="matching-board">
            {/* Kolom Kiri: Kondisi Penikmat */}
            <div className="match-column">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--color-orange)', fontWeight: 800 }}>
                  1. Pilih Kondisi Jiwa atau Raga:
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {matchedPairs.length} / 3 Terhubung
                </span>
              </div>

              {ACT_2_DATA.matchingPairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedCondition && selectedCondition.id === pair.id;

                return (
                  <div
                    key={pair.id}
                    className={`match-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isMatched && handleSelectCondition(pair)}
                    style={{ position: 'relative' }}
                  >
                    {!isMatched && !isSelected && (
                      <div className="interactive-cue-badge" style={{ fontSize: '0.66rem' }}>
                        👆 Klik Keluhan
                      </div>
                    )}
                    <strong>{pair.condition}</strong>
                    {isMatched ? (
                      <span style={{ display: 'block', marginTop: '6px', fontSize: '0.78rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                        ✓ Khasiat Berhasil Dicocokkan
                      </span>
                    ) : (
                      <span style={{ display: 'block', marginTop: '4px', fontSize: '0.74rem', color: isSelected ? 'var(--color-orange)' : 'var(--text-muted)' }}>
                        {isSelected ? '👉 Sekarang pilih ramuan di kanan' : 'Klik untuk memilih kondisi ini'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Kolom Kanan: Racikan Rempah */}
            <div className="match-column">
              <span style={{ fontSize: '0.84rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                2. Pasangkan dengan Racikan Rempah:
              </span>
              {ACT_2_DATA.matchingPairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);

                return (
                  <div
                    key={pair.id}
                    className={`match-card ${isMatched ? 'matched' : ''}`}
                    onClick={() => !isMatched && handleSelectRemedy(pair)}
                    style={{
                      border: selectedCondition && !isMatched ? '1.5px dashed var(--color-teal)' : undefined,
                      cursor: isMatched ? 'default' : 'pointer'
                    }}
                  >
                    <span>{pair.remedy}</span>
                    {isMatched ? (
                      <span style={{ display: 'block', marginTop: '6px', fontSize: '0.78rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                        ✓ Khasiat Cocok Sempurna
                      </span>
                    ) : (
                      selectedCondition && (
                        <span style={{ display: 'block', marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-teal-dark)', fontWeight: 700 }}>
                          👉 Klik jika ini ramuan yang tepat
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifikasi Selesai Khasiat */}
          {isMatchingComplete && (
            <div className="discovery-toast-card" style={{ marginTop: '20px' }}>
              <div className="discovery-toast-text">
                <h5>Semua Pasangan Khasiat Rempah Telah Tepat!</h5>
                <p>Kamu telah memahami keterkaitan antara keluhan raga dengan saripati tanaman herbal Nusantara.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Aksi Navigasi Babak */}
      <div className="action-footer-bar">
        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Progres Babak 2: {completedChallengesCount} dari 3 tantangan selesai. {isAct2Ready ? 'Semua tantangan tuntas!' : 'Selesaikan seluruh tantangan untuk lanjut.'}
        </div>

        <button
          className="btn-primary-action"
          disabled={!isAct2Ready}
          onClick={() => {
            soundManager.playActCompletion();
            onCompleteAct();
          }}
        >
          <span>Lanjut ke Babak 3: Untuk Siapa Racikan Ini?</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
