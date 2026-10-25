// ==========================================================================
// ANGKRINGAN PAK ILMU — DATA PERMAINAN & KONTEN NARATIF
// Gredupedia #7: Karsa Kala • Zona Dhandanggula (Aku/Kita Berkarya & Kontribusi)
// ==========================================================================

export const GAME_INFO = {
  title: "Angkringan Pak Ilmu",
  subtitle: "Pesanan yang Tak Biasa",
  exhibition: "Gredupedia #7: Karsa Kala",
  tagline: "Saka Rasa, Tumuju Makna",
  department: "Teknologi Pendidikan FIP Universitas Negeri Yogyakarta",
  zone: "Dhandanggula (Karya & Kontribusi)",
  targetDuration: "5 hingga 7 Menit"
};

// Fungsi Utilitas Pengacakan yang Aman & Terverifikasi
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function derangeSequence(steps) {
  let shuffled = shuffleArray(steps);
  let attempts = 0;
  while (shuffled.every((s, i) => s.correctOrder === i + 1) && attempts < 10) {
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
// 1. TIKET PESANAN DENGAN VARIASI SITUASI
// --------------------------------------------------------------------------
export const ORDER_TICKETS = [
  {
    id: "order-mystic-01",
    title: "Tiket Pesanan: Malam Berhawa Dingin",
    sender: "Seorang Pengelana Basah Kuyup",
    time: "Larut Malam di Tengah Hujan Malioboro",
    image: "/background/tiketpesanan.png",
    text: "Tenggorokan tercekat debu jalanan, sendi-sendi ngilu didera angin malam. Jiwa lelah mencari arah, pikiran gundah butuh kehangatan yang menenangkan tanpa memperdaya rasa... Racikkan sesuatu yang bukan sekadar pengisi lambung, melainkan pengingat jati diri dan penentram batin.",
    notes: [
      "Pelanggan kedinginan parah akibat terpaan hujan deras Malioboro.",
      "Butuh kehangatan alami mendalam yang membakar dingin hingga ke tulang.",
      "Butuh sapaan tulus yang menguatkan tekad untuk melanjutkan perjalanan esok."
    ]
  },
  {
    id: "order-mystic-02",
    title: "Tiket Pesanan: Beban Lelah Perantau",
    sender: "Perantau Muda di Ujung Lincak",
    time: "Malam Sunyi Seusai Jam Lembur",
    image: "/background/tiketpesanan.png",
    text: "Napas terasa sesak diimpit hiruk-pikuk kota, dada berat memikul kerinduan pada hangatnya keluarga di kampung halaman. Tubuh tidak sedang sakit, tetapi batin kehilangan ketenangan... Beri aku seteguk seduhan yang aromanya melegakan pikiran dan mengembalikan rasa damai.",
    notes: [
      "Pelanggan mengalami kelelahan mental dan sesak napas akibat ketegangan.",
      "Butuh aroma sereh wangi dan cengkeh yang menyegarkan pernapasan.",
      "Butuh rasa manis alami gula kelapa yang menenteramkan rasa rindu."
    ]
  },
  {
    id: "order-mystic-03",
    title: "Tiket Pesanan: Keringat Pengayuh Malam",
    sender: "Pengayuh Becak Tua Malioboro",
    time: "Dini Hari Menembus Angin Selatan",
    image: "/background/tiketpesanan.png",
    text: "Lutut gemetar menopang roda kehidupan, otot-otot betis tegang dan perut kembung ditiup angin malam. Bukan kemewahan yang kucari, melainkan pulihnya tenaga dan lenyapnya rasa ngilu agar esok raga ini kembali mampu berikhtiar.",
    notes: [
      "Pelanggan mengalami masuk angin berat dan keletihan fisik setelah bekerja keras.",
      "Butuh daya bakar bara jahe emprit untuk mengeluarkan angin di tubuh.",
      "Butuh asupan energi stamina tinggi dari gula kelapa aren asli."
    ]
  }
];

export const ORDER_TICKET = ORDER_TICKETS[0];

// --------------------------------------------------------------------------
// 2. BABAK 1: AKU BERKARYA (DENGAN VARIASI BENDA & TANTANGAN)
// --------------------------------------------------------------------------
export const ACT_1_VARIANTS = [
  // Varian A: Meja Gerobak Klasik
  {
    id: "act1-v0",
    name: "Meja Gerobak Depan",
    objects: [
      {
        id: "ceret",
        name: "Ceret Tiga Tingkat",
        tag: "Piranti Seduh",
        image: "/background/cerek.png",
        desc: "Ceret tembaga khas angkringan yang bertumpuk di atas anglo arang. Bunyi desis uapnya menandakan air mendidih pada suhu yang tepat untuk melarutkan saripati rimpang.",
        clue: "Air yang terlalu dingin takkan membangunkan aroma jahe; air yang mendidih sempurna adalah kunci keikhlasan seduhan.",
        hasHiddenNote: true,
        noteId: "note-1"
      },
      {
        id: "toples_rempah",
        name: "Toples Kaca Rempah Tua",
        tag: "Bahan Alami",
        image: "/background/toples.png",
        desc: "Toples kaca tebal berisi rimpang jahe emprit pilihan, batang sereh wangi, cengkeh, dan kulit kayu manis. Aromanya wangi tajam dan menghangatkan.",
        clue: "Jahe emprit kecil tapi membakar dingin. Dipadukan dengan sereh, ia melancarkan aliran rasa dan pikiran.",
        hasHiddenNote: true,
        noteId: "note-3"
      },
      {
        id: "cangkir_blirik",
        name: "Cangkir Kaleng Blirik",
        tag: "Piranti Saji",
        image: "/background/cangkir.png",
        desc: "Cangkir loreng hijau-putih legendaris penahan panas. Menjadi saksi ratusan perbincangan egaliter tanpa memandang kasta atau gelar.",
        clue: "Wadah sederhana mengajarkan kita bahwa bukan kemewahan bejana yang utama, melainkan kemurnian apa yang disajikan di dalamnya.",
        hasHiddenNote: true,
        noteId: "note-2"
      },
      {
        id: "buku_catatan",
        name: "Jurnal Lusuh Pak Ilmu",
        tag: "Catatan Pembelajar",
        image: "/background/jurnallusuh.png",
        desc: "Buku catatan bersampul kulit kusam. Halamannya sebagian terlipat, berisi tulisan tangan Pak Ilmu tentang perjumpaan manusia dengan persoalan hidupnya.",
        clue: "Karya bermula dari kepekaan meraba kebutuhan sesama. Jangan meracik sebelum kau sungguh-sungguh mendengarkan.",
        hasHiddenNote: false
      },
      {
        id: "lentera_sentir",
        name: "Lampu Sentir Minyak",
        tag: "Penerang Suasana",
        image: "/background/lampusentir.png",
        desc: "Lentera minyak tanah yang memendarkan cahaya temaram keemasan. Menghangatkan gerobak di tengah dinginnya malam kota pelajar.",
        clue: "Cahaya kecil yang ajeg lebih bermakna daripada kilatan petir yang membutakan lalu lenyap dalam sekejap.",
        hasHiddenNote: false
      },
      {
        id: "tiket_pesanan",
        name: "Tiket Pesanan Misterius",
        tag: "Kebutuhan Nyata",
        image: "/background/tiketpesanan.png",
        desc: "Kertas pesanan dari pelanggan di ujung lincak. Berisi bahasa kiasan tentang keletihan fisik dan kegundahan jiwa.",
        clue: "Bukan sekadar dahaga tenggorokan, melainkan kepenatan jiwa yang membutuhkan sapaan hangat dan empati.",
        hasHiddenNote: false
      }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        foundAt: "Di samping Ceret Tembaga Tiga Tingkat",
        text: "Sobekan Resep 1: Kenali dulu dingin macam apa yang merasuk. Dingin raga butuh bara jahe emprit, dingin batin butuh sapaan tulus."
      },
      {
        id: "note-2",
        foundAt: "Di bawah tatakan Cangkir Blirik Loreng",
        text: "Sobekan Resep 2: Jangan terburu-buru memberi manis gula sebelum kepedihan raga terurai oleh kehangatan rempah."
      },
      {
        id: "note-3",
        foundAt: "Di balik Toples Kaca Rempah Tua",
        text: "Sobekan Resep 3: Seduh dengan air yang matang sempurna. Aduk dengan doa kebaikan, sajikan selagi uap masih menari."
      }
    ]
  },

  // Varian B: Sudut Perapian & Penumbuk Rempah
  {
    id: "act1-v1",
    name: "Sudut Perapian & Penumbuk",
    objects: [
      {
        id: "ceret",
        name: "Ceret Tiga Tingkat",
        tag: "Piranti Seduh",
        image: "/background/cerek.png",
        desc: "Ceret tembaga khas angkringan yang bertumpuk di atas anglo arang. Suhu airnya terjaga ajeg untuk ekstraksi minyak atsiri rimpang.",
        clue: "Air panas adalah perantara; tanpa air matang seimbang, saripati rempah takkan luruh menyatu.",
        hasHiddenNote: true,
        noteId: "note-1"
      },
      {
        id: "buku_catatan",
        name: "Jurnal Lusuh Pak Ilmu",
        tag: "Catatan Pembelajar",
        image: "/background/jurnallusuh.png",
        desc: "Buku catatan bersampul kulit kusam berisi resep warisan dan renungan filosofis tentang gotong royong dan kemanusiaan.",
        clue: "Karya sejati lahir saat keterampilan tangan dipandu oleh kelembutan nurani.",
        hasHiddenNote: true,
        noteId: "note-2"
      },
      {
        id: "toples_rempah",
        name: "Toples Kaca Rempah Tua",
        tag: "Bahan Alami",
        image: "/background/toples.png",
        desc: "Toples kaca tebal penyimpan rimpang kering dan rempah aromatik pilihan dari perbukitan Menoreh.",
        clue: "Rempah yang tersimpan rapat mempertahankan keharuman aslinya hingga tiba waktu diseduh.",
        hasHiddenNote: true,
        noteId: "note-3"
      },
      {
        id: "cangkir_blirik",
        name: "Cangkir Kaleng Blirik",
        tag: "Piranti Saji",
        image: "/background/cangkir.png",
        desc: "Bejana saji kaleng enamel bermotif loreng khas tanah Jawa yang menjaga kehangatan wedang lebih lama.",
        clue: "Kesederhanaan rupa menampung kemuliaan rasa.",
        hasHiddenNote: false
      },
      {
        id: "lentera_sentir",
        name: "Lampu Sentir Minyak",
        tag: "Penerang Suasana",
        image: "/background/lampusentir.png",
        desc: "Lentera minyak tanah yang setia menerangi gerobak dan wajah para pengunjung yang singgah.",
        clue: "Terang yang tenang memayungi obrolan yang jujur dari hati ke hati.",
        hasHiddenNote: false
      },
      {
        id: "tiket_pesanan",
        name: "Tiket Pesanan Misterius",
        tag: "Kebutuhan Nyata",
        image: "/background/tiketpesanan.png",
        desc: "Catatan pesanan bernada puitis yang ditinggalkan pengunjung di ujung bangku kayu lincak.",
        clue: "Bacalah getaran batin di balik setiap baris kata yang tertulis.",
        hasHiddenNote: false
      }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        foundAt: "Di celah alas Ceret Tembaga",
        text: "Sobekan Resep 1: Suhu air adalah kesabaran. Seduh pada kematangan sempurna agar saripati jahe menyatu lembut dengan sereh."
      },
      {
        id: "note-2",
        foundAt: "Di balik sampul Jurnal Lusuh Pak Ilmu",
        text: "Sobekan Resep 2: Mememarkan sereh bukan untuk menghancurkannya, melainkan membuka jalan bagi keharumannya untuk keluar."
      },
      {
        id: "note-3",
        foundAt: "Di dasar Toples Kaca Rempah Tua",
        text: "Sobekan Resep 3: Keseimbangan rasa tercipta saat kepedasan bara jahe dipeluk oleh kemanisan teduh gula aren."
      }
    ]
  },

  // Varian C: Lincak Rempah & Ruang Saji
  {
    id: "act1-v2",
    name: "Lincak Rempah Tradisional",
    objects: [
      {
        id: "cangkir_blirik",
        name: "Cangkir Kaleng Blirik",
        tag: "Piranti Saji",
        image: "/background/cangkir.png",
        desc: "Cangkir blirik hijau-putih yang telah menghangatkan ribuan tangan yang gemetar kedinginan.",
        clue: "Cangkir ini mengajarkan bahwa kehangatan sejati harus dibagikan, bukan disimpan sendiri.",
        hasHiddenNote: true,
        noteId: "note-1"
      },
      {
        id: "toples_rempah",
        name: "Toples Kaca Rempah Tua",
        tag: "Bahan Alami",
        image: "/background/toples.png",
        desc: "Toples kaca buram dengan aroma cengkeh, kayu manis, dan kapulaga yang khas dan menenteramkan.",
        clue: "Rempah Nusantara adalah jalinan kekayaan tanah air yang saling melengkapi khasiatnya.",
        hasHiddenNote: true,
        noteId: "note-2"
      },
      {
        id: "tiket_pesanan",
        name: "Tiket Pesanan Misterius",
        tag: "Kebutuhan Nyata",
        image: "/background/tiketpesanan.png",
        desc: "Kertas pesanan lusuh dengan tinta yang agak memudar terpaan tetes air hujan.",
        clue: "Pelanggan ini sedang mencari pegangan di tengah dinginnya malam.",
        hasHiddenNote: true,
        noteId: "note-3"
      },
      {
        id: "ceret",
        name: "Ceret Tiga Tingkat",
        tag: "Piranti Seduh",
        image: "/background/cerek.png",
        desc: "Ceret tembaga penyimpan air mendidih yang selalu mengepulkan uap hangat.",
        clue: "Kehangatan adalah awal dari pulihnya tenaga.",
        hasHiddenNote: false
      },
      {
        id: "buku_catatan",
        name: "Jurnal Lusuh Pak Ilmu",
        tag: "Catatan Pembelajar",
        image: "/background/jurnallusuh.png",
        desc: "Jurnal catatan tentang perjalanan hidup manusia yang singgah di lincak angkringan.",
        clue: "Dengarkan dengan saksama sebelum mengambil kesimpulan.",
        hasHiddenNote: false
      },
      {
        id: "lentera_sentir",
        name: "Lampu Sentir Minyak",
        tag: "Penerang Suasana",
        image: "/background/lampusentir.png",
        desc: "Lentera antik dengan nyala sumbu yang stabil di tengah semilir angin malam.",
        clue: "Cahaya redup yang menghangatkan lebih menenangkan daripada silau yang membingungkan.",
        hasHiddenNote: false
      }
    ],
    hiddenNotes: [
      {
        id: "note-1",
        foundAt: "Di balik tatakan Cangkir Blirik Loreng",
        text: "Sobekan Resep 1: Bejana sederhana mengingatkan kita bahwa niat ikhlas penyaji jauh lebih berharga daripada kemewahan wadah."
      },
      {
        id: "note-2",
        foundAt: "Di balik Toples Kaca Rempah Tua",
        text: "Sobekan Resep 2: Aroma cengkeh dan sereh menenangkan saraf yang tegang, mengembalikan kejernihan pikiran yang kalut."
      },
      {
        id: "note-3",
        foundAt: "Terselip di balik Tiket Pesanan Misterius",
        text: "Sobekan Resep 3: Jangan sekadar menyuguhkan minuman, sertakan doa tulus agar langkah penikmatnya kembali diteguhkan."
      }
    ]
  }
];

