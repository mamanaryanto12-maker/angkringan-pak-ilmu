import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Puzzle, ListOrdered, GitCompare, RotateCcw, Check, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_2_PUZZLE_VARIANTS, ACT_2_SEQUENCE_VARIANTS, MATCHING_PAIRS_POOL, shuffleArray, derangeSequence } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';
import RecipeManuscriptModal from '../components/RecipeManuscriptModal.jsx';

const SLOT_METADATA = [
  { title: 'Bagian 1 • Pembuka', hint: 'Niat & bahan awal', icon: '/assets/tools/naskah_pembuka.svg', color: 'var(--color-orange)' },
  { title: 'Bagian 2 • Isi 1', hint: 'Memarkan rempah', icon: '/assets/tools/naskah_isi.svg', color: 'var(--color-teal-dark)' },
  { title: 'Bagian 3 • Isi 2', hint: 'Seduh air mendidih', icon: '/assets/tools/naskah_isi.svg', color: 'var(--color-teal-dark)' },
  { title: 'Bagian 4 • Penutup', hint: 'Aduk & sajikan hangat', icon: '/assets/tools/naskah_penutup.svg', color: 'var(--color-bata)' }
];

const SEQ_SLOT_LABELS = ['Langkah 1', 'Langkah 2', 'Langkah 3', 'Langkah 4'];

