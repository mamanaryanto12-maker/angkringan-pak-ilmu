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

export const ORDER_TICKET = {
  id: "order-mystic-07",
  title: "Tiket Pesanan: Malam Berhawa Dingin",
  sender: "Seorang Pengelana di Ujung Lincak",
  time: "Larut Malam di Tengah Hujan",
  image: "/background/tiketpesanan.png",
  text: "Tenggorokan tercekat debu jalanan, sendi-sendi ngilu didera angin malam. Jiwa lelah mencari arah, pikiran gundah butuh kehangatan yang menenangkan tanpa memperdaya rasa... Racikkan sesuatu yang bukan sekadar pengisi lambung, melainkan pengingat jati diri dan penentram batin.",
  notes: [
    "Pelanggan tidak menyebutkan nama minuman secara langsung.",
    "Butuh kehangatan alami yang mengusir hawa dingin hingga ke tulang.",
    "Butuh ketenangan batin agar pikiran tidak kalut menghadapi perjalanan esok."
  ]
};

export const ACT_1_DATA = {
  id: "act-1",
  zone: "Aku Berkarya",
  title: "Babak 1: Pesanan Pertama",
  objective: "Eksplorasi meja gerobak angkringan, kumpulkan bahan dan piranti seduh, lalu temukan potongan catatan rahasia yang terselip.",
  
  // Panduan kontekstual babak 1
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
        text: "Perhatikan Ceret Tiga Tingkat, Cangkir Blirik, dan Toples Kaca Rempah Tua. Ketiganya menyembunyikan potongan informasi penting."
      },
      {
        level: "Petunjuk 3 (Penataan Bahan & Piranti)",
        text: "Pada tab Penataan, pisahkan rimpang alami (Jahe, Sereh, Gula Aren) dari peralatan fisik seduh (Ceret, Cangkir, Sendok Kayu)."
      }
    ]
  },

  // 6 Objek interaktif di meja gerobak dengan gambar resmi dari folder background
  objects: [
    {
      id: "ceret",
      name: "Ceret Tiga Tingkat",
      tag: "Piranti Seduh",
      image: "/background/cerek.png",
      desc: "Ceret tembaga khas angkringan yang bertumpuk di atas anglo arang. Bunyi desis uapnya menandakan air mendidih pada suhu yang tepat untuk melarutkan saripati rimpang.",
      clue: "Air yang terlalu dingin takkan membangunkan aroma jahe; air yang mendidih sempurna adalah kunci keikhlasan seduhan."
    },
    {
      id: "toples_rempah",
      name: "Toples Kaca Rempah Tua",
      tag: "Bahan Alami",
      image: "/background/toples.png",
      desc: "Toples kaca tebal berisi rimpang jahe emprit pilihan, batang sereh wangi, cengkeh, dan kulit kayu manis. Aromanya wangi tajam dan menghangatkan.",
      clue: "Jahe emprit kecil tapi membakar dingin. Dipadukan dengan sereh, ia melancarkan aliran rasa dan pikiran."
    },
    {
      id: "cangkir_blirik",
      name: "Cangkir Kaleng Blirik",
      tag: "Piranti Saji",
      image: "/background/cangkir.png",
      desc: "Cangkir loreng hijau-putih legendaris penahan panas. Menjadi saksi ratusan perbincangan egaliter tanpa memandang kasta atau gelar.",
      clue: "Wadah sederhana mengajarkan kita bahwa bukan kemewahan bejana yang utama, melainkan kemurnian apa yang disajikan di dalamnya."
    },
    {
      id: "buku_catatan",
      name: "Jurnal Lusuh Pak Ilmu",
      tag: "Catatan Pembelajar",
      image: "/background/jurnallusuh.png",
      desc: "Buku catatan bersampul kulit kusam. Halamannya sebagian terlipat, berisi tulisan tangan Pak Ilmu tentang perjumpaan manusia dengan persoalan hidupnya.",
      clue: "Karya bermula dari kepekaan meraba kebutuhan sesama. Jangan meracik sebelum kau sungguh-sungguh mendengarkan."
    },
    {
      id: "lentera_sentir",
      name: "Lampu Sentir Minyak",
      tag: "Penerang Suasana",
      image: "/background/lampusentir.png",
      desc: "Lentera minyak tanah yang memendarkan cahaya temaram keemasan. Menghangatkan gerobak di tengah dinginnya malam kota pelajar.",
      clue: "Cahaya kecil yang ajeg lebih bermakna daripada kilatan petir yang membutakan lalu lenyap dalam sekejap."
    },
    {
      id: "tiket_pesanan",
      name: "Tiket Pesanan Misterius",
      tag: "Kebutuhan Nyata",
      image: "/background/tiketpesanan.png",
      desc: "Kertas pesanan dari pelanggan di ujung lincak. Berisi bahasa kiasan tentang keletihan fisik dan kegundahan jiwa.",
      clue: "Bukan sekadar dahaga tenggorokan, melainkan kepenatan jiwa yang membutuhkan sapaan hangat dan empati."
    }
  ],

  // Item untuk mini-game pengelompokan (Drag-and-Drop)
  sortItems: [
    { id: "s1", name: "Jahe Emprit Bakar", category: "bahan", hint: "Rimpang pedas alami pembakar hawa dingin" },
    { id: "s2", name: "Ceret Tembaga", category: "alat", hint: "Wadah air mendidih bersuhu ajeg" },
    { id: "s3", name: "Gula Jawa Aren", category: "bahan", hint: "Pemanis alami penopang stamina tubuh" },
    { id: "s4", name: "Cangkir Blirik Loreng", category: "alat", hint: "Wadah saji penahan kehangatan seduhan" },
    { id: "s5", name: "Batang Sereh Wangi", category: "bahan", hint: "Aroma segar pelega pernapasan dan pikiran" },
    { id: "s6", name: "Sendok Kayu Jati", category: "alat", hint: "Alat pengaduk agar saripati larut merata" }
  ],

  // 3 Sobekan Catatan yang terselip
  hiddenNotes: [
    {
      id: "note-1",
      foundAt: "Di samping Ceret Tembaga",
      text: "Sobekan Resep 1: Kenali dulu dingin macam apa yang merasuk. Dingin raga butuh bara jahe emprit, dingin batin butuh sapaan tulus."
    },
    {
      id: "note-2",
      foundAt: "Di bawah tatakan Cangkir Blirik",
      text: "Sobekan Resep 2: Jangan terburu-buru memberi manis gula sebelum kepedihan raga terurai oleh kehangatan rempah."
    },
    {
      id: "note-3",
      foundAt: "Di balik Toples Kaca Rempah",
      text: "Sobekan Resep 3: Seduh dengan air yang matang sempurna. Aduk dengan doa kebaikan, sajikan selagi uap masih menari."
    }
  ]
};

