// ==========================================
// INFORMASI TOKO
// ==========================================

export const SITE = {
    nama_toko: "Batik Nusantara",
    alamat: "Jl. Slamet Riyadi No. 45, Solo, Jawa Tengah",
    email: "info@batiknusantara.com",
    phone: "081234567890",
    bank: "BCA",
    no_rekening: "1234567890",
    atas_nama: "Batik Nusantara",
    jam_buka: "Senin - Sabtu, 08.00 - 17.00 WIB",
    link_wa: "https://wa.me/6281234567890",
    link_ig: "https://instagram.com/batiknusantara",
    link_fb: "https://facebook.com/batiknusantara"
};


// ==========================================
// NAVIGASI PUBLIK
// ==========================================

export const PUBLIC_NAV = [
    {
        label: "Beranda",
        path: "/"
    },
    {
        label: "Toko",
        path: "/produk"
    },
    {
        label: "Artikel",
        path: "/artikel"
    }
];


// ==========================================
// ENUM KELAMIN
// ==========================================

export const KELAMIN = [
    "L",
    "P"
];


// ==========================================
// KATEGORI PRODUK
// Sesuai ENUM pada database
// ==========================================

export const KATEGORI_PRODUK = [
    "Batik Tulis",
    "Batik Cap",
    "Batik Printing",
    "Aksesoris Batik"
];


// ==========================================
// METODE PEMBAYARAN
// Sesuai ENUM pada database
// ==========================================

export const METODE_BAYAR = [
    "Bank Transfer",
    "COD"
];


// ==========================================
// SHIPPING / KURIR
// ==========================================

export const SHIPPING = [
    "JNT Express",
    "JNE"
];


// ==========================================
// STATUS PROSES
// ==========================================

export const STATUS_PROSES = [
    "Menunggu",
    "Diproses",
    "Dikirim",
    "Selesai",
    "Dibatalkan"
];


// ==========================================
// STATUS PEMBAYARAN
// ==========================================

export const STATUS_BAYAR = [
    "Belum",
    "Dibayar"
];
