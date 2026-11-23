import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Search, Layers, FileText, Check, X, Box } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_1_VARIANTS, shuffleArray } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';
import Item3DViewer from '../components/Item3DViewer.jsx';

export default function Act1View({
  onCompleteAct,
  collectedNotes,
  setCollectedNotes,
  inspectedObjects,
  setInspectedObjects,
  onOpenHelp,
  onOpen3DGallery,
  sessionIndex = 0
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'sort'
  const [selectedObject, setSelectedObject] = useState(null);
  const [lastDiscoveredNote, setLastDiscoveredNote] = useState(null);

  const activeVariant = useMemo(() => {
    return ACT_1_VARIANTS[sessionIndex % ACT_1_VARIANTS.length];
  }, [sessionIndex]);

  const randomizedTableObjects = useMemo(() => {
    return shuffleArray(activeVariant.objects);
  }, [activeVariant]);

  const initialSortItems = useMemo(() => {
    return shuffleArray(activeVariant.objects);
  }, [activeVariant]);

  const [poolItems, setPoolItems] = useState(initialSortItems);
  const [bahanBasket, setBahanBasket] = useState([]);
  const [alatBasket, setAlatBasket] = useState([]);
  const [sortFeedback, setSortFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
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

  const placeItem = (item, targetCategory) => {
    const isCorrect = item.category === targetCategory;
    const currentAttempts = wrongAttempts[item.id] || 0;
    const targetName = targetCategory === 'bahan' ? 'Wadah Rempah' : 'Rak Peralatan';
    const correctReceptacle = item.category === 'bahan' ? 'Wadah Rempah' : 'Rak Peralatan';

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

    soundManager.playGentleWrong();
    const newAttempts = currentAttempts + 1;
    setWrongAttempts(prev => ({ ...prev, [item.id]: newAttempts }));
    setTotalMistakes(prev => prev + 1);

    if (newAttempts === 1) {
      setSortFeedback({
        type: 'warning',
        message: `Belum tepat. ${item.name} bukan untuk ${targetName}. Coba lagi!`
      });
    } else {
      setSortFeedback({
        type: 'error',
        message: `${item.name} ditempatkan ke ${correctReceptacle}.`
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
          <span className="act-zone-kicker">Zona Aku Berkarya</span>
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

      {/* ============================================================ */}
      {/* TAHAP 1: EKSPLORASI MEJA GEROBAK                             */}
      {/* ============================================================ */}
      {activeTab === 'explore' && (
        <div className="act1-view-wrap">
          {/* Panduan Utama yang Jelas, Singkat, dan Menonjol */}
          <MiniGameGuideBanner
            tag="LANGKAH 1"
            instruction="Temukan 3 sobekan resep pada benda di meja gerobak."
            hint="Ketuk benda untuk mengamati dan membaca catatannya."
            onOpenHelp={onOpenHelp}
          />

          {/* Notifikasi Temuan Sobekan Resep */}
          {lastDiscoveredNote && (
            <div className="discovery-toast-card">
              <div className="discovery-toast-text">
                <h5>Sobekan Resep Bagian #{lastDiscoveredNote.num} Ditemukan!</h5>
                <p>“{lastDiscoveredNote.text}”</p>
              </div>
              <button
                className="toast-close-mini"
                onClick={() => setLastDiscoveredNote(null)}
                aria-label="Tutup notifikasi"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="angkringan-board">
            {/* Panggung Meja Gerobak */}
            <div className="countertop-view">
              <div className="countertop-awning" />

              <div className="countertop-bar-header">
                <span className="countertop-label">Peralatan & Bahan di Meja</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="countertop-badge-status">
                    {inspectedObjects.length} dari {totalItems} diperiksa
                  </span>
                  {onOpen3DGallery && (
                    <button
                      type="button"
                      className="btn-secondary-action"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      onClick={() => onOpen3DGallery('serai')}
                      title="Buka Galeri 3D Perkakas & Rempah"
                    >
                      <Box size={13} color="var(--color-orange)" />
                      <span>Galeri 3D</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Objek Visual Meja Gerobak */}
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
                      <div className="item-image-wrapper" style={{ height: '125px', position: 'relative' }}>
                        {obj.model3d ? (
                          <Item3DViewer
                            modelPath={obj.model3d}
                            itemName={obj.name}
                            fallbackImage={obj.image}
                            height={125}
                            compact={true}
                            autoRotateSpeed={1.5}
                          />
                        ) : (
                          <img
                            src={obj.image}
                            alt={obj.name}
                            className="item-official-img"
                          />
                        )}
                      </div>
                      <div className="item-meta-footer">
                        <div className="item-title">{obj.name}</div>
                        <span className="item-tag">{obj.tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Drawer Inspeksi Benda Aktif (Ringkas & Dilengkapi Model 3D) */}
              {selectedObject && (
                <div className="inspect-drawer">
                  <div className="inspect-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={selectedObject.image}
                        alt=""
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                      <div>
                        <span className="inspect-category">{selectedObject.tag}</span>
                        <h3 className="inspect-title">{selectedObject.name}</h3>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedObject.model3d && onOpen3DGallery && (
                        <button
                          type="button"
                          className="btn-secondary-action"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                          onClick={() => onOpen3DGallery(selectedObject.id)}
                        >
                          <Box size={13} color="var(--color-orange)" />
                          <span>Perbesar 3D</span>
                        </button>
                      )}
                      <button
                        className="btn-secondary-action"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => setSelectedObject(null)}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>

                  {/* 3D Model Interaktif jika tersedia */}
                  {selectedObject.model3d && (
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <Item3DViewer
                        modelPath={selectedObject.model3d}
                        itemName={selectedObject.name}
                        fallbackImage={selectedObject.image}
                        height={250}
                      />
                    </div>
                  )}

                  <p className="inspect-clue-highlight">
                    <strong>Fungsi:</strong> {selectedObject.clue}
                  </p>
                </div>
              )}
            </div>

            {/* Panel Sobekan Resep Terkumpul */}
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
                          {note ? 'Ditemukan' : 'Mencari...'}
                        </span>
                      </div>
                      <p className="note-snippet-text">
                        {note ? `“${note.text}”` : 'Periksa benda gerobak...'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {isExploreComplete && (
                <button
                  className="btn-primary-action pulse-ready"
                  style={{
                    width: '100%',
                    marginTop: '14px',
                    justifyContent: 'center',
                    padding: '12px 18px',
                    fontSize: '0.92rem'
                  }}
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('sort');
                  }}
                >
                  <span>Lanjut ke Penataan</span>
                  <ArrowRight size={17} />
                </button>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAHAP 2: PENATAAN BAHAN REMPAH & RAK PERALATAN               */}
      {/* ============================================================ */}
      {activeTab === 'sort' && (
        <div className="act1-view-wrap">
          {/* Panduan Utama Penataan */}
          <MiniGameGuideBanner
            tag="LANGKAH 2"
            instruction="Pilah setiap benda ke Wadah Rempah atau Rak Peralatan."
            hint="Lihat bentuk 3D benda, lalu klik tombol Rempah / Peralatan di bawahnya."
            onOpenHelp={onOpenHelp}
          />

          {sortFeedback && (
            <div className={`feedback-strip ${sortFeedback.type}`}>
              {sortFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{sortFeedback.message}</span>
            </div>
          )}

          {/* Kolam Kartu yang Harus Dipilah (Menggunakan Model 3D Asli Langsung) */}
          <div className="sorting-pool-area">
            {poolItems.length === 0 ? (
              <div className="sorting-done-state">
                <CheckCircle2 size={36} color="var(--color-teal)" />
                <h4>Semua Benda Berhasil Dipilah!</h4>
                <p>Seluruh bahan rempah dan peralatan telah tertata rapi di posisinya.</p>
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
                    >
                      {/* Render Model 3D Interaktif Langsung pada Kartu */}
                      <div className="sort-thumb-box" style={{ height: '135px', position: 'relative' }}>
                        <Item3DViewer
                          modelPath={item.model3d}
                          itemName={item.name}
                          fallbackImage={item.image}
                          height={135}
                          compact={true}
                          autoRotateSpeed={1.8}
                        />
                      </div>

                      <div className="sort-card-title">{item.name}</div>

                      <div className="sort-action-btns">
                        <button
                          className="sort-pick-btn bahan"
                          onClick={() => placeItem(item, 'bahan')}
                          title="Pilah ke Wadah Rempah"
                        >
                          + Rempah
                        </button>
                        <button
                          className="sort-pick-btn alat"
                          onClick={() => placeItem(item, 'alat')}
                          title="Pilah ke Rak Peralatan"
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

          {/* Dua Dropzone Sasaran */}
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
                  <span className="dropzone-placeholder">Tempatkan bahan rempah di sini...</span>
                ) : (
                  bahanBasket.map((item) => (
                    <div key={item.id} className="sorted-chip">
                      <span className="chip-badge-tag">Rempah</span>
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
                  <span className="dropzone-placeholder">Tempatkan peralatan di sini...</span>
                ) : (
                  alatBasket.map((item) => (
                    <div key={item.id} className="sorted-chip">
                      <span className="chip-badge-tag alat">Alat</span>
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

      {/* Footer Navigasi Babak */}
      <div className="action-footer-bar">
        <div className="footer-progress-note">
          Sobekan: {collectedNotes.length}/3 • Benda Tertata: {sortedCount}/{totalItems}
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