// Pool Lengkap Item Sortir untuk Penataan (10 Item)
export const SORT_ITEMS_POOL = [
  // Kategori: Rempah Alami (Bahan)
  { id: "s1", name: "Jahe Emprit Bakar", category: "bahan", hint: "Rimpang pedas alami pembakar hawa dingin" },
  { id: "s2", name: "Gula Jawa Aren", category: "bahan", hint: "Pemanis alami penopang stamina tubuh" },
  { id: "s3", name: "Batang Sereh Wangi", category: "bahan", hint: "Aroma segar pelega pernapasan dan pikiran" },
  { id: "s4", name: "Bunga Cengkeh Kering", category: "bahan", hint: "Kuncup bunga penenang denyut saraf lelah" },
  { id: "s5", name: "Kulit Kayu Manis", category: "bahan", hint: "Kulit batang harum pelaras ritme sirkulasi darah" },

  // Kategori: Piranti Seduh (Alat)
  { id: "s6", name: "Ceret Tembaga", category: "alat", hint: "Wadah air mendidih bersuhu ajeg" },
  { id: "s7", name: "Cangkir Blirik Loreng", category: "alat", hint: "Wadah saji penahan kehangatan seduhan" },
  { id: "s8", name: "Sendok Kayu Jati", category: "alat", hint: "Alat pengaduk agar saripati larut merata" },
  { id: "s9", name: "Saringan Kain Tradisional", category: "alat", hint: "Penyaring ampas rempah agar seduhan bening" },
  { id: "s10", name: "Cobek Tumbuk Rimpang", category: "alat", hint: "Alat pememar batang sereh dan rimpang jahe" }
];

