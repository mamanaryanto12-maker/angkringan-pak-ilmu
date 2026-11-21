import React from 'react';

// Latar Belakang Pameran Bergaya Nomaya: Colorful, Elegan, Memiliki Kedalaman & Hidup
export default function ExhibitionBackdrop({ currentStep = 'intro' }) {
  const isNight = currentStep === 'act3';
  const isOpening = currentStep === 'intro';
  const isSummary = currentStep === 'epilogue' || currentStep === 'summary';
  const isAct2 = currentStep === 'act2';

  return (
    <div
      className={`exhibition-backdrop ${isNight ? 'mode-night' : 'mode-day'} step-${currentStep}`}
      aria-hidden="true"
    >
      {/* Lapisan 1: Langit Dasar Pameran Asli */}
      <img
        src="/assets/exhibition/langit.jpg"
        alt=""
        className="backdrop-sky"
      />

      {/* Lapisan 2: Atmospheric Color Mesh (Pendekatan Nomaya: Kaya Warna, Gradasi Lembut, Hidup) */}
      <div className="backdrop-aurora-mesh">
        <div className="aurora-glow glow-amber" />
        <div className="aurora-glow glow-teal" />
        <div className="aurora-glow glow-coral" />
        <div className="aurora-glow glow-violet" />
      </div>

      {/* Nuansa Malam Hujan Khusus Babak 3 (Atmosfer Malioboro Hangat & Dramatis) */}
      {isNight && (
        <div className="backdrop-night-wash">
          <div className="night-lantern-halo" />
        </div>
      )}

      {/* Lapisan 3: Matahari & Awan (Untuk Babak Siang & Sore) */}
      {!isNight && (
        <>
          <div className={`sun-wrapper ${isOpening ? 'sun-intro' : 'sun-subtle'}`}>
            <div className="sun-radiance-aura" />
            <img
              src="/assets/exhibition/matahari.png"
              alt=""
              className="backdrop-sun"
            />
          </div>

          <img
            src="/assets/exhibition/awan_baris.png"
            alt=""
            className="backdrop-clouds-row"
          />

          {isOpening && (
            <img
              src="/assets/exhibition/awan.png"
              alt=""
              className="backdrop-cloud-float"
            />
          )}
        </>
      )}

      {/* Lapisan 4: Bingkai Naskah Proposal (Babak 2 & Summary) */}
      {(isAct2 || isSummary) && (
        <img
          src="/assets/exhibition/bingkai_atas.png"
          alt=""
          className="backdrop-scroll-arch"
        />
      )}

      {/* Lapisan 5: Kontur Bukit & Tanah Bumi Asli di Cakrawala Bawah */}
      <img
        src="/assets/exhibition/bukit_kiri.png"
        alt=""
        className="backdrop-hill-left"
      />
      <img
        src="/assets/exhibition/bukit_kanan.png"
        alt=""
        className="backdrop-hill-right"
      />
      <img
        src="/assets/exhibition/tanah.png"
        alt=""
        className="backdrop-earth"
      />

      {/* Lapisan 6: Ornamen Nusantara Tepi Layar */}
      {(isOpening || isSummary) && (
        <>
          <img
            src="/assets/exhibition/wijayakusuma.png"
            alt=""
            className="backdrop-flora-left"
          />
          <img
            src="/assets/exhibition/kupu_kupu.png"
            alt=""
            className="backdrop-butterfly"
          />
        </>
      )}

      {!isOpening && !isNight && (
        <img
          src="/assets/exhibition/ukiran.png"
          alt=""
          className="backdrop-carving-corner"
        />
      )}
    </div>
  );
}
