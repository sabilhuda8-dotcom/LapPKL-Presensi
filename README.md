# weblaporan-Presensipkl

# 📋 Website Laporan Pekerjaan & Presensi PKL

Aplikasi web profesional untuk sistem pelaporan jurnal harian, absensi kehadiran terpadu, dan manajemen penugasan ticketing siswa praktik kerja lapangan (PKL) dengan antarmuka modern yang responsif dan fitur lengkap.

---

## ✨ Fitur Utama

### 🎫 Sistem Ticketing Tugas PKL
- ✅ **Penugasan Pekerjaan oleh Pembimbing/Admin** - Admin menerbitkan tugas dalam sistem tiket (judul, kategori, prioritas, target deadline, instruksi tugas, penugasan terbuka / siswa khusus).
- ✅ **Pengambilan Tugas oleh Siswa** - Siswa dapat melihat daftar tiket terbuka dan mengklaim tugas (*Ambil Tugas Ini*).
- ✅ **Selesaikan Tugas & Auto-Jurnal** - Saat menyelesaikan tiket, siswa mengisi laporan hasil dan dapat mencentang opsi otomatis membuat catatan jurnal pekerjaan harian tanpa perlu mengetik ulang!
- ✅ **Filter Status Tiket** - Filter kategori: *Semua Tiket*, *Tersedia (Open)*, *Sedang Dikerjakan (In Progress)*, dan *Selesai (Completed)*.

### 👑 Dashboard Khusus Administrator / Pembimbing PKL
- ✅ **Pemisahan Navigasi Sesuai Role** - Halaman admin bersih dan terfokus pada monitoring; tidak menampilkan form siswa harian biasa.
- ✅ **Dashboard Ringkasan 4 Kartu Metrik** - Total Siswa Aktif, Tiket Tugas Aktif, Total Jurnal Siswa, dan Total Presensi.
- ✅ **Daftar Siswa & Aktivitas Cepat** - Tabel monitoring ringkas siswa dengan tombol pintas langsung ke Absen dan Jurnal per siswa.
- ✅ **Preview Tiket Tugas Aktif** - Memantau tugas prioritas tinggi dan status pengerjaannya.

### 📅 Rekapitulasi Jurnal & Absensi Per Periode
- ✅ **Filter Rentang Tanggal Periode Kerja** - Pilih tanggal mulai dan tanggal selesai fleksibel (misal: periode mingguan, bulanan, atau semester).
- ✅ **Preset Periode Cepat** - Tombol pintas: *Bulan Ini*, *7 Hari Terakhir*, *30 Hari Terakhir*, dan *Semua Waktu*.
- ✅ **Filter Multi-Siswa atau Siswa Tertentu** - Pantau seluruh siswa sekaligus atau fokus ke satu siswa tertentu.
- ✅ **7 KPI Dinamis Per Periode** - Hadir IT, Bantuan Perkuliahan, Hadir Situasional, Izin, Sakit, Tanggal Merah Libur, dan % Tingkat Kehadiran.
- ✅ **Export Excel & Cetak PDF Per Periode** - Format cetak resmi dan unduhan spreadsheet lengkap.

### 👥 Kelola Akun Siswa (CRUD Siswa oleh Admin)
- ✅ **Tambah Akun Siswa Baru** - Form pembuatan akun siswa dengan NIS, nama lengkap, email, dan password.
- ✅ **Edit Data & Reset Password Siswa** - Pembimbing dapat memperbarui identitas siswa atau mereset password jika siswa lupa.
- ✅ **Hapus Akun Siswa** - Menghapus akun siswa yang telah menyelesaikan masa praktik kerja.

### 🕒 Absensi Kehadiran & Rekapitulasi Presensi Bulanan
- ✅ **Form Absensi Harian (1x per hari)** - Mencegah duplikasi data absensi per tanggal.
- ✅ **Bantuan Perkuliahan** - Standby jam 07:00 pagi di perkuliahan, lanjut jam 08:00 di Divisi IT.
- ✅ **Hadir Situasional (Ke Sekolah Dulu / Fleksibel)** - Toleransi khusus bimbingan/administrasi sekolah, tetap dihitung 100% hadir resmi PKL.
- ✅ **Izin Multi-Hari Fleksibel** - Otomatis menghitung hari kerja Senin–Jumat & melewati hari libur nasional.
- ✅ **Integrasi Hari Libur Nasional Indonesia** - Otomatis mengenali tanggal merah & akhir pekan.
- ✅ **Rekapitulasi Bulanan Simpel (7 KPI)** - Hadir IT, Bantuan Kuliah, Situasional, Izin, Sakit, Tgl Merah, dan % Kehadiran.
- ✅ **Export Excel & Cetak PDF Formal** - Format siap cetak dengan lembar tanda tangan pembimbing.