export const ACT_1_DATA = {
  id: "act-1",
  zone: "Aku Berkarya",
  title: "Babak 1: Pesanan Pertama",
  objective: "Eksplorasi meja gerobak angkringan, kumpulkan bahan dan piranti seduh, lalu temukan potongan catatan rahasia yang terselip.",
  guide: {
    title: "Panduan Babak 1: Eksplorasi Gerobak & Penataan Awal",
    description: "Malam pertama menjaga angkringan dimulai dari rasa ingin tahu. Periksa setiap sudut meja gerobak, amati fungsi peralatan, dan tata bahan-bahan agar siap digunakan.",
    steps: [
      "1. Periksa 6 benda di meja gerobak untuk memahami fungsinya dan menemukan 3 sobekan catatan rahasia.",
      "2. Buka tab Penataan Bahan & Piranti, lalu kelompokkan 6 item ke dalam Wadah Rempah atau Rak Piranti.",
      "3. Setelah kedua misi selesai, tombol lanjut ke Babak 2 akan aktif secara otomatis."
    ],
    hints: [
      {
        level: "Petunjuk 1 (Tujuan Utama)",
        text: "Klik setiap benda di atas meja gerobak. Tiga di antaranya menyimpan sobekan catatan resep kuno Pak Ilmu."
      },
      {
        level: "Petunjuk 2 (Lokasi Catatan Tersembunyi)",
        text: "Perhatikan benda-benda utama gerobak seperti Ceret, Cangkir Blirik, atau Toples Rempah. Tiga di antaranya menyimpan rahasia penting."
      },
      {
        level: "Petunjuk 3 (Penataan Bahan & Piranti)",
        text: "Pada tab Penataan, pisahkan rimpang alami (Jahe, Sereh, Gula Aren, Cengkeh) dari peralatan fisik seduh (Ceret, Cangkir, Sendok, Cobek)."
      }
    ]
  },
  objects: ACT_1_VARIANTS[0].objects,
  sortItems: SORT_ITEMS_POOL.slice(0, 6),
  hiddenNotes: ACT_1_VARIANTS[0].hiddenNotes
};

