const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// AUTHENTICATE
// Mengecek Bearer JWT
// ==========================================
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header tidak ditemukan"
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Format token harus Bearer <token>"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token tidak valid atau sudah kedaluwarsa"
        });
    }
};


// ==========================================
// REQUIRE ROLE
// Membatasi akses berdasarkan role
// ==========================================
const requireRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Belum terautentikasi"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Anda tidak memiliki izin untuk mengakses resource ini"
            });
        }

        next();
    };
};


// ==========================================
// UPLOAD GAMBAR
// Field: gambar
// Folder: uploads/images
// Maksimal: 5MB
// ==========================================

const uploadDir = path.join(__dirname, "../uploads/images");

// Buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// Penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            ext;

        cb(null, filename);
    }
});

// Filter hanya file gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File harus berupa gambar JPG, JPEG, PNG, atau WEBP"));
    }
};

// Middleware upload
const middlewareUploadGambar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("gambar");


// ==========================================
// HASIL UPLOAD GAMBAR
// Mengembalikan path gambar
// ==========================================
const sendHasilUpload = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "Gambar belum diupload"
        });
    }

    const filePath = `/uploads/images/${req.file.filename}`;

    res.status(201).json({
        message: "Gambar berhasil diupload",
        path: filePath
    });
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    authenticate,
    requireRole,
    middlewareUploadGambar,
    sendHasilUpload
};