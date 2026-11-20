// ==========================================================================
// ANGKRINGAN PAK ILMU — SUMBER DATA TUNGGAL PERMAINAN
// Gredupedia #7: Karsa Kala Saka Rasa Tujumu Makna
// Prinsip Konten: Ringkas, Edukatif, Tanpa Klaim Medis Berlebihan, Konsisten
// ==========================================================================

export const GAME_INFO = {
  title: "Angkringan Pak Ilmu",
  subtitle: "Pesanan yang Tak Biasa",
  exhibition: "Karsa Kala Saka Rasa Tujumu Makna",
  zone: "Zona Dhandanggula",
  targetDuration: "5–7 Menit"
};

// Utilitas Pengacakan Stabil (Fisher-Yates)
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Acak urutan langkah sehingga tidak pernah langsung tersusun benar sejak awal
export function derangeSequence(steps) {
  let shuffled = shuffleArray(steps);
  let attempts = 0;
  while (shuffled.every((s, i) => s.correctOrder === i + 1) && attempts < 12) {
    shuffled = shuffleArray(steps);
    attempts++;
  }
  if (shuffled.every((s, i) => s.correctOrder === i + 1) && shuffled.length > 1) {
    const tmp = shuffled[0];
    shuffled[0] = shuffled[1];
    shuffled[1] = tmp;
  }
  return shuffled;
}

// --------------------------------------------------------------------------
// 1. TIKET PESANAN PENGUNJUNG
// --------------------------------------------------------------------------
export const ORDER_TICKETS = [
  {
    id: "order-danang",
    title: "Pesanan Malam Berhujan",
    sender: "Mas Danang",
    time: "Malam Hujan Deras, Malioboro",
    image: "/background/tiketpesanan.png",
    text: "Badan menggigil kedinginan diterpa hujan, langkah terasa berat. Tolong racikkan segelas minuman yang menghangatkan badan dan menenangkan pikiran.",
    notes: [
      "Basah kuyup diterpa hujan deras.",
      "Butuh sensasi hangat mendalam & aroma menenangkan."
    ]
  },
  {
    id: "order-sari",
    title: "Pesanan Penawar Lelah Lembur",
    sender: "Mbak Sari",
    time: "Larut Malam Seusai Bekerja",
    image: "/background/tiketpesanan.png",
    text: "Kepala terasa penat seusai lembur larut, rindu suasana hangat kampung halaman. Beri aku seduhan beraroma segar dan manis lembut.",
    notes: [
      "Kelelahan pikiran selepas bekerja larut.",
      "Cocok dengan aroma wangi lembut & rasa manis teduh."
    ]
  },
  {
    id: "order-broto",
    title: "Pesanan Pengayuh Becak Malam",
    sender: "Pak Broto",
    time: "Dini Hari Angin Selatan",
    image: "/background/tiketpesanan.png",
    text: "Lutut terasa kaku setelah mengayuh jauh menembus angin malam. Buatkan wedang hangat mantap dengan manis aren agar bertenaga kembali.",
    notes: [
      "Tubuh lelah & kedinginan angin malam.",
      "Butuh hangat pedas alami & manis energi gula aren."
    ]
  }
];

export const ORDER_TICKET = ORDER_TICKETS[0];