export const ACT_2_DATA = {
  id: "act-2",
  zone: "Kita Berkarya",
  title: "Babak 2: Resep yang Hilang",
  objective: "Satukan kepingan catatan resep kuno, urutkan tahapan peracikan yang benar, dan cocokkan khasiat rempah dengan kebutuhan raga.",
  
  // Panduan kontekstual babak 2
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

  // Jigsaw Puzzle: 4 kepingan resep kuno
  puzzlePieces: [
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
  ],

  // Sequencing: Urutan proses seduh yang logis
  sequenceSteps: [
    {
      id: "seq-1",
      correctOrder: 1,
      text: "Mendengarkan keluh kesah penikmat dengan empati tanpa menghakimi kondisi mereka."
    },
    {
      id: "seq-2",
      correctOrder: 2,
      text: "Mememarkan rimpang jahe bakar dan sereh agar minyak atsirinya siap mengalir."
    },
    {
      id: "seq-3",
      correctOrder: 3,
      text: "Mengguyur rempah dengan air mendidih bersuhu pas dari ceret tembaga tiga tingkat."
    },
    {
      id: "seq-4",
      correctOrder: 4,
      text: "Melarutkan gula aren asli, mengaduk dengan ketulusan, lalu menyajikan dalam cangkir blirik hangat."
    }
  ],

  // Matching: Kondisi Jiwa/Raga vs Ramuan Rempah
  matchingPairs: [
    {
      id: "m1",
      condition: "Tubuh Menggigil & Sendi Kaku Didera Angin Malam",
      remedy: "Jahe Emprit Bakar & Sereh Wangi (Penghangat Inti Raga & Pembakar Hawa Dingin)",
      explanation: "Jahe emprit mengandung gingerol yang melancarkan sirkulasi darah dan mengusir dingin secara mendalam."
    },
    {
      id: "m2",
      condition: "Pikiran Semrawut & Jiwa Penat Seusai Perjalanan Panjang",
      remedy: "Cengkeh & Kayu Manis Beraroma Khas (Penenang Saraf & Pelaras Ritme Jiwa)",
      explanation: "Aroma eugenol cengkeh dan kayu manis meredakan ketegangan saraf serta menghadirkan ketenangan."
    },
    {
      id: "m3",
      condition: "Raga Kehabisan Energi & Kehilangan Daya Semangat",
      remedy: "Gula Aren Nira Kelapa Asli (Pembangkit Daya & Peneguh Harapan)",
      explanation: "Gula aren menyediakan energi alami bertahap yang memulihkan tenaga tanpa lonjakan gula mendadak."
    }
  ]
};

