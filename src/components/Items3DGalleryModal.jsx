import React, { useState } from 'react';
import { X, Box, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';
import Item3DViewer from './Item3DViewer.jsx';
import { MASTER_ANGKRINGAN_INVENTORY } from '../data/gameData.js';
import { soundManager } from '../utils/audio.js';

export const ITEMS_3D_LIST = [
  {
    id: 'serai',
    name: 'Batang Serai Wangi',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/serai.glb',
    image: '/assets/spices/sereh.svg',
    materialDesc: 'Tekstur serat alami, pangkal putih ungu, dan helaian daun hijau aromatik.',
    culturalRole: 'Dimemarkan sebelum diseduh air mendidih untuk melepas minyak atsiri sitrus alami yang menenangkan pikiran penat.',
    clue: 'Aromanya segar dan membantu suasana hati terasa lebih tenang.'
  },
  {
    id: 'cangkir',
    name: 'Cangkir Blirik',
    category: 'Peralatan',
    model3d: '/assets/models/items/cangkir.glb',
    image: '/background/cangkir.png',
    materialDesc: 'Lapisan enamel halus motif loreng hijau-putih klasik khas Yogyakarta dengan bibir lis perak gelap.',
    culturalRole: 'Wadah saji legendaris penahan hangat minuman wedang, simbol kehangatan dan obrolan akrab di gerobak angkringan.',
    clue: 'Menahan panas minuman sekaligus menjadi simbol kehangatan akrab.'
  },
  {
    id: 'gula_aren',
    name: 'Gula Jawa Aren',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/gula_aren.glb',
    image: '/assets/spices/gula_aren.svg',
    materialDesc: 'Bongkahan padat kubah setengah batok kelapa warna karamel cokelat tua dengan remahan legit bertekstur alami.',
    culturalRole: 'Olahan tradisional dari nira pohon aren yang memberikan rasa manis gurih legit dan memulihkan stamina raga.',
    clue: 'Menyeimbangkan rasa pedas rempah dan memberi rasa nyaman berenergi.'
  },
  {
    id: 'sendok',
    name: 'Sendok Kayu',
    category: 'Peralatan',
    model3d: '/assets/models/items/sendok.glb',
    image: '/assets/tools/sendok.svg',
    materialDesc: 'Kayu jati alami dengan serat halus, cekungan oval proporsional, dan gagang ergonomis.',
    culturalRole: 'Alat pengaduk seduhan tradisional yang tidak merusak lapisan cangkir enamel serta tidak menghantarkan panas berlebih ke tangan.',
    clue: 'Mengaduk perlahan menyatukan manis gula dan hangatnya rempah.'
  },
  {
    id: 'ceret',
    name: 'Ceret Tembaga',
    category: 'Peralatan',
    model3d: '/assets/models/items/ceret.glb',
    image: '/background/cerek.png',
    materialDesc: 'Tembaga dan kuningan tempa berkilau hangat dengan pegangan lengkung dan moncong angsa berproporsi presisi.',
    culturalRole: 'Perkakas perebus air di atas bara arang anglo untuk menjaga air selalu mendidih matang sempurna setiap saat.',
    clue: 'Air mendidih sempurna membantu sari jahe dan serai keluar maksimal.'
  },
  {
    id: 'cobek',
    name: 'Cobek & Ulekan',
    category: 'Peralatan',
    model3d: '/assets/models/items/cobek.glb',
    image: '/assets/tools/cobek.svg',
    materialDesc: 'Batu andesit vulkanik berpori halus dengan ulekan bentuk L ergonomis yang kokoh.',
    culturalRole: 'Digunakan oleh Pak Ilmu untuk mememarkan jahe bakar dan serai agar seratnya terbuka tanpa hancur berantakan.',
    clue: 'Rimpang cukup dimemarkan perlahan agar saripati mudah larut.'
  },
  {
    id: 'cengkeh',
    name: 'Bunga Cengkeh',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/cengkeh.glb',
    image: '/assets/spices/cengkeh.svg',
    materialDesc: 'Kuncup bunga kering warna cokelat tua dengan kelopak empat mahkota dan tangkai berpori khas rempah kepulauan Maluku.',
    culturalRole: 'Rempah primadona Nusantara beraroma harum manis-hangat yang memberi kedalaman rasa pada wedang uwuh.',
    clue: 'Cukup beberapa butir untuk memperkaya wangi seduhan malam.'
  },
  {
    id: 'jahe',
    name: 'Jahe Emprit Bakar',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/jahe.glb',
    image: '/assets/spices/jahe.svg',
    materialDesc: 'Rimpang bercabang dengan ruas bertekstur kerut alami dan semburat arang kehitaman di pucuknya hasil pemanggangan.',
    culturalRole: 'Rimpang pedas menghangatkan yang dipanggang sejenak di atas bara agar aroma pedas atsiri terlepas sempurna.',
    clue: 'Memberi sensasi hangat kuat di badan dan tenggorokan.'
  },
  {
    id: 'kayu_manis',
    name: 'Kulit Kayu Manis',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/kayu_manis.glb',
    image: '/assets/spices/kayu_manis.svg',
    materialDesc: 'Gulungan kulit kayu alami berlapir cokelat kemerahan dengan aroma manis harum lembut.',
    culturalRole: 'Menyeimbangkan rasa rempah dan memberi ketenangan pikiran serta rasa nyaman di tenggorokan.',
    clue: 'Aroma manis lembut menenangkan suasana hati.'
  },
  {
    id: 'kunyit',
    name: 'Rimpang Kunyit',
    category: 'Bahan Rempah',
    model3d: '/assets/models/items/kunyit.glb',
    image: '/assets/spices/kunyit.svg',
    materialDesc: 'Rimpang oranye keemasan dengan ruas cincin melingkar dan penampang inti berwarna kunyit cerah.',
    culturalRole: 'Rempah penjaga stamina tubuh dan pencernaan, memberikan warna kuning hangat khas jamu Nusantara.',
    clue: 'Hangat lembut bersahabat di lambung dan raga.'
  },
  {
    id: 'saringan',
    name: 'Saringan Kain',
    category: 'Peralatan',
    model3d: '/assets/models/items/saringan.glb',
    image: '/assets/tools/saringan.svg',
    materialDesc: 'Kantong kain blacu tenun dengan lingkar kawat baja tahan karat dan pegangan kayu jati ergonomis.',
    culturalRole: 'Peralatan penyaring tradisional untuk memisahkan ampas rempah agar seduhan wedang jernih dan nyaman diminum.',
    clue: 'Menyaring seduhan rempah agar wedang jernih tanpa ampas kasar.'
  },
  {
    id: 'toples',
    name: 'Toples Kawruh Kaca',
    category: 'Wadah Hikmah',
    model3d: '/assets/models/items/toples.glb',
    image: '/background/toples.png',
    materialDesc: 'Toples kaca tebal vintage silindris dengan tutup ulir logam kuningan dan gulungan kertas hikmah di dalamnya.',
    culturalRole: 'Tempat menyimpan mutiara hikmah dan pelajaran rasa dari obrolan malam bersama pengunjung angkringan.',
    clue: 'Menampung kawruh kehidupan yang telah disimpulkan.'
  }
];

export default function Items3DGalleryModal({ isOpen, onClose, initialItemId = 'serai' }) {
  const [selectedItemId, setSelectedItemId] = useState(initialItemId);

  if (!isOpen) return null;

  const activeItem = ITEMS_3D_LIST.find((i) => i.id === selectedItemId) || ITEMS_3D_LIST[0];

  const handleSelect = (id) => {
    soundManager.playClickSound();
    setSelectedItemId(id);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog-card"
        style={{ maxWidth: '820px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Galeri 3D">
          <X size={18} />
        </button>

        <div style={{ padding: '26px 28px' }}>
          {/* Header Dialog */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '2px solid var(--border-natural)',
              paddingBottom: '14px',
              marginBottom: '18px'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255, 170, 68, 0.2), rgba(53, 140, 136, 0.2))',
                border: '1px solid rgba(255, 170, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-orange)'
              }}
            >
              <Box size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Koleksi Model 3D Perkakas & Rempah
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-teal-dark)', margin: '2px 0 0 0', fontWeight: 600 }}>
                Model 3D Realistis Buatan Blender • Interaktif 360°
              </p>
            </div>
          </div>

          {/* Grid Tab Pemilihan 8 Item */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            {ITEMS_3D_LIST.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: isSelected
                      ? '2px solid var(--color-orange)'
                      : '1.5px solid var(--border-natural)',
                    background: isSelected ? 'var(--color-cream-light)' : 'var(--bg-paper)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    boxShadow: isSelected ? '0 4px 10px rgba(224, 112, 32, 0.2)' : 'none'
                  }}
                  title={item.name}
                >
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: '28px', height: '28px', objectFit: 'contain', marginBottom: '4px' }}
                  />
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? 'var(--color-orange)' : 'var(--text-primary)',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}
                  >
                    {item.name.replace(/^(Batang |Bunga |Gula |Cangkir |Ceret |Cobek |Sendok |Jahe )/, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Showcase Viewport Model 3D Terpilih */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              background: 'var(--bg-parchment)',
              borderRadius: '12px',
              padding: '16px',
              border: '1.5px solid var(--border-natural)'
            }}
          >
            {/* Viewer 3D Utama */}
            <div style={{ position: 'relative' }}>
              <Item3DViewer
                modelPath={activeItem.model3d}
                itemName={activeItem.name}
                fallbackImage={activeItem.image}
                height={260}
              />
            </div>

            {/* Info & Deskripsi Kebudayaan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--color-teal-dark)',
                      background: 'var(--color-teal-soft)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}
                  >
                    {activeItem.category}
                  </span>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {activeItem.name}
                  </h3>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--color-teal)',
                    fontWeight: 700,
                    background: 'rgba(53, 140, 136, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid rgba(53, 140, 136, 0.3)'
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Blender PBR GLB</span>
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.86rem',
                  lineHeight: '1.5',
                  color: 'var(--text-secondary)',
                  background: '#FFF',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-natural)'
                }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--color-orange)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Detail Material & Bentuk:
                  </strong>
                  <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeItem.materialDesc}</div>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-teal-dark)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    Fungsi & Nilai Filosofis:
                  </strong>
                  <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{activeItem.culturalRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
