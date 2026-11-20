import React from 'react';

// Ilustrasi & Animasi Suasana Pengunjung di Malioboro / Angkringan
export default function VisitorSceneIllustration({
  personaId = 'persona-danang',
  weatherType = 'rain',
  isServed = false,
  servingTier = null
}) {
  const isRain = weatherType === 'rain';
  const isColdOutcome = servingTier === 'kurang_sesuai';
  const isWarmSmile = isServed && !isColdOutcome;

  // Warna pakaian karakter yang harmonis dengan palet pameran
  const outfitMain =
    personaId === 'persona-danang'
      ? '#2F4D63'
      : personaId === 'persona-sari'
      ? '#9A3F5B'
      : '#6D4C2F';

  const outfitAccent =
    personaId === 'persona-danang'
      ? '#EE7217'
      : personaId === 'persona-sari'
      ? '#358C88'
      : '#FDC631';

  return (
    <div className={`malioboro-stage ${isRain ? 'has-rain' : 'has-evening'}`}>
      {/* Plang Jalan & Lampu Jalan Malioboro + Atap Tenda Angkringan */}
      <svg
        viewBox="0 0 360 220"
        className="malioboro-svg"
        role="img"
        aria-label={`Suasana malam ${isRain ? 'hujan deras di Malioboro' : 'Yogyakarta'}`}
      >
        <defs>
          <linearGradient id="nightSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B2A38" />
            <stop offset="65%" stopColor="#2C3E4F" />
            <stop offset="100%" stopColor="#3B352D" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDC631" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#EE7217" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EE7217" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Latar Langit Malam Kota Yogyakarta */}
        <rect width="360" height="220" fill="url(#nightSkyGrad)" rx="12" />

        {/* Siluet Bangunan / Kios Malioboro */}
        <rect x="0" y="135" width="75" height="65" fill="#17232E" opacity="0.7" />
        <rect x="285" y="128" width="75" height="72" fill="#17232E" opacity="0.7" />
        <rect x="298" y="142" width="14" height="16" fill="#FDC631" opacity="0.35" />

        {/* Lampu Jalan Klasik Malioboro di Sisi Kiri */}
        <line x1="56" y1="54" x2="56" y2="188" stroke="#18222B" strokeWidth="4" />
        <path d="M56 58 Q68 48 80 56" fill="none" stroke="#18222B" strokeWidth="3" />
        <circle cx="80" cy="64" r="38" fill="url(#lampGlow)" />
        <circle cx="80" cy="64" r="7" fill="#FFF3C4" />

        {/* Plang Hijau Ikonik "JL. MALIOBORO" */}
        <rect x="16" y="74" width="66" height="18" rx="3" fill="#246360" stroke="#FAF6EE" strokeWidth="1" />
        <text x="49" y="86" textAnchor="middle" fill="#FAF6EE" fontSize="7.5" fontWeight="700" fontFamily="Raleway, sans-serif">
          MALIOBORO
        </text>

        {/* Trotoar Basah & Pantulan Cahaya */}
        <rect x="0" y="184" width="360" height="36" fill="#241B14" />
        <ellipse cx="82" cy="196" rx="44" ry="5" fill="#FDC631" opacity="0.22" />
        {isRain && (
          <>
            <ellipse cx="52" cy="202" rx="16" ry="3" fill="none" stroke="#9EC8E0" strokeWidth="1" opacity="0.45" className="puddle-ripple" />
            <ellipse cx="305" cy="198" rx="18" ry="3" fill="none" stroke="#9EC8E0" strokeWidth="1" opacity="0.4" className="puddle-ripple delay-2" />
          </>
        )}

        {/* Kanopi / Terpal Tenda Angkringan (Memberi Ruang Teduh Kanan-Tengah) */}
        <polygon points="105,28 360,28 360,46 95,46" fill="#C22A18" />
        <polygon points="135,28 165,28 160,46 130,46" fill="#FAF6EE" opacity="0.9" />
        <polygon points="195,28 225,28 220,46 190,46" fill="#FAF6EE" opacity="0.9" />
        <polygon points="255,28 285,28 280,46 250,46" fill="#FAF6EE" opacity="0.9" />
        <polygon points="315,28 345,28 340,46 310,46" fill="#FAF6EE" opacity="0.9" />
        <line x1="342" y1="46" x2="342" y2="188" stroke="#5A3921" strokeWidth="5" />

        {/* Pancaran Cahaya Lampu Sentir di Bawah Tenda */}
        <circle cx="290" cy="122" r="68" fill="url(#lampGlow)" />

        {/* Tokoh Pengunjung (Berteduh di Bawah Tenda) */}
        <g className={!isServed && isRain ? 'character-shiver' : 'character-calm'} transform="translate(182, 74)">
          {/* Bayangan di bangku/lincak */}
          <ellipse cx="0" cy="112" rx="34" ry="6" fill="#18120C" opacity="0.55" />

          {/* Badan & Jaket/Kebaya */}
          <path d="M-28 106 C-28 64, 28 64, 28 106 Z" fill={outfitMain} />
          <path d="M-12 72 L0 94 L12 72" fill={outfitAccent} opacity="0.9" />

          {/* Kepala */}
          <circle cx="0" cy="40" r="22" fill="#E8BA92" />

          {/* Rambut / Topi Caping (Pak Broto) */}
          {personaId === 'persona-broto' ? (
            <path d="M-30 30 Q0 4 30 30 Q0 24 -30 30 Z" fill="#C89B54" stroke="#7A5226" strokeWidth="1.5" />
          ) : personaId === 'persona-sari' ? (
            <path d="M-23 38 C-23 12, 23 12, 23 38 C23 48, 19 60, 14 62 L-14 62 C-19 60, -23 48, -23 38 Z" fill="#2A1D17" />
          ) : (
            <path d="M-22 36 C-21 15, 22 15, 22 36 C16 26, -12 24, -22 36 Z" fill="#231915" />
          )}

          {/* Wajah kembali muncul di atas rambut belakang untuk Mbak Sari */}
          {personaId === 'persona-sari' && <circle cx="0" cy="40" r="18" fill="#ECC19C" />}
          {personaId === 'persona-sari' && (
            <path d="M-18 35 C-14 21, 14 21, 18 35 C10 28, -8 28, -18 35 Z" fill="#2A1D17" />
          )}

          {/* Mata */}
          <circle cx="-7" cy="40" r="2.2" fill="#2D1F14" />
          <circle cx="7" cy="40" r="2.2" fill="#2D1F14" />

          {/* Mulut (Menggigil vs Senyum Lega) */}
          {isWarmSmile ? (
            <path d="M-7 48 Q0 54 7 48" fill="none" stroke="#8C3B2B" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            <path d="M-6 50 Q-3 48 0 50 Q3 52 6 50" fill="none" stroke="#6E4432" strokeWidth="1.8" strokeLinecap="round" />
          )}

          {/* Tetes air pada Mas Danang jika belum minum wedang */}
          {isRain && !isWarmSmile && (
            <g fill="#A8D5EE" opacity="0.85">
              <circle cx="-18" cy="24" r="2" />
              <circle cx="17" cy="28" r="1.8" />
            </g>
          )}

          {/* Tangan memegang cangkir jika sudah disajikan */}
          {isServed ? (
            <g transform="translate(22, 84)" className="anim-cup-place">
              {/* Kepulan Uap */}
              {!isColdOutcome && (
                <g stroke="#FFFDF8" strokeWidth="1.5" fill="none" opacity="0.7" className="svg-steam-float">
                  <path d="M6 -4 Q4 -12 8 -18" />
                  <path d="M13 -3 Q15 -11 11 -19" />
                </g>
              )}
              <rect x="0" y="0" width="20" height="16" rx="2" fill="#FAF6EE" stroke="#358C88" strokeWidth="2" />
              <path d="M20 4 C25 4, 25 12, 20 12" fill="none" stroke="#358C88" strokeWidth="2" />
            </g>
          ) : (
            /* Lengan bersedekap menahan dingin */
            <path d="M-20 86 Q0 94 20 86" fill="none" stroke="#1E3040" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          )}
        </g>

        {/* Bangku Lincak Bambu & Meja Depan */}
        <rect x="130" y="182" width="218" height="10" rx="2" fill="#8C5832" />
        <rect x="260" y="156" width="84" height="8" rx="2" fill="#6F4120" />
        <rect x="270" y="164" width="6" height="24" fill="#5A3418" />

        {/* Rintik Hujan Deras di Area Luar Tenda (Kiri & Atas) */}
        {isRain && (
          <g className="svg-rain-layer" stroke="#A6D0EB" strokeWidth="1.4" strokeLinecap="round" opacity="0.65">
            <line x1="22" y1="14" x2="14" y2="38" className="rain-line r1" />
            <line x1="48" y1="30" x2="40" y2="56" className="rain-line r2" />
            <line x1="76" y1="10" x2="68" y2="34" className="rain-line r3" />
            <line x1="94" y1="48" x2="86" y2="76" className="rain-line r1" />
            <line x1="30" y1="88" x2="22" y2="116" className="rain-line r2" />
            <line x1="64" y1="112" x2="56" y2="142" className="rain-line r3" />
            <line x1="88" y1="138" x2="80" y2="168" className="rain-line r1" />
            <line x1="16" y1="146" x2="8" y2="174" className="rain-line r2" />
            <line x1="110" y1="90" x2="102" y2="118" className="rain-line r3" />
          </g>
        )}
      </svg>
    </div>
  );
}