// --------------------------------------------------------------------------
// 2. DAFTAR INVENTARIS UTAMA (SUMBER KEBENARAN TUNGGAL BABAK 1, 2, 3)
// Seluruh nama, ID, kategori, gambar, dan fungsi merujuk ke tabel induk ini.
// --------------------------------------------------------------------------
export const MASTER_ANGKRINGAN_INVENTORY = {
  // --- KELOMPOK BAHAN REMPAH (category: "bahan") ---
  jahe: {
    id: "jahe",
    name: "Jahe Emprit Bakar",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/jahe.svg",
    desc: "Rimpang pedas yang dibakar sejenak di atas bara agar wanginya keluar.",
    clue: "Memberi sensasi hangat kuat di badan dan tenggorokan.",
    hint: "Berasal dari rimpang tanaman alami (Bahan Rempah).",
    property: "Sensasi hangat kuat & pedas lembut",
    suitableFor: ["dingin", "kaku", "hangat"]
  },
  serai: {
    id: "serai",
    name: "Batang Serai Wangi",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/sereh.svg",
    desc: "Batang beraroma sitrus segar yang dimemarkan sebelum diseduh.",
    clue: "Aromanya segar dan membantu suasana hati terasa lebih tenang.",
    hint: "Tanaman aromatik berumpun alami (Bahan Rempah).",
    property: "Aroma segar menenangkan suasana",
    suitableFor: ["penat", "tenang", "dingin"]
  },
  gula_aren: {
    id: "gula_aren",
    name: "Gula Jawa Aren",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/gula_aren.svg",
    desc: "Bongkahan pemanis alami dari nira aren dengan wangi karamel legit.",
    clue: "Menyeimbangkan rasa pedas rempah dan memberi rasa nyaman.",
    hint: "Olahan alami nira pohon aren (Bahan Rempah).",
    property: "Manis lembut pembangkit tenaga",
    suitableFor: ["lelah", "manis", "tenaga"]
  },
  cengkeh: {
    id: "cengkeh",
    name: "Bunga Cengkeh",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/cengkeh.svg",
    desc: "Kuncup bunga kering beraroma harum hangat khas Nusantara.",
    clue: "Cukup beberapa butir untuk memperkaya wangi seduhan malam.",
    hint: "Bunga rempah kering alami (Bahan Rempah).",
    property: "Aroma harum klasik penghangat rasa",
    suitableFor: ["penat", "dingin", "wangi"]
  },
  kayu_manis: {
    id: "kayu_manis",
    name: "Kulit Kayu Manis",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/kayu_manis.svg",
    desc: "Kulit batang kering dengan aroma manis lembut yang menenangkan.",
    clue: "Membuat rasa wedang terasa lebih bulat dan ramah di tenggorokan.",
    hint: "Kulit batang rempah alami (Bahan Rempah).",
    property: "Aroma manis lembut & hangat",
    suitableFor: ["manis", "tenang", "wangi"]
  },
  kunyit: {
    id: "kunyit",
    name: "Rimpang Kunyit",
    category: "bahan",
    tag: "Bahan Rempah",
    image: "/assets/spices/kunyit.svg",
    desc: "Rimpang berwarna kuning keemasan dengan aroma khas jamu tradisional.",
    clue: "Memberi warna kuning hangat dan rasa gurih bumi yang lembut.",
    hint: "Rimpang tanaman rempah alami (Bahan Rempah).",
    property: "Hangat lembut ramah di perut",
    suitableFor: ["perut", "nyaman", "lembut"]
  },

  // --- KELOMPOK PERALATAN ANGKRINGAN (category: "alat") ---
  ceret: {
    id: "ceret",
    name: "Ceret Tembaga",
    category: "alat",
    tag: "Peralatan",
    image: "/background/cerek.png",
    desc: "Wadah perebus air di atas anglo arang agar panasnya merata.",
    clue: "Air mendidih sempurna membantu sari jahe dan serai keluar maksimal.",
    hint: "Benda perkakas perebus air (Peralatan).",
    property: "Penjaga suhu didih air"
  },
  cangkir: {
    id: "cangkir",
    name: "Cangkir Blirik",
    category: "alat",
    tag: "Peralatan",
    image: "/background/cangkir.png",
    desc: "Gelas enamel loreng hijau-putih khas angkringan Yogyakarta.",
    clue: "Menahan panas minuman sekaligus menjadi simbol kehangatan akrab.",
    hint: "Wadah penyajian minuman (Peralatan).",
    property: "Wadah saji penahan hangat"
  },
  cobek: {
    id: "cobek",
    name: "Cobek & Ulekan",
    category: "alat",
    tag: "Peralatan",
    image: "/assets/tools/cobek.svg",
    desc: "Peralatan batu untuk mememarkan jahe dan serai sebelum diseduh.",
    clue: "Rimpang cukup dimemarkan perlahan agar saripati mudah larut.",
    hint: "Perkakas batu pememar bahan (Peralatan).",
    property: "Pememar batang serai & jahe"
  },
  sendok: {
    id: "sendok",
    name: "Sendok Kayu",
    category: "alat",
    tag: "Peralatan",
    image: "/assets/tools/sendok.svg",
    desc: "Pengaduk kayu jati agar gula aren larut merata tanpa merusak cangkir.",
    clue: "Mengaduk perlahan menyatukan manis gula dan hangatnya rempah.",
    hint: "Perkakas pengaduk minuman (Peralatan).",
    property: "Pengaduk seduhan hangat"
  },
  saringan: {
    id: "saringan",
    name: "Saringan Kain",
    category: "alat",
    tag: "Peralatan",
    image: "/assets/tools/saringan.svg",
    desc: "Saringan tradisional pemisah ampas rempah agar seduhan bersih.",
    clue: "Memastikan wedang nyaman diminum tanpa ampas kasar.",
    hint: "Perkakas penyaring minuman (Peralatan).",
    property: "Penyaring seduhan jernih"
  }
};

// Daftar pool lengkap untuk komponen lain yang mengimpornya
export const SORT_ITEMS_POOL = Object.values(MASTER_ANGKRINGAN_INVENTORY);

// Bahan Pantry Babak 3 bersumber tunggal dari MASTER_ANGKRINGAN_INVENTORY
export const PANTRY_INGREDIENTS = [
  MASTER_ANGKRINGAN_INVENTORY.jahe,
  MASTER_ANGKRINGAN_INVENTORY.serai,
  MASTER_ANGKRINGAN_INVENTORY.gula_aren,
  MASTER_ANGKRINGAN_INVENTORY.cengkeh,
  MASTER_ANGKRINGAN_INVENTORY.kayu_manis,
  MASTER_ANGKRINGAN_INVENTORY.kunyit
];

