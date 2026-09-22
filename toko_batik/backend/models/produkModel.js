const db = require("../config/db");

// Ambil semua produk
const findAllProduk = async () => {
    const sql = `
        SELECT
            id_produk,
            nama_produk,
            deskripsi,
            harga,
            gambar,
            kategori,
            created_at,
            updated_at
        FROM produk
        ORDER BY id_produk DESC
    `;

    const [rows] = await db.promise().query(sql);

    return rows;
};


// Ambil produk berdasarkan ID
const findProdukById = async (id_produk) => {
    const sql = `
        SELECT
            id_produk,
            nama_produk,
            deskripsi,
            harga,
            gambar,
            kategori,
            created_at,
            updated_at
        FROM produk
        WHERE id_produk = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [id_produk]);

    return rows[0] || null;
};


// Tambah produk
const insertProduk = async (produkData) => {
    const {
        nama_produk,
        deskripsi,
        harga,
        gambar,
        kategori
    } = produkData;

    const sql = `
        INSERT INTO produk (
            nama_produk,
            deskripsi,
            harga,
            gambar,
            kategori
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        nama_produk,
        deskripsi,
        harga,
        gambar,
        kategori
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Update produk
const updateProduk = async (id_produk, produkData) => {
    const {
        nama_produk,
        deskripsi,
        harga,
        gambar,
        kategori
    } = produkData;

    const sql = `
        UPDATE produk
        SET
            nama_produk = ?,
            deskripsi = ?,
            harga = ?,
            gambar = ?,
            kategori = ?
        WHERE id_produk = ?
    `;

    const values = [
        nama_produk,
        deskripsi,
        harga,
        gambar,
        kategori,
        id_produk
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Hapus produk
const deleteProduk = async (id_produk) => {
    const sql = `
        DELETE FROM produk
        WHERE id_produk = ?
    `;

    const [result] = await db.promise().query(sql, [id_produk]);

    return result;
};


module.exports = {
    findAllProduk,
    findProdukById,
    insertProduk,
    updateProduk,
    deleteProduk
};