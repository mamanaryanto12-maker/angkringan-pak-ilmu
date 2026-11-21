import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Puzzle, ListOrdered, GitCompare, ArrowUp, ArrowDown, Check, BookOpen } from 'lucide-react';
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

export default function Act2View({ onCompleteAct, onOpenHelp, sessionIndex = 0 }) {
  const [subTab, setSubTab] = useState('puzzle'); // 'puzzle' | 'sequence' | 'matching'
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false);

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

  // 2. URUTAN SEDUH
  const activeSequence = ACT_2_SEQUENCE_VARIANTS[0];
  const [sequenceOrder, setSequenceOrder] = useState(() => derangeSequence(activeSequence.steps));
  const [seqFeedback, setSeqFeedback] = useState(null);

  useEffect(() => {
    setSequenceOrder(derangeSequence(activeSequence.steps));
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

  // Handlers Sequence
  const moveSequenceItem = (idx, direction) => {
    soundManager.playClickSound();
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sequenceOrder.length) return;

    const updated = [...sequenceOrder];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setSequenceOrder(updated);

    if (updated.every((step, i) => step.correctOrder === i + 1)) {
      soundManager.playPlaceSuccess();
      setSeqFeedback({
        type: 'success',
        message: 'Urutan seduh dari mendengar tamu hingga menyajikan hangat telah runtut.'
      });
    } else {
      setSeqFeedback(null);
    }
  };

  const isSequenceComplete = sequenceOrder.every((step, i) => step.correctOrder === i + 1);

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
        <div>
          <MiniGameGuideBanner
            tag="TANTANGAN 1"
            instruction="Susun 4 kepingan naskah resep wedang jahe sesuai urutannya."
            hint="Pilih kepingan di panel kiri, lalu pasang pada bingkai naskah di kanan."
            onOpenHelp={onOpenHelp}
          />

          {/* Ilustrasi Visual Struktur 3 Bagian Naskah (Contoh Ringkas) */}
          <div className="structure-visual-strip">
            <div className="structure-step-badge">
              <img src="/assets/tools/naskah_pembuka.svg" alt="" />
              <div>
                <strong>Pembuka</strong>
                <span>Sapa tamu & pilih rimpang awal</span>
              </div>
            </div>
            <div className="structure-arrow">→</div>
            <div className="structure-step-badge">
              <img src="/assets/tools/naskah_isi.svg" alt="" />
              <div>
                <strong>Isi</strong>
                <span>Memar rempah & tuang air didih</span>
              </div>
            </div>
            <div className="structure-arrow">→</div>
            <div className="structure-step-badge">
              <img src="/assets/tools/naskah_penutup.svg" alt="" />
              <div>
                <strong>Penutup</strong>
                <span>Aduk gula aren & sajikan hangat</span>
              </div>
            </div>
          </div>

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
                <span className="panel-title-kicker orange">Kepingan Sobekan ({placedPieces.filter(Boolean).length}/4)</span>
                <span className="panel-hint-mini">Klik kepingan untuk memilih</span>
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
                <span className="panel-title-kicker teal">Bingkai Naskah Utuh (4 Bagian)</span>
                {isPuzzleComplete && (
                  <button
                    className="btn-read-manuscript"
                    onClick={() => {
                      soundManager.playPaperRustle();
                      setIsManuscriptModalOpen(true);
                    }}
                  >
                    <BookOpen size={14} />
                    <span>Buka Naskah Utuh</span>
                  </button>
                )}
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
                          {isReady ? 'Klik untuk meletakkan kepingan di sini' : 'Slot kosong'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isPuzzleComplete && (
            <div className="discovery-toast-card" style={{ marginTop: '18px' }}>
              <div className="discovery-toast-text">
                <h5>Naskah Lengkap Terangkai</h5>
                <p>Kamu siap melanjutkan ke tantangan urutan penyeduhan.</p>
              </div>
              <button
                className="btn-primary-action"
                style={{ padding: '9px 18px', fontSize: '0.86rem' }}
                onClick={() => {
                  soundManager.playClickSound();
                  setSubTab('sequence');
                }}
              >
                <span>Lanjut: 2. Urutan Seduh</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBBABAK 2: URUTAN SEDUH (DENGAN ILUSTRASI TAHAPAN JELAS) */}
      {subTab === 'sequence' && (
        <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}>
          <MiniGameGuideBanner
            tag="TANTANGAN 2"
            instruction="Urutkan 4 langkah meracik wedang dari awal hingga siap disajikan."
            hint="Gunakan tombol panah naik atau turun pada setiap kartu langkah."
            onOpenHelp={onOpenHelp}
          />

          {seqFeedback && (
            <div className="feedback-strip success">
              <CheckCircle2 size={18} />
              <span>{seqFeedback.message}</span>
            </div>
          )}

          <div className="sequencing-list">
            {sequenceOrder.map((step, idx) => {
              const isStepCorrect = step.correctOrder === idx + 1;

              return (
                <div key={step.id} className={`sequence-card ${isStepCorrect ? 'is-aligned' : ''}`}>
                  <div className="sequence-badge">{idx + 1}</div>

                  <div className="sequence-visual-thumb">
                    <img src={step.image} alt={step.label} />
                  </div>

                  <div className="sequence-body">
                    <div className="sequence-step-label">
                      Tahap {idx + 1} • {step.label}
                      {isStepCorrect && <Check size={14} color="var(--color-teal)" />}
                    </div>
                    <p className="sequence-step-text">{step.text}</p>
                  </div>

                  <div className="sequence-controls">
                    <button
                      className="seq-btn"
                      disabled={idx === 0}
                      onClick={() => moveSequenceItem(idx, -1)}
                      title="Naikkan urutan"
                      aria-label={`Naikkan ${step.label}`}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="seq-btn"
                      disabled={idx === sequenceOrder.length - 1}
                      onClick={() => moveSequenceItem(idx, 1)}
                      title="Turunkan urutan"
                      aria-label={`Turunkan ${step.label}`}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {isSequenceComplete && (
            <div className="discovery-toast-card" style={{ marginTop: '18px' }}>
              <div className="discovery-toast-text">
                <h5>Urutan Seduh Runtut</h5>
                <p>Lanjutkan ke tahap mengenali sifat dan kehangatan setiap rempah.</p>
              </div>
              <button
                className="btn-primary-action"
                style={{ padding: '9px 18px', fontSize: '0.86rem' }}
                onClick={() => {
                  soundManager.playClickSound();
                  setSubTab('matching');
                }}
              >
                <span>Lanjut: 3. Khasiat Rempah</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBBABAK 3: KHASIAT & RAGA (HANYA REMPAH ASLI DI INVENTORY) */}
      {subTab === 'matching' && (
        <div>
          <MiniGameGuideBanner
            tag="TANTANGAN 3"
            instruction="Cocokkan kondisi raga pengunjung dengan khasiat rempah yang tepat."
            hint="Pilih kondisi di sisi kiri, lalu pilih rempah penawarnya di sisi kanan."
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
                        {isMatched ? 'Pasangan cocok' : (isSelected ? 'Pilih rempah cocok di kanan →' : 'Klik untuk memilih')}
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