### ⏪ Mode Susulan (Input Tanggal yang Lalu)
- ✅ **Tombol Pintas Cepat (Quick Date)** - `[📅 Hari Ini]`, `[⏪ Kemarin]`, `[⏪ 2 Hari Lalu]`, `[⏪ 3 Hari Lalu]`.
- ✅ **Banner Deteksi Mode Susulan** - Memudahkan pengisian jurnal pekerjaan dan absensi yang terlewat atau lupa saat jam pulang.
- ✅ **Validasi Cerdas** - Tetap tercatat resmi dan rapi sesuai tanggal pelaksanaan tugas.

### 🌓 Mode Gelap / Terang (Dark & Light Theme)
- ✅ **Tombol Switch Tema Fleksibel** - Tombol satu klik di header dashboard dan halaman login
- ✅ **Dukungan Penuh Tailwind Dark Mode** - Palet warna gelap modern yang nyaman di mata
- ✅ **Penyimpanan Preferensi Tema** - Otomatis mengingat pilihan tema di browser

### 📝 Catatan Pekerjaan Harian
- ✅ **Tambah Catatan** - Lengkap dengan: nama pekerjaan, tanggal, jam, lokasi, pemohon, bukti kerja
- ✅ **Edit Catatan** - Ubah data pekerjaan yang sudah dicatat dengan mudah
- ✅ **Hapus Catatan** - Hapus dengan konfirmasi keamanan
- ✅ **Upload Gambar** - Bukti kerja visual (maksimal 5MB, format gambar)
- ✅ **Auto-fill Waktu** - Tanggal dan jam otomatis terisi dengan hari/jam saat ini

### 🔍 Pencarian & Filter
- ✅ **Search Real-time** - Cari berdasarkan nama pekerjaan, lokasi, atau pemohon
- ✅ **Sort Flexible** - Urutkan: Terbaru, Terlama, atau Nama Pekerjaan
- ✅ **Statistik Catatan** - Total count ditampilkan otomatis

### 📊 Export Data Profesional
- ✅ **Export Excel (CSV)** - File spreadsheet yang dapat diedit di Excel
- ✅ **Export PDF** - Via print dialog browser untuk fleksibilitas
- ✅ **Export Word** - File .doc compatible dengan Microsoft Word
- ✅ **Semua format menyertakan gambar** - Dokumentasi visual lengkap
- ✅ **Timestamp otomatis** - Setiap export mencakup tanggal laporan

### 🎨 Desain & User Experience
- ✅ **Tailwind CSS** - Desain modern, clean, dan responsif
- ✅ **Dark Mode & Light Mode** - Toggle tema instan dengan persistensi
- ✅ **Toast Notifications** - Feedback visual in-app & desktop notification
- ✅ **Loading States** - Indikator proses saat export
- ✅ **Confirmations** - Pencegahan aksi tidak sengaja (logout, hapus)
- ✅ **Soft Colors** - Warna yang nyaman untuk mata sepanjang hari
- ✅ **Mobile-First** - Fully responsive di desktop, tablet, dan mobile

### 📱 Kemudahan Penggunaan
- ✅ Validasi form real-time dengan pesan yang jelas
- ✅ Error message yang helpful dan actionable
- ✅ Automatic focus pada form yang error
- ✅ Interface intuitif - tidak perlu tutorial
- ✅ Informative feedback untuk setiap interaksi

---

## 🚀 Panduan Penggunaan

### 1️⃣ Pertama Kali
```
1. Buka file index.html di browser (Chrome, Firefox, Edge, Safari)
2. Klik "Sign Up" untuk membuat akun baru
3. Isi NIS, Nama, Email, dan Password (min 6 karakter)
4. Klik "Daftar"
```

### 2️⃣ Isi Profil User
```
1. Di dashboard, klik bagian "Pengaturan User"
2. Perbarui NIS, Nama, dan Email jika diperlukan
3. Klik "Simpan Profil"
```

### 3️⃣ Tambah Catatan Pekerjaan
```
1. Isi form "Catatan Pekerjaan Harian":
   - Nama Pekerjaan (contoh: Instalasi jaringan)
   - Tanggal (auto-fill dengan hari ini)
   - Jam (auto-fill dengan jam sekarang)
   - Lokasi Pekerjaan
   - Nama Orang yang Meminta/Menyuruh
   - Bukti Kerja (deskripsi detail)
   - Upload Gambar (opsional, max 5MB)
2. Klik "Tambah Catatan"
3. Catatan akan muncul di "Daftar Catatan"
```