export const ACT_3_DATA = {
  id: "act-3",
  zone: "Karya Kita Berkontribusi",
  title: "Babak 3: Untuk Siapa Racikan Ini?",
  missionTitle: "Misi: Hangat di Tengah Hujan",
  customer: {
    name: "Mas Danang (Sang Penempuh Jalan)",
    condition: "Kedinginan, Pakaian Basah Kuyup, Wajah Lelah Penuh Beban",
    story: "Malam ini hujan deras tak kunjung reda di Malioboro. Aku telah berjalan berjam-jam membawa tugas dan impian yang nyaris patah di tengah jalan. Kakiku mati rasa, dan pikiranku dipenuhi keraguan apakah langkahku ada artinya... Bolehkah aku memesan sesuatu yang bisa menghidupkan kembali nyala dalam dadaku?"
  },
  
  // Panduan kontekstual babak 3
  guide: {
    title: "Panduan Babak 3: Misi Pelayanan Penuh Empati",
    description: "Karya sejati bukan sekadar membuat produk, melainkan meringankan beban nyata sesama manusia. Bantu Mas Danang memulihkan kehangatan raga dan semangat hidupnya.",
    steps: [
      "1. Analisis Kebutuhan: Pilih pendekatan pemulihan yang menyentuh akar permasalahan Mas Danang.",
      "2. Penakaran Rempah: Atur perbandingan Jahe Emprit, Sereh, dan Gula Aren hingga mencapai kehangatan seimbang.",
      "3. Tutur Kata Penyajian: Pilih sapaan dan sikap menyerahkan cangkir dengan budi pekerti khas Yogyakarta."
    ],
    hints: [
      {
        level: "Petunjuk 1 (Analisis Kebutuhan)",
        text: "Mas Danang tidak hanya lapar atau haus, ia kedinginan dan tertekan. Pilih racikan wedang rempah hangat yang memulihkan fisik sekaligus batin."
      },
      {
        level: "Petunjuk 2 (Takaran Seimbang)",
        text: "Kombinasi ideal adalah Jahe level 3 atau 4 (hangat mendalam), Sereh level 2 atau 3 (aroma menenangkan), dan Gula Aren level 2 atau 3 (manis gurih pas)."
      },
      {
        level: "Petunjuk 3 (Sikap Penyajian)",
        text: "Sikap ramah dan tutur kata tulus adalah separuh dari khasiat wedang angkringan. Pilih ungkapan doa kebaikan yang menyemangati langkahnya."
      }
    ]
  },

  needsAnalysis: [
    {
      id: "na-1",
      title: "Hanya Butuh Minuman Manis Instan",
      desc: "Menyajikan teh manis kental agar cepat kenyang.",
      feedback: "Kurang tepat. Manis instan hanya menipu lambung sesaat, tetapi tidak menyembuhkan dinginnya raga dan lelahnya pikiran sang penempuh jalan."
    },
    {
      id: "na-2",
      title: "Kehangatan Raga & Pemulihan Semangat Batin (Sangat Disarankan)",
      desc: "Meracik Wedang Rempah Hangat Khas Pak Ilmu dengan Jahe Emprit, Sereh, Cengkeh, dan Gula Aren.",
      feedback: "Sangat tepat! Ini menyentuh inti persoalan: mengusir dingin fisik sekaligus memulihkan ketenangan jiwa melalui empati racikan."
    },
    {
      id: "na-3",
      title: "Menolak Pesanan Karena Bahan Terbatas",
      desc: "Menyarankan pelanggan mencari warung lain.",
      feedback: "Angkringan adalah ruang penerimaan tanpa pamrih. Menolak orang yang membutuhkan pertolongan bertentangan dengan filosofi Karsa Kala."
    }
  ],

  defaultIngredients: {
    jahe: 3,
    sereh: 2,
    gulaAren: 2
  },

  presentationDecisions: [
    {
      id: "pd-1",
      quote: "Mangga Mas dipun unjuk selagi hangat. Tiap lelah pasti ada jedanya, dan tiap dingin malam selalu punya penawar rasa. Semoga langkahmu esok kembali terang.",
      tone: "Penuh Empati & Budi Pekerti (Khas Kejogjaan)",
      impact: "Mata Mas Danang berkaca-kaca. Kehangatan wedang meresap ke dadanya, dan tutur katamu mengembalikan keyakinan hidupnya.",
      score: 100
    },
    {
      id: "pd-2",
      quote: "Ini pesanannya ya Mas. Semoga lekas hangat dan tidak kedinginan lagi.",
      tone: "Biasa & Fungsional",
      impact: "Wedang terasa lezat dan tubuhnya menghangat, namun sentuhan batinnya terasa datar.",
      score: 75
    }
  ]
};

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
        text: "Susun kata secara berurutan: 'Pengetahuan' -> 'Menjadi' -> 'Berarti' -> 'Ketika' -> 'Dibagikan'."
      }
    ]
  },

  tokens: [
    { id: "t1", text: "Pengetahuan" },
    { id: "t2", text: "Menjadi" },
    { id: "t3", text: "Berarti" },
    { id: "t4", text: "Ketika" },
    { id: "t5", text: "Dibagikan" }
  ],
  correctSentence: "Pengetahuan Menjadi Berarti Ketika Dibagikan",

  reflectionMessage: "Di Angkringan Pak Ilmu ini, secangkir wedang rempah bukanlah sekadar komoditas pelepas dahaga, melainkan jembatan rasa antara manusia yang saling peduli. Apa yang kita pelajari dalam kesendirian (Aku Berkarya) dan kita padukan dalam kebersamaan (Kita Berkarya), baru menemukan kesempurnaannya saat dipersembahkan untuk meringankan beban sesama (Karya Kita Berkontribusi).",

  exhibitionBadge: {
    name: "Peracik Kawruh Dhandanggula",
    motto: "Saka Rasa, Tumuju Makna",
    authority: "Pameran Karya Teknologi Pendidikan Gredupedia #7"
  }
};