// --------------------------------------------------------------------------
// 3. BABAK 2: KITA BERKARYA (DENGAN VARIASI & PENGACAKAN NYATA)
// --------------------------------------------------------------------------
export const ACT_2_PUZZLE_VARIANTS = [
  // Variasi 1: Formula Wedang Uwuh Luhur
  {
    id: "puz-v0",
    title: "Naskah 1: Formula Wedang Uwuh Luhur",
    description: "Kaidah racikan rempah kuno penawar dingin malam Yogyakarta.",
    pieces: [
      {
        id: "p1",
        slot: 0,
        title: "Keping 1 (Awal)",
        text: "Racikan Wedang Uwuh Luhur bermula dari rimpang jahe emprit yang dibakar di atas bara arang hingga aromanya pecah keluar..."
      },
      {
        id: "p2",
        slot: 1,
        title: "Keping 2 (Penyelarasan)",
        text: "...ditambahkan batang sereh yang telah dimemarkan perlahan serta cengkeh wangi untuk menentramkan denyut saraf yang lelah..."
      },
      {
        id: "p3",
        slot: 2,
        title: "Keping 3 (Penyeduhan)",
        text: "...kemudian diguyur kucuran air mendidih langsung dari ceret tembaga beruap panas, melarutkan getah kayu secang hingga air merona merah..."
      },
      {
        id: "p4",
        slot: 3,
        title: "Keping 4 (Penutup)",
        text: "...dan disempurnakan dengan bongkahan gula aren asli, diaduk searah jarum jam sebagai simbol keselarasan budi pekerti."
      }
    ]
  },

  // Variasi 2: Resep Wedang Secang Kraton
  {
    id: "puz-v1",
    title: "Naskah 2: Risalah Wedang Secang Penghangat",
    description: "Catatan kuno tentang perpaduan warna dan kehangatan rimpang.",
    pieces: [
      {
        id: "p1-b",
        slot: 0,
        title: "Keping 1 (Awal)",
        text: "Memilih rimpang jahe tua yang berurat padat, dibersihkan kulitnya dari tanah lalu dipanggang sejenak hingga layu berkilat..."
      },
      {
        id: "p2-b",
        slot: 1,
        title: "Keping 2 (Penyelarasan)",
        text: "...meramu serutan kayu secang merah delima bersama kelopak cengkeh kering pilihan dari lereng bukit yang sejuk..."
      },
      {
        id: "p3-b",
        slot: 2,
        title: "Keping 3 (Penyeduhan)",
        text: "...diseduh dengan aliran air mendidih bersuhu ajeg dari ceret tembaga, mengekstrak warna merah terang saripati alam..."
      },
      {
        id: "p4-b",
        slot: 3,
        title: "Keping 4 (Penutup)",
        text: "...lalu dituangkan ke dalam cangkir blirik hangat, disajikan dengan ketulusan hati bagi siapa pun yang membutuhkan jeda."
      }
    ]
  },

  // Variasi 3: Makna Filosofi Racikan Angkringan
  {
    id: "puz-v2",
    title: "Naskah 3: Kaidah Keikhlasan Meracik",
    description: "Pesan Pak Ilmu tentang adab melayani sesama manusia di lincak angkringan.",
    pieces: [
      {
        id: "p1-c",
        slot: 0,
        title: "Keping 1 (Awal)",
        text: "Menyambut setiap jiwa yang singgah dengan senyum egaliter, tanpa membedakan pangkat, harta, maupun asal muasal..."
      },
      {
        id: "p2-c",
        slot: 1,
        title: "Keping 2 (Penyelarasan)",
        text: "...meraba kebutuhan batin di balik setiap keluh kesah, memilihkan rempah yang menentramkan pikiran gelisah..."
      },
      {
        id: "p3-c",
        slot: 2,
        title: "Keping 3 (Penyeduhan)",
        text: "...meracik dengan takaran seimbang antara panasnya bara jahe dan kelembutan aroma sereh wangi..."
      },
      {
        id: "p4-c",
        slot: 3,
        title: "Keping 4 (Penutup)",
        text: "...menyerahkan cangkir dengan dua tangan penuh hormat, menyertakan doa kebaikan bagi keselamatan langkah mereka esok."
      }
    ]
  }
];