// --------------------------------------------------------------------------
// 3. BABAK 1: AKU BERKARYA (OBJEK EKSPLORASI = OBJEK PENATAAN, 100% KONSISTEN!)
// --------------------------------------------------------------------------
export const ACT_1_VARIANTS = [
  // Sesi 0 (Utama: Mas Danang) -> 8 benda meja gerobak (4 bahan + 4 alat)
  {
    id: "act1-v0",
    name: "Meja Gerobak Utama",
    objects: [
      { ...MASTER_ANGKRINGAN_INVENTORY.ceret,     hasHiddenNote: true, noteId: "note-1" },
      { ...MASTER_ANGKRINGAN_INVENTORY.jahe,      hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.serai,     hasHiddenNote: true, noteId: "note-2" },
      { ...MASTER_ANGKRINGAN_INVENTORY.cobek,     hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.gula_aren, hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.cangkir,   hasHiddenNote: true, noteId: "note-3" },
      { ...MASTER_ANGKRINGAN_INVENTORY.cengkeh,   hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.sendok,    hasHiddenNote: false }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        num: 1,
        objectId: "ceret",
        foundAt: "Ceret Tembaga",
        text: "Kenali dulu dingin yang dibawa tamu, lalu siapkan air mendidih matang."
      },
      {
        id: "note-2",
        num: 2,
        objectId: "serai",
        foundAt: "Batang Serai Wangi",
        text: "Memarkan jahe dan serai perlahan agar wangi segarnya larut bersama."
      },
      {
        id: "note-3",
        num: 3,
        objectId: "cangkir",
        foundAt: "Cangkir Blirik",
        text: "Sajikan dalam cangkir blirik hangat dengan sapaan yang tulus."
      }
    ]
  },

  // Sesi 1 (Mbak Sari)
  {
    id: "act1-v1",
    name: "Meja Rempah Aromatik",
    objects: [
      { ...MASTER_ANGKRINGAN_INVENTORY.serai,      hasHiddenNote: true, noteId: "note-1" },
      { ...MASTER_ANGKRINGAN_INVENTORY.kayu_manis, hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.ceret,      hasHiddenNote: true, noteId: "note-2" },
      { ...MASTER_ANGKRINGAN_INVENTORY.saringan,   hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.gula_aren,  hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.cengkeh,    hasHiddenNote: true, noteId: "note-3" },
      { ...MASTER_ANGKRINGAN_INVENTORY.cangkir,    hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.sendok,     hasHiddenNote: false }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        num: 1,
        objectId: "serai",
        foundAt: "Batang Serai Wangi",
        text: "Aroma serai dan kayu manis membantu pikiran terasa lebih tenang."
      },
      {
        id: "note-2",
        num: 2,
        objectId: "ceret",
        foundAt: "Ceret Tembaga",
        text: "Seduh dengan air matang agar keharuman rempah tidak menguap sia-sia."
      },
      {
        id: "note-3",
        num: 3,
        objectId: "cengkeh",
        foundAt: "Bunga Cengkeh",
        text: "Tambahkan cengkeh secukupnya lalu beri manis gula aren seimbang."
      }
    ]
  },

  // Sesi 2 (Pak Broto)
  {
    id: "act1-v2",
    name: "Meja Anglo Tengah Malam",
    objects: [
      { ...MASTER_ANGKRINGAN_INVENTORY.jahe,      hasHiddenNote: true, noteId: "note-1" },
      { ...MASTER_ANGKRINGAN_INVENTORY.cobek,     hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.kunyit,    hasHiddenNote: true, noteId: "note-2" },
      { ...MASTER_ANGKRINGAN_INVENTORY.ceret,     hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.gula_aren, hasHiddenNote: true, noteId: "note-3" },
      { ...MASTER_ANGKRINGAN_INVENTORY.cangkir,   hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.serai,     hasHiddenNote: false },
      { ...MASTER_ANGKRINGAN_INVENTORY.saringan,  hasHiddenNote: false }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        num: 1,
        objectId: "jahe",
        foundAt: "Jahe Emprit Bakar",
        text: "Bakar jahe sejenak dan memarkan di cobek sebelum diseduh."
      },
      {
        id: "note-2",
        num: 2,
        objectId: "kunyit",
        foundAt: "Rimpang Kunyit",
        text: "Padukan kunyit dan serai untuk rasa hangat yang nyaman di perut."
      },
      {
        id: "note-3",
        num: 3,
        objectId: "gula_aren",
        foundAt: "Gula Jawa Aren",
        text: "Larutkan gula aren asli sebagai penambah tenaga bagi pejalan malam."
      }
    ]
  }
];

