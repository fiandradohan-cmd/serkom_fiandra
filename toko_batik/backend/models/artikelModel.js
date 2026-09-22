const db = require("../config/db");

// Ambil semua artikel
const findAllArtikel = async () => {
    const sql = `
        SELECT
            id,
            judul,
            ringkasan,
            isi,
            gambar,
            created_at,
            updated_at
        FROM artikel
        ORDER BY id DESC
    `;

    const [rows] = await db.promise().query(sql);

    return rows;
};


// Ambil artikel berdasarkan ID
const findArtikelById = async (id) => {
    const sql = `
        SELECT
            id,
            judul,
            ringkasan,
            isi,
            gambar,
            created_at,
            updated_at
        FROM artikel
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [id]);

    return rows[0] || null;
};


// Tambah artikel
const insertArtikel = async (artikelData) => {
    const {
        judul,
        ringkasan,
        isi,
        gambar
    } = artikelData;

    const sql = `
        INSERT INTO artikel (
            judul,
            ringkasan,
            isi,
            gambar
        )
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        judul,
        ringkasan,
        isi,
        gambar
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Update artikel
const updateArtikel = async (id, artikelData) => {
    const {
        judul,
        ringkasan,
        isi,
        gambar
    } = artikelData;

    const sql = `
        UPDATE artikel
        SET
            judul = ?,
            ringkasan = ?,
            isi = ?,
            gambar = ?
        WHERE id = ?
    `;

    const values = [
        judul,
        ringkasan,
        isi,
        gambar,
        id
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// Hapus artikel
const deleteArtikel = async (id) => {
    const sql = `
        DELETE FROM artikel
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [id]);

    return result;
};


module.exports = {
    findAllArtikel,
    findArtikelById,
    insertArtikel,
    updateArtikel,
    deleteArtikel
};