// Variasi Urutan Seduh Tradisional
export const ACT_2_SEQUENCE_VARIANTS = [
  // Alur Seduh 1: Cangkir Blirik Hangat
  {
    id: "seq-v0",
    title: "Urutan Seduh Cangkir Blirik",
    steps: [
      {
        id: "seq-1",
        correctOrder: 1,
        text: "Mendengarkan keluh kesah penikmat dengan empati tanpa menghakimi kondisi mereka."
      },
      {
        id: "seq-2",
        correctOrder: 2,
        text: "Mememarkan rimpang jahe bakar dan batang sereh agar minyak atsiri alaminya siap mengalir."
      },
      {
        id: "seq-3",
        correctOrder: 3,
        text: "Mengguyur rempah dengan air mendidih bersuhu pas langsung dari ceret tembaga tiga tingkat."
      },
      {
        id: "seq-4",
        correctOrder: 4,
        text: "Melarutkan gula aren asli, mengaduk dengan ketulusan, lalu menyajikan dalam cangkir blirik hangat."
      }
    ]
  },

  // Alur Seduh 2: Rebusan Kuali Tradisional
  {
    id: "seq-v1",
    title: "Urutan Peracikan Kuali Tradisional",
    steps: [
      {
        id: "seq-1-b",
        correctOrder: 1,
        text: "Menyapa pelanggan dengan santun dan menanyakan keluhan rasa dingin yang dirasakan."
      },
      {
        id: "seq-2-b",
        correctOrder: 2,
        text: "Membakar jahe emprit di atas bara arang hingga aroma wangi atsiri pecah merebak."
      },
      {
        id: "seq-3-b",
        correctOrder: 3,
        text: "Menyeduh ramuan rempah menggunakan air mendidih matang sempurna sampai saripati luruh."
      },
      {
        id: "seq-4-b",
        correctOrder: 4,
        text: "Menyaring air seduhan ke bejana saji dan menyerahkannya dengan dua belah tangan penuh hormat."
      }
    ]
  }
];

// Pool Lengkap Pasangan Khasiat & Raga (6 Pasangan)
export const MATCHING_PAIRS_POOL = [
  {
    id: "m1",
    condition: "Tubuh Menggigil & Sendi Kaku Didera Angin Malam",
    remedy: "Jahe Emprit Bakar & Sereh Wangi (Penghangat Inti Raga & Pembakar Hawa Dingin)",
    explanation: "Jahe emprit kaya gingerol yang melancarkan peredaran darah dan mengusir dingin hingga ke tulang."
  },
  {
    id: "m2",
    condition: "Pikiran Semrawut & Jiwa Penat Seusai Perjalanan Panjang",
    remedy: "Cengkeh & Kayu Manis Beraroma Khas (Penenang Saraf & Pelaras Ritme Jiwa)",
    explanation: "Aroma eugenol cengkeh dan kayu manis meredakan ketegangan saraf serta menghadirkan rasa tenang."
  },
  {
    id: "m3",
    condition: "Raga Kehabisan Energi & Kehilangan Daya Semangat",
    remedy: "Gula Aren Nira Kelapa Asli (Pembangkit Daya & Peneguh Harapan)",
    explanation: "Gula aren menyediakan energi alami bertahap yang memulihkan tenaga tanpa lonjakan gula mendadak."
  },
  {
    id: "m4",
    condition: "Tenggorokan Kering Gatal Terpaan Debu Jalanan",
    remedy: "Seduhan Kulit Kayu Manis & Daun Pandan (Pelega Saluran & Penyejuk Dahaga)",
    explanation: "Minyak atsiri kayu manis melumasi saluran tenggorokan dan meredakan peradangan akibat debu."
  },
  {
    id: "m5",
    condition: "Perut Kembung Begah Akibat Masuk Angin Malam",
    remedy: "Gepukan Rimpang Jahe & Seduhan Batang Sereh (Pengusir Gas & Pelega Rongga Perut)",
    explanation: "Zat hangat jahe melancarkan fungsi pencernaan dan meredakan kejang kembung pada lambung."
  },
  {
    id: "m6",
    condition: "Napas Berat & Dada Tertekan Akibat Kelelahan Mental",
    remedy: "Kuncup Bunga Cengkeh & Uap Air Rebusan Sereh (Pelega Rongga Dada & Penenang Pikiran)",
    explanation: "Aroma atsiri hangat membuka saluran pernapasan dan mengendurkan otot dada yang tegang."
  }
];

export const ACT_2_DATA = {
  id: "act-2",
  zone: "Kita Berkarya",
  title: "Babak 2: Resep yang Hilang",
  objective: "Satukan kepingan catatan resep kuno, urutkan tahapan peracikan yang benar, dan cocokkan khasiat rempah dengan kebutuhan raga.",
  guide: {
    title: "Panduan Babak 2: Rekonstruksi Resep & Kolaborasi",
    description: "Catatan yang kamu temukan adalah kepingan pengetahuan yang terpisah. Di zona Kita Berkarya, satukan kembali informasi tersebut menjadi struktur perancangan seduh yang logis.",
    steps: [
      "1. Selesaikan Jigsaw Puzzle dengan merekatkan 4 potongan kertas resep ke bingkai target.",
      "2. Susun 4 langkah urutan seduh tradisional dari tahap mendengarkan hingga menyajikan.",
      "3. Cocokkan 3 kondisi keluhan raga/jiwa dengan racikan rempah yang tepat khasiatnya."
    ],
    hints: [
      {
        level: "Petunjuk 1 (Jigsaw Puzzle)",
        text: "Pilih satu kepingan di sebelah kiri, lalu klik slot nomor 1 hingga 4 di bingkai kanan sesuai sambungan alur ceritanya."
      },
      {
        level: "Petunjuk 2 (Urutan Seduh)",
        text: "Peracikan selalu dimulai dari empati mendengarkan pelanggan, dilanjutkan dengan menyiapkan rempah, menyeduh air panas, dan diakhiri dengan menyajikan dalam cangkir blirik."
      },
      {
        level: "Petunjuk 3 (Pencocokan Khasiat)",
        text: "Jahe emprit mengatasi kedinginan raga, aroma cengkeh dan kayu manis meredakan ketegangan pikiran, dan gula aren memulihkan tenaga fisik."
      }
    ]
  },
  puzzlePieces: ACT_2_PUZZLE_VARIANTS[0].pieces,
  sequenceSteps: ACT_2_SEQUENCE_VARIANTS[0].steps,
  matchingPairs: MATCHING_PAIRS_POOL.slice(0, 3)
};

