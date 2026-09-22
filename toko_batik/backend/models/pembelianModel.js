const db = require("../config/db");

// Ambil semua pembelian dengan detail user dan produk
const findAllPembelianWithDetail = async () => {
    const sql = `
        SELECT
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,

            u.nama_d,
            u.nama_b,
            u.email,
            u.uname,

            pr.nama_produk,
            pr.deskripsi,
            pr.harga,
            pr.gambar,
            pr.kategori

        FROM pembelian p

        LEFT JOIN users u
            ON p.id_pembeli = u.id

        LEFT JOIN produk pr
            ON p.id_produk = pr.id_produk

        ORDER BY p.created_at DESC
    `;

    const [rows] = await db.promise().query(sql);

    return rows;
};


// Ambil pembelian berdasarkan ID
const findPembelianById = async (id) => {
    const sql = `
        SELECT
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,

            u.nama_d,
            u.nama_b,
            u.email,
            u.uname,

            pr.nama_produk,
            pr.deskripsi,
            pr.harga,
            pr.gambar,
            pr.kategori

        FROM pembelian p

        LEFT JOIN users u
            ON p.id_pembeli = u.id

        LEFT JOIN produk pr
            ON p.id_produk = pr.id_produk

        WHERE p.id = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [id]);

    return rows[0] || null;
};


// Update pembelian
const updatePembelian = async (id, pembelianData) => {
    const {
        nama_pembeli,
        alamat_pembeli,
        phone_pembeli,
        metode_pembayaran,
        pembayaran,
        pengiriman,
        status,
        catatan,
        foto_bukti
    } = pembelianData;

    const sql = `
        UPDATE pembelian
        SET
            nama_pembeli = ?,
            alamat_pembeli = ?,
            phone_pembeli = ?,
            metode_pembayaran = ?,
            pembayaran = ?,
            pengiriman = ?,
            status = ?,
            catatan = ?,
            foto_bukti = ?
        WHERE id = ?
    `;

    const values = [
        nama_pembeli,
        alamat_pembeli,
        phone_pembeli,
        metode_pembayaran,
        pembayaran,
        pengiriman,
        status,
        catatan,
        foto_bukti,
        id
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Hapus pembelian
const deletePembelian = async (id) => {
    const sql = `
        DELETE FROM pembelian
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [id]);

    return result;
};


// Tambah pembelian
const insertPembelian = async (pembelianData) => {
    const {
        id_pembeli,
        id_produk,
        nama_pembeli,
        alamat_pembeli,
        phone_pembeli,
        metode_pembayaran,
        pembayaran,
        pengiriman,
        status,
        catatan,
        foto_bukti
    } = pembelianData;

    const sql = `
        INSERT INTO pembelian (
            id_pembeli,
            id_produk,
            nama_pembeli,
            alamat_pembeli,
            phone_pembeli,
            metode_pembayaran,
            pembayaran,
            pengiriman,
            status,
            catatan,
            foto_bukti
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_pembeli,
        id_produk,
        nama_pembeli,
        alamat_pembeli,
        phone_pembeli,
        metode_pembayaran,
        pembayaran,
        pengiriman,
        status,
        catatan,
        foto_bukti
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Ambil pembelian milik pembeli dengan detail
const findPembelianByPembeliIdWithDetail = async (id_pembeli) => {
    const sql = `
        SELECT
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,

            pr.nama_produk,
            pr.deskripsi,
            pr.harga,
            pr.gambar,
            pr.kategori

        FROM pembelian p

        LEFT JOIN produk pr
            ON p.id_produk = pr.id_produk

        WHERE p.id_pembeli = ?

        ORDER BY p.created_at DESC
    `;

    const [rows] = await db.promise().query(sql, [id_pembeli]);

    return rows;
};


// Ambil pembelian berdasarkan ID dan ID pembeli
const findPembelianByIdAndPembeliId = async (id, id_pembeli) => {
    const sql = `
        SELECT
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,

            pr.nama_produk,
            pr.deskripsi,
            pr.harga,
            pr.gambar,
            pr.kategori

        FROM pembelian p

        LEFT JOIN produk pr
            ON p.id_produk = pr.id_produk

        WHERE p.id = ?
          AND p.id_pembeli = ?

        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [
        id,
        id_pembeli
    ]);

    return rows[0] || null;
};


// Statistik pembelian berdasarkan pembeli
const getStatsByPembeliId = async (id_pembeli) => {
    const sql = `
        SELECT
            COUNT(*) AS total_pembelian,

            SUM(
                CASE
                    WHEN pembayaran = 'Belum'
                    THEN 1
                    ELSE 0
                END
            ) AS belum_dibayar,

            SUM(
                CASE
                    WHEN pembayaran = 'Dibayar'
                    THEN 1
                    ELSE 0
                END
            ) AS sudah_dibayar,

            SUM(
                CASE
                    WHEN status = 'Selesai'
                    THEN 1
                    ELSE 0
                END
            ) AS selesai

        FROM pembelian
        WHERE id_pembeli = ?
    `;

    const [rows] = await db.promise().query(sql, [id_pembeli]);

    return rows[0];
};


