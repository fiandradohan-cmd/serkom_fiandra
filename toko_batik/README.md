# Toko Batik Nusantara

Website dinamis toko pengrajin batik (Junior Web Developer - Latihan Uji Serkom).

## Fitur

- Halaman publik: Beranda, Daftar Produk, Detail Produk, Artikel, Detail Artikel
- Login Admin untuk mengelola Produk, Artikel, dan Users
- Sistem pembelian (struktur tetap ada, data riwayat dikosongkan)
- Database: `toko_batik`

## Perubahan dari proyek asli (toko_online / Homee.Printing)

1. Nama database diganti menjadi **toko_batik**
2. Konten produk diganti menjadi produk batik (Batik Tulis, Batik Cap, Batik Printing, Aksesoris Batik)
3. Artikel diganti menjadi artikel seputar batik
4. User pembeli (sample) dihapus — hanya tersisa akun **admin**
5. Riwayat pembelian dikosongkan
6. Branding diganti menjadi **Batik Nusantara**

## Akun Admin

- Username: `admin`
- Password: (sama dengan password admin proyek asli / hash yang ada di SQL)
- Email: admin@batiknusantara.com

> Password hash yang digunakan sama dengan admin sebelumnya. Jika lupa, buat ulang user admin via phpMyAdmin atau script bcrypt.

## Cara Menjalankan

### 1. Database

1. Jalankan XAMPP / Laragon (MySQL)
2. Import file `toko_batik.sql` melalui phpMyAdmin
3. Pastikan database bernama `toko_batik`

### 2. Backend

```bash
cd backend
npm install
# edit .env jika perlu (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
npm run dev
```

Backend berjalan di `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend biasanya di `http://localhost:5173`

## Struktur Folder

```
toko_batik/
├── backend/          # Express + MySQL
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── frontend/         # React + Vite
│   └── src/
├── toko_batik.sql    # Database dump
└── README.md
```

## Catatan

- Gambar produk/artikel di SQL mengarah ke path `/uploads/images/...`. Anda dapat mengunggah ulang gambar melalui panel admin.
- Role `pembeli` masih tersedia di sistem (untuk registrasi baru), namun data sample pembeli dan riwayat pembelian sudah dihapus sesuai permintaan.
