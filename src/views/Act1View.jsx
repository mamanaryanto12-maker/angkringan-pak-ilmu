import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle, Search, Layers, Lightbulb, Compass, FileText, Check } from 'lucide-react';
import { soundManager } from '../utils/audio.js';
import { ACT_1_DATA } from '../data/gameData.js';
import MiniGameGuideBanner from '../components/MiniGameGuideBanner.jsx';

export default function Act1View({
  onCompleteAct,
  collectedNotes,
  setCollectedNotes,
  inspectedObjects,
  setInspectedObjects,
  onOpenTicket,
  onOpenHelp
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'sort'
  const [selectedObject, setSelectedObject] = useState(null);
  const [lastDiscoveredNote, setLastDiscoveredNote] = useState(null);
  
  // State untuk Sorting Game
  const [poolItems, setPoolItems] = useState(ACT_1_DATA.sortItems);
  const [bahanBasket, setBahanBasket] = useState([]);
  const [alatBasket, setAlatBasket] = useState([]);
  const [sortFeedback, setSortFeedback] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Klik objek interaktif di gerobak
  const handleInspectObject = (obj) => {
    soundManager.playClickSound();
    setSelectedObject(obj);

    // Tambahkan ke daftar inspeksi jika belum
    if (!inspectedObjects.some(o => o.id === obj.id)) {
      setInspectedObjects(prev => [...prev, obj]);
    }

    // Cek apakah ada sobekan catatan tersembunyi di objek ini
    if (obj.id === 'ceret') {
      checkFindNote('note-1');
    } else if (obj.id === 'cangkir_blirik') {
      checkFindNote('note-2');
    } else if (obj.id === 'toples_rempah') {
      checkFindNote('note-3');
    }
  };

  const checkFindNote = (noteId) => {
    if (!collectedNotes.some(n => n.id === noteId)) {
      const noteToFind = ACT_1_DATA.hiddenNotes.find(n => n.id === noteId);
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
        message: `Tepat sekali! '${item.name}' berhasil ditempatkan di wadah ${targetCategory === 'bahan' ? 'Rempah Alami' : 'Piranti Seduh'}.`
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
            Zona {ACT_1_DATA.zone}
          </div>
          <h2 className="act-main-title">{ACT_1_DATA.title}</h2>
        </div>

        {/* Status Ringkas Checklist */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            background: inspectedObjects.length >= 4 ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${inspectedObjects.length >= 4 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: inspectedObjects.length >= 4 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            1. Benda Diperiksa: {inspectedObjects.length} / 6 {inspectedObjects.length >= 4 && '✓'}
          </span>

          <span style={{
            background: collectedNotes.length === 3 ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${collectedNotes.length === 3 ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: collectedNotes.length === 3 ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            2. Catatan Tersembunyi: {collectedNotes.length} / 3 {collectedNotes.length === 3 && '✓'}
          </span>

          <span style={{
            background: isSortingComplete ? 'var(--color-teal-soft)' : 'var(--bg-parchment)',
            border: `1.5px solid ${isSortingComplete ? 'var(--color-teal)' : 'var(--border-strong)'}`,
            color: isSortingComplete ? 'var(--color-teal-dark)' : 'var(--text-muted)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}>
            3. Penataan: {6 - poolItems.length} / 6 {isSortingComplete && '✓'}
          </span>
        </div>
      </div>

      {/* Navigasi Sub-Tab Babak 1 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => {
            soundManager.playClickSound();
            setActiveTab('explore');
          }}
          style={{
            padding: '12px 22px',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'explore' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${activeTab === 'explore' ? 'var(--color-teal-dark)' : 'var(--border-strong)'}`,
            color: activeTab === 'explore' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'explore' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)'
          }}
        >
          <Search size={18} />
          <span>1. Eksplorasi Meja Gerobak ({inspectedObjects.length} / {ACT_1_DATA.objects.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClickSound();
            setActiveTab('sort');
          }}
          style={{
            padding: '12px 22px',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'sort' ? 'var(--color-teal)' : '#FFF',
            border: `2px solid ${activeTab === 'sort' ? 'var(--color-teal-dark)' : (isExploreComplete ? 'var(--color-gold-deep)' : 'var(--border-strong)')}`,
            color: activeTab === 'sort' ? '#FFF' : 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'sort' ? '0 4px 12px rgba(53, 140, 136, 0.25)' : 'var(--shadow-soft)',
            animation: (isExploreComplete && !isSortingComplete && activeTab !== 'sort') ? 'pulseTap 2s infinite ease-in-out' : 'none'
          }}
        >
          <Layers size={18} />
          <span>2. Penataan Bahan & Piranti ({6 - poolItems.length} / 6)</span>
          {isExploreComplete && !isSortingComplete && (
            <span style={{ background: 'var(--color-gold)', color: '#000', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>
              Langkah Berikutnya 👉
            </span>
          )}
        </button>
      </div>

      {/* TAMPILAN 1: EKSPLORASI GEROBAK */}
      {activeTab === 'explore' && (
        <div>
          {/* Banner Petunjuk Spesifik Tab Eksplorasi */}
          <MiniGameGuideBanner
            title="Cara Bermain: Eksplorasi Benda di Meja Gerobak"
            tag="Panduan Aktivitas 1"
            steps={[
              "Ketuk atau klik setiap gambar benda di meja gerobak (Ceret, Toples, Cangkir, Jurnal, Lentera, Tiket).",
              "Perhatikan tanda centang hijau ✓ yang muncul setelah benda diperiksa.",
              "Temukan 3 sobekan resep rahasia yang terselip di balik Ceret Tiga Tingkat, Cangkir Blirik, dan Toples Rempah.",
              "Setelah minimal 4 benda diperiksa dan 3 catatan ditemukan, beralihlah ke tab '2. Penataan Bahan & Piranti'."
            ]}
            tip="Benda yang belum diperiksa memiliki penanda oranye '👆 Klik Periksa'. Ketuk untuk membacanya!"
            onOpenHelp={onOpenHelp}
          />

          {/* Toast Notifikasi Penemuan Catatan Terbaru */}
          {lastDiscoveredNote && (
            <div className="discovery-toast-card">
              <div className="discovery-toast-text">
                <h5>📜 Sobekan Resep Baru Ditemukan! ({collectedNotes.length} / 3 Terkumpul)</h5>
                <p>“{lastDiscoveredNote.text}” — <em>Tersimpan otomatis ke Jurnal Kawruh.</em></p>
              </div>
              <button
                onClick={() => setLastDiscoveredNote(null)}
                style={{
                  background: 'var(--bg-parchment)',
                  border: '1px solid var(--border-strong)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tutup Notifikasi ✕
              </button>
            </div>
          )}

          <div className="angkringan-board" style={{ marginTop: '14px' }}>
            <div className="countertop-view">
              <div className="countertop-awning" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--color-teal-dark)', fontWeight: 800 }}>
                  MEJA GEROBAK ANGKRINGAN PAK ILMU
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ketuk setiap benda untuk memeriksa ciri dan menemukan petunjuk rahasia
                </span>
              </div>

              {/* Grid 6 Objek dengan Visual Cues */}
              <div className="counter-grid-objects">
                {ACT_1_DATA.objects.map((obj) => {
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
                      {/* Visual Cue: Penunjuk Jari jika belum diperiksa */}
                      {!isInspected && (
                        <div className="interactive-cue-badge">
                          👆 Klik Periksa
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
                <div className="object-inspection-panel">
                  <span className="inspection-badge">{selectedObject.name}</span>
                  <p className="inspection-text">{selectedObject.desc}</p>
                </div>
              ) : (
                <div className="object-inspection-panel" style={{ borderColor: 'var(--border-natural)', background: 'var(--bg-parchment)' }}>
                  <span className="inspection-badge" style={{ background: 'var(--border-strong)', color: 'var(--text-primary)' }}>Petunjuk Aksi</span>
                  <p className="inspection-text" style={{ color: 'var(--text-muted)' }}>
                    Pilih salah satu benda di atas meja gerobak untuk mengamati fungsi dan mencari sobekan resep yang terselip.
                  </p>
                </div>
              )}
            </div>

            {/* Sisi Kanan: Tiket & Catatan Rahasia */}
            <div className="angkringan-sidebar">
              {/* Kartu Tiket Ringkas */}
              <div className="ticket-paper" style={{ padding: '18px' }}>
                <div className="ticket-header" style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Tiket Pesanan
                  </span>
                  <button
                    onClick={onOpenTicket}
                    style={{
                      background: 'var(--color-bata)',
                      color: '#FFF',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}
                  >
                    Buka Utuh
                  </button>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5', marginBottom: '8px' }}>
                  “Tenggorokan tercekat debu jalanan, sendi ngilu didera angin malam... Butuh kehangatan penentram batin...”
                </p>
              </div>

              {/* Kotak Catatan Terkumpul */}
              <div className="notes-collected-box">
                <div className="notes-collected-header">
                  <h3>Sobekan Catatan Kuno</h3>
                  <span className="notes-counter-badge">{collectedNotes.length} / 3</span>
                </div>

                {collectedNotes.length === 0 ? (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.45' }}>
                    Belum ada catatan ditemukan. Coba amati Ceret Tiga Tingkat, Cangkir Blirik, dan Toples Kaca!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {collectedNotes.map((note) => (
                      <div key={note.id} className="note-scrap-item">
                        <span style={{ fontSize: '0.82rem' }}>“{note.text}”</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN 2: MINI-GAME SORTING (DRAG & DROP) */}
      {activeTab === 'sort' && (
        <div className="sorting-container">
          {/* Banner Petunjuk Spesifik Tab Penataan */}
          <MiniGameGuideBanner
            title="Cara Bermain: Penataan Bahan Rempah & Piranti Seduh"
            tag="Panduan Aktivitas 2"
            steps={[
              "Pilih cara interaksi yang paling nyaman: Tarik (drag) item ke wadah tujuan, ATAU klik tombol '+ Rempah' / '+ Piranti' di bawah nama item.",
              "Kelompokkan bahan alami (Jahe Emprit, Gula Jawa Aren, Sereh Wangi) ke dalam 'Wadah Rempah Alami'.",
              "Kelompokkan peralatan fisik (Ceret Tembaga, Cangkir Blirik, Sendok Kayu) ke dalam 'Rak Piranti Seduh'.",
              "Jika seluruh 6 item telah tertata rapi, tombol 'Lanjut ke Babak 2' di bagian bawah layar akan aktif."
            ]}
            tip="Jika salah menempatkan, sistem akan memberikan petunjuk perbaikan tanpa langsung menyelesaikan tantangan."
            onOpenHelp={onOpenHelp}
          />

          <div style={{
            background: '#FFF',
            border: '1.5px solid var(--border-natural)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pengelompokan Bahan Alami & Piranti Seduh
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Tarik item ke wadah yang sesuai, atau klik tombol transfer cepat di tiap kartu item.
              </p>
            </div>
            {isSortingComplete && (
              <span style={{
                background: 'var(--color-teal-soft)',
                color: 'var(--color-teal-dark)',
                border: '1.5px solid var(--color-teal)',
                padding: '6px 16px',
                borderRadius: '24px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={16} />
                Seluruh 6 Item Tertata Rapi!
              </span>
            )}
          </div>

          {/* Umpan Balik Tindakan */}
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
              gap: '10px'
            }}>
              {sortFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{sortFeedback.message}</span>
            </div>
          )}

          {/* Pool Item Berserakan */}
          <div className="sorting-pool">
            <span style={{ fontSize: '0.82rem', color: 'var(--color-orange)', fontWeight: 800, width: '100%', marginBottom: '4px' }}>
              Item Berserakan di Meja ({poolItems.length} Tersisa):
            </span>
            {poolItems.length === 0 ? (
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Semua bahan dan piranti telah tertata dengan rapi pada tempatnya.
              </span>
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
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-orange)' }} />
                <h4>🎯 Wadah Rempah Alami ({bahanBasket.length})</h4>
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
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-teal)' }} />
                <h4>🎯 Rak Piranti Seduh ({alatBasket.length})</h4>
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
          style={{
            animation: isAct1Ready ? 'pulseTap 2s infinite ease-in-out' : 'none'
          }}
        >
          <span>Lanjut ke Babak 2: Resep yang Hilang</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
