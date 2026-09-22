import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api";
import { mediaUrl } from "../../utils";

function AdminArtikelFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        judul: "",
        ringkasan: "",
        isi: "",
        gambar: ""
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD DATA ARTIKEL SAAT EDIT
    // ==========================================
    useEffect(() => {
        if (!isEdit) return;

        const loadArtikel = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getArtikelById(id);

                const data = response.data || response;

                setForm({
                    judul: data.judul || "",
                    ringkasan: data.ringkasan || "",
                    isi: data.isi || "",
                    gambar: data.gambar || ""
                });

                if (data.gambar) {
                    setPreview(mediaUrl(data.gambar));
                }

            } catch (err) {
                console.error("Load artikel error:", err);

                setError(
                    err.message ||
                    "Gagal mengambil data artikel."
                );
            } finally {
                setLoading(false);
            }
        };

        loadArtikel();
    }, [id, isEdit]);

    // ==========================================
    // HANDLE INPUT
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==========================================
    // UPLOAD GAMBAR
    // ==========================================
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        // Preview sementara
        const localPreview = URL.createObjectURL(selectedFile);
        setPreview(localPreview);

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const response =
                await adminApi.uploadGambar(selectedFile);

            console.log("HASIL UPLOAD:", response);

            const data = response.data || response;

            // Middleware upload mengembalikan "path"
            const gambarPath = data.path;

            if (!gambarPath) {
                throw new Error(
                    "Path gambar dari server tidak ditemukan."
                );
            }

            setForm((prev) => ({
                ...prev,
                gambar: gambarPath
            }));

            // Preview dari backend
            setPreview(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${gambarPath}`
            );

            setSuccess("Gambar berhasil diupload.");

        } catch (err) {
            console.error("Upload gambar error:", err);

            setFile(null);
            setPreview("");

            setError(
                err.message ||
                "Gagal mengupload gambar."
            );

        } finally {
            setUploading(false);
        }
    };

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const judul = form.judul.trim();
        const ringkasan = form.ringkasan.trim();
        const isi = form.isi.trim();
        const gambar = form.gambar;

        // Validasi
        if (!judul) {
            setError("Judul artikel wajib diisi.");
            return;
        }

        if (!ringkasan) {
            setError("Ringkasan artikel wajib diisi.");
            return;
        }

        if (!isi) {
            setError("Isi artikel wajib diisi.");
            return;
        }

        if (!gambar) {
            setError("Gambar artikel wajib diupload.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                judul,
                ringkasan,
                isi,
                gambar
            };

            console.log("PAYLOAD ARTIKEL:", payload);

            if (isEdit) {
                await adminApi.updateArtikel(
                    id,
                    payload
                );
            } else {
                await adminApi.createArtikel(
                    payload
                );
            }

            navigate("/admin/artikel");

        } catch (err) {
            console.error(
                "Simpan artikel error:",
                err
            );

            setError(
                err.message ||
                (
                    isEdit
                        ? "Gagal memperbarui artikel."
                        : "Gagal menambahkan artikel."
                )
            );

        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Memuat...
                        </span>
                    </div>

                    <p className="text-secondary mt-3">
                        Memuat data artikel...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">

            {/* ==================================
                HEADER
            ================================== */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                <div>
                    <p className="text-secondary small fw-bold text-uppercase mb-1">
                        ADMIN
                    </p>

                    <h2 className="fw-bold mb-1">
                        {isEdit
                            ? "Edit Artikel"
                            : "Tambah Artikel"}
                    </h2>

                    <p className="text-secondary mb-0">
                        {isEdit
                            ? "Perbarui informasi artikel."
                            : "Tambahkan artikel baru ke website."}
                    </p>
                </div>

                <Link
                    to="/admin/artikel"
                    className="btn btn-outline-secondary"
                >
                    ← Kembali
                </Link>

            </div>

            {/* ==================================
                ERROR
            ================================== */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* ==================================
                SUCCESS
            ================================== */}
            {success && (
                <div
                    className="alert alert-success"
                    role="alert"
                >
                    {success}
                </div>
            )}

            <div className="row g-4">

                {/* ==================================
                    FORM
                ================================== */}
                <div className="col-12 col-lg-8">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit}>

                                {/* JUDUL */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="judul"
                                        className="form-label fw-semibold"
                                    >
                                        Judul Artikel
                                    </label>

                                    <input
                                        id="judul"
                                        type="text"
                                        name="judul"
                                        className="form-control"
                                        value={form.judul}
                                        onChange={handleChange}
                                        placeholder="Contoh: Mengenal Batik Tulis Warisan Budaya Indonesia"
                                    />

                                </div>

                                {/* RINGKASAN */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="ringkasan"
                                        className="form-label fw-semibold"
                                    >
                                        Ringkasan
                                    </label>

                                    <textarea
                                        id="ringkasan"
                                        name="ringkasan"
                                        className="form-control"
                                        rows="3"
                                        value={form.ringkasan}
                                        onChange={handleChange}
                                        placeholder="Masukkan ringkasan singkat artikel..."
                                    />

                                    <div className="form-text">
                                        Ringkasan singkat yang akan ditampilkan
                                        pada daftar artikel.
                                    </div>

                                </div>

                                {/* ISI */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="isi"
                                        className="form-label fw-semibold"
                                    >
                                        Isi Artikel
                                    </label>

                                    <textarea
                                        id="isi"
                                        name="isi"
                                        className="form-control"
                                        rows="10"
                                        value={form.isi}
                                        onChange={handleChange}
                                        placeholder="Masukkan isi artikel..."
                                    />

                                </div>

                                {/* GAMBAR */}
                                <div className="mb-4">

                                    <label
                                        htmlFor="gambar"
                                        className="form-label fw-semibold"
                                    >
                                        Gambar Artikel
                                    </label>

                                    <input
                                        id="gambar"
                                        type="file"
                                        className="form-control"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />

                                    <div className="form-text">
                                        Format JPG, JPEG, PNG, atau WEBP.
                                        Maksimal 5MB.
                                    </div>

                                    {uploading && (
                                        <div className="mt-2">

                                            <div
                                                className="spinner-border spinner-border-sm text-primary me-2"
                                                role="status"
                                            />

                                            <span className="text-secondary">
                                                Mengupload gambar...
                                            </span>

                                        </div>
                                    )}

                                </div>

                                {/* BUTTON */}
                                <div className="d-flex gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            saving ||
                                            uploading
                                        }
                                    >
                                        {saving
                                            ? "Menyimpan..."
                                            : isEdit
                                                ? "Simpan Perubahan"
                                                : "Tambah Artikel"}
                                    </button>

                                    <Link
                                        to="/admin/artikel"
                                        className="btn btn-outline-secondary"
                                    >
                                        Batal
                                    </Link>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

                {/* ==================================
                    PREVIEW
                ================================== */}
                <div className="col-12 col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            <h5 className="fw-bold mb-3">
                                Preview Gambar
                            </h5>

                            <div
                                className="border rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
                                style={{
                                    minHeight: "260px"
                                }}
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Preview artikel"
                                        className="img-fluid"
                                        style={{
                                            width: "100%",
                                            height: "260px",
                                            objectFit: "cover"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/placeholder.png";
                                        }}
                                    />

                                ) : (

                                    <div className="text-center text-secondary p-4">

                                        <div className="fs-1 mb-2">
                                            🖼️
                                        </div>

                                        <p className="mb-0">
                                            Belum ada gambar
                                        </p>

                                    </div>

                                )}

                            </div>

                            {file && (
                                <small className="text-secondary d-block mt-2">
                                    {file.name}
                                </small>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminArtikelFormPage;
