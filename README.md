# SI-SISWA — SD Negeri Kiupunu — Versi 1

Aplikasi web statis untuk mengimpor data peserta didik dari Excel dan menampilkannya di browser.

## Disesuaikan dengan file Anda
- Sheet: `Daftar Peserta Didik`
- Header utama: baris ke-5
- Subheader Data Ayah/Ibu/Wali: baris ke-6
- Data siswa: mulai baris ke-7
- Struktur: 66 kolom sesuai file sumber

## Fitur
- Dashboard statistik
- Import `.xlsx` / `.xls`
- Drag & drop Excel
- Preview hasil import
- Tabel siswa
- Pencarian Nama/NISN/NIPD/NIK
- Filter Rombel
- Detail seluruh kolom siswa
- Export ke Excel
- LocalStorage browser
- Responsif untuk komputer/tablet/HP

## Menjalankan
Buka `index.html` dengan Chrome/Edge. Untuk GitHub Pages, upload ketiga file utama (`index.html`, `style.css`, `app.js`) ke repository lalu aktifkan Pages.

## Catatan
Versi 1 memakai SheetJS dari CDN, sehingga saat pertama dibuka membutuhkan internet untuk memuat library Excel. Data siswa tidak dikirim ke server oleh aplikasi ini; data yang diimpor disimpan di browser menggunakan LocalStorage.
