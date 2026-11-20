import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Search, Layers, FileText, Check, X } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_1_VARIANTS, shuffleArray } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act1View({
  onCompleteAct,
  collectedNotes,
  setCollectedNotes,
  inspectedObjects,
  setInspectedObjects,
  onOpenHelp,
  sessionIndex = 0
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'sort'
  const [selectedObject, setSelectedObject] = useState(null);
  const [lastDiscoveredNote, setLastDiscoveredNote] = useState(null);

  const activeVariant = useMemo(() => {
    return ACT_1_VARIANTS[sessionIndex % ACT_1_VARIANTS.length];
  }, [sessionIndex]);

  // Acak tampilan meja gerobak sambil tetap menjaga ID unik & catatan asli tiap objek
  const randomizedTableObjects = useMemo(() => {
    return shuffleArray(activeVariant.objects);
  }, [activeVariant]);

  // Sumber daftar sortir 100% sama dengan objek yang ada di Meja Gerobak (Bagian 1)
  const initialSortItems = useMemo(() => {
    return shuffleArray(activeVariant.objects);
  }, [activeVariant]);

  const [poolItems, setPoolItems] = useState(initialSortItems);
  const [bahanBasket, setBahanBasket] = useState([]);
  const [alatBasket, setAlatBasket] = useState([]);
  const [sortFeedback, setSortFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Sistem 2 kesempatan per item & pencatatan total kesalahan evaluasi
  const [wrongAttempts, setWrongAttempts] = useState({});
  const [totalMistakes, setTotalMistakes] = useState(0);

  useEffect(() => {
    setPoolItems(initialSortItems);
    setBahanBasket([]);
    setAlatBasket([]);
    setSortFeedback(null);
    setWrongAttempts({});
    setTotalMistakes(0);
    setSelectedObject(null);
    setLastDiscoveredNote(null);
  }, [initialSortItems]);

  const handleInspectObject = (obj) => {
    soundManager.playClickSound();
    setSelectedObject(obj);

    if (!inspectedObjects.some(o => o.id === obj.id)) {
      setInspectedObjects(prev => [...prev, obj]);
    }

    // Validasi catatan tersembunyi menggunakan ID objek & ID note unik
    if (obj.hasHiddenNote && obj.noteId) {
      if (!collectedNotes.some(n => n.id === obj.noteId)) {
        const matchedNote = activeVariant.hiddenNotes.find(
          n => n.id === obj.noteId && n.objectId === obj.id
        ) || activeVariant.hiddenNotes.find(n => n.id === obj.noteId);

        if (matchedNote) {
          soundManager.playPaperRustle();
          soundManager.playPlaceSuccess();
          setCollectedNotes(prev => [...prev, matchedNote]);
          setLastDiscoveredNote(matchedNote);
        }
      }
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDropTo = (targetCategory) => {
    if (!draggedItem) return;
    placeItem(draggedItem, targetCategory);
    setDraggedItem(null);
  };

  // Validasi jawaban berdasarkan kategori objek dari ID sumber inventaris tunggal
  const placeItem = (item, targetCategory) => {
    const isCorrect = item.category === targetCategory;
    const currentAttempts = wrongAttempts[item.id] || 0;
    const targetName = targetCategory === 'bahan' ? 'Wadah Rempah' : 'Rak Peralatan';
    const correctReceptacle = item.category === 'bahan' ? 'Wadah Rempah' : 'Rak Peralatan';
    const correctCategoryLabel = item.category === 'bahan' ? 'Bahan Rempah' : 'Peralatan';
    const cleanHint = (item.hint || '').replace(/\.+$/, '');

    if (isCorrect) {
      soundManager.playPlaceSuccess();
      setSortFeedback({
        type: 'success',
        message: `Tepat! ${item.name} masuk ke ${targetName}.`
      });

      setPoolItems(prev => prev.filter(i => i.id !== item.id));
      if (targetCategory === 'bahan') {
        setBahanBasket(prev => [...prev, item]);
      } else {
        setAlatBasket(prev => [...prev, item]);
      }
      return;
    }

    // Jawaban salah: catat kesalahan, beri 1 kesempatan mencoba kembali
    soundManager.playGentleWrong();
    const newAttempts = currentAttempts + 1;
    setWrongAttempts(prev => ({ ...prev, [item.id]: newAttempts }));
    setTotalMistakes(prev => prev + 1);

    if (newAttempts === 1) {
      setSortFeedback({
        type: 'warning',
        message: `Belum tepat. ${item.name} — perhatikan cirinya: ${cleanHint}. Coba sekali lagi!`
      });
    } else {
      // Percobaan ke-2 salah: jelaskan jawaban tepat lalu bantu lanjutkan permainan
      setSortFeedback({
        type: 'error',
        message: `${item.name} termasuk kategori ${correctCategoryLabel} (${cleanHint}), sehingga diletakkan di ${correctReceptacle}. Sudah dibantu ditempatkan agar bisa lanjut.`
      });

      setPoolItems(prev => prev.filter(i => i.id !== item.id));
      if (item.category === 'bahan') {
        setBahanBasket(prev => [...prev, item]);
      } else {
        setAlatBasket(prev => [...prev, item]);
      }
    }
  };

  const totalItems = activeVariant.objects.length;
  const sortedCount = totalItems - poolItems.length;
  const isSortingComplete = poolItems.length === 0;
  const isExploreComplete = inspectedObjects.length >= 4 && collectedNotes.length === 3;
  const isAct1Ready = isExploreComplete && isSortingComplete;

  return (
    <div className="game-content-area">
      {/* Header Ringkas Babak 1 */}
      <div className="act-header-banner">
        <div>
          <span className="act-zone-kicker">Zona Aku Berkarya • {activeVariant.name}</span>
          <h2 className="act-main-title">Babak 1: Pesanan Pertama</h2>
        </div>

        <div className="act-subtabs">
          <button
            className={`subtab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('explore');
            }}
          >
            <Search size={16} />
            <span>1. Meja Gerobak ({inspectedObjects.length}/{totalItems})</span>
            {collectedNotes.length === 3 && <Check size={14} />}
          </button>

          <button
            className={`subtab-btn ${activeTab === 'sort' ? 'active' : ''} ${isExploreComplete && !isSortingComplete ? 'pulse-ready' : ''}`}
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('sort');
            }}
          >
            <Layers size={16} />
            <span>2. Penataan ({sortedCount}/{totalItems})</span>
            {isSortingComplete && <Check size={14} />}
          </button>
        </div>
      </div>

      {/* BAGIAN 1: EKSPLORASI MEJA GEROBAK */}
      {activeTab === 'explore' && (
        <div>
          <MiniGameGuideBanner
            tag="Langkah 1"
            title="Periksa benda di meja gerobak untuk menemukan 3 sobekan resep."
            steps={[
              "Ketuk benda di gerobak memakai mouse atau tombol Tab + Enter / Spasi.",
              "Temukan 3 sobekan catatan resep lalu lanjut ke tab 2. Penataan."
            ]}
            tip="Daftar benda di gerobak inilah yang akan kamu tata di langkah berikutnya."
            onOpenHelp={onOpenHelp}
          />

          {lastDiscoveredNote && (
            <div className="discovery-toast-card">
              <div className="discovery-toast-text">
                <h5>Sobekan Resep #{lastDiscoveredNote.num} Ditemukan ({lastDiscoveredNote.foundAt})</h5>
                <p>“{lastDiscoveredNote.text}”</p>
              </div>
              <button className="toast-close-mini" onClick={() => setLastDiscoveredNote(null)} aria-label="Tutup pesan">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="angkringan-board">
            {/* Panggung Meja Gerobak Kayu */}
            <div className="countertop-view">
              <div className="countertop-awning" />

              <div className="countertop-bar-header">
                <span className="countertop-label">Meja Gerobak Pak Ilmu</span>
                <div className="kbd-hint-group" aria-label="Pintasan Keyboard">
                  <span>Navigasi:</span>
                  <kbd className="kbd-key">Tab</kbd>
                  <kbd className="kbd-key">Enter</kbd>
                  <span>/</span>
                  <kbd className="kbd-key">Spasi</kbd>
                </div>
              </div>

              <div className="counter-grid-objects grid-4x2">
                {randomizedTableObjects.map((obj) => {
                  const isInspected = inspectedObjects.some(o => o.id === obj.id);

                  return (
                    <div
                      key={obj.id}
                      className={`interactive-item-card ${isInspected ? 'inspected' : ''}`}
                      onClick={() => handleInspectObject(obj)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleInspectObject(obj);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${obj.name}${isInspected ? ', sudah diperiksa' : ''}`}
                    >
                      <div className="item-image-wrapper">
                        <img
                          src={obj.image}
                          alt={obj.name}
                          className="item-official-img"
                        />
                      </div>
                      <div className="item-meta-footer">
                        <div className="item-title">{obj.name}</div>
                        <span className="item-tag">{obj.tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Inspeksi Benda Aktif */}
              {selectedObject && (
                <div className="inspect-drawer">
                  <div className="inspect-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={selectedObject.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      <div>
                        <span className="inspect-category">{selectedObject.tag}</span>
                        <h3 className="inspect-title">{selectedObject.name}</h3>
                      </div>
                    </div>
                    <button
                      className="btn-secondary-action"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      onClick={() => setSelectedObject(null)}
                    >
                      Tutup
                    </button>
                  </div>

                  <p className="inspect-body">{selectedObject.desc}</p>
                  <p className="inspect-clue-inline">
                    <strong>Fungsi:</strong> {selectedObject.clue}
                  </p>
                </div>
              )}
            </div>

            {/* Panel Kanan: Sobekan Resep Terkumpul */}
            <aside className="notes-tracker-panel">
              <div className="notes-panel-head">
                <FileText size={18} color="var(--color-orange)" />
                <h4>Sobekan Resep ({collectedNotes.length}/3)</h4>
              </div>

              <div className="collected-notes-list">
                {[1, 2, 3].map((num) => {
                  const note = collectedNotes.find(n => n.id === `note-${num}`);

                  return (
                    <div key={num} className={`note-snippet-card ${note ? 'found' : 'empty'}`}>
                      <div className="note-snippet-header">
                        <span className="note-num-label">Bagian #{num}</span>
                        <span className={`note-status-pill ${note ? 'done' : 'pending'}`}>
                          {note ? note.foundAt : 'Belum Ditemukan'}
                        </span>
                      </div>
                      <p className="note-snippet-text">
                        {note ? `“${note.text}”` : 'Periksa benda di gerobak...'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {isExploreComplete && (
                <button
                  className="btn-primary-action"
                  style={{ width: '100%', marginTop: '14px', justifyContent: 'center', padding: '11px 16px', fontSize: '0.88rem' }}
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('sort');
                  }}
                >
                  <span>Lanjut ke Penataan</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* BAGIAN 2: PENATAAN BAHAN REMPAH & RAK PERALATAN */}
      {activeTab === 'sort' && (
        <div>
          <MiniGameGuideBanner
            tag="Langkah 2"
            title="Kelompokkan benda gerobak ke Wadah Rempah atau Rak Peralatan."
            steps={[
              "Tarik kartu atau tekan '+ Rempah' / '+ Peralatan' (atau tombol angka 1 / 2).",
              "Kamu punya 2 kesempatan per benda jika keliru."
            ]}
            tip={`Terdaftar ${totalMistakes} kesalahan saat berlatih.`}
            onOpenHelp={onOpenHelp}
          />

          {sortFeedback && (
            <div className={`feedback-strip ${sortFeedback.type}`}>
              {sortFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{sortFeedback.message}</span>
            </div>
          )}

          {/* Area Kartu yang Akan Dikelompokkan */}
          <div className="sorting-pool-area">
            {poolItems.length === 0 ? (
              <div className="sorting-done-state">
                <CheckCircle2 size={28} color="var(--color-teal)" />
                <span>Semua {totalItems} benda sudah tertata di tempatnya!</span>
                {totalMistakes > 0 && (
                  <small>Catatan evaluasi: {totalMistakes} percobaan salah telah diperbaiki.</small>
                )}
              </div>
            ) : (
              <div className="sort-cards-grid">
                {poolItems.map((item) => {
                  const attempts = wrongAttempts[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      className={`sort-item-card ${attempts === 1 ? 'has-warning' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === '1' || e.key.toLowerCase() === 'r') placeItem(item, 'bahan');
                        if (e.key === '2' || e.key.toLowerCase() === 'p') placeItem(item, 'alat');
                      }}
                    >
                      {attempts === 1 && (
                        <span className="retry-chance-tag">Kesempatan 2</span>
                      )}

                      <div className="sort-thumb-box">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="sort-card-title">{item.name}</div>

                      <div className="sort-action-btns">
                        <button
                          className="sort-pick-btn bahan"
                          onClick={() => placeItem(item, 'bahan')}
                        >
                          + Rempah
                        </button>
                        <button
                          className="sort-pick-btn alat"
                          onClick={() => placeItem(item, 'alat')}
                        >
                          + Peralatan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2 Area Penempatan: Wadah Rempah & Rak Peralatan */}
          <div className="dropzone-grid">
            <div
              className="dropzone-box zone-bahan"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropTo('bahan')}
            >
              <div className="dropzone-header">
                <span className="zone-dot bahan" />
                <h4>Wadah Rempah ({bahanBasket.length})</h4>
              </div>
              <div className="dropzone-items-list">
                {bahanBasket.length === 0 ? (
                  <span className="dropzone-placeholder">Letakkan bahan rempah di sini...</span>
                ) : (
                  bahanBasket.map((item) => (
                    <div key={item.id} className="sorted-chip">
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                      <Check size={14} color="var(--color-teal)" style={{ marginLeft: 'auto' }} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="dropzone-box zone-alat"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropTo('alat')}
            >
              <div className="dropzone-header">
                <span className="zone-dot alat" />
                <h4>Rak Peralatan ({alatBasket.length})</h4>
              </div>
              <div className="dropzone-items-list">
                {alatBasket.length === 0 ? (
                  <span className="dropzone-placeholder">Letakkan peralatan angkringan di sini...</span>
                ) : (
                  alatBasket.map((item) => (
                    <div key={item.id} className="sorted-chip">
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                      <Check size={14} color="var(--color-teal)" style={{ marginLeft: 'auto' }} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Aksi */}
      <div className="action-footer-bar">
        <div className="footer-progress-note">
          Benda diperiksa: {inspectedObjects.length}/4 • Sobekan resep: {collectedNotes.length}/3 • Penataan: {sortedCount}/{totalItems}
          {totalMistakes > 0 ? ` • Kesalahan tercatat: ${totalMistakes}` : ''}
        </div>

        <button
          className="btn-primary-action"
          disabled={!isAct1Ready}
          onClick={() => {
            soundManager.playActCompletion();
            onCompleteAct();
          }}
        >
          <span>Lanjut ke Babak 2</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
