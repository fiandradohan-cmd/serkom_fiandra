const express = require("express");

const router = express.Router();

const {
    authenticate,
    requireRole,
    middlewareUploadGambar,
    sendHasilUpload
} = require("../middlewares");

// Controller user
const usersController = require("../controllers/usersController");

// ==========================================
// REGISTER & LOGIN - TANPA LOGIN
// ==========================================

router.post("/register", usersController.registerUser);

router.post("/login", usersController.loginUser);


// ==========================================
// PRODUK PUBLIK - TANPA LOGIN
// ==========================================

router.get("/produk", usersController.listProduk);

router.get("/produk/:id_produk", usersController.getProdukById);


// ==========================================
// ARTIKEL PUBLIK - TANPA LOGIN
// ==========================================

router.get("/artikel", usersController.listArtikelPublik);

router.get(
    "/artikel/:id",
    usersController.getArtikelPublikById
);


// ==========================================
// ROUTE PEMBELI - WAJIB LOGIN
// ==========================================

router.use(
    authenticate,
    requireRole("pembeli")
);


// ==========================================
// PROFILE PEMBELI
// ==========================================

router.get(
    "/me",
    usersController.getMyProfile
);

router.put(
    "/me",
    usersController.updateMyProfile
);


// ==========================================
// UPLOAD GAMBAR
// ==========================================

router.post(
    "/upload-gambar",
    middlewareUploadGambar,
    sendHasilUpload
);


// ==========================================
// DASHBOARD PEMBELI
// ==========================================

router.get(
    "/dashboard",
    usersController.getDashboard
);


// ==========================================
// PEMBELIAN PEMBELI
// ==========================================

router.post(
    "/pembelian",
    usersController.createPembelian
);

router.get(
    "/pembelian",
    usersController.listMyPembelian
);

router.get(
    "/pembelian/:id",
    usersController.getMyPembelianById
);


module.exports = router;