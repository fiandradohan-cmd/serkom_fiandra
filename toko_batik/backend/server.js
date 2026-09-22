require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Akses file upload melalui /uploads/...
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Route utama
app.get("/", (req, res) => {
    res.send("API jalan");
});

// Jalankan server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});