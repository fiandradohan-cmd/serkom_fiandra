const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/usersModel");
const produkModel = require("../models/produkModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

// ==========================================
// REGISTER USER
// ==========================================
const registerUser = async (req, res) => {
    try {
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
        } = req.body;

        if (
            !nama_d ||
            !nama_b ||
            !kelamin ||
            !lahir ||
            !alamat ||
            !phone ||
            !email ||
            !role ||
            !uname ||
            !passwd
        ) {
            return res.status(400).json({
                message: "Semua data wajib diisi"
            });
        }

        if (!["admin", "pembeli"].includes(role)) {
            return res.status(400).json({
                message: "Role harus admin atau pembeli"
            });
        }

        const existingEmail = await usersModel.findUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({
                message: "Email sudah terdaftar"
            });
        }

        const hashedPassword = await bcrypt.hash(passwd, 10);

        const result = await usersModel.createUser({
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            role,
            uname,
            passwd: hashedPassword,
            foto: foto || "-"
        });

        return res.status(201).json({
            message: "User berhasil didaftarkan",
            id: result.insertId,
            role
        });

    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { credential, passwd } = req.body;

        if (!credential || !passwd) {
            return res.status(400).json({
                message: "Credential dan password wajib diisi"
            });
        }

        const user = await usersModel.findUserByCredential(credential);

        if (!user) {
            return res.status(401).json({
                message: "Credential atau password salah"
            });
        }

        const passwordMatch = await bcrypt.compare(
            passwd,
            user.passwd
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Credential atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                nama_d: user.nama_d,
                nama_b: user.nama_b,
                email: user.email,
                uname: user.uname,
                role: user.role,
                foto: user.foto
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET PROFILE SENDIRI
// ==========================================
const getMyProfile = async (req, res) => {
    try {
        const user = await usersModel.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data profile berhasil diambil",
            data: user
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// UPDATE PROFILE SENDIRI
// ==========================================
const updateMyProfile = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await usersModel.findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        const {
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            uname,
            foto,
            passwd_lama,
            passwd_baru
        } = req.body;

        const updateData = {
            nama_d: nama_d || user.nama_d,
            nama_b: nama_b || user.nama_b,
            kelamin: kelamin || user.kelamin,
            lahir: lahir || user.lahir,
            alamat: alamat || user.alamat,
            phone: phone || user.phone,
            email: email || user.email,
            uname: uname || user.uname,
            foto: foto || user.foto
        };

        await usersModel.updateUserProfile(id, updateData);

        if (passwd_baru) {
            if (!passwd_lama) {
                return res.status(400).json({
                    message: "Password lama wajib diisi"
                });
            }

            const passwordData =
                await usersModel.findPasswdHashById(id);

            if (!passwordData) {
                return res.status(404).json({
                    message: "User tidak ditemukan"
                });
            }

            const passwordMatch = await bcrypt.compare(
                passwd_lama,
                passwordData.passwd
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Password lama salah"
                });
            }

            const hashedPassword = await bcrypt.hash(
                passwd_baru,
                10
            );

            const db = require("../config/db");

            await new Promise((resolve, reject) => {
                db.query(
                    "UPDATE users SET passwd = ? WHERE id = ?",
                    [hashedPassword, id],
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
            });
        }

        return res.status(200).json({
            message: "Profile berhasil diperbarui"
        });

    } catch (error) {
        console.error("Update profile error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST PRODUK PUBLIK
// ==========================================
const listProduk = async (req, res) => {
    try {
        const produk = await produkModel.findAllProduk();

        return res.status(200).json({
            message: "Data produk berhasil diambil",
            data: produk
        });

    } catch (error) {
        console.error("List produk error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET PRODUK BY ID PUBLIK
// ==========================================
const getProdukById = async (req, res) => {
    try {
        const id = req.params.id_produk || req.params.id;

        const produk = await produkModel.findProdukById(id);

        if (!produk) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data produk berhasil diambil",
            data: produk
        });

    } catch (error) {
        console.error("Get produk error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST ARTIKEL PUBLIK
// ==========================================
const listArtikelPublik = async (req, res) => {
    try {
        const artikel = await artikelModel.findAllArtikel();

        return res.status(200).json({
            message: "Data artikel berhasil diambil",
            data: artikel
        });

    } catch (error) {
        console.error("List artikel error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET ARTIKEL PUBLIK BY ID
// ==========================================
const getArtikelPublikById = async (req, res) => {
    try {
        const { id } = req.params;

        const artikel = await artikelModel.findArtikelById(id);

        if (!artikel) {
            return res.status(404).json({
                message: "Artikel tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data artikel berhasil diambil",
            data: artikel
        });

    } catch (error) {
        console.error("Get artikel error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// DASHBOARD PEMBELI
// ==========================================
const getDashboard = async (req, res) => {
    try {
        const idPembeli = req.user.id;

        const stats = await pembelianModel.getStatsByPembeliId(
            idPembeli
        );

        return res.status(200).json({
            message: "Dashboard berhasil diambil",
            data: stats
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// CREATE PEMBELIAN
// ==========================================
const createPembelian = async (req, res) => {
    try {
        const idPembeli = req.user.id;

        const {
            id_produk,
            nama_pembeli,
            alamat_pembeli,
            phone_pembeli,
            metode_pembayaran,
            pengiriman,
            catatan,
            foto_bukti
        } = req.body;

        // Data wajib
        if (
            !id_produk ||
            !nama_pembeli ||
            !alamat_pembeli ||
            !phone_pembeli ||
            !metode_pembayaran ||
            !pengiriman
        ) {
            return res.status(400).json({
                message: "Data pembelian wajib diisi"
            });
        }

        // Validasi metode pembayaran
        if (!["Bank Transfer", "COD"].includes(metode_pembayaran)) {
            return res.status(400).json({
                message: "Metode pembayaran tidak valid"
            });
        }

        // Validasi kurir
        if (!["JNT Express", "JNE"].includes(pengiriman)) {
            return res.status(400).json({
                message: "Kurir tidak valid"
            });
        }

        // Pastikan produk tersedia
        const produk = await produkModel.findProdukById(id_produk);

        if (!produk) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        const result = await pembelianModel.insertPembelian({
            id_pembeli: idPembeli,
            id_produk,
            nama_pembeli,
            alamat_pembeli,
            phone_pembeli,
            metode_pembayaran,
            pembayaran: "Belum",
            pengiriman,
            status: "Tertunda",
            catatan: catatan || null,
            foto_bukti: foto_bukti || null
        });

        return res.status(201).json({
            message: "Pembelian berhasil dibuat",
            id: result.insertId
        });

    } catch (error) {
        console.error("Create pembelian error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST PEMBELIAN SAYA
// ==========================================
const listMyPembelian = async (req, res) => {
    try {
        const idPembeli = req.user.id;

        const pembelian =
            await pembelianModel.findPembelianByPembeliIdWithDetail(
                idPembeli
            );

        return res.status(200).json({
            message: "Data pembelian berhasil diambil",
            data: pembelian
        });

    } catch (error) {
        console.error("List pembelian error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET PEMBELIAN SAYA BY ID
// ==========================================
const getMyPembelianById = async (req, res) => {
    try {
        const idPembeli = req.user.id;
        const { id } = req.params;

        const pembelian =
            await pembelianModel.findPembelianByIdAndPembeliId(
                id,
                idPembeli
            );

        if (!pembelian) {
            return res.status(404).json({
                message: "Pembelian tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data pembelian berhasil diambil",
            data: pembelian
        });

    } catch (error) {
        console.error("Get pembelian error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
    updateMyProfile,

    listProduk,
    getProdukById,

    listArtikelPublik,
    getArtikelPublikById,

    getDashboard,
    createPembelian,
    listMyPembelian,
    getMyPembelianById
};