export const ACT_1_DATA = {
  id: "act-1",
  zone: "Aku Berkarya",
  title: "Babak 1: Pesanan Pertama",
  objective: "Periksa benda di gerobak, temukan 3 sobekan resep, lalu kelompokkan Bahan Rempah dan Peralatan.",
  guide: {
    title: "Panduan Babak 1",
    description: "Amati benda-benda di gerobak Pak Ilmu lalu kelompokkan mana yang Bahan Rempah dan mana yang Peralatan.",
    steps: [
      "Periksa benda di meja gerobak untuk menemukan 3 sobekan resep.",
      "Buka tab Penataan dan kelompokkan setiap benda ke Wadah Rempah atau Rak Peralatan.",
      "Jika salah, kamu diberi 1 kesempatan ulang beserta petunjuk singkat."
    ],
    hints: [
      { level: "Petunjuk 1", text: "Ketuk setiap gambar di meja gerobak. Ada 3 catatan tersembunyi." },
      { level: "Petunjuk 2", text: "Bahan Rempah berasal dari tumbuhan/nira (Jahe, Serai, Gula Aren, Cengkeh). Rak Peralatan berisi perkakas (Ceret, Cangkir, Cobek, Sendok)." }
    ]
  }
};

// --------------------------------------------------------------------------
// 4. BABAK 2: RESEP YANG HILANG (KITA BERKARYA)
// --------------------------------------------------------------------------
export const ACT_2_PUZZLE_VARIANTS = [
  {
    id: "puz-v0",
    title: "Naskah Wedang Uwuh Hangat",
    pieces: [
      {
        id: "p1",
        slot: 0,
        title: "Bagian 1",
        structureRole: "Pembuka",
        text: "Sapa tamu dengan ramah, lalu pilih jahe emprit bakar yang harum..."
      },
      {
        id: "p2",
        slot: 1,
        title: "Bagian 2",
        structureRole: "Isi 1",
        text: "...memarkan batang serai dan tambahkan cengkeh ke dalam cangkir..."
      },
      {
        id: "p3",
        slot: 2,
        title: "Bagian 3",
        structureRole: "Isi 2",
        text: "...tuang air mendidih dari ceret tembaga hingga sari rempah keluar..."
      },
      {
        id: "p4",
        slot: 3,
        title: "Bagian 4",
        structureRole: "Penutup",
        text: "...aduk manis gula aren dan sajikan hangat dengan senyum tulus."
      }
    ]
  },
  {
    id: "puz-v1",
    title: "Naskah Seduhan Penenang Malam",
    pieces: [
      {
        id: "p1-b",
        slot: 0,
        title: "Bagian 1",
        structureRole: "Pembuka",
        text: "Dengarkan cerita pelanggan, lalu siapkan serai wangi dan kayu manis..."
      },
      {
        id: "p2-b",
        slot: 1,
        title: "Bagian 2",
        structureRole: "Isi 1",
        text: "...memarkan rimpang perlahan agar wangi alaminya siap diseduh..."
      },
      {
        id: "p3-b",
        slot: 2,
        title: "Bagian 3",
        structureRole: "Isi 2",
        text: "...guyur air panas matang hingga warna hangat kekuningan merata..."
      },
      {
        id: "p4-b",
        slot: 3,
        title: "Bagian 4",
        structureRole: "Penutup",
        text: "...serahkan dengan kedua tangan seraya mendoakan langkah mereka."
      }
    ]
  }
];

export const ACT_2_SEQUENCE_VARIANTS = [
  {
    id: "seq-v0",
    title: "Urutan Meracik Wedang",
    steps: [
      {
        id: "seq-1",
        correctOrder: 1,
        label: "Dengar",
        text: "Sapa dan dengarkan kebutuhan pengunjung terlebih dahulu.",
        image: "/assets/steps/step1_dengar.svg"
      },
      {
        id: "seq-2",
        correctOrder: 2,
        label: "Memarkan",
        text: "Memarkan jahe bakar dan batang serai di atas cobek.",
        image: "/assets/steps/step2_memar.svg"
      },
      {
        id: "seq-3",
        correctOrder: 3,
        label: "Seduh",
        text: "Tuang air mendidih dari ceret tembaga agar sarinya larut.",
        image: "/assets/steps/step3_seduh.svg"
      },
      {
        id: "seq-4",
        correctOrder: 4,
        label: "Sajikan",
        text: "Larutkan gula aren dan sajikan hangat dalam cangkir blirik.",
        image: "/assets/steps/step4_saji.svg"
      }
    ]
  }
];

