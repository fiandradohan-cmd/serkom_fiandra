const produkModel = require("../models/produkModel");
const usersModel = require("../models/usersModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");
const bcrypt = require("bcrypt");

const KATEGORI_VALID = [
    "Batik Tulis",
    "Batik Cap",
    "Batik Printing",
    "Aksesoris Batik"
];


// ==========================================
// LIST PRODUK
// ==========================================
const listProduk = async (req, res) => {
    try {
        const produk = await produkModel.findAllProduk();

        res.status(200).json({
            message: "Data produk berhasil diambil",
            data: produk
        });
    } catch (error) {
        console.error("List produk error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET PRODUK BY ID
// ==========================================
const getProdukById = async (req, res) => {
    try {
        const { id } = req.params;

        const produk = await produkModel.findProdukById(id);

        if (!produk) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data produk berhasil diambil",
            data: produk
        });
    } catch (error) {
        console.error("Get produk error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// CREATE PRODUK
// ==========================================
const createProduk = async (req, res) => {
    try {
        const {
            nama_produk,
            deskripsi,
            harga,
            gambar,
            kategori
        } = req.body;

        if (
            !nama_produk ||
            !deskripsi ||
            harga === undefined ||
            !kategori
        ) {
            return res.status(400).json({
                message: "nama_produk, deskripsi, harga, dan kategori wajib diisi"
            });
        }

        if (!KATEGORI_VALID.includes(kategori)) {
            return res.status(400).json({
                message: "Kategori tidak valid"
            });
        }

        const result = await produkModel.insertProduk({
            nama_produk,
            deskripsi,
            harga,
            gambar: gambar || null,
            kategori
        });

        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            id_produk: result.insertId
        });
    } catch (error) {
        console.error("Create produk error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// UPDATE PRODUK
// ==========================================
const updateProduk = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nama_produk,
            deskripsi,
            harga,
            gambar,
            kategori
        } = req.body;

        const produk = await produkModel.findProdukById(id);

        if (!produk) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        if (
            !nama_produk ||
            !deskripsi ||
            harga === undefined ||
            !kategori
        ) {
            return res.status(400).json({
                message: "nama_produk, deskripsi, harga, dan kategori wajib diisi"
            });
        }

        if (!KATEGORI_VALID.includes(kategori)) {
            return res.status(400).json({
                message: "Kategori tidak valid"
            });
        }

        const result = await produkModel.updateProduk(id, {
            nama_produk,
            deskripsi,
            harga,
            gambar: gambar || null,
            kategori
        });

        res.status(200).json({
            message: "Produk berhasil diperbarui",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Update produk error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// DELETE PRODUK
// ==========================================
const deleteProduk = async (req, res) => {
    try {
        const { id } = req.params;

        const produk = await produkModel.findProdukById(id);

        if (!produk) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        const result = await produkModel.deleteProduk(id);

        res.status(200).json({
            message: "Produk berhasil dihapus",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Delete produk error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST PEMBELI
// ==========================================
const listPembeli = async (req, res) => {
    try {
        const pembeli = await usersModel.findAllPembeli();

        res.status(200).json({
            message: "Data pembeli berhasil diambil",
            data: pembeli
        });
    } catch (error) {
        console.error("List pembeli error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};



// ==========================================
// GET PEMBELI BY ID
// ==========================================
const getPembeli = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await usersModel.findUserById(id);

        if (!user || user.role !== "pembeli") {
            return res.status(404).json({
                message: "Pembeli tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data pembeli berhasil diambil",
            data: user
        });
    } catch (error) {
        console.error("Get pembeli error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// CREATE PEMBELI
// ==========================================
const createPembeli = async (req, res) => {
    try {
        const {
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
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
            !uname ||
            !passwd
        ) {
            return res.status(400).json({
                message: "Semua data wajib diisi"
            });
        }

        const existingEmail = await usersModel.findUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({
                message: "Email sudah digunakan"
            });
        }

        const existingCredential =
            await usersModel.findUserByCredential(uname);

        if (existingCredential) {
            return res.status(409).json({
                message: "Username sudah digunakan"
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
            role: "pembeli",
            uname,
            passwd: hashedPassword,
            foto: foto || "-"
        });

        res.status(201).json({
            message: "Pembeli berhasil ditambahkan",
            id: result.insertId,
            role: "pembeli"
        });
    } catch (error) {
        console.error("Create pembeli error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// UPDATE PEMBELI
// ==========================================
const updatePembeli = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await usersModel.findUserById(id);

        if (!user || user.role !== "pembeli") {
            return res.status(404).json({
                message: "Pembeli tidak ditemukan"
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
            foto
        } = req.body;

        const result = await usersModel.updateUserProfile(id, {
            nama_d,
            nama_b,
            kelamin,
            lahir,
            alamat,
            phone,
            email,
            uname,
            foto: foto || user.foto
        });

        res.status(200).json({
            message: "Data pembeli berhasil diperbarui",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Update pembeli error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// DELETE PEMBELI
// ==========================================
const deletePembeli = async (req, res) => {
    try {
        return res.status(501).json({
            message: "Fungsi hapus pembeli belum tersedia di usersModel"
        });
    } catch (error) {
        console.error("Delete pembeli error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST ARTIKEL
// ==========================================
const listArtikel = async (req, res) => {
    try {
        const artikel = await artikelModel.findAllArtikel();

        res.status(200).json({
            message: "Data artikel berhasil diambil",
            data: artikel
        });
    } catch (error) {
        console.error("List artikel error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET ARTIKEL BY ID
// ==========================================
const getArtikelById = async (req, res) => {
    try {
        const { id } = req.params;

        const artikel = await artikelModel.findArtikelById(id);

        if (!artikel) {
            return res.status(404).json({
                message: "Artikel tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data artikel berhasil diambil",
            data: artikel
        });
    } catch (error) {
        console.error("Get artikel error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// CREATE ARTIKEL
// ==========================================
const createArtikel = async (req, res) => {
    try {
        const {
            judul,
            ringkasan,
            isi,
            gambar
        } = req.body;

        if (!judul || !ringkasan || !isi || !gambar) {
            return res.status(400).json({
                message: "judul, ringkasan, isi, dan gambar wajib diisi"
            });
        }

        const result = await artikelModel.insertArtikel({
            judul,
            ringkasan,
            isi,
            gambar
        });

        res.status(201).json({
            message: "Artikel berhasil ditambahkan",
            id: result.insertId
        });
    } catch (error) {
        console.error("Create artikel error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// UPDATE ARTIKEL
// ==========================================
const updateArtikel = async (req, res) => {
    try {
        const { id } = req.params;

        const artikel = await artikelModel.findArtikelById(id);

        if (!artikel) {
            return res.status(404).json({
                message: "Artikel tidak ditemukan"
            });
        }

        const {
            judul,
            ringkasan,
            isi,
            gambar
        } = req.body;

        if (!judul || !ringkasan || !isi || !gambar) {
            return res.status(400).json({
                message: "judul, ringkasan, isi, dan gambar wajib diisi"
            });
        }

        const result = await artikelModel.updateArtikel(id, {
            judul,
            ringkasan,
            isi,
            gambar
        });

        res.status(200).json({
            message: "Artikel berhasil diperbarui",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Update artikel error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// DELETE ARTIKEL
// ==========================================
const deleteArtikel = async (req, res) => {
    try {
        const { id } = req.params;

        const artikel = await artikelModel.findArtikelById(id);

        if (!artikel) {
            return res.status(404).json({
                message: "Artikel tidak ditemukan"
            });
        }

        const result = await artikelModel.deleteArtikel(id);

        res.status(200).json({
            message: "Artikel berhasil dihapus",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Delete artikel error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// STATISTIK ADMIN
// ==========================================
const getStats = async (req, res) => {
    try {
        const stats = await pembelianModel.getAdminStats();
        const recentPembelian = await pembelianModel.getRecentPembelian();

        res.status(200).json({
            message: "Statistik admin berhasil diambil",
            data: {
                stats,
                recentPembelian
            }
        });
    } catch (error) {
        console.error("Get stats error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// LIST PEMBELIAN
// ==========================================
const listPembelian = async (req, res) => {
    try {
        const pembelian =
            await pembelianModel.findAllPembelianWithDetail();

        res.status(200).json({
            message: "Data pembelian berhasil diambil",
            data: pembelian
        });
    } catch (error) {
        console.error("List pembelian error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// GET PEMBELIAN BY ID
// ==========================================
const getPembelianById = async (req, res) => {
    try {
        const { id } = req.params;

        const pembelian =
            await pembelianModel.findPembelianById(id);

        if (!pembelian) {
            return res.status(404).json({
                message: "Pembelian tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data pembelian berhasil diambil",
            data: pembelian
        });
    } catch (error) {
        console.error("Get pembelian error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// UPDATE PEMBELIAN
// ==========================================
const updatePembelian = async (req, res) => {
    try {
        const { id } = req.params;

        const pembelian =
            await pembelianModel.findPembelianById(id);

        if (!pembelian) {
            return res.status(404).json({
                message: "Pembelian tidak ditemukan"
            });
        }

        const result =
            await pembelianModel.updatePembelian(id, req.body);

        res.status(200).json({
            message: "Pembelian berhasil diperbarui",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Update pembelian error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


// ==========================================
// DELETE PEMBELIAN
// ==========================================
const deletePembelian = async (req, res) => {
    try {
        const { id } = req.params;

        const pembelian =
            await pembelianModel.findPembelianById(id);

        if (!pembelian) {
            return res.status(404).json({
                message: "Pembelian tidak ditemukan"
            });
        }

        const result =
            await pembelianModel.deletePembelian(id);

        res.status(200).json({
            message: "Pembelian berhasil dihapus",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Delete pembelian error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};



// ==========================================
// PROFILE ADMIN (me)
// ==========================================
const getMe = async (req, res) => {
    try {
        const user = await usersModel.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json({
            message: "Data profile berhasil diambil",
            data: user
        });
    } catch (error) {
        console.error("Get me error:", error.message);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const updateMe = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await usersModel.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
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
            const passwordData = await usersModel.findPasswdHashById(id);
            if (!passwordData) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }
            const match = await bcrypt.compare(passwd_lama, passwordData.passwd);
            if (!match) {
                return res.status(400).json({ message: "Password lama salah" });
            }
            const hash = await bcrypt.hash(passwd_baru, 10);
            await usersModel.updatePassword(id, hash);
        }

        const updated = await usersModel.findUserById(id);
        res.status(200).json({
            message: "Profil berhasil diperbarui",
            data: updated
        });
    } catch (error) {
        console.error("Update me error:", error.message);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = {
    // Produk
    listProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk,

    // Pembeli
    listPembeli,
    getPembeli,
    createPembeli,
    updatePembeli,
    deletePembeli,

    // Artikel
    listArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel,

    // Pembelian
    getStats,
    listPembelian,
    getPembelianById,
    updatePembelian,
    deletePembelian,

    // Profile
    getMe,
    updateMe
};