// --------------------------------------------------------------------------
// 4. BABAK 3: KARYA KITA BERKONTRIBUSI (3 PERSONA PENGUNJUNG BERBEDA)
// --------------------------------------------------------------------------
export const ACT_3_PERSONAS = [
  // Persona 0: Mas Danang (Sang Penempuh Jalan)
  {
    id: "persona-danang",
    name: "Mas Danang (Sang Penempuh Jalan)",
    condition: "Kedinginan Parah, Pakaian Basah Kuyup, Wajah Lelah Penuh Beban",
    contextBadge: "Hujan Deras Malioboro",
    story: "Malam ini hujan deras tak kunjung reda di Malioboro. Aku telah berjalan berjam-jam membawa tugas dan impian yang nyaris patah di tengah jalan. Kakiku mati rasa, dan pikiranku dipenuhi keraguan apakah langkahku ada artinya... Bolehkah aku memesan sesuatu yang bisa menghidupkan kembali nyala dalam dadaku?",
    clue: "Pelanggan membutuhkan kehangatan bara jahe tinggi untuk mengusir dingin hingga ke tulang, dipadu aroma sereh dan gula aren seimbang.",
    idealRatios: {
      jaheMin: 3,
      jaheMax: 5,
      serehMin: 2,
      serehMax: 3,
      gulaMin: 2,
      gulaMax: 3
    },
    idealDesc: "Jahe level 3–5 (hangat mendalam), Sereh level 2–3 (aroma menenangkan), Gula Aren level 2–3 (stamina pas).",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Hanya Menyajikan Teh Manis Instan",
        desc: "Menyajikan teh manis dingin agar cepat kenyang.",
        feedback: "Kurang tepat. Manis instan hanya menipu lambung sesaat, tetapi tidak menyembuhkan dinginnya raga dan lelahnya pikiran sang penempuh jalan.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Kehangatan Raga & Pemulihan Semangat Batin (Rekomendasi Utama)",
        desc: "Meracik Wedang Rempah Hangat Khas Pak Ilmu dengan Jahe Emprit Bakar pekat, Sereh, dan Gula Aren seimbang.",
        feedback: "Sangat tepat! Racikan ini mengusir dingin fisik secara mendalam sekaligus memulihkan ketenangan jiwa melalui empati kepedulian.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Menyarankan Pindah ke Warung Lain",
        desc: "Menolak pesanan karena bahan yang tersisa perlu dihemat.",
        feedback: "Angkringan adalah ruang penerimaan tanpa pamrih. Menolak orang yang kedinginan bertentangan dengan filosofi Karsa Kala.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Mangga Mas, dipun unjuk selagi hangat. Tiap lelah pasti ada jedanya, dan tiap dingin malam selalu punya penawar rasa. Semoga langkahmu esok kembali terang.",
        tone: "Penuh Empati & Budi Pekerti Yogyakarta",
        impact: "Mata Mas Danang berkaca-kaca. Kehangatan wedang meresap ke relung dadanya, dan tutur katamu mengembalikan keyakinan hidupnya.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini pesanannya ya Mas. Semoga lekas hangat dan tidak kedinginan lagi.",
        tone: "Fungsional Standar",
        impact: "Wedang terasa nikmat dan tubuhnya menghangat, namun sentuhan batinnya terasa datar.",
        score: 75
      }
    ],
    resolutionQuote: "Matur nuwun sanget... Ternyata yang kubutuhkan bukan sekadar minuman penghalau dahaga, tetapi pengingat bahwa di tanah ini, kita tidak pernah berjuang sendirian.",
    resolutionDesc: "Mas Danang menyesap wedang hangat dari cangkir blirik dengan kedua tangannya yang gemetar. Hawa jahe membakar dingin di tulangnya, aroma sereh menjernihkan kepalanya, dan tutur katamu mengusir rasa putus asa yang sempat membelenggunya."
  },

  // Persona 1: Mbak Sari (Perantau Muda yang Lelah & Rindu Rumah)
  {
    id: "persona-sari",
    name: "Mbak Sari (Perantau Muda)",
    condition: "Tenggorokan Kering, Dada Sesak Tertekan, Pikiran Gelisah Rindu Rumah",
    contextBadge: "Malam Larut Seusai Lembur",
    story: "Sudah berbulan-bulan aku merantau sendirian di kota ini. Malam ini pekerjaanku menumpuk dan rasanya kepalaku mau pecah. Aku rindu kehangatan dapur simbok di desa yang selalu menenangkanku saat gundah... Bisakah kamu meracikkan sesuatu yang aromanya membuat nafasku lega dan menghadirkan rasa tenteram?",
    clue: "Pelanggan membutuhkan aroma sereh wangi yang dominan untuk melegakan pernapasan, dipadukan kehangatan lembut jahe dan manis gula kelapa.",
    idealRatios: {
      jaheMin: 2,
      jaheMax: 3,
      serehMin: 3,
      serehMax: 5,
      gulaMin: 2,
      gulaMax: 4
    },
    idealDesc: "Sereh level 3–5 (aroma pelega tinggi), Jahe level 2–3 (hangat lembut), Gula Aren level 2–4 (manis penenteram).",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Memberikan Kopi Hitam Pekat Tanpa Gula",
        desc: "Agar tetap terjaga dan bisa melanjutkan kerja lembur.",
        feedback: "Kurang tepat. Kafein pekat justru mempercepat detak jantung dan memperparah kegelisahan batin Mbak Sari.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Seduhan Aromatik Pelega Jiwa & Rasa Tenteram (Rekomendasi Utama)",
        desc: "Mengutamakan aroma sereh wangi dan cengkeh yang melegakan rongga dada, dipadukan kehangatan lembut jahe dan manis gula jawa.",
        feedback: "Sangat tepat! Aroma atsiri sereh menenangkan denyut saraf yang lelah, menghadirkan kehangatan seperti berada di rumah.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Menyarankan Langsung Pulang dan Tidur",
        desc: "Menolak meracik karena warung sudah hampir tutup.",
        feedback: "Pelanggan datang mencari ruang jeda yang aman. Mendengarkan dan menyuguhkan kehangatan adalah esensi angkringan.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Mangga Mbak, dihirup dulu aromanya pelan-pelan. Kotamu boleh bising dan menuntut, tapi malam ini di lincak ini, kamu berhak beristirahat dengan damai. Kamu sudah berjuang sangat baik.",
        tone: "Penuh Kasih & Penerimaan Tulus",
        impact: "Mbak Sari menghela napas panjang dan tersenyum haru. Beban berat di pundaknya terasa meluruh perlahan.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini wedang serehnya Mbak, silakan diminum mumpung masih panas.",
        tone: "Biasa & Tergesa",
        impact: "Wedang diminum dengan baik, namun tidak meninggalkan kehangatan emosional yang berkesan.",
        score: 75
      }
    ],
    resolutionQuote: "Aroma sereh ini persis seperti seduhan simbok di desa... Terima kasih sudah mengingatkanku bahwa lelah adalah tanda bahwa kita telah bersungguh-sungguh melangkah.",
    resolutionDesc: "Mbak Sari menghirup uap sereh yang mengepul dari cangkir blirik. Otot-otot lehernya yang kaku mereda, dan rasa sepi yang menghimpitnya berganti menjadi ketenangan batin yang sejuk."
  },

  // Persona 2: Pak Broto (Pengayuh Becak Lansia)
  {
    id: "persona-broto",
    name: "Pak Broto (Pengayuh Becak Tua)",
    condition: "Kaki Pegal Ngilu, Perut Kembung Masuk Angin, Tenaga Terkuras Habis",
    contextBadge: "Dini Hari Angin Selatan",
    story: "Seharian tadi becakku menempuh puluhan kilometer menembus angin malam dari Stasiun Tugu hingga Pojok Beteng. Lututku bergetar dan angin malam seolah mengendap di lambungku. Raga tua ini butuh bara yang kuat dan tenaga manis agar esok fajar masih bisa mengayuh rezeki untuk keluarga...",
    clue: "Pelanggan membutuhkan jahe emprit bakar berkonsentrasi tinggi untuk mengusir masuk angin, serta gula aren tebal sebagai sumber tenaga fisik.",
    idealRatios: {
      jaheMin: 4,
      jaheMax: 5,
      serehMin: 2,
      serehMax: 4,
      gulaMin: 3,
      gulaMax: 5
    },
    idealDesc: "Jahe level 4–5 (bara pembakar angin kuat), Gula Aren level 3–5 (tenaga stamina padat), Sereh level 2–4 (penyegar pernapasan).",
    needsAnalysis: [
      {
        id: "na-1",
        title: "Menyajikan Air Es Dingin Pelepas Haus",
        desc: "Untuk menyegarkan tubuh yang berkeringat.",
        feedback: "Sangat berbahaya! Air es akan mengunci hawa dingin di lambung dan memperparah kram sendi Pak Broto.",
        isCorrect: false
      },
      {
        id: "na-2",
        title: "Wedang Bara Jahe Emprit & Gula Aren Pekat (Rekomendasi Utama)",
        desc: "Menakar jahe emprit bakar level tinggi untuk mengusir angin, ditambah gula aren pekat penopang tenaga otot.",
        feedback: "Sangat tepat! Kombinasi panas jahe dan kalori alami nira aren mengendurkan kram otot dan memulihkan stamina fisiknya.",
        isCorrect: true
      },
      {
        id: "na-3",
        title: "Hanya Memberikan Nasi Kucing Kering",
        desc: "Tanpa menyediakan minuman hangat penawar angin.",
        feedback: "Kurang bijak. Perut yang kembung masuk angin membutuhkan cairan rempah hangat terlebih dahulu sebelum makanan padat.",
        isCorrect: false
      }
    ],
    presentationDecisions: [
      {
        id: "pd-1",
        quote: "Nyuwun sewu Pak Broto, mangga diunjuk anget-anget. Keringat dan ikhtiar panjenengan sungguh berkah luar biasa. Mugi-mugi raga tansah pinaringan berkah sehat lan kekiyatan.",
        tone: "Hormat Luhur & Doa Ketulusan",
        impact: "Pak Broto menerima cangkir dengan kedua tangannya yang kapalan seraya mengangguk takzim penuh rasa syukur.",
        score: 100
      },
      {
        id: "pd-2",
        quote: "Ini wedangnya Pak, habiskan biar badannya tidak masuk angin lagi.",
        tone: "Singkat & Biasa",
        impact: "Wedang diminum habis, namun percakapan berakhir tanpa kehangatan persaudaraan.",
        score: 75
      }
    ],
    resolutionQuote: "Alhamdulillah... Hangatnya jahe langsung meresap ke sendi-sendi lututku yang kaku. Rasanya seperti mendapat tenaga baru untuk mengayuh esok pagi.",
    resolutionDesc: "Pak Broto menyesap wedang dengan mata berbinar. Keringat dingin di dahinya mengering, rasa begah di perutnya mereda, dan wajahnya kembali memancarkan keteguhan seorang pejuang nafkah keluarga."
  }
];