// Pasangan Khasiat & Kebutuhan (HANYA bahan dari inventaris resmi + BEBAS KLAIM MEDIS)
export const MATCHING_PAIRS_POOL = [
  {
    id: "m1",
    condition: "Badan menggigil diterpa hujan malam",
    remedy: "Jahe Emprit Bakar",
    explanation: "Jahe emprit memberi rasa pedas hangat yang cepat menghangatkan badan.",
    spiceImage: "/assets/spices/jahe.svg"
  },
  {
    id: "m2",
    condition: "Pikiran penat dan butuh rasa tenang",
    remedy: "Batang Serai Wangi",
    explanation: "Wangi sitrus segar dari batang serai membuat suasana terasa lebih rileks.",
    spiceImage: "/assets/spices/sereh.svg"
  },
  {
    id: "m3",
    condition: "Tenaga terasa habis seusai beraktivitas",
    remedy: "Gula Jawa Aren",
    explanation: "Manis alami nira aren memberi asupan energi manis yang lembut.",
    spiceImage: "/assets/spices/gula_aren.svg"
  },
  {
    id: "m4",
    condition: "Tenggorokan terasa kering karena angin malam",
    remedy: "Kulit Kayu Manis",
    explanation: "Aroma dan rasa manis hangat kayu manis terasa ramah di tenggorokan.",
    spiceImage: "/assets/spices/kayu_manis.svg"
  },
  {
    id: "m5",
    condition: "Menginginkan aroma rempah hangat khas tradisi",
    remedy: "Bunga Cengkeh",
    explanation: "Cengkeh kering menghadirkan wangi klasik Nusantara yang hangat.",
    spiceImage: "/assets/spices/cengkeh.svg"
  },
  {
    id: "m6",
    condition: "Perut terasa kurang nyaman di udara dingin",
    remedy: "Rimpang Kunyit",
    explanation: "Seduhan kunyit hangat memberi rasa nyaman dan lembut di perut.",
    spiceImage: "/assets/spices/kunyit.svg"
  }
];

export const ACT_2_DATA = {
  id: "act-2",
  zone: "Kita Berkarya",
  title: "Babak 2: Resep yang Hilang",
  objective: "Rangkai naskah kuno, susun urutan meracik, dan pasangkan rempah sesuai kebutuhan.",
  guide: {
    title: "Panduan Babak 2",
    description: "Satukan kepingan resep kuno menjadi pedoman meracik yang utuh.",
    steps: [
      "Jigsaw Naskah: Pilih kepingan di kiri lalu klik slot Pembuka, Isi, atau Penutup di kanan.",
      "Urutan Seduh: Atur urutan 1–4 memakai tombol panah naik/turun.",
      "Khasiat & Raga: Hubungkan kondisi tamu dengan rempah yang cocok."
    ],
    hints: [
      { level: "Petunjuk Jigsaw", text: "Pembuka memulai dari niat & bahan awal; Isi meramu & menyeduh; Penutup mengaduk & menyajikan." },
      { level: "Petunjuk Urutan", text: "Selalu mulai dari mendengarkan tamu sebelum mememarkan rempah, menyeduh, lalu menyajikan." }
    ]
  }
};

