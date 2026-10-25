# ANGKRINGAN PAK ILMU: PESANAN YANG TAK BIASA
### Permainan Multimedia Interaktif Berbasis Web
**Karya Pameran Teknologi Pendidikan: Zona Dhandanggula (Gredupedia #7: Karsa Kala)**  
*Fakultas Ilmu Pendidikan dan Psikologi, Universitas Negeri Yogyakarta*  
*Tagline: “Saka Rasa, Tumuju Makna” • Tema: Lifelong Learning Beyond Boundaries*

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
4. **Sistem Panduan Kontekstual & Bantuan Bertahap:**
   * Modal Panduan Awal (Walkthrough) yang merangkum cerita, peta 3 babak, dan fungsi tombol kontrol.
   * Banner panduan misi pada setiap babak yang menjelaskan langkah saat ini.
   * Tombol Bantuan dengan petunjuk bertingkat (Level 1, 2, dan 3) agar pemain tertantang memecahkan masalah sendiri.
5. **Pembersihan Tanda Hubung Dekoratif:** Menghilangkan semua karakter “-” atau “—” yang dipakai sebagai hiasan atau pola template generik.
6. **Motion Design Halus:** Animasi kemunculan layar (550ms), efek angkat kartu saat disentuh, efek lekat puzzle (*snap-in*), dan toples kaca mengambang.

---

## 2. Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
* Node.js versi 18 atau lebih baru.
* Web browser modern (Chrome, Edge, Firefox, Safari).

### Mode Pengembangan (Dev Server)
```powershell
cd "C:\Users\USERR\.gemini\antigravity\scratch\angkringan-pak-ilmu"
npm run dev
```
Akses di peramban: `http://localhost:5173/`

### Build Mandiri untuk Pameran (Kiosk)
```powershell
cd "C:\Users\USERR\.gemini\antigravity\scratch\angkringan-pak-ilmu"
npm run build
npm run preview
```
Jalankan dalam mode layar penuh tanpa bilah URL:
```powershell
# Microsoft Edge
msedge.exe --kiosk http://localhost:4173 --edge-kiosk-type=fullscreen --no-first-run

# Google Chrome
chrome.exe --kiosk http://localhost:4173 --incognito --disable-pinch
```

---

## 3. Struktur Direktori Proyek

```
angkringan-pak-ilmu/
├── dist/                          # Hasil build siap pameran (HTML, JS, CSS, fonts, assets, background)
├── public/
│   ├── assets/                    # Aset grafis resmi Gredupedia (Bunga Wijayakusuma, Ukiran, Ornamen)
│   ├── background/                # Aset background1.jpg dan ilustrasi menu (cerek, toples, cangkir, dll.)
│   └── fonts/                     # Font resmi Raleway (TTF)
├── src/
│   ├── components/                # Komponen antarmuka modular
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
│   │   └── audio.js               # Web Audio API organik sintetis (desau malam & gamelan)
│   ├── views/                     # Layar babak permainan
│   │   ├── OpeningView.jsx        # Layar pembuka & pilihan Mode Solo/Duo
│   │   ├── Act1View.jsx           # Babak 1: Pesanan Pertama (Aku Berkarya)
│   │   ├── Act2View.jsx           # Babak 2: Resep yang Hilang (Kita Berkarya)
│   │   ├── Act3View.jsx           # Babak 3: Untuk Siapa Racikan Ini? (Karya Kita Berkontribusi)
│   │   ├── EpilogueView.jsx       # Epilog: Toples Kawruh dengan toples.png
│   │   └── SummaryView.jsx        # Piagam Peracik Kawruh & rangkuman refleksi
│   ├── App.jsx                    # Root state & sinkronisasi LocalStorage
│   └── main.jsx                   # Entry point React
├── index.html
├── package.json
└── vite.config.js
```