export const ACT_3_DATA = {
  id: "act-3",
  zone: "Karya Kita Berkontribusi",
  title: "Babak 3: Untuk Siapa Racikan Ini?",
  missionTitle: "Misi: Pelayanan Penuh Empati",
  customer: ACT_3_PERSONAS[0],
  guide: {
    title: "Panduan Babak 3: Misi Pelayanan Penuh Empati",
    description: "Karya sejati bukan sekadar membuat produk, melainkan meringankan beban nyata sesama manusia. Pahami kebutuhan pengunjung dan racik wedang yang tepat.",
    steps: [
      "1. Analisis Kebutuhan: Pilih pendekatan pemulihan yang menyentuh akar permasalahan pengunjung.",
      "2. Penakaran Rempah: Atur perbandingan Jahe Emprit, Sereh, dan Gula Aren sesuai kebutuhan fisik dan batinnya.",
      "3. Tutur Kata Penyajian: Pilih sapaan dan sikap menyerahkan cangkir dengan budi pekerti khas Yogyakarta."
    ],
    hints: [
      {
        level: "Petunjuk 1 (Analisis Kebutuhan)",
        text: "Perhatikan isyarat kebutuhan pelanggan di kartu profil. Pilih solusi yang menyentuh akar persoalan, bukan solusi instan."
      },
      {
        level: "Petunjuk 2 (Takaran Seimbang)",
        text: "Kondisi awal takaran sengaja dikosongkan. Naikkan level rempah sesuai kebutuhan khusus pelanggan yang sedang dilayani."
      },
      {
        level: "Petunjuk 3 (Sikap Penyajian)",
        text: "Sikap ramah dan tutur kata tulus adalah separuh dari khasiat wedang angkringan. Pilih ungkapan doa kebaikan yang menyemangati langkahnya."
      }
    ]
  },
  needsAnalysis: ACT_3_PERSONAS[0].needsAnalysis,
  presentationDecisions: ACT_3_PERSONAS[0].presentationDecisions
};

