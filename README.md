# ANGKRINGAN PAK ILMU: PESANAN YANG TAK BIASA
### Permainan Multimedia Interaktif Berbasis Web
**Karya Pameran Teknologi Pendidikan: Zona Dhandanggula (Gredupedia #7: Karsa Kala)**  
*Fakultas Ilmu Pendidikan dan Psikologi, Universitas Negeri Yogyakarta*  
*Tagline: “Saka Rasa, Tumuju Makna” • Tema: Lifelong Learning Beyond Boundaries*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmamanaryanto12-maker%2Fangkringan-pak-ilmu)

---

## 1. Pembaruan & Penyempurnaan Versi Terbaru

Revisi menyeluruh telah diterapkan pada game web ini:
1. **Background Utama Resmi:** Menggunakan file asli `background1.jpg` yang dipadukan dengan overlay krem hangat natural untuk keterbacaan prima.
2. **Aset Ilustrasi Asli pada Seluruh Menu:** Memanfaatkan file gambar PNG transparan berkualitas tinggi:
   * `cerek.png`: Ceret Tiga Tingkat
   * `toples.png`: Toples Kaca Rempah Tua dan Toples Kawruh
   * `cangkir.png`: Cangkir Kaleng Blirik
   * `jurnallusuh.png`: Jurnal Lusuh Pak Ilmu
   * `lampusentir.png`: Lampu Sentir Minyak
   * `tiketpesanan.png`: Tiket Pesanan Misterius
3. **Tema Cerah Hangat & Alami:** Menghadirkan suasana hangat angkringan klasik Yogyakarta dengan kartu kertas gading, border natural, dan teks cokelat espresso berkontras tajam tanpa efek neon gelap yang generik.
4. **Sistem Panduan Kontekstual & Bantuan Bertahap Lengkap:**
   * **Modal Sambutan Babak (`ActWelcomeModal`):** Muncul otomatis saat pemain masuk ke babak baru, memaparkan cerita dan 3 langkah aksi.
   * **Banner Panduan Mini-Game (`MiniGameGuideBanner`):** Banner panduan yang dapat diciutkan (*collapsible*) pada setiap mini-game.
   * **Petunjuk Visual Interaktif:** Lencana bergerak `👆 Klik Periksa`, `👆 Klik Kepingan`, `👉 Pasang di sini`, dan sorotan berdenyut `slot-highlight-pulse`.
   * **Bantuan Bertahap (`HelpModal`):** Petunjuk bertingkat Level 1, 2, dan 3 yang dapat dibuka satu demi satu.
   * **Panduan Komprehensif (`WalkthroughModal`):** Panduan umum dan peta alur 3 babak yang dapat diakses kapan saja dari bilah navigasi.
5. **Pembersihan Tanda Hubung Dekoratif:** Menghilangkan semua karakter “-” atau “—” yang dipakai sebagai hiasan atau pola template generik.
6. **Motion Design Halus:** Animasi kemunculan layar (550ms), efek angkat kartu saat disentuh, efek lekat puzzle (*snap-in*), dan toples kaca mengambang.

---

## 2. Cara Deploy ke Vercel

### Opsi 1: Satu Klik Deploy via Dashboard Vercel (Sangat Direkomendasikan)
1. Buka [https://vercel.com/new](https://vercel.com/new) dan masuk dengan akun GitHub Anda (**`mamanaryanto12-maker`**).
2. Temukan repositori **`angkringan-pak-ilmu`** pada daftar repositori GitHub Anda, lalu klik **Import**.
3. Vercel secara otomatis mendeteksi:
   * **Framework Preset:** Vite
   * **Root Directory:** `./`
   * **Build Command:** `vite build`
   * **Output Directory:** `dist`
4. Klik tombol **Deploy**.
5. Dalam waktu ~30 detik, game akan aktif secara publik di alamat permanen:  
   `https://angkringan-pak-ilmu.vercel.app`

### Opsi 2: Deploy via Vercel CLI di Terminal
Jika menggunakan Vercel CLI di terminal:
```powershell
# Login ke akun Vercel
npx vercel login

# Deploy ke production
npx vercel --prod
```

---

## 3. Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
* Node.js versi 18 atau lebih baru.
* Web browser modern (Chrome, Edge, Firefox, Safari).

### Mode Pengembangan (Dev Server)
```powershell
npm run dev
```
Akses di peramban: `http://localhost:5173/`

### Build Mandiri untuk Pameran (Kiosk)
```powershell
npm run build
npm run preview
```

Jalankan dalam mode layar penuh tanpa bilah URL (Kiosk Mode untuk Pameran):
```powershell
# Microsoft Edge
msedge.exe --kiosk http://localhost:4173 --edge-kiosk-type=fullscreen --no-first-run

# Google Chrome
chrome.exe --kiosk http://localhost:4173 --incognito --disable-pinch
```

---

## 4. Struktur Direktori Proyek

```
angkringan-pak-ilmu/
├── dist/                          # Hasil build siap pameran (HTML, JS, CSS, fonts, assets, background)
├── public/
│   ├── assets/                    # Aset grafis resmi Gredupedia (Bunga Wijayakusuma, Ukiran, Ornamen)
│   ├── background/                # Aset background1.jpg dan ilustrasi menu (cerek, toples, cangkir, dll.)
│   └── fonts/                     # Font resmi Raleway (TTF)
├── src/
│   ├── components/                # Komponen antarmuka modular
│   │   ├── ActWelcomeModal.jsx    # Modal sambutan kontekstual saat babak baru dimulai
│   │   ├── MiniGameGuideBanner.jsx# Banner panduan instruksi interaktif tiap mini-game
│   │   ├── Navbar.jsx             # Navigasi babak, kontrol audio, tombol panduan & tiket
│   │   ├── OrderTicketModal.jsx   # Tiket pesanan misterius dengan sobekan autentik
│   │   ├── NotebookModal.jsx      # Jurnal Kawruh Pak Ilmu dengan ilustrasi jurnallusuh.png
│   │   ├── HelpModal.jsx          # Sistem bantuan petunjuk bertahap (Level 1, 2, 3)
│   │   └── WalkthroughModal.jsx   # Panduan awal permainan & peta 3 babak
│   ├── data/
│   │   └── gameData.js            # Konten narasi, resep, teka-teki, dan panduan babak
│   ├── styles/
│   │   └── main.css               # Tema cerah hangat, sistem warna resmi, dan motion design
│   ├── utils/
│   │   └── audio.js               # Audio Web Audio API organik (klik, kerisik kertas, snap, harmoni)
│   ├── views/
│   │   ├── OpeningView.jsx        # Halaman pembuka, pemilihan mode Solo/Duo
│   │   ├── Act1View.jsx           # Babak 1: Eksplorasi gerobak & penataan bahan/alat
│   │   ├── Act2View.jsx           # Babak 2: Jigsaw resep, urutan seduh, khasiat rempah
│   │   ├── Act3View.jsx           # Babak 3: Analisis Mas Danang, racik wedang, penyajian empati
│   │   ├── EpilogueView.jsx       # Epilog: Penyusunan kata hikmah & Toples Kawruh
│   │   └── SummaryView.jsx        # Refleksi akhir, piagam peracik, dan intisari pembelajaran
│   ├── App.jsx                    # State root & orchestrator alur permainan
│   └── main.jsx                   # Entry point React
├── vercel.json                    # Konfigurasi rewrite SPA untuk hosting Vercel
├── vite.config.js                 # Konfigurasi bundler Vite
└── package.json                   # Dependensi & script proyek
```