// --------------------------------------------------------------------------
// 5. BABAK 3: UNTUK SIAPA RACIKAN INI? (EVALUASI FLEKSIBEL TANPA MUTLAK)
// --------------------------------------------------------------------------
export function evaluateCustomRecipe(personaId, selectedIngredientIds = [], servingTemp = 'hangat_panas') {
  const hasJahe = selectedIngredientIds.includes('jahe');
  const hasSerai = selectedIngredientIds.includes('serai');
  const hasGula = selectedIngredientIds.includes('gula_aren');
  const hasCengkeh = selectedIngredientIds.includes('cengkeh');
  const hasKayuManis = selectedIngredientIds.includes('kayu_manis');
  const hasKunyit = selectedIngredientIds.includes('kunyit');
  const count = selectedIngredientIds.length;

  if (count === 0) {
    return {
      tier: 'empty',
      badge: 'Cangkir Kosong',
      score: 0,
      analysis: 'Pilih minimal 1–2 rempah yang paling sesuai dengan cerita pengunjung.',
      recommendation: 'Misalnya padukan Jahe Emprit dengan Serai atau Gula Aren.'
    };
  }

  // Kasus 1: Mas Danang (Kehujanan Malioboro -> butuh hangat & penenang, 2+ bahan sudah sah)
  if (personaId === 'persona-danang') {
    if (servingTemp === 'dingin_es') {
      return {
        tier: 'kurang_sesuai',
        badge: 'Kurang Sesuai',
        score: 58,
        analysis: 'Mas Danang baru saja kehujanan dan kedinginan. Minuman dingin berbatu es kurang cocok karena tidak memberi kehangatan yang ia butuhkan.',
        recommendation: 'Saran: Pilih penyajian hangat panas dan utamakan Jahe Emprit atau Serai.'
      };
    }

    if (hasJahe && (hasSerai || hasCengkeh || hasKayuManis) && (count >= 2)) {
      return {
        tier: 'sangat_sesuai',
        badge: 'Sangat Sesuai',
        score: count >= 3 && hasGula ? 98 : 92,
        analysis: hasGula
          ? 'Racikan pas untuk malam hujan: jahe menghangatkan raga, serai/cengkeh memberi wangi menenangkan, dan gula aren menyeimbangkan rasa.'
          : 'Kombinasi jahe dan rempah aromatik ini pas menghangatkan tubuh Mas Danang sekaligus menenangkan suasananya.',
        recommendation: hasGula
          ? 'Paduan lengkap dan nyaman dinikmati selagi hangat.'
          : 'Racikan 2 bahan ini sudah kuat; boleh tambah gula aren jika suka lebih manis.'
      };
    }

    if (hasJahe || hasSerai || hasKunyit) {
      return {
        tier: 'cukup_sesuai',
        badge: 'Cukup Sesuai',
        score: 80,
        analysis: 'Seduhan hangat ini cukup menenangkan Mas Danang yang kelelahan kehujanan, meski kehangatan jahe/aroma penenang masih dapat diperkaya.',
        recommendation: hasJahe
          ? 'Menambahkan Serai atau Cengkeh akan membuat aromanya lebih menenteramkan.'
          : 'Menambahkan Jahe Emprit memberi sensasi hangat lebih terasa setelah kehujanan.'
      };
    }

    return {
      tier: 'cukup_sesuai',
      badge: 'Cukup Sesuai',
      score: 75,
      analysis: 'Minuman hangat ini tetap memberi rasa nyaman bagi Mas Danang sebagai teman berteduh.',
      recommendation: 'Untuk kondisi basah kuyup, Jahe Emprit paling membantu mengusir dingin.'
    };
  }

  // Kasus 2: Mbak Sari (Lelah lembur -> butuh aroma penenang & manis lembut)
  if (personaId === 'persona-sari') {
    if (servingTemp === 'dingin_es') {
      return {
        tier: 'kurang_sesuai',
        badge: 'Kurang Sesuai',
        score: 60,
        analysis: 'Di malam larut setelah lembur, minuman hangat lebih memberi rasa nyaman daripada es dingin.',
        recommendation: 'Gunakan penyajian hangat dengan aroma Serai, Kayu Manis, atau Cengkeh.'
      };
    }
    if ((hasSerai || hasKayuManis || hasCengkeh) && (count >= 2)) {
      return {
        tier: 'sangat_sesuai',
        badge: 'Sangat Sesuai',
        score: 95,
        analysis: 'Wangi segar serai dan lembutnya rempah menghadirkan suasana teduh yang membantu Mbak Sari melepas penat.',
        recommendation: 'Sajikan hangat dengan sapaan yang ramah dan tulus.'
      };
    }
    return {
      tier: 'cukup_sesuai',
      badge: 'Cukup Sesuai',
      score: 82,
      analysis: 'Racikan hangat ini memberi jeda santai bagi Mbak Sari setelah bekerja keras.',
      recommendation: 'Menambahkan Serai atau Kayu Manis akan memperkaya aroma yang menenangkan.'
    };
  }

  // Kasus 3: Pak Broto (Angin malam -> butuh hangat kuat & manis energi gula aren)
  if (servingTemp === 'dingin_es') {
    return {
      tier: 'kurang_sesuai',
      badge: 'Kurang Sesuai',
      score: 55,
      analysis: 'Setelah mengayuh jauh menembus angin malam, minuman es dingin justru membuat badan terasa kurang nyaman.',
      recommendation: 'Sajikan hangat dengan Jahe Emprit dan Gula Jawa Aren.'
    };
  }
  if (hasJahe && hasGula && count >= 2) {
    return {
      tier: 'sangat_sesuai',
      badge: 'Sangat Sesuai',
      score: 96,
      analysis: 'Paduan mantap: hangatnya jahe emprit dan manis legit gula aren cocok menemani Pak Broto beristirahat.',
      recommendation: 'Kombinasi klasik andalan angkringan untuk pengayuh malam.'
    };
  }
  return {
    tier: 'cukup_sesuai',
    badge: 'Cukup Sesuai',
    score: 80,
    analysis: 'Wedang hangat ini membantu Pak Broto merasa lebih hangat dan nyaman beristirahat.',
    recommendation: 'Kombinasi Jahe Emprit dan Gula Aren sangat disukai setelah menempuh angin malam.'
  };
}

