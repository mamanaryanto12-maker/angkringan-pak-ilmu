import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle, Search, Layers, Lightbulb, Compass, FileText, Check, X } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_1_VARIANTS, SORT_ITEMS_POOL, shuffleArray } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act1View({
  onCompleteAct,
  collectedNotes,
  setCollectedNotes,
  inspectedObjects,
  setInspectedObjects,
  onOpenTicket,
  onOpenHelp,
  sessionIndex = 0
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'sort'
  const [selectedObject, setSelectedObject] = useState(null);
  const [lastDiscoveredNote, setLastDiscoveredNote] = useState(null);

  // Ambil varian objek dan catatan sesuai sesi aktif
  const activeVariant = useMemo(() => {
    return ACT_1_VARIANTS[sessionIndex % ACT_1_VARIANTS.length];
  }, [sessionIndex]);

  // Siapkan 6 item sortir dinamis (3 bahan, 3 alat) berdasarkan sesi
  const initialSortItems = useMemo(() => {
    const bahanPool = SORT_ITEMS_POOL.filter(i => i.category === 'bahan');
    const alatPool = SORT_ITEMS_POOL.filter(i => i.category === 'alat');
    const bStart = (sessionIndex * 2) % bahanPool.length;
    const aStart = (sessionIndex * 2) % alatPool.length;
    const pickedBahan = [
      bahanPool[bStart % bahanPool.length],
      bahanPool[(bStart + 1) % bahanPool.length],
      bahanPool[(bStart + 2) % bahanPool.length]
    ];
    const pickedAlat = [
      alatPool[aStart % alatPool.length],
      alatPool[(aStart + 1) % alatPool.length],
      alatPool[(aStart + 2) % alatPool.length]
    ];
    return shuffleArray([...pickedBahan, ...pickedAlat]);
  }, [sessionIndex]);

  // State untuk Sorting Game
  const [poolItems, setPoolItems] = useState(initialSortItems);
  const [bahanBasket, setBahanBasket] = useState([]);
  const [alatBasket, setAlatBasket] = useState([]);
  const [sortFeedback, setSortFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Reset item pool jika sesi berubah
  useEffect(() => {
    setPoolItems(initialSortItems);
    setBahanBasket([]);
    setAlatBasket([]);
    setSortFeedback(null);
  }, [initialSortItems]);

  // Klik objek interaktif di gerobak
  const handleInspectObject = (obj) => {
    soundManager.playClickSound();
    setSelectedObject(obj);

    // Tambahkan ke daftar inspeksi jika belum
    if (!inspectedObjects.some(o => o.id === obj.id)) {
      setInspectedObjects(prev => [...prev, obj]);
    }

    // Cek apakah ada sobekan catatan tersembunyi di objek ini
    if (obj.hasHiddenNote && obj.noteId) {
      checkFindNote(obj.noteId);
    }
  };

  const checkFindNote = (noteId) => {
    if (!collectedNotes.some(n => n.id === noteId)) {
      const noteToFind = activeVariant.hiddenNotes.find(n => n.id === noteId);
      if (noteToFind) {
        soundManager.playPaperRustle();
        soundManager.playPlaceSuccess();
        setCollectedNotes(prev => [...prev, noteToFind]);
        setLastDiscoveredNote(noteToFind);
      }
    }
  };

  // Drag and drop handlers
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
    if (item.category === targetCategory) {
      soundManager.playPlaceSuccess();
      setSortFeedback({
        type: 'success',
        message: `Tepat sekali: '${item.name}' berhasil ditempatkan di wadah ${targetCategory === 'bahan' ? 'Rempah Alami' : 'Piranti Seduh'}.`
      });

      setPoolItems(prev => prev.filter(i => i.id !== item.id));
      if (targetCategory === 'bahan') {
        setBahanBasket(prev => [...prev, item]);
      } else {
        setAlatBasket(prev => [...prev, item]);
      }
    } else {
      soundManager.playClickSound();
      setSortFeedback({
        type: 'error',
        message: `Kurang tepat: '${item.name}' bukan termasuk kelompok ${targetCategory === 'bahan' ? 'Rempah Alami' : 'Piranti Seduh'}. Cermati fungsinya: ${item.hint}.`
      });
    }
  };

  const isSortingComplete = poolItems.length === 0;
  const isExploreComplete = inspectedObjects.length >= 4 && collectedNotes.length === 3;
  const isAct1Ready = inspectedObjects.length >= 4 && isSortingComplete && collectedNotes.length === 3;

  return (
    <div className="game-content-area">
      {/* Header Babak */}
      <div className="act-header-banner">
        <div>
          <div className="act-subtitle">
            <Sparkles size={14} />
            Zona Aku Berkarya • Variasi Sesi {sessionIndex + 1} ({activeVariant.name})
          </div>
          <h2 className="act-main-title">Babak 1: Pesanan Pertama</h2>
        </div>

        {/* Status Ringkas Checklist */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: inspectedObjects.length >= 4 ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${inspectedObjects.length >= 4 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: inspectedObjects.length >= 4 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {inspectedObjects.length >= 4 && <Check size={13} color="var(--color-teal)" />}
            Benda: {inspectedObjects.length} / 6
          </span>

          <span style={{
            background: collectedNotes.length === 3 ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${collectedNotes.length === 3 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: collectedNotes.length === 3 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {collectedNotes.length === 3 && <Check size={13} color="var(--color-teal)" />}
            Catatan: {collectedNotes.length} / 3
          </span>

          <span style={{
            background: isSortingComplete ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${isSortingComplete ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: isSortingComplete ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {isSortingComplete && <Check size={13} color="var(--color-teal)" />}
            Penataan: {6 - poolItems.length} / 6
          </span>
        </div>
      </div>

      {/* Navigasi Sub-Tab Babak 1 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            soundManager.playClickSound();
            setActiveTab('explore');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'explore' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${activeTab === 'explore' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
            color: activeTab === 'explore' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'explore' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <Search size={17} />
          <span>1. Eksplorasi Meja Gerobak ({inspectedObjects.length} / {activeVariant.objects.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClickSound();
            setActiveTab('sort');
          }}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'sort' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${activeTab === 'sort' ? 'var(--color-teal-dark)' : (isExploreComplete ? 'var(--color-gold-deep)' : 'var(--border-strong)')}`,
            color: activeTab === 'sort' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'sort' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <Layers size={17} />
          <span>2. Penataan Bahan & Piranti ({6 - poolItems.length} / 6)</span>
          {isExploreComplete && !isSortingComplete && (
            <span style={{ background: 'var(--color-gold)', color: '#000', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
              Lanjut ke Sini
            </span>
          )}
        </button>
      </div>

      {/* TAMPILAN 1: EKSPLORASI GEROBAK */}
      {activeTab === 'explore' && (
        <div>
          <MiniGameGuideBanner
            title="Cara Bermain: Eksplorasi Benda di Meja Gerobak"
            tag="Aktivitas 1: Pengamatan & Penemuan"
            steps={[
              "Ketuk setiap benda di atas meja gerobak untuk mengamati fungsi dan ciri fisiknya.",
              "Perhatikan tanda centang hijau yang muncul setelah benda berhasil diperiksa.",
              "Temukan 3 sobekan resep kuno Pak Ilmu yang terselip di antara benda-benda gerobak.",
              "Setelah minimal 4 benda diperiksa dan 3 catatan ditemukan, lanjutkan ke tab '2. Penataan Bahan & Piranti'."
            ]}
            tip="Benda di atas gerobak yang belum diperiksa memiliki penanda 'Periksa Objek'. Ketuk untuk membaca keterangannya."
            onOpenHelp={onOpenHelp}
          />

          {/* Toast Notifikasi Penemuan Catatan Terbaru */}
          {lastDiscoveredNote && (
            <div className="discovery-toast-card">
              <div className="discovery-toast-text">
                <h5>Sobekan Resep Baru Ditemukan ({collectedNotes.length} / 3 Terkumpul)</h5>
                <p>“{lastDiscoveredNote.text}” — <em>Tersimpan otomatis ke Jurnal Kawruh.</em></p>
              </div>
              <button
                onClick={() => setLastDiscoveredNote(null)}
                style={{
                  background: 'var(--bg-parchment)',
                  border: '1px solid var(--border-strong)',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Tutup</span>
                <X size={13} />
              </button>
            </div>
          )}

          <div className="angkringan-board" style={{ marginTop: '14px' }}>
            <div className="countertop-view">
              <div className="countertop-awning" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                  MEJA GEROBAK ANGKRINGAN PAK ILMU ({activeVariant.name.toUpperCase()})
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ketuk setiap benda untuk memeriksa ciri dan menemukan petunjuk rahasia
                </span>
              </div>

              {/* Grid 6 Objek dengan Visual Cues Bersih Tanpa Emoji */}
              <div className="counter-grid-objects">
                {activeVariant.objects.map((obj) => {
                  const isInspected = inspectedObjects.some(o => o.id === obj.id);

                  return (
                    <div
                      key={obj.id}
                      className={`interactive-item-card ${isInspected ? 'inspected' : ''}`}
                      onClick={() => handleInspectObject(obj)}
                      role="button"
                      tabIndex={0}
                      title={`Klik untuk memeriksa ${obj.name}`}
                    >
                      {!isInspected && (
                        <div className="interactive-cue-badge">
                          <Search size={11} />
                          <span>Periksa Objek</span>
                        </div>
                      )}

                      <div className="item-image-wrapper">
                        <img
                          src={obj.image}
                          alt={obj.name}
                          className="item-official-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <div className="item-title">{obj.name}</div>
                        <span className="item-tag">{obj.tag}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Hasil Pemeriksaan Objek */}
              {selectedObject ? (
                <div className="inspect-drawer" style={{ display: 'block' }}>
                  <div className="inspect-header">
                    <div>
                      <span className="inspect-category">{selectedObject.tag}</span>
                      <h3 className="inspect-title">{selectedObject.name}</h3>
                    </div>
                    <button
                      className="btn-secondary-action"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={() => setSelectedObject(null)}
                    >
                      Tutup Penjelasan
                    </button>
                  </div>

                  <p className="inspect-body">{selectedObject.desc}</p>

                  <div className="inspect-clue-box">
                    <span className="inspect-clue-label">Kearifan Seduhan Pak Ilmu:</span>
                    <p style={{ fontStyle: 'italic', margin: 0 }}>“{selectedObject.clue}”</p>
                  </div>

                  {selectedObject.hasHiddenNote && (
                    <div style={{
                      marginTop: '12px',
                      background: 'var(--color-teal-soft)',
                      border: '1px solid var(--color-teal)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      color: 'var(--color-teal-dark)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle2 size={16} />
                      <span>Catatan Resep Rahasia telah tercatat ke dalam Jurnal Kawruh!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg-parchment)',
                  border: '1.5px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '24px',
                  textAlign: 'center',
                  marginTop: '16px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Pilih salah satu benda di atas meja gerobak untuk membaca fungsi dan petunjuk rahasianya.
                </div>
              )}
            </div>

            {/* Panel Sisi: Panduan Catatan Terkumpul */}
            <div className="notes-tracker-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={20} color="var(--color-orange)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Sobekan Resep ({collectedNotes.length} / 3)
                </h4>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                Pak Ilmu menyelipkan 3 serpihan naskah resep rahasia di antara piranti gerobak. Temukan ketiganya untuk merangkai resep di Babak 2.
              </p>

              <div className="collected-notes-list">
                {[1, 2, 3].map((num) => {
                  const note = collectedNotes[num - 1];

                  return (
                    <div key={num} className={`note-snippet-card ${note ? 'found' : 'empty'}`}>
                      <div className="note-snippet-header">
                        <span>Serpihan Resep #{num}</span>
                        <span>{note ? 'Telah Ditemukan' : 'Belum Terbaca'}</span>
                      </div>
                      <p className="note-snippet-text">
                        {note ? `“${note.text}”` : '(Periksa benda-benda lain di meja gerobak untuk menemukan serpihan ini...)'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Rekomendasi Lanjut */}
              {isExploreComplete && (
                <div style={{
                  marginTop: '16px',
                  background: 'var(--color-teal-soft)',
                  border: '1px solid var(--color-teal)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  color: 'var(--color-teal-dark)',
                  lineHeight: '1.45',
                  fontWeight: 700
                }}>
                  Semua 3 serpihan resep telah terkumpul! Buka tab '2. Penataan Bahan & Piranti' untuk menuntaskan babak ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN 2: SORTING/PENATAAN BAHAN DAN ALAT */}
      {activeTab === 'sort' && (
        <div>
          <MiniGameGuideBanner
            title="Cara Bermain: Penataan Bahan Rempah & Piranti Seduh"
            tag="Aktivitas 2: Klasifikasi Pengetahuan"
            steps={[
              "Amati kartu bahan atau alat yang tersedia pada rak persiapan di bawah.",
              "Tarik kartu (drag & drop) atau klik tombol '+ Rempah' / '+ Piranti' pada masing-masing kartu.",
              "Kelompokkan ke dalam wadah yang sesuai: Rempah Alami (Jahe, Sereh, Gula Aren, Cengkeh, Kayu Manis) atau Piranti Seduh (Ceret, Cangkir, Sendok, Cobek, Saringan).",
              "Selesaikan seluruh 6 kartu untuk membuka kunci menuju Babak 2."
            ]}
            tip="Pahami perbedaan antara bahan rimpang hasil bumi dan peralatan seduh tradisional."
            onOpenHelp={onOpenHelp}
          />

          {sortFeedback && (
            <div style={{
              background: sortFeedback.type === 'success' ? 'var(--color-teal-soft)' : 'var(--color-bata-soft)',
              borderLeft: `4px solid ${sortFeedback.type === 'success' ? 'var(--color-teal)' : 'var(--color-bata)'}`,
              padding: '12px 18px',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.9rem',
              color: sortFeedback.type === 'success' ? 'var(--color-teal-dark)' : 'var(--color-bata-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              {sortFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{sortFeedback.message}</span>
            </div>
          )}

          {/* Rak Item yang Belum Dikelompokkan */}
          <div className="sorting-pool-area">
            {poolItems.length === 0 ? (
              <div style={{
                width: '100%',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--color-teal-dark)',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}>
                Seluruh 6 bahan dan piranti telah tertata rapi pada wadahnya masing-masing!
              </div>
            ) : (
              poolItems.map((item) => (
                <div
                  key={item.id}
                  className="draggable-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <span>{item.name}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="click-transfer-btn"
                      onClick={() => placeItem(item, 'bahan')}
                      title="Pindahkan ke Wadah Rempah"
                    >
                      + Rempah
                    </button>
                    <button
                      className="click-transfer-btn"
                      onClick={() => placeItem(item, 'alat')}
                      title="Pindahkan ke Rak Piranti"
                    >
                      + Piranti
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 2 Dropzone (Wadah Rempah vs Rak Piranti) */}
          <div className="dropzone-grid">
            {/* Wadah Rempah Alami */}
            <div
              className="dropzone-box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropTo('bahan')}
            >
              <div className="dropzone-header">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-orange)' }} />
                <h4>Wadah Rempah Alami ({bahanBasket.length})</h4>
              </div>
              <div className="dropzone-items-list">
                {bahanBasket.length === 0 ? (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto' }}>
                    Tarik rimpang dan rempah alami ke sini
                  </span>
                ) : (
                  bahanBasket.map((item) => (
                    <div key={item.id} style={{
                      background: 'var(--bg-parchment)',
                      border: '1px solid var(--border-natural)',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={16} color="var(--color-teal)" />
                      {item.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rak Piranti Seduh */}
            <div
              className="dropzone-box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropTo('alat')}
            >
              <div className="dropzone-header">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-teal)' }} />
                <h4>Rak Piranti Seduh ({alatBasket.length})</h4>
              </div>
              <div className="dropzone-items-list">
                {alatBasket.length === 0 ? (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto' }}>
                    Tarik piranti seduh tradisional ke sini
                  </span>
                ) : (
                  alatBasket.map((item) => (
                    <div key={item.id} style={{
                      background: 'var(--bg-parchment)',
                      border: '1px solid var(--border-natural)',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={16} color="var(--color-teal)" />
                      {item.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Aksi Navigasi Babak */}
      <div className="action-footer-bar">
        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Syarat lanjut: Eksplorasi 4 objek ({inspectedObjects.length}/4), tata 6 item ({6 - poolItems.length}/6), temukan 3 catatan ({collectedNotes.length}/3).
        </div>

        <button
          className="btn-primary-action"
          disabled={!isAct1Ready}
          onClick={() => {
            soundManager.playActCompletion();
            onCompleteAct();
          }}
        >
          <span>Lanjut ke Babak 2: Resep yang Hilang</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
