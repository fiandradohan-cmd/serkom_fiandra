const express = require("express");

const router = express.Router();

const {
    authenticate,
    requireRole,
    middlewareUploadGambar,
    sendHasilUpload
} = require("../middlewares/index");

const adminController = require("../controllers/admincontroller");

// Semua route admin wajib login + role admin
router.use(authenticate, requireRole("admin"));

router.post(
    "/upload-gambar",
    middlewareUploadGambar,
    sendHasilUpload
);


// ==========================================
// STATISTIK ADMIN
// ==========================================

router.get(
    "/stats",
    adminController.getStats
);

// ==========================================
// PROFILE ADMIN
// ==========================================
router.get("/me", adminController.getMe);
router.put("/me", adminController.updateMe);



// ==========================================
// STATISTIK USERS
// ==========================================
//router.get("/users", adminController.listUsers);
//router.get("/users/:id", adminController.getUser);
//router.post("/users", adminController.createUser);
//router.put("/users/:id", adminController.updateUser);
//router.delete("/users/:id", adminController.deleteUser);


// ==========================================
// KELOLA PEMBELI
// ==========================================

router.get(
    "/pembeli",
    adminController.listPembeli
);

router.get(
    "/pembeli/:id",
    adminController.getPembeli
);

router.post(
    "/pembeli",
    adminController.createPembeli
);

router.put(
    "/pembeli/:id",
    adminController.updatePembeli
);

router.delete(
    "/pembeli/:id",
    adminController.deletePembeli
);

// Alias for users (frontend compatibility)
router.get("/users", adminController.listPembeli);
router.get("/users/:id", adminController.getPembeli);
router.post("/users", adminController.createPembeli);
router.put("/users/:id", adminController.updatePembeli);
router.delete("/users/:id", adminController.deletePembeli);


// ==========================================
// KELOLA PRODUK
// ==========================================

router.get(
    "/produk",
    adminController.listProduk
);

router.get(
    "/produk/:id",
    adminController.getProdukById
);

router.post(
    "/produk",
    adminController.createProduk
);

router.put(
    "/produk/:id",
    adminController.updateProduk
);

router.delete(
    "/produk/:id",
    adminController.deleteProduk
);


// ==========================================
// KELOLA PEMBELIAN
// ==========================================

router.get(
    "/pembelian",
    adminController.listPembelian
);

router.get(
    "/pembelian/:id",
    adminController.getPembelianById
);

router.put(
    "/pembelian/:id",
    adminController.updatePembelian
);

router.delete(
    "/pembelian/:id",
    adminController.deletePembelian
);


// ==========================================
// KELOLA ARTIKEL
// ==========================================

router.get(
    "/artikel",
    adminController.listArtikel
);

router.get(
    "/artikel/:id",
    adminController.getArtikelById
);

router.post(
    "/artikel",
    adminController.createArtikel
);

router.put(
    "/artikel/:id",
    adminController.updateArtikel
);

router.delete(
    "/artikel/:id",
    adminController.deleteArtikel
);


module.exports = router;