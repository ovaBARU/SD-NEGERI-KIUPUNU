# SI-SISWA v4.0 — Publik + Admin

## Hak akses
- Publik: dapat melihat seluruh modul/data dan Export Semua Data.
- Admin: login untuk Import Excel serta tambah/edit/hapus data.
- Mode Admin berlaku selama tab browser aktif.

## Login demo
- Username: `admin`
- Password: `admin123`

> Catatan keamanan: login ini adalah proteksi sisi browser untuk versi prototipe/local. Untuk deployment online multi-perangkat yang benar-benar aman, autentikasi dan database harus dipindahkan ke backend (misalnya Supabase). Jangan memakai password demo ini untuk data produksi.

## Export
Tombol `Export Semua Data` membuat satu file Excel dengan sheet:
Identitas Sekolah, Kepala Sekolah, Data Guru, Tenaga Kependidikan, Sarana Prasarana, dan Data Siswa.

## Menjalankan
Buka `index.html` di browser. Untuk penggunaan online, deploy folder ini ke hosting statis.