export const ACT_3_PERSONAS = [
  {
    id: "persona-danang",
    name: "Mas Danang",
    role: "Pengelana Malam",
    condition: "Basah kuyup, kedinginan & pikiran gundah",
    contextBadge: "Hujan Deras Malioboro",
    weatherType: "rain",
    story: "Hujan deras di Malioboro bikin bajuku basah kuyup dan badan menggigil. Pikiranku juga sedang gundah. Ada minuman hangat yang bisa bikin badan lebih nyaman?",
    clue: "Basah kuyup kedinginan cocok dengan sensasi hangat jahe dan aroma tenang serai.",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Teh Manis Es Dingin",
        desc: "Cepat menghilangkan haus dengan es batu segar.",
        feedback: "Kurang pas. Ia sedang basah kuyup kedinginan, minuman es justru tidak membantu menghangatkan badan.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Wedang Rempah Hangat Penuh Empati",
        desc: "Memilihkan racikan rempah hangat yang sesuai dinginnya hujan serta sapaan ramah.",
        feedback: "Tepat. Kepekaan pada kondisi fisik dan perasaan tamu adalah langkah awal berkontribusi.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Menyarankan Pindah Tempat",
        desc: "Menolak tamu karena teras gerobak mulai basah tempias.",
        feedback: "Angkringan adalah ruang singgah yang hangat dan terbuka bagi siapa saja.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Mangga Mas, diminum selagi hangat. Tiap lelah ada jedanya, semoga langkah besok lebih ringan.",
        tone: "Ramah & Penuh Empati",
        impact: "Mas Danang tersenyum haru merasakan perhatian dan kehangatan.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini pesanannya Mas, silakan langsung diminum ya.",
        tone: "Singkat & Sopan",
        impact: "Minuman diterima dengan baik oleh Mas Danang.",
        score: 80
      }
    ],
    resolutionQuote: "Matur nuwun sanget... Hangatnya wedang dan sapaanmu bikin aku kuat melangkah lagi.",
    resolutionQuoteOk: "Terima kasih banyak, Mas. Hangatnya sudah cukup membuatku lebih tenang berteduh di sini.",
    resolutionQuoteCold: "Wah, agak dingin di tenggorokan karena baru kehujanan... tapi terima kasih niat baikmu menyambutku berteduh.",
    learningNote: "Racikan yang bermakna lahir saat kita menyesuaikan keahlian dengan kondisi nyata orang lain."
  },
  {
    id: "persona-sari",
    name: "Mbak Sari",
    role: "Perantau Muda",
    condition: "Lelah lembur & rindu kampung halaman",
    contextBadge: "Malam Seusai Lembur",
    weatherType: "wind",
    story: "Kerjaan lembur baru saja selesai, kepala rasanya penuh dan rindu seduhan simbok di desa. Ada minuman beraroma tenang?",
    clue: "Kelelahan pikiran cocok dengan aroma lembut serai, kayu manis, dan manis gula aren.",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Kopi Hitam Pekat Tanpa Gula",
        desc: "Supaya tetap terjaga sampai pagi.",
        feedback: "Kurang pas. Ia justru ingin beristirahat tenang setelah lembur panjang.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Seduhan Aromatik Hangat & Sapaan Teduh",
        desc: "Menonjolkan wangi lembut serai dan gula aren sebagai jeda istirahat.",
        feedback: "Tepat sekali. Ia membutuhkan suasana damai dan minuman beraroma menenangkan.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Tutup Lebih Awal",
        desc: "Meminta pulang langsung karena sudah larut.",
        feedback: "Memberi ruang jeda sebentar dapat sangat berarti bagi perantau yang penat.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Mangga Mbak, nikmati wanginya pelan-pelan. Malam ini saatnya rehat dengan tenang.",
        tone: "Lembut & Menghargai",
        impact: "Mbak Sari menarik napas lega dan tersenyum.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini wedangnya Mbak, diminum mumpung hangat.",
        tone: "Standar",
        impact: "Minuman dinikmati dengan tenang.",
        score: 80
      }
    ],
    resolutionQuote: "Wanginya mirip seduhan simbok di desa... Terima kasih sudah menyediakan ruang jeda ini.",
    resolutionQuoteOk: "Terima kasih ya, kehangatan ini cukup membuat lelah lemburku berkurang.",
    resolutionQuoteCold: "Agak dingin di malam larut, tapi terima kasih sudah mau mendengarkan ceritaku.",
    learningNote: "Empati hadir dalam bentuk sederhana: mendengarkan dan memilihkan hal yang menenangkan."
  },
  {
    id: "persona-broto",
    name: "Pak Broto",
    role: "Pengayuh Becak",
    condition: "Capek berat & diterpa angin malam",
    contextBadge: "Dini Hari Angin Selatan",
    weatherType: "chilly",
    story: "Sudah puluhan kilometer mengayuh becak malam ini. Kaki pegal dan badan rasanya dingin kena angin. Enaknya minum apa ya?",
    clue: "Butuh kehangatan mantap dari jahe emprit dipadu manis energi gula aren.",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Air Es Dingin Biasa",
        desc: "Penghilang haus instan.",
        feedback: "Kurang cocok untuk orang yang baru menembus dinginnya angin dini hari.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Wedang Jahe Hangat & Gula Aren",
        desc: "Menghadirkan rasa hangat kuat serta manis alami untuk memulihkan semangat.",
        feedback: "Tepat. Sesuai untuk kondisi kelelahan fisik dan udara dingin.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Sajian Tanpa Minuman Hangat",
        desc: "Menyajikan camilan kering saja.",
        feedback: "Setelah menembus angin malam, minuman hangat jauh lebih membantu memberi rasa nyaman.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Nyuwun sewu Pak, mangga diunjuk anget-anget. Semoga selalu diparingi kekuatan lan berkah.",
        tone: "Hormat & Penuh Doa",
        impact: "Pak Broto menerima cangkir dengan dua tangan penuh syukur.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini wedangnya Pak, silakan dinikmati.",
        tone: "Sopan Standar",
        impact: "Pak Broto mengangguk ramah dan menikmati minumannya.",
        score: 80
      }
    ],
    resolutionQuote: "Wah mantap, hangatnya langsung terasa di badan. Seperti punya tenaga baru untuk besok pagi.",
    resolutionQuoteOk: "Matur nuwun, minuman hangatnya enak menemani istirahat sebentar.",
    resolutionQuoteCold: "Aduh, agak dingin untuk malam begini... tapi matur nuwun niat baiknya.",
    learningNote: "Pengetahuan menjadi kontribusi sejati ketika menyentuh kebutuhan nyata di sekitar kita."
  }
];