// Statistik seluruh pembelian untuk admin
const getAdminStats = async () => {
    // Stats pembelian
    const sqlPembelian = `
        SELECT
            COUNT(*) AS total_pembelian,

            SUM(
                CASE
                    WHEN pembayaran = 'Belum'
                    THEN 1
                    ELSE 0
                END
            ) AS belum_dibayar,

            SUM(
                CASE
                    WHEN pembayaran = 'Dibayar'
                    THEN 1
                    ELSE 0
                END
            ) AS sudah_dibayar,

            SUM(
                CASE
                    WHEN status IN ('Tertunda', 'Dikemas', 'Dikirim')
                    THEN 1
                    ELSE 0
                END
            ) AS pesanan_aktif,

            SUM(
                CASE
                    WHEN status = 'Tertunda'
                    THEN 1
                    ELSE 0
                END
            ) AS tertunda,

            SUM(
                CASE
                    WHEN status = 'Dikemas'
                    THEN 1
                    ELSE 0
                END
            ) AS dikemas,

            SUM(
                CASE
                    WHEN status = 'Dikirim'
                    THEN 1
                    ELSE 0
                END
            ) AS dikirim,

            SUM(
                CASE
                    WHEN status = 'Diterima'
                    THEN 1
                    ELSE 0
                END
            ) AS diterima,

            SUM(
                CASE
                    WHEN status = 'Selesai'
                    THEN 1
                    ELSE 0
                END
            ) AS selesai,

            COALESCE(SUM(
                CASE
                    WHEN pembayaran = 'Dibayar'
                    THEN COALESCE(pr.harga, 0)
                    ELSE 0
                END
            ), 0) AS pendapatan,

            COALESCE(SUM(
                CASE
                    WHEN pembayaran = 'Dibayar'
                    THEN 1
                    ELSE 0
                END
            ), 0) AS produk_terjual

        FROM pembelian p
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
    `;

    const [pembelianRows] = await db.promise().query(sqlPembelian);
    const pembelianStats = pembelianRows[0] || {};

    // Count pembeli
    const [pembeliRows] = await db.promise().query(
        `SELECT COUNT(*) AS total_pembeli FROM users WHERE role = 'pembeli'`
    );

    // Count produk
    const [produkRows] = await db.promise().query(
        `SELECT COUNT(*) AS total_produk FROM produk`
    );

    // Count artikel
    const [artikelRows] = await db.promise().query(
        `SELECT COUNT(*) AS total_artikel FROM artikel`
    );

    // Count pesan kontak (jika tabel ada, fallback 0)
    let total_kontak = 0;
    try {
        const [kontakRows] = await db.promise().query(
            `SELECT COUNT(*) AS total_kontak FROM kontak`
        );
        total_kontak = kontakRows[0]?.total_kontak || 0;
    } catch (e) {
        total_kontak = 0;
    }

    return {
        total_pembelian: Number(pembelianStats.total_pembelian) || 0,
        belum_dibayar: Number(pembelianStats.belum_dibayar) || 0,
        sudah_dibayar: Number(pembelianStats.sudah_dibayar) || 0,
        pesanan_aktif: Number(pembelianStats.pesanan_aktif) || 0,
        tertunda: Number(pembelianStats.tertunda) || 0,
        dikemas: Number(pembelianStats.dikemas) || 0,
        dikirim: Number(pembelianStats.dikirim) || 0,
        diterima: Number(pembelianStats.diterima) || 0,
        selesai: Number(pembelianStats.selesai) || 0,
        pendapatan: Number(pembelianStats.pendapatan) || 0,
        produk_terjual: Number(pembelianStats.produk_terjual) || 0,
        total_pembeli: Number(pembeliRows[0]?.total_pembeli) || 0,
        total_produk: Number(produkRows[0]?.total_produk) || 0,
        total_artikel: Number(artikelRows[0]?.total_artikel) || 0,
        total_kontak: Number(total_kontak) || 0,
        pesan_kontak: Number(total_kontak) || 0,
    };
};


// Ambil pembelian terbaru
const getRecentPembelian = async () => {
    const sql = `
        SELECT
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.foto_bukti,
            p.created_at,

            pr.nama_produk,
            pr.harga,
            pr.gambar

        FROM pembelian p

        LEFT JOIN produk pr
            ON p.id_produk = pr.id_produk

        ORDER BY p.created_at DESC
        LIMIT 5
    `;

    const [rows] = await db.promise().query(sql);

    return rows;
};


module.exports = {
    findAllPembelianWithDetail,
    findPembelianById,
    updatePembelian,
    deletePembelian,
    insertPembelian,
    findPembelianByPembeliIdWithDetail,
    findPembelianByIdAndPembeliId,
    getStatsByPembeliId,
    getAdminStats,
    getRecentPembelian
};