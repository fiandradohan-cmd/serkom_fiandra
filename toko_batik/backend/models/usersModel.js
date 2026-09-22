const db = require("../config/db");

// ==========================================
// CREATE USER
// ==========================================
const createUser = async (userData) => {
    const {
        nama_d,
        nama_b,
        kelamin,
        lahir,
        alamat,
        phone,
        email,
        role,
        uname,
        passwd,
        foto
    } = userData;

    const sql = `
        INSERT INTO users (
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            passwd,
            foto
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        nama_d,
        nama_b,
        kelamin,
        lahir,
        alamat,
        phone,
        email,
        role,
        uname,
        passwd,
        foto
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// ==========================================
// FIND ALL USERS
// Tanpa password
// ==========================================
const findAllUsers = async (role = null) => {

    let sql = `
        SELECT
            id,
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            foto,
            created_at,
            updated_at
        FROM users
    `;

    const values = [];

    if (role) {
        sql += ` WHERE role = ? `;
        values.push(role);
    }

    sql += ` ORDER BY id DESC `;

    const [rows] = await db.promise().query(sql, values);

    return rows;
};


// ==========================================
// FIND ALL PEMBELI
// ==========================================
const findAllPembeli = async () => {
    return findAllUsers("pembeli");
};


// ==========================================
// FIND USER BY EMAIL
// ==========================================
const findUserByEmail = async (email) => {

    const sql = `
        SELECT
            id,
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            passwd,
            foto,
            created_at,
            updated_at
        FROM users
        WHERE email = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [email]);

    return rows[0] || null;
};


// ==========================================
// FIND USER BY CREDENTIAL
// Credential = email / username
// ==========================================
const findUserByCredential = async (credential) => {

    const sql = `
        SELECT
            id,
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            passwd,
            foto,
            created_at,
            updated_at
        FROM users
        WHERE email = ?
           OR uname = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(
        sql,
        [credential, credential]
    );

    return rows[0] || null;
};


// ==========================================
// FIND USER BY ID
// Tanpa passwd
// ==========================================
const findUserById = async (id) => {

    const sql = `
        SELECT
            id,
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            foto,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [id]);

    return rows[0] || null;
};


// ==========================================
// FIND PASSWORD HASH BY ID
// ==========================================
const findPasswdHashById = async (id) => {

    const sql = `
        SELECT passwd
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.promise().query(sql, [id]);

    return rows[0] || null;
};


// ==========================================
// UPDATE USER PROFILE
// ==========================================
const updateUserProfile = async (id, userData) => {

    const {
        nama_d,
        nama_b,
        kelamin,
        lahir,
        alamat,
        phone,
        email,
        uname,
        foto
    } = userData;

    const sql = `
        UPDATE users
        SET
            nama_d = ?,
            nama_b = ?,
            kelamin = ?,
            lahir = ?,
            alamat = ?,
            phone = ?,
            email = ?,
            uname = ?,
            foto = ?
        WHERE id = ?
    `;

    const values = [
        nama_d,
        nama_b,
        kelamin,
        lahir,
        alamat,
        phone,
        email,
        uname,
        foto,
        id
    ];

    const [result] = await db.promise().query(sql, values);

    return result;
};


// ==========================================
// DELETE USER
// ==========================================
const deleteUser = async (id) => {

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    const [result] = await db.promise().query(sql, [id]);

    return result;
};


// ==========================================
// EXPORT
// ==========================================

const updatePassword = async (id, hash) => {
    const sql = `UPDATE users SET passwd = ? WHERE id = ?`;
    const [result] = await db.promise().query(sql, [hash, id]);
    return result;
};

module.exports = {
    createUser,
    findAllUsers,
    findAllPembeli,
    findUserByEmail,
    findUserByCredential,
    findUserById,
    findPasswdHashById,
    updateUserProfile,
    updatePassword,
    deleteUser
};