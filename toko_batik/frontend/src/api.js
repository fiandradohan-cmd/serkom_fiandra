import { getToken } from "./utils";

/**
 * api.js — semua pemanggilan HTTP ke backend.
 * Publik: api | Admin: adminApi | Pembeli: pembeliApi
 */

export const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

export function authHeaders() {
    const token = getToken();

    return token
        ? {
              Authorization: `Bearer ${token}`
          }
        : {};
}

// Request ke backend
export async function apiRequest(path, options = {}) {
    const url = path.startsWith("http")
        ? path
        : `${API_BASE}${path}`;

    const headers = {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(options.headers || {})
    };

    let response;

    try {
        response = await fetch(url, {
            ...options,
            headers
        });
    } catch (error) {
        throw new Error(
            "Backend tidak jalan. Jalankan backend terlebih dahulu."
        );
    }

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            body.message || "Permintaan gagal"
        );

        error.status = response.status;
        error.body = body;

        throw error;
    }

    return body;
}

// Upload gambar
async function uploadGambar(endpoint, file) {
    const formData = new FormData();

    formData.append("gambar", file);

    let response;

    try {
        response = await fetch(
            `${API_BASE}${endpoint}`,
            {
                method: "POST",
                headers: authHeaders(),
                body: formData
            }
        );
    } catch (error) {
        throw new Error(
            "Backend tidak jalan. Jalankan backend terlebih dahulu."
        );
    }

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            body.message || "Upload gagal"
        );

        error.status = response.status;
        error.body = body;

        throw error;
    }

    return body;
}

/* =========================
   API PUBLIK
========================= */

export const api = {
    getProduk: () =>
        apiRequest("/api/users/produk"),

    getProdukById: (id) =>
        apiRequest(`/api/users/produk/${id}`),

    getArtikel: () =>
        apiRequest("/api/users/artikel"),

    getArtikelById: (id) =>
        apiRequest(`/api/users/artikel/${id}`),

    login: (credential, passwd) => {
        if (
            typeof credential === "object" &&
            credential !== null
        ) {
            passwd = credential.passwd;
            credential = credential.credential;
        }

        return apiRequest("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                credential,
                passwd
            })
        });
    },

    register: (payload) =>
        apiRequest("/api/users/register", {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

/* =========================
   API ADMIN
========================= */

export const adminApi = {
    getStats: () =>
        apiRequest("/api/admin/stats"),

    getMe: () =>
        apiRequest("/api/admin/me"),

    putMe: (payload) =>
        apiRequest("/api/admin/me", {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    getPembeli: () =>
        apiRequest("/api/admin/pembeli"),

    getUsers: (role) =>
        apiRequest(
            `/api/admin/users${
                role ? `?role=${role}` : ""
            }`
        ),

    getUser: (id) =>
        apiRequest(`/api/admin/users/${id}`),

    createUser: (payload) =>
        apiRequest("/api/admin/users", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    updateUser: (id, payload) =>
        apiRequest(`/api/admin/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    deleteUser: (id) =>
        apiRequest(`/api/admin/users/${id}`, {
            method: "DELETE"
        }),

    getProduk: () =>
        apiRequest("/api/admin/produk"),

    getProdukById: (id) =>
        apiRequest(`/api/admin/produk/${id}`),

    createProduk: (payload) =>
        apiRequest("/api/admin/produk", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    updateProduk: (id, payload) =>
        apiRequest(`/api/admin/produk/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    deleteProduk: (id) =>
        apiRequest(`/api/admin/produk/${id}`, {
            method: "DELETE"
        }),

    getPembelian: () =>
        apiRequest("/api/admin/pembelian"),

    getPembelianById: (id) =>
        apiRequest(`/api/admin/pembelian/${id}`),

    updatePembelian: (id, payload) =>
        apiRequest(`/api/admin/pembelian/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    deletePembelian: (id) =>
        apiRequest(`/api/admin/pembelian/${id}`, {
            method: "DELETE"
        }),

    getArtikel: () =>
        apiRequest("/api/admin/artikel"),

    getArtikelById: (id) =>
        apiRequest(`/api/admin/artikel/${id}`),

    createArtikel: (payload) =>
        apiRequest("/api/admin/artikel", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    updateArtikel: (id, payload) =>
        apiRequest(`/api/admin/artikel/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    deleteArtikel: (id) =>
        apiRequest(`/api/admin/artikel/${id}`, {
            method: "DELETE"
        }),

    uploadGambar: (file) =>
        uploadGambar(
            "/api/admin/upload-gambar",
            file
        )
};

/* =========================
   API PEMBELI
========================= */

export const pembeliApi = {
    getDashboard: () =>
        apiRequest("/api/users/dashboard"),

    getMe: () =>
        apiRequest("/api/users/me"),

    putMe: (payload) =>
        apiRequest("/api/users/me", {
            method: "PUT",
            body: JSON.stringify(payload)
        }),

    getProduk: () =>
        apiRequest("/api/users/produk"),

    getProdukById: (id) =>
        apiRequest(`/api/users/produk/${id}`),

    getPembelian: () =>
        apiRequest("/api/users/pembelian"),

    getPembelianById: (id) =>
        apiRequest(`/api/users/pembelian/${id}`),

    createPembelian: (payload) =>
        apiRequest("/api/users/pembelian", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    uploadGambar: (file) =>
        uploadGambar(
            "/api/users/upload-gambar",
            file
        )
};