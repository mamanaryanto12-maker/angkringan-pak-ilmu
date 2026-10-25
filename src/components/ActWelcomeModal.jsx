import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Lightbulb, Compass, HeartHandshake, Puzzle, Search } from 'lucide-react';
import { soundManager } from '../utils/audio.js';

export default function ActWelcomeModal({ isOpen, onClose, currentStep }) {
  if (!isOpen) return null;

  const actData = {
    act1: {
      badge: "Zona Aku Berkarya",
      title: "Selamat Datang di Babak 1: Pesanan Pertama",
      icon: Search,
      color: "var(--color-orange)",
      narrative: "Kamu baru saja membuka gerobak Angkringan Pak Ilmu. Di atas meja terdapat tiket pesanan misterius serta bahan dan piranti yang belum tertata. Mulailah dengan mengamati lingkungan sekitarmu!",
      steps: [
        {
          num: 1,
          title: "Eksplorasi Gerobak",
          desc: "Klik 6 benda di meja gerobak untuk mengamati fungsi dan mencari rahasianya."
        },
        {
          num: 2,
          title: "Temukan 3 Catatan",
          desc: "Tiga benda menyembunyikan sobekan resep kuno Pak Ilmu. Temukan semuanya!"
        },
        {
          num: 3,
          title: "Tata Bahan & Alat",
          desc: "Buka tab Penataan dan kelompokkan rempah alami vs piranti seduh tradisional."
        }
      ],
      tip: "Tanda centang hijau akan muncul di setiap benda yang telah kamu periksa. Sobekan catatan otomatis tersimpan di Jurnal Kawruh."
    },
    act2: {
      badge: "Zona Kita Berkarya",
      title: "Selamat Datang di Babak 2: Resep yang Hilang",
      icon: Puzzle,
      color: "var(--color-teal-dark)",
      narrative: "Tiga sobekan catatan yang kamu temukan di Babak 1 ternyata adalah formula Wedang Uwuh Luhur yang terpecah. Saatnya menyatukan informasi dan membangun urutan seduh yang logis!",
      steps: [
        {
          num: 1,
          title: "Jigsaw Puzzle",
          desc: "Klik kepingan resep di kiri, lalu klik slot bingkai 1–4 di kanan hingga naskah utuh."
        },
        {
          num: 2,
          title: "Urutan Seduh",
          desc: "Gunakan tombol panah ▲ dan ▼ untuk menyusun 4 langkah peracikan secara kronologis."
        },
        {
          num: 3,
          title: "Khasiat & Raga",
          desc: "Hubungkan kondisi fisik/jiwa pelanggan dengan ramuan rempah yang menyembuhkan."
        }
      ],
      tip: "Setiap mini-game memiliki tab sendiri di bagian atas. Selesaikan ketiganya untuk membuka Babak 3."
    },
    act3: {
      badge: "Zona Karya Kita Berkontribusi",
      title: "Selamat Datang di Babak 3: Untuk Siapa Racikan Ini?",
      icon: HeartHandshake,
      color: "var(--color-gold-deep)",
      narrative: "Hujan deras mengguyur malam di Yogyakarta. Mas Danang datang dengan pakaian basah kuyup dan napas terengah. Saatnya menerapkan pengetahuanmu untuk menolong sesama!",
      steps: [
        {
          num: 1,
          title: "Analisis Kebutuhan",
          desc: "Pahami kondisi Mas Danang dan pilih pendekatan pemulihan yang menyentuh akar masalah."
        },
        {
          num: 2,
          title: "Penakaran Rempah",
          desc: "Atur meteran Jahe (panas), Sereh (aroma), dan Gula Aren (stamina) secara harmonis."
        },
        {
          num: 3,
          title: "Tutur Kata Empati",
          desc: "Pilih cara penyajian cangkir dengan budi pekerti Yogyakarta yang menentramkan jiwa."
        }
      ],
      tip: "Karya sejati bukan sekadar menghasilkan barang, melainkan empati yang meringankan beban hidup orang lain."
    },
    epilogue: {
      badge: "Epilog Simbolik",
      title: "Selamat Datang di Epilog: Toples Kawruh",
      icon: Sparkles,
      color: "var(--color-pink)",
      narrative: "Mas Danang telah merasakan kehangatan wedangmu dan menemukan kembali harapannya. Sebelum pameran berakhir, abadikan pelajaran yang kamu petik ke dalam Toples Kawruh!",
      steps: [
        {
          num: 1,
          title: "Susun Kata Hikmah",
          desc: "Ketuk kata-kata untuk membentuk kalimat: 'Pengetahuan Menjadi Berarti Ketika Dibagikan'."
        },
        {
          num: 2,
          title: "Masukkan ke Toples",
          desc: "Tekan tombol serahkan agar catatan hikmah tersimpan abadi di dalam toples kaca."
        },
        {
          num: 3,
          title: "Terima Piagam",
          desc: "Dapatkan Piagam Peracik Kawruh resmi pameran Gredupedia #7 Karsa Kala."
        }
      ],
      tip: "Jika salah memilih urutan kata, ketuk kata yang terpasang di kotak target untuk menghapusnya."
    }
  };

  const current = actData[currentStep];
  if (!current) return null;

  const IconComponent = current.icon;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Panduan Babak">
          <X size={18} />
        </button>

        <div style={{ padding: '28px 32px' }}>
          {/* Header Sambutan Babak */}
          <div className="act-welcome-header">
            <div className="act-welcome-icon-box">
              <IconComponent size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: current.color, letterSpacing: '0.8px' }}>
                {current.badge}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {current.title}
              </h2>
            </div>
          </div>

          {/* Narasi Kontekstual */}
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            {current.narrative}
          </p>

          {/* 3 Langkah Utama Babak Ini */}
          <div>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              3 Hal yang Perlu Kamu Lakukan di Babak Ini:
            </h4>
            <div className="act-welcome-steps-grid">
              {current.steps.map((st) => (
                <div key={st.num} className="act-welcome-step-card">
                  <div className="act-welcome-step-num">{st.num}</div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {st.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {st.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Tambahan */}
          <div style={{
            background: 'var(--color-teal-soft)',
            borderLeft: '4px solid var(--color-teal)',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            color: 'var(--color-teal-dark)',
            lineHeight: '1.5',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Lightbulb size={20} style={{ flexShrink: 0 }} />
            <span><strong>Kiat:</strong> {current.tip}</span>
          </div>

          {/* Tombol Mulai Babak */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-natural)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Panduan ini bisa kamu buka lagi kapan saja lewat tombol 💡 Petunjuk di atas.
            </span>

            <button
              className="btn-primary-action"
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
            >
              <span>Saya Siap, Mulai Tantangan!</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