// --------------------------------------------------------------------------
// 5. EPILOG: TOPLES KAWRUH (3 VARIASI REFLEKSI & KATA HIKMAH)
// --------------------------------------------------------------------------
export const EPILOGUE_VARIANTS = [
  // Variasi 1
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
    reflectionMessage: "Di Angkringan Pak Ilmu ini, secangkir wedang rempah bukanlah sekadar komoditas pelepas dahaga, melainkan jembatan rasa antara manusia yang saling peduli. Apa yang kita pelajari dalam kesendirian (Aku Berkarya) dan kita padukan dalam kebersamaan (Kita Berkarya), baru menemukan kesempurnaannya saat dipersembahkan untuk meringankan beban sesama (Karya Kita Berkontribusi)."
  },

  // Variasi 2
  {
    id: "epi-v1",
    theme: "Ketulusan Empati",
    tokens: [
      { id: "t1-b", text: "Karya" },
      { id: "t2-b", text: "Bermakna" },
      { id: "t3-b", text: "Lahir" },
      { id: "t4-b", text: "Dari" },
      { id: "t5-b", text: "Empati" },
      { id: "t6-b", text: "Tulus" }
    ],
    correctSentence: "Karya Bermakna Lahir Dari Empati Tulus",
    reflectionMessage: "Kemahiran meracik bahan takkan pernah cukup jika tidak dilandasi kepekaan menyimak derita sesama. Setiap tetes kehangatan yang kita bagikan adalah bukti bahwa ilmu pengetahuan mencapai puncak tertingginya saat ia menjadi penyejuk bagi jiwa yang letih."
  },

  // Variasi 3
  {
    id: "epi-v2",
    theme: "Kekuatan Kehangatan",
    tokens: [
      { id: "t1-c", text: "Kehangatan" },
      { id: "t2-c", text: "Sejati" },
      { id: "t3-c", text: "Meneguhkan" },
      { id: "t4-c", text: "Jiwa" },
      { id: "t5-c", text: "Yang" },
      { id: "t6-c", text: "Lelah" }
    ],
    correctSentence: "Kehangatan Sejati Meneguhkan Jiwa Yang Lelah",
    reflectionMessage: "Dunia mungkin terasa dingin dan menuntut, namun kehadiran ruang sederhana seperti Angkringan Pak Ilmu mengingatkan kita pada kodrat gotong royong. Satu sapaan hangat dan satu cangkir ketulusan sudah cukup untuk menyalakan kembali lentera harapan di dalam dada manusia."
  }
];

export const EPILOGUE_DATA = {
  id: "epilogue",
  title: "Epilog: Toples Kawruh",
  image: "/background/toples.png",
  objective: "Susun hikmah pengetahuan yang telah kamu petik, lalu masukkan ke dalam Toples Kawruh untuk menerangi langkah pengunjung berikutnya.",
  guide: {
    title: "Panduan Epilog: Merumuskan Hikmah di Toples Kawruh",
    description: "Perjalanan di Angkringan Pak Ilmu ditutup dengan mewariskan pengalaman. Pengetahuan tidak berhenti pada satu misi, melainkan berlanjut saat diteruskan.",
    steps: [
      "1. Ketuk kata-kata di pool untuk menyusun kalimat hikmah yang utuh.",
      "2. Tekan tombol 'Masukkan Pelajaran ke Toples Kawruh'.",
      "3. Catatan hikmah akan terabadikan di dalam toples kaca untuk pengunjung pameran berikutnya."
    ],
    hints: [
      {
        level: "Petunjuk Kalimat Hikmah",
        text: "Amati kata-kata yang tersedia dan susun menjadi kalimat bermakna utuh tentang intisari pembelajaran yang kamu peroleh."
      }
    ]
  },
  tokens: EPILOGUE_VARIANTS[0].tokens,
  correctSentence: EPILOGUE_VARIANTS[0].correctSentence,
  reflectionMessage: EPILOGUE_VARIANTS[0].reflectionMessage,
  exhibitionBadge: {
    name: "Peracik Kawruh Dhandanggula",
    motto: "Saka Rasa, Tumuju Makna",
    authority: "Pameran Karya Teknologi Pendidikan Gredupedia #7"
  }
};