### 4️⃣ Kelola Catatan
```
- SEARCH: Ketik di kolom pencarian untuk filter catatan
- SORT: Pilih urutan di dropdown (Terbaru/Terlama/Nama)
- EDIT: Klik tombol Edit pada catatan yang ingin diubah
- HAPUS: Klik tombol Hapus (dengan konfirmasi)
```

### 5️⃣ Export Laporan
```
- Export Excel: Download sebagai CSV (buka dengan Excel)
- Export PDF: Pilih "Save as PDF" di dialog print browser
- Export Word: Download sebagai file .doc
- Semua format menyertakan: data user, semua catatan, dan gambar
```

### 6️⃣ Logout
```
1. Klik tombol "Logout" di header
2. Konfirmasi logout
3. Akan kembali ke halaman login
```

---

## 💾 Penyimpanan Data

| Item | Lokasi | Sifat |
|------|--------|-------|
| User Data | Browser LocalStorage | Persistent (tidak hilang saat close browser) |
| Catatan | Browser LocalStorage | Persistent |
| Gambar | Browser LocalStorage | Persistent (embed sebagai data URL) |
| Session | Browser LocalStorage | Bertahan sampai logout |

⚠️ **Penting**: 
- Data hanya di browser lokal (tidak ada server)
- Hapus cache/cookies browser akan menghapus data
- Rutin export sebagai backup

---

## ⚙️ Teknologi yang Digunakan

- **HTML5** - Struktur semantic
- **Tailwind CSS 3** - Styling utility-first (CDN)
- **JavaScript Vanilla** - Logic, no framework dependencies
- **LocalStorage API** - Penyimpanan data browser
- **File API** - Upload dan preview gambar
- **Blob API** - Generate download file

---

## 📋 Checklist Fitur

- ✅ Autentikasi (Login/Signup/Logout)
- ✅ Manajemen profil user
- ✅ CRUD catatan pekerjaan (Create, Read, Update, Delete)
- ✅ Upload gambar dengan validasi
- ✅ Search & filter catatan
- ✅ Sort berbagai cara
- ✅ Export Excel (CSV)
- ✅ Export PDF (print)
- ✅ Export Word (HTML)
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Form validations
- ✅ Loading states
- ✅ User confirmations

---

## 🎯 Tips & Trik

1. **Backup Rutin**
   - Export laporan setiap minggu untuk backup
   - Simpan file di cloud (Google Drive, OneDrive, etc)

2. **Data Akurat**
   - Isi tanggal dan jam dengan tepat
   - Gunakan deskripsi bukti kerja yang detail
   - Selalu upload foto bukti kerja

3. **Efisiensi**
   - Gunakan search untuk cari catatan lama
   - Sort by name untuk laporan terstruktur
   - Edit jika ada kesalahan, jangan buat duplikat

4. **Presentasi**
   - Export PDF untuk presentasi formal
   - Export Word untuk document professional
   - Gambar akan otomatis included

---

## 🔒 Keamanan Data

- ✅ Validasi input untuk prevent injection
- ✅ Email format validation
- ✅ Password minimal 6 karakter
- ✅ File size limit (5MB) untuk gambar
- ✅ MIME type checking untuk upload gambar
- ✅ Konfirmasi sebelum delete/logout

---

## 📞 Troubleshooting

### Data Hilang Setelah Close Browser?
→ Data di localStorage bersifat persistent. Jika hilang, kemungkinan cache dibersihkan atau browser setting.

### Gambar Tidak Muncul di Export?
→ Pastikan ukuran gambar < 5MB dan format gambar (JPG, PNG, GIF, etc).

### Export Tidak Berfungsi?
→ Gunakan browser modern (Chrome, Firefox, Edge). Disable adblocker jika ada.

### Lupa Password?
→ Saat ini tidak ada fitur reset. Daftar akun baru atau clear browser data (akan reset semua).

---

## 📚 File Structure

```
Website laporan/
├── index.html      # Main HTML file
├── script.js       # JavaScript logic (pure vanilla)
├── README.md       # Dokumentasi ini
└── styles.css      # (deprecated, gunakan Tailwind)
```

---

## 🚧 Pengembangan Selanjutnya (Opsional)

- [ ] Backend server untuk penyimpanan di cloud
- [ ] Database untuk multi-device sync
- [ ] Dark mode toggle
- [ ] Multiple language support
- [ ] Advanced statistics & charts
- [ ] Email export functionality
- [ ] Mobile app version

---

## 📄 Lisensi

Aplikasi ini dibuat untuk keperluan dokumentasi praktik. Bebas digunakan dan dimodifikasi.

---

## 🎉 Selamat Menggunakan!

Semoga aplikasi ini membantu Anda mendokumentasikan praktik dengan lebih baik dan terstruktur. Jika ada pertanyaan atau saran, silakan update code ini sesuai kebutuhan. 

**Happy practicing! 📚✨**