export const ACT_3_DATA = {
  id: "act-3",
  zone: "Karya Kita Berkontribusi",
  title: "Babak 3: Untuk Siapa Racikan Ini?",
  objective: "Pahami kondisi pengunjung, racik kombinasi rempah secara fleksibel, dan sajikan dengan tutur kata ramah.",
  guide: {
    title: "Panduan Babak 3",
    description: "Pilih kombinasi rempah sesuai kebutuhan pengunjung. Tidak harus terpaku pada satu rumus kaku.",
    steps: [
      "Tentukan pendekatan yang sesuai dengan cerita pengunjung.",
      "Pilih 2 atau lebih bahan rempah + suhu seduhan, lalu lihat kesesuaian kontekstualnya.",
      "Pilih tutur kata penyajian dan saksikan reaksi pengunjung."
    ],
    hints: [
      { level: "Petunjuk Konteks", text: "Untuk tamu kehujanan/dingin, minuman hangat berbahan Jahe & Serai/Gula Aren paling nyaman." }
    ]
  }
};

// --------------------------------------------------------------------------
// 6. EPILOG: TOPLES KAWRUH
// --------------------------------------------------------------------------
export const EPILOGUE_VARIANTS = [
  {
    id: "epi-v0",
    theme: "Berbagi Pengetahuan",
    tokens: [
      { id: "t1", text: "Pengetahuan" },
      { id: "t2", text: "Menjadi" },
      { id: "t3", text: "Berarti" },
      { id: "t4", text: "Ketika" },
      { id: "t5", text: "Dibagikan" }
    ],
    correctSentence: "Pengetahuan Menjadi Berarti Ketika Dibagikan",
    reflectionMessage: "Apa yang kita amati sendiri dan rangkai bersama menemukan makna sejatinya ketika dipersembahkan bagi sesama."
  },
  {
    id: "epi-v1",
    theme: "Ketulusan Empati",
    tokens: [
      { id: "t1-b", text: "Karya" },
      { id: "t2-b", text: "Bermakna" },
      { id: "t3-b", text: "Lahir" },
      { id: "t4-b", text: "Dari" },
      { id: "t5-b", text: "Empati" }
    ],
    correctSentence: "Karya Bermakna Lahir Dari Empati",
    reflectionMessage: "Ilmu meracik mencapai puncak keindahannya ketika peka menjawab kebutuhan manusia."
  }
];

export const EPILOGUE_DATA = {
  id: "epilogue",
  title: "Epilog: Toples Kawruh",
  image: "/background/toples.png",
  objective: "Susun kalimat hikmah lalu simpan ke Toples Kawruh.",
  guide: {
    title: "Panduan Epilog",
    description: "Rangkai kata menjadi pesan hikmah penutup.",
    steps: ["Ketuk kata berurutan lalu simpan ke dalam toples."],
    hints: [{ level: "Petunjuk", text: "Susun menjadi kalimat utuh bermakna tentang berbagi pengetahuan." }]
  },
  tokens: EPILOGUE_VARIANTS[0].tokens,
  correctSentence: EPILOGUE_VARIANTS[0].correctSentence,
  reflectionMessage: EPILOGUE_VARIANTS[0].reflectionMessage,
  exhibitionBadge: {
    name: "Peracik Kawruh Dhandanggula",
    motto: "Karsa Kala: Saka Rasa, Tumuju Makna",
    authority: "Pameran Karya Teknologi Pendidikan #7"
  }
};
