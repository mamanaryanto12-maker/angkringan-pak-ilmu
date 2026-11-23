import React from 'react';

// Ilustrasi Realistis Suasana Pengunjung (Mas Danang / Mbak Sari / Pak Broto) di Angkringan Malioboro
export default function VisitorSceneIllustration({
  personaId = 'persona-danang',
  weatherType = 'rain',
  isServed = false,
  servingTier = null
}) {
  const isRain = weatherType === 'rain';
  const isColdOutcome = servingTier === 'kurang_sesuai';
  const isWarmSmile = isServed && !isColdOutcome;

  // Warna jaket/pakaian kontekstual
  const jacketBase =
    personaId === 'persona-danang'
      ? '#263D52' // Jaket parka/windbreaker biru malam Mas Danang
      : personaId === 'persona-sari'
      ? '#82324C' // Kardigan rajut marun Mbak Sari
      : '#543820'; // Jaket kanvas cokelat Pak Broto

  const jacketShadow =
    personaId === 'persona-danang'
      ? '#172736'
      : personaId === 'persona-sari'
      ? '#571D30'
      : '#382212';

  const jacketHighlight =
    personaId === 'persona-danang'
      ? '#3D5E7A'
      : personaId === 'persona-sari'
      ? '#A34865'
      : '#734E2F';

  return (
    <div className={`malioboro-stage ${isRain ? 'has-rain' : 'has-evening'}`}>
      <svg
        viewBox="0 0 360 220"
        className="malioboro-svg"
        role="img"
        aria-label={`Suasana malam ${isRain ? 'hujan lebat di Malioboro' : 'Yogyakarta'}`}
      >
        <defs>
          {/* Latar Langit Malam */}
          <linearGradient id="nightSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141E28" />
            <stop offset="65%" stopColor="#223344" />
            <stop offset="100%" stopColor="#302820" />
          </linearGradient>

          {/* Cahaya Lentera & Lampu Jalan */}
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDC631" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#EE7217" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#EE7217" stopOpacity="0" />
          </radialGradient>

          {/* Gradasi Kulit Manusia Realistis (Pencahayaan Hangat Lentera) */}
          <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5AD84" />
            <stop offset="60%" stopColor="#D99B6E" />
            <stop offset="100%" stopColor="#BF7D52" />
          </linearGradient>

          {/* Gradasi Jaket Basah Gerimis */}
          <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={jacketHighlight} />
            <stop offset="50%" stopColor={jacketBase} />
            <stop offset="100%" stopColor={jacketShadow} />
          </linearGradient>

          {/* Pola Cangkir Blirik Loreng Hijau */}
          <linearGradient id="blirikGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4F6F0" />
            <stop offset="25%" stopColor="#2E6B4A" />
            <stop offset="55%" stopColor="#F4F6F0" />
            <stop offset="80%" stopColor="#2E6B4A" />
            <stop offset="100%" stopColor="#F4F6F0" />
          </linearGradient>
        </defs>

        {/* 1. Latar Belakang Kota & Langit Malam */}
        <rect width="360" height="220" fill="url(#nightSkyGrad)" rx="10" />

        {/* Siluet Bangunan & Fasad Pertokoan Malioboro */}
        <rect x="0" y="130" width="78" height="70" fill="#131B22" opacity="0.85" />
        <rect x="282" y="120" width="78" height="80" fill="#131B22" opacity="0.85" />
        <rect x="296" y="138" width="16" height="20" fill="#FDC631" opacity="0.4" rx="1" />

        {/* Tiang Lampu Jalan Ikonik Malioboro */}
        <line x1="52" y1="48" x2="52" y2="190" stroke="#10171D" strokeWidth="4.5" />
        <path d="M52 54 Q65 42 78 52" fill="none" stroke="#10171D" strokeWidth="3" />
        <circle cx="78" cy="60" r="42" fill="url(#lampGlow)" />
        <circle cx="78" cy="60" r="8" fill="#FFF2BD" />

        {/* Plang Hijau Ikonik "JL. MALIOBORO" */}
        <rect x="14" y="70" width="68" height="19" rx="3" fill="#205854" stroke="#FAF6EE" strokeWidth="1.2" />
        <text x="48" y="83" textAnchor="middle" fill="#FAF6EE" fontSize="7.8" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.6">
          JL. MALIOBORO
        </text>

        {/* Trotoar Basah Malioboro & Refleksi Genangan Air */}
        <rect x="0" y="185" width="360" height="35" fill="#1E1610" />
        <ellipse cx="80" cy="197" rx="48" ry="5.5" fill="#FDC631" opacity="0.25" />
        {isRain && (
          <>
            <ellipse cx="48" cy="202" rx="18" ry="3.5" fill="none" stroke="#A8D2EB" strokeWidth="1" opacity="0.5" className="puddle-ripple" />
            <ellipse cx="308" cy="198" rx="20" ry="3.5" fill="none" stroke="#A8D2EB" strokeWidth="1" opacity="0.45" className="puddle-ripple delay-2" />
          </>
        )}

        {/* 2. Kanopi Tenda Angkringan Pak Ilmu (Bergaris Merah-Putih Tradisional) */}
        <polygon points="98,24 360,24 360,45 88,45" fill="#B32415" />
        <polygon points="126,24 156,24 150,45 120,45" fill="#FAF5E8" opacity="0.95" />
        <polygon points="186,24 216,24 210,45 180,45" fill="#FAF5E8" opacity="0.95" />
        <polygon points="246,24 276,24 270,45 240,45" fill="#FAF5E8" opacity="0.95" />
        <polygon points="306,24 336,24 330,45 300,45" fill="#FAF5E8" opacity="0.95" />
        <line x1="344" y1="45" x2="344" y2="190" stroke="#4D2E18" strokeWidth="6" />

        {/* Lentera Sentir Angkringan di Bawah Atap */}
        <circle cx="285" cy="118" r="75" fill="url(#lampGlow)" />

        {/* Bangku Lincak Kayu / Bambu */}
        <rect x="120" y="180" width="235" height="12" rx="2" fill="#754724" />
        <line x1="140" y1="182" x2="340" y2="182" stroke="#5C3619" strokeWidth="1.5" />
        {/* Meja Gerobak Depan */}
        <rect x="250" y="152" width="105" height="10" rx="2" fill="#5E3516" />
        <rect x="262" y="162" width="8" height="28" fill="#482810" />

        {/* 3. Tokoh Pengunjung: Karakter Realistis & Bernyawa */}
        <g className={!isServed && isRain ? 'character-shiver' : 'character-calm'} transform="translate(186, 70)">
          {/* Bayangan Menapak di Bangku */}
          <ellipse cx="0" cy="116" rx="38" ry="7" fill="#100C08" opacity="0.65" />

          {/* Badan / Punggung & Bahu Natural */}
          <path
            d="M-34 114 C-34 68, -26 56, -14 54 L14 54 C26 56, 34 68, 34 114 Z"
            fill="url(#jacketGrad)"
          />
          {/* Lipatan Jaket & Garis Jahitan Bahu */}
          <path d="M-22 62 C-26 78, -30 96, -32 112" fill="none" stroke={jacketShadow} strokeWidth="1.8" />
          <path d="M22 62 C26 78, 30 96, 32 112" fill="none" stroke={jacketShadow} strokeWidth="1.8" />
          <path d="M-10 68 Q0 74 10 68" fill="none" stroke={jacketHighlight} strokeWidth="1.5" opacity="0.6" />

          {/* Kerah Jaket Parka & Resleting */}
          <path d="M-14 54 L-6 78 L6 78 L14 54 Z" fill="#E06B22" opacity="0.95" />
          <line x1="0" y1="78" x2="0" y2="114" stroke="#D18738" strokeWidth="2.2" strokeDasharray="3 1" />

          {/* Leher Human Proportional */}
          <path d="M-9 42 L-9 56 L9 56 L9 42 Z" fill="#C9895E" />

          {/* Wajah / Kepala Manusia Berkarakter */}
          <path
            d="M-16 18 C-18 28, -17 38, -12 46 C-8 52, 8 52, 12 46 C17 38, 18 28, 16 18 C14 8, -14 8, -16 18 Z"
            fill="url(#skinGrad)"
          />

          {/* Telinga */}
          <ellipse cx="-17" cy="30" rx="3" ry="5.5" fill="#CF8E62" />
          <ellipse cx="17" cy="30" rx="3" ry="5.5" fill="#CF8E62" />

          {/* Rambut Manusia Alami Bertekstur */}
          {personaId === 'persona-danang' ? (
            /* Gaya Rambut Mas Danang: Sisir samping natural sedikit basah gerimis */
            <g fill="#1A130E">
              <path d="M-18 18 C-18 4, 18 4, 18 18 C16 10, 8 8, 0 10 C-8 12, -15 15, -18 18 Z" />
              <path d="M-17 17 C-15 10, -8 13, -3 15 C-8 11, -14 11, -17 17 Z" fill="#291F18" />
              <path d="M-18 18 C-18 25, -16 28, -15 28 C-16 24, -16 20, -18 18 Z" />
              <path d="M18 18 C18 25, 16 28, 15 28 C16 24, 16 20, 18 18 Z" />
            </g>
          ) : personaId === 'persona-sari' ? (
            /* Rambut Mbak Sari: Gelung anggun rapi */
            <g fill="#1C1410">
              <path d="M-19 20 C-20 6, 20 6, 19 20 C18 12, 10 9, 0 10 C-10 11, -17 15, -19 20 Z" />
              <ellipse cx="0" cy="5" rx="10" ry="7" fill="#1C1410" />
              <path d="M-18 20 C-18 36, -14 42, -13 42 C-16 34, -16 24, -18 20 Z" />
              <path d="M18 20 C18 36, 14 42, 13 42 C16 34, 16 24, 18 20 Z" />
            </g>
          ) : (
            /* Caping / Blangkon Pak Broto */
            <g>
              <path d="M-28 16 Q0 -6 28 16 Q0 10 -28 16 Z" fill="#9C7338" stroke="#5E431B" strokeWidth="1.5" />
              <path d="M-18 14 C-12 8, 12 8, 18 14" fill="#3D2B1A" />
            </g>
          )}

          {/* Alis Mata Natural */}
          <path d="M-12 24 Q-8 22 -4 24" fill="none" stroke="#221811" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 24 Q8 22 12 24" fill="none" stroke="#221811" strokeWidth="1.8" strokeLinecap="round" />

          {/* Mata Manusia (Lelah Kedinginan vs Senyum Lega) */}
          {isWarmSmile ? (
            /* Mata tersenyum hangat, sedikit melengkung ramah */
            <g stroke="#221811" strokeWidth="1.8" fill="none" strokeLinecap="round">
              <path d="M-11 29 Q-8 26 -5 29" />
              <path d="M5 29 Q8 26 11 29" />
              {/* Garis senyum lembut di sudut mata */}
              <line x1="-12" y1="28" x2="-13" y2="29" strokeWidth="1" stroke="#A86E45" />
              <line x1="12" y1="28" x2="13" y2="29" strokeWidth="1" stroke="#A86E45" />
            </g>
          ) : (
            /* Mata lelah menahan dingin, kelopak sedikit sayu */
            <g>
              <ellipse cx="-8" cy="28" rx="2.8" ry="2" fill="#FAF6EE" />
              <ellipse cx="8" cy="28" rx="2.8" ry="2" fill="#FAF6EE" />
              <circle cx="-8" cy="28" r="1.6" fill="#1C140E" />
              <circle cx="8" cy="28" r="1.6" fill="#1C140E" />
              {/* Garis kantung mata kelelahan malam */}
              <path d="M-11 31 Q-8 33 -5 31" fill="none" stroke="#9E653F" strokeWidth="1" opacity="0.75" />
              <path d="M5 31 Q8 33 11 31" fill="none" stroke="#9E653F" strokeWidth="1" opacity="0.75" />
            </g>
          )}

          {/* Hidung Berdimensi */}
          <path d="M-1 25 L-2 34 L1 34" fill="none" stroke="#A3663C" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="0" cy="34" rx="3.5" ry="1.2" fill="#BA794C" opacity="0.6" />

          {/* Mulut & Ekspresi */}
          {isWarmSmile ? (
            /* Senyum hangat dan lega */
            <g>
              <path d="M-6 41 Q0 47 6 41" fill="none" stroke="#873223" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M-7 41 Q-6 39 -5 41" fill="none" stroke="#A35442" strokeWidth="1" />
              <path d="M7 41 Q6 39 5 41" fill="none" stroke="#A35442" strokeWidth="1" />
            </g>
          ) : (
            /* Bibir agak rapat menggigil dingin */
            <path d="M-5 42 Q-2 40 0 42 Q2 44 5 42" fill="none" stroke="#7A422D" strokeWidth="1.8" strokeLinecap="round" />
          )}

          {/* Butir Gerimis / Tetes Air di Bahu (Jika Kedinginan Hujan) */}
          {isRain && !isWarmSmile && (
            <g fill="#B4DCF5" opacity="0.8">
              <circle cx="-22" cy="74" r="1.8" />
              <circle cx="-16" cy="66" r="1.4" />
              <circle cx="20" cy="72" r="1.6" />
              <circle cx="26" cy="80" r="1.4" />
            </g>
          )}

          {/* 4. Gestur Tangan & Cangkir Blirik */}
          {isServed ? (
            /* Kedua tangan memeluk Cangkir Blirik hangat */
            <g transform="translate(0, 78)">
              {/* Uap Hangat Wedang Mengepul Nyata */}
              {!isColdOutcome && (
                <g stroke="#FFFDF8" strokeWidth="1.6" fill="none" opacity="0.75" className="svg-steam-float">
                  <path d="M-4 -4 Q-8 -14 -3 -22" />
                  <path d="M2 -3 Q0 -13 5 -20" />
                  <path d="M8 -5 Q12 -15 6 -24" />
                </g>
              )}

              {/* Badan Cangkir Blirik */}
              <rect x="-14" y="0" width="28" height="22" rx="3" fill="url(#blirikGreen)" stroke="#22332A" strokeWidth="1.5" />
              {/* Lis Perak Bibir Cangkir */}
              <ellipse cx="0" cy="0" rx="14" ry="3" fill="#D9DBD5" stroke="#333" strokeWidth="1" />
              {/* Gagang Cangkir */}
              <path d="M14 4 C20 4, 20 16, 14 16" fill="none" stroke="#22332A" strokeWidth="2.5" />

              {/* Tangan Kiri & Kanan Memeluk Cangkir */}
              <ellipse cx="-16" cy="11" rx="5.5" ry="7" fill="#C9895E" stroke="#9C6036" strokeWidth="1" />
              <ellipse cx="16" cy="11" rx="5.5" ry="7" fill="#C9895E" stroke="#9C6036" strokeWidth="1" />
            </g>
          ) : (
            /* Tangan bersedekap di dada menahan dingin angin malam */
            <g>
              <path d="M-24 84 Q0 94 24 84" fill="none" stroke={jacketShadow} strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="-8" cy="88" rx="6" ry="4" fill="#BA794C" />
              <ellipse cx="8" cy="88" rx="6" ry="4" fill="#BA794C" />
            </g>
          )}
        </g>

        {/* 5. Rintik Hujan Realistis di Luar Tenda Angkringan */}
        {isRain && (
          <g className="svg-rain-layer" stroke="#B0D8F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
            <line x1="20" y1="12" x2="12" y2="38" className="rain-line r1" />
            <line x1="46" y1="28" x2="38" y2="56" className="rain-line r2" />
            <line x1="74" y1="8" x2="66" y2="34" className="rain-line r3" />
            <line x1="92" y1="46" x2="84" y2="76" className="rain-line r1" />
            <line x1="28" y1="86" x2="20" y2="116" className="rain-line r2" />
            <line x1="62" y1="110" x2="54" y2="142" className="rain-line r3" />
            <line x1="86" y1="136" x2="78" y2="168" className="rain-line r1" />
            <line x1="14" y1="144" x2="6" y2="174" className="rain-line r2" />
          </g>
        )}
      </svg>
    </div>
  );
}
