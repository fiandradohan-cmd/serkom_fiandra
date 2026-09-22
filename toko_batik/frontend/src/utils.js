import { API_BASE } from "./api";


// ==========================================
// MEDIA URL
// ==========================================

export const mediaUrl = (path) => {
    if (!path || path === "default.jpg") {
        return "/placeholder.png";
    }

    // Jika URL lengkap
    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    // URL backend
    const API_BASE =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    // Jika path sudah /uploads/...
    if (path.startsWith("/")) {
        return `${API_BASE}${path}`;
    }

    // Jika hanya nama file
    return `${API_BASE}/uploads/images/${path}`;
};


// ==========================================
// FORMAT RUPIAH
// ==========================================

export const formatRupiah = (angka) => {
    const nilai = Number(angka);

    if (isNaN(nilai)) {
        return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(nilai);
};


// ==========================================
// FORMAT TANGGAL
// ==========================================

export const formatTanggal = (tanggal) => {
    if (!tanggal) {
        return "-";
    }

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
};


// ==========================================
// SIMPAN SESSION
// ==========================================

export const saveSession = (token, user) => {
    localStorage.setItem(
        "session",
        JSON.stringify({
            token,
            user
        })
    );
};


// ==========================================
// AMBIL TOKEN
// ==========================================

export const getToken = () => {
    const session = localStorage.getItem("session");

    if (!session) {
        return null;
    }

    try {
        const data = JSON.parse(session);

        return data.token || null;
    } catch (error) {
        return null;
    }
};


// ==========================================
// AMBIL DATA SESSION
// ==========================================

export const getSession = () => {
    const session = localStorage.getItem("session");

    if (!session) {
        return null;
    }

    try {
        return JSON.parse(session);
    } catch (error) {
        return null;
    }
};


// ==========================================
// HAPUS SESSION
// ==========================================

export const clearSession = () => {
    localStorage.removeItem("session");
    // jaga-jaga jika ada key lama
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};