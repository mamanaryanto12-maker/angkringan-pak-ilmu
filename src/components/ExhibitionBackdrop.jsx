import React from 'react';

// Latar Belakang Pameran Berbasis Aset Asli Gredupedia (Tanpa Lapisan Opacity Kusam)
export default function ExhibitionBackdrop({ currentStep = 'intro' }) {
  const isNight = currentStep === 'act3';
  const isOpening = currentStep === 'intro';
  const isSummary = currentStep === 'epilogue' || currentStep === 'summary';
  const isAct2 = currentStep === 'act2';

  return (
    <div className={`exhibition-backdrop ${isNight ? 'mode-night' : 'mode-day'}`} aria-hidden="true">
      {/* Lapisan 1: Langit Pameran Asli */}
      <img
        src="/assets/exhibition/langit.jpg"
        alt=""
        className="backdrop-sky"
      />

      {/* Nuansa Malam Hujan Khusus Babak 3 agar Suasana Malioboro Terasa Nyata */}
      {isNight && <div className="backdrop-night-wash" />}

      {/* Lapisan 2: Matahari & Awan (Pembuka, Epilog, Refleksi, Babak 1 & 2) */}
      {!isNight && (
        <>
          <img
            src="/assets/exhibition/matahari.png"
            alt=""
            className={`backdrop-sun ${isOpening ? 'sun-intro' : 'sun-subtle'}`}
          />
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

      {/* Lapisan 3: Bingkai Naskah Proposal (Babak 2 & Summary) */}
      {(isAct2 || isSummary) && (
        <img
          src="/assets/exhibition/bingkai_atas.png"
          alt=""
          className="backdrop-scroll-arch"
        />
      )}

      {/* Lapisan 4: Kontur Bukit & Tanah Bumi Asli di Cakrawala Bawah */}
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

      {/* Lapisan 5: Ornamen Nusantara Tepi Layar */}
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