export default function Act2View({ onCompleteAct, onOpenHelp, onSubStepChange, sessionIndex = 0 }) {
  const [subTab, setSubTab] = useState('puzzle'); // 'puzzle' | 'sequence' | 'matching'
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false);

  useEffect(() => {
    if (onSubStepChange) onSubStepChange(`act2:${subTab}`);
  }, [subTab, onSubStepChange]);

  // 1. PUZZLE NASKAH
  const activePuzzle = useMemo(() => {
    return ACT_2_PUZZLE_VARIANTS[sessionIndex % ACT_2_PUZZLE_VARIANTS.length];
  }, [sessionIndex]);

  const initialShuffledPieces = useMemo(() => {
    const pieces = shuffleArray(activePuzzle.pieces);
    if (pieces[0].slot === 0 && pieces.length > 1) {
      [pieces[0], pieces[1]] = [pieces[1], pieces[0]];
    }
    return pieces;
  }, [activePuzzle]);

  const [placedPieces, setPlacedPieces] = useState([null, null, null, null]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState(null);

  useEffect(() => {
    setPlacedPieces([null, null, null, null]);
    setSelectedPiece(null);
    setPuzzleFeedback(null);
    setIsManuscriptModalOpen(false);
  }, [activePuzzle]);

  // 2. URUTAN SEDUH (Alur Visual 4 Slot Berurutan — 1 Klik per Langkah)
  const activeSequence = ACT_2_SEQUENCE_VARIANTS[0];
  const shuffledSeqPool = useMemo(() => derangeSequence(activeSequence.steps), [activeSequence, sessionIndex]);
  const [placedSeq, setPlacedSeq] = useState([]); // array of placed step objects in order 1..4
  const [wrongSeqId, setWrongSeqId] = useState(null);
  const [seqFeedback, setSeqFeedback] = useState(null);

  useEffect(() => {
    setPlacedSeq([]);
    setWrongSeqId(null);
    setSeqFeedback(null);
  }, [sessionIndex]);

  // 3. KHASIAT & RAGA
  const selectedPairs = useMemo(() => {
    const startIdx = (sessionIndex * 2) % MATCHING_PAIRS_POOL.length;
    return [
      MATCHING_PAIRS_POOL[startIdx % MATCHING_PAIRS_POOL.length],
      MATCHING_PAIRS_POOL[(startIdx + 1) % MATCHING_PAIRS_POOL.length],
      MATCHING_PAIRS_POOL[(startIdx + 2) % MATCHING_PAIRS_POOL.length]
    ];
  }, [sessionIndex]);

  const shuffledConditions = useMemo(() => shuffleArray(selectedPairs), [selectedPairs]);
  const shuffledRemedies = useMemo(() => shuffleArray(selectedPairs), [selectedPairs]);

  const [selectedCondition, setSelectedCondition] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchFeedback, setMatchFeedback] = useState(null);

  useEffect(() => {
    setSelectedCondition(null);
    setMatchedPairs([]);
    setMatchFeedback(null);
  }, [selectedPairs]);

  // Handlers Puzzle
  const handleSelectPiece = (piece) => {
    soundManager.playClickSound();
    setSelectedPiece(piece);
    setPuzzleFeedback(null);
  };

  const handlePlacePieceInSlot = (slotIdx) => {
    if (placedPieces[slotIdx]) return;
    if (!selectedPiece) {
      setPuzzleFeedback({
        type: 'info',
        message: 'Pilih kepingan naskah di panel kiri terlebih dahulu.'
      });
      return;
    }

    if (selectedPiece.slot === slotIdx) {
      soundManager.playPlaceSuccess();
      const updated = [...placedPieces];
      updated[slotIdx] = selectedPiece;
      setPlacedPieces(updated);
      setSelectedPiece(null);

      if (updated.every(Boolean)) {
        setPuzzleFeedback({
          type: 'success',
          message: 'Naskah resep kuno berhasil disusun lengkap.'
        });
        setTimeout(() => setIsManuscriptModalOpen(true), 420);
      } else {
        setPuzzleFeedback({
          type: 'success',
          message: `Bagian ${slotIdx + 1} (${SLOT_METADATA[slotIdx].title.split('•')[1].trim()}) tepat terpasang.`
        });
      }
    } else {
      soundManager.playGentleWrong();
      setPuzzleFeedback({
        type: 'error',
        message: `Belum pas pada Bagian ${slotIdx + 1} (${SLOT_METADATA[slotIdx].hint}). Perhatikan tanda elipsis (...) penyambung kalimat.`
      });
    }
  };

  const isPuzzleComplete = placedPieces.every(Boolean);

  // Handlers Sequence (Klik kartu langkah yang sesuai urutan aktif)
  const nextSeqOrder = placedSeq.length + 1;
  const isSequenceComplete = placedSeq.length === activeSequence.steps.length;

  const handlePickSequenceStep = (step) => {
    if (isSequenceComplete || placedSeq.some(s => s.id === step.id)) return;

    if (step.correctOrder === nextSeqOrder) {
      soundManager.playPlaceSuccess();
      const updated = [...placedSeq, step];
      setPlacedSeq(updated);
      setWrongSeqId(null);

      if (updated.length === activeSequence.steps.length) {
        setSeqFeedback({
          type: 'success',
          message: 'Urutan seduh lengkap! Wedang siap diracik.'
        });
      } else {
        setSeqFeedback({
          type: 'success',
          message: `Tepat! Langkah ${nextSeqOrder}: ${step.label}.`
        });
      }
    } else {
      soundManager.playGentleWrong();
      setWrongSeqId(step.id);
      const expected = activeSequence.steps.find(s => s.correctOrder === nextSeqOrder);
      setSeqFeedback({
        type: 'error',
        message: `Belum pas untuk Langkah ${nextSeqOrder}. ${expected ? expected.wrongHint : 'Coba pilih langkah lain.'}`
      });
      setTimeout(() => setWrongSeqId(null), 650);
    }
  };

  const handleResetSequence = () => {
    soundManager.playClickSound();
    setPlacedSeq([]);
    setWrongSeqId(null);
    setSeqFeedback(null);
  };

  // Handlers Matching
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
        message: 'Pilih salah satu kondisi di kolom kiri dahulu.'
      });
      return;
    }

    if (selectedCondition.id === item.id) {
      soundManager.playPlaceSuccess();
      setMatchedPairs(prev => [...prev, item.id]);
      setSelectedCondition(null);
      setMatchFeedback({
        type: 'success',
        message: `Cocok! ${item.explanation}`
      });
    } else {
      soundManager.playGentleWrong();
      setMatchFeedback({
        type: 'error',
        message: 'Belum sesuai dengan kondisi yang dipilih. Coba perhatikan sifat hangat atau aroma rempah lainnya.'
      });
    }
  };

  const isMatchingComplete = matchedPairs.length === selectedPairs.length;
  const completedCount = (isPuzzleComplete ? 1 : 0) + (isSequenceComplete ? 1 : 0) + (isMatchingComplete ? 1 : 0);
  const isAct2Ready = isPuzzleComplete && isSequenceComplete && isMatchingComplete;

  return (
    <div className="game-content-area">
      {/* Header Babak 2 */}
      <div className="act-header-banner">
        <div>
          <span className="act-zone-kicker">Zona Kita Berkarya • {activePuzzle.title}</span>
          <h2 className="act-main-title">Babak 2: Resep yang Hilang</h2>
        </div>

        <div className="act-subtabs">
          <button
            className={`subtab-btn ${subTab === 'puzzle' ? 'active' : ''}`}
            onClick={() => { soundManager.playClickSound(); setSubTab('puzzle'); }}
          >
            <Puzzle size={16} />
            <span>1. Puzzle Naskah</span>
            {isPuzzleComplete && <Check size={14} />}
          </button>

          <button
            className={`subtab-btn ${subTab === 'sequence' ? 'active' : ''}`}
            onClick={() => { soundManager.playClickSound(); setSubTab('sequence'); }}
          >
            <ListOrdered size={16} />
            <span>2. Urutan Seduh</span>
            {isSequenceComplete && <Check size={14} />}
          </button>

          <button
            className={`subtab-btn ${subTab === 'matching' ? 'active' : ''}`}
            onClick={() => { soundManager.playClickSound(); setSubTab('matching'); }}
          >
            <GitCompare size={16} />
            <span>3. Khasiat Rempah ({matchedPairs.length}/{selectedPairs.length})</span>
            {isMatchingComplete && <Check size={14} />}
          </button>
        </div>
      </div>

      {/* SUBBABAK 1: PUZZLE NASKAH RESEP */}
      {subTab === 'puzzle' && (
        <div key="puzzle" className="subview-enter">
          <MiniGameGuideBanner
            tag="TANTANGAN 1"
            instruction="Susun 4 kepingan naskah resep wedang sesuai urutannya."
            hint="Pilih kepingan di kiri lalu pasang ke bingkai di kanan."
            onOpenHelp={onOpenHelp}
          />

          {puzzleFeedback && (
            <div className={`feedback-strip ${puzzleFeedback.type}`}>
              {puzzleFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{puzzleFeedback.message}</span>
            </div>
          )}

          <div className="puzzle-assembly-arena">
            {/* Panel Kiri: Kepingan Acak */}
            <div className="puzzle-panel">
              <div className="puzzle-panel-header">
                <span className="panel-title-kicker orange">Kepingan Naskah ({placedPieces.filter(Boolean).length}/4)</span>
                <span className="panel-hint-mini">Klik untuk memilih</span>
              </div>

              <div className="puzzle-pieces-grid">
                {initialShuffledPieces.map((piece) => {
                  const isPlaced = placedPieces.some(p => p && p.id === piece.id);
                  const isSelected = selectedPiece && selectedPiece.id === piece.id;

                  if (isPlaced) {
                    return (
                      <div key={piece.id} className="puzzle-piece-placed-placeholder">
                        <Check size={15} color="var(--color-teal)" />
                        <span>{piece.structureRole} Terpasang</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={piece.id}
                      className={`puzzle-piece-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectPiece(piece)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectPiece(piece);
                        }
                      }}
                    >
                      <div className="piece-top-row">
                        <span className="piece-role-chip">{piece.structureRole}</span>
                        {isSelected && <span className="piece-selected-tag">Dipilih</span>}
                      </div>
                      <p className="piece-text">“{piece.text}”</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel Kanan: Bingkai Target 4 Slot */}
            <div className="puzzle-panel">
              <div className="puzzle-panel-header">
                <span className="panel-title-kicker teal">Bingkai Naskah Utuh</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPuzzleComplete && (
                    <>
                      <button
                        className="btn-read-manuscript"
                        onClick={() => {
                          soundManager.playPaperRustle();
                          setIsManuscriptModalOpen(true);
                        }}
                      >
                        <BookOpen size={14} />
                        <span>Naskah Utuh</span>
                      </button>
                      <button
                        className="btn-primary-action pulse-ready"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => {
                          soundManager.playClickSound();
                          setSubTab('sequence');
                        }}
                      >
                        <span>Ke Urutan Seduh</span>
                        <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="puzzle-slots-grid">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const placed = placedPieces[slotIdx];
                  const isReady = !placed && selectedPiece !== null;
                  const meta = SLOT_METADATA[slotIdx];

                  return (
                    <div
                      key={slotIdx}
                      className={`puzzle-slot ${placed ? 'filled' : ''} ${isReady ? 'slot-ready' : ''}`}
                      onClick={() => handlePlacePieceInSlot(slotIdx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePlacePieceInSlot(slotIdx);
                        }
                      }}
                    >
                      <div className="slot-header-meta">
                        <img src={meta.icon} alt="" className="slot-icon-img" />
                        <div>
                          <div className="slot-title" style={{ color: meta.color }}>{meta.title}</div>
                          <div className="slot-subtitle">{meta.hint}</div>
                        </div>
                      </div>

                      {placed ? (
                        <p className="slot-filled-text">“{placed.text}”</p>
                      ) : (
                        <div className="slot-empty-prompt">
                          {isReady ? 'Klik untuk memasang di sini' : 'Slot kosong'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBBABAK 2: URUTAN SEDUH (ALUR VISUAL 4 LANGKAH — 1 KLIK PER TAHAP) */}
      {subTab === 'sequence' && (
        <div key="sequence" className="brew-flow-wrapper subview-enter">
          <MiniGameGuideBanner
            tag="TANTANGAN 2"
            instruction={
              isSequenceComplete
                ? 'Urutan seduh sudah lengkap! Lanjut ke Khasiat Rempah.'
                : `Pilih kartu di bawah untuk mengisi Langkah ${nextSeqOrder} dari 4.`
            }
            hint="Susun proses dari awal menyapa tamu hingga menyajikan wedang hangat."
            onOpenHelp={onOpenHelp}
          />

          {seqFeedback && (
            <div className={`feedback-strip ${seqFeedback.type}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {seqFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{seqFeedback.message}</span>
              </div>
              {isSequenceComplete && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-secondary-action"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={handleResetSequence}
                  >
                    <RotateCcw size={13} />
                    <span>Ulangi</span>
                  </button>
                  <button
                    className="btn-primary-action pulse-ready"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      soundManager.playClickSound();
                      setSubTab('matching');
                    }}
                  >
                    <span>Ke Khasiat Rempah</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bagian Atas: 4 Slot Alur Penyeduhan (1 -> 2 -> 3 -> 4) */}
          <div className="brew-timeline-grid">
            {SEQ_SLOT_LABELS.map((slotLabel, idx) => {
              const placed = placedSeq[idx];
              const isCurrentTarget = !isSequenceComplete && idx === placedSeq.length;

              return (
                <div
                  key={slotLabel}
                  className={`brew-slot-card ${placed ? 'filled' : ''} ${isCurrentTarget ? 'active-target' : ''}`}
                >
                  <div className="brew-slot-head">
                    <span className={`brew-slot-num ${placed ? 'done' : isCurrentTarget ? 'active' : ''}`}>
                      {placed ? <Check size={14} /> : idx + 1}
                    </span>
                    <span className="brew-slot-label">{slotLabel}</span>
                  </div>

                  {placed ? (
                    <div className="brew-slot-filled-body">
                      <img src={placed.image} alt={placed.label} className="brew-slot-img" />
                      <strong>{placed.label}</strong>
                      <span className="brew-tool-chip">{placed.toolTag}</span>
                    </div>
                  ) : (
                    <div className="brew-slot-empty-body">
                      <span>{isCurrentTarget ? `Klik kartu Langkah ${idx + 1}` : 'Menunggu urutan'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bagian Bawah: Pilihan Kartu Tahapan yang Belum Dipasang */}
          {!isSequenceComplete && (
            <div className="brew-pool-panel">
              <div className="brew-pool-header">
                <span className="panel-title-kicker orange">Pilihan Tahapan Seduh</span>
                <span className="panel-hint-mini">Klik kartu untuk Langkah {nextSeqOrder}</span>
              </div>

              <div className="brew-choices-grid">
                {shuffledSeqPool.map((step) => {
                  const isUsed = placedSeq.some(s => s.id === step.id);
                  const isWrong = wrongSeqId === step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      disabled={isUsed}
                      className={`brew-choice-card ${isUsed ? 'used' : ''} ${isWrong ? 'wrong-shake' : ''}`}
                      onClick={() => handlePickSequenceStep(step)}
                    >
                      <div className="brew-choice-thumb">
                        <img src={step.image} alt={step.label} />
                      </div>
                      <div className="brew-choice-info">
                        <span className="brew-tool-chip">{step.toolTag}</span>
                        <strong>{step.label}</strong>
                        <p>{step.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBBABAK 3: KHASIAT & RAGA (REMPAH ASLI NUSANTARA) */}
      {subTab === 'matching' && (
        <div key="matching" className="subview-enter">
          <MiniGameGuideBanner
            tag="TANTANGAN 3"
            instruction="Pasangkan kondisi pengunjung dengan bahan rempah yang tepat."
            hint="Pilih kondisi di sisi kiri, lalu ketuk rempah yang cocok di sisi kanan."
            onOpenHelp={onOpenHelp}
          />

          {matchFeedback && (
            <div className={`feedback-strip ${matchFeedback.type}`}>
              {matchFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{matchFeedback.message}</span>
            </div>
          )}

          <div className="matching-board">
            <div className="match-column">
              <div className="match-col-title orange">1. Kondisi Pengunjung ({matchedPairs.length}/{selectedPairs.length})</div>

              {shuffledConditions.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedCondition && selectedCondition.id === pair.id;

                return (
                  <div
                    key={pair.id}
                    className={`match-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isMatched && handleSelectCondition(pair)}
                    role="button"
                    tabIndex={isMatched ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isMatched && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSelectCondition(pair);
                      }
                    }}
                  >
                    <div className="match-card-content">
                      <strong>{pair.condition}</strong>
                      <span className="match-card-sub">
                        {isMatched ? 'Pasangan cocok' : (isSelected ? 'Pilih rempah cocok di kanan' : 'Klik untuk memilih')}
                      </span>
                    </div>
                    {isMatched && <CheckCircle2 size={18} color="var(--color-teal)" />}
                  </div>
                );
              })}
            </div>

            <div className="match-column">
              <div className="match-col-title teal">2. Bahan Rempah Nusantara</div>

              {shuffledRemedies.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);

                return (
                  <div
                    key={pair.id}
                    className={`match-card remedy-card ${isMatched ? 'matched' : ''} ${selectedCondition && !isMatched ? 'target-ready' : ''}`}
                    onClick={() => !isMatched && handleSelectRemedy(pair)}
                    role="button"
                    tabIndex={isMatched ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isMatched && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSelectRemedy(pair);
                      }
                    }}
                  >
                    <div className="remedy-thumb">
                      <img src={pair.spiceImage} alt={pair.remedy} />
                    </div>
                    <div className="match-card-content">
                      <strong>{pair.remedy}</strong>
                      <span className="match-card-sub">
                        {isMatched ? pair.explanation : (selectedCondition ? 'Klik untuk memasangkan' : 'Tentukan kondisi dahulu')}
                      </span>
                    </div>
                    {isMatched && <CheckCircle2 size={18} color="var(--color-teal)" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Babak 2 */}
      <div className="action-footer-bar">
        <div className="footer-progress-note">
          Progres Babak 2: {completedCount}/3 tantangan selesai.
        </div>

        <button
          className="btn-primary-action"
          disabled={!isAct2Ready}
          onClick={() => {
            soundManager.playActCompletion();
            onCompleteAct();
          }}
        >
          <span>Lanjut ke Babak 3</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <RecipeManuscriptModal
        isOpen={isManuscriptModalOpen}
        onClose={() => setIsManuscriptModalOpen(false)}
        puzzleData={activePuzzle}
        onContinueToSequence={() => {
          setIsManuscriptModalOpen(false);
          setSubTab('sequence');
        }}
      />
    </div>
  );
}
