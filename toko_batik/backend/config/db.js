require("dotenv").config();
const mysql = require("mysql2");

// Membuat connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
    database: process.env.DB_NAME
});

// Uji koneksi MySQL
db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection error:", err.message);
        return;
    }

    console.log("MySQL connected");
    connection.release();
});

module.exports = db;