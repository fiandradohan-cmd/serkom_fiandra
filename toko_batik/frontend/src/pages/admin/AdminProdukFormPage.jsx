import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api";
import { mediaUrl, formatRupiah } from "../../utils";

function AdminProdukFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        nama_produk: "",
        kategori: "",
        deskripsi: "",
        harga: "",
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
    // LOAD DATA PRODUK SAAT EDIT
    // ==========================================
    useEffect(() => {
        if (!isEdit) return;

        const loadProduk = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getProdukById(id);
                const data = response.data || response;

                setForm({
                    nama_produk: data.nama_produk || "",
                    kategori: data.kategori || "",
                    deskripsi: data.deskripsi || "",
                    harga: data.harga || "",
                    gambar: data.gambar || ""
                });

                if (data.gambar) {
                    setPreview(mediaUrl(data.gambar));
                }
            } catch (err) {
                setError(
                    err.message ||
                    "Gagal mengambil data produk."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduk();
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

        const localPreview = URL.createObjectURL(selectedFile);
        setPreview(localPreview);

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const response = await adminApi.uploadGambar(
                selectedFile
            );

            const data = response.data || response;

            const filename =
                data.gambar ||
                data.filename ||
                data.file ||
                data.path;

            if (!filename) {
                throw new Error(
                    "Nama file hasil upload tidak ditemukan."
                );
            }

            setForm((prev) => ({
                ...prev,
                gambar: filename
            }));

            setSuccess("Gambar berhasil diupload.");
        } catch (err) {
            setFile(null);

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

        if (!form.nama_produk.trim()) {
            setError("Nama produk wajib diisi.");
            return;
        }

        if (!form.kategori) {
            setError("Kategori produk wajib dipilih.");
            return;
        }

        if (
            form.harga === "" ||
            Number(form.harga) < 0
        ) {
            setError("Harga produk tidak valid.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                nama_produk: form.nama_produk.trim(),
                kategori: form.kategori,
                deskripsi: form.deskripsi.trim(),
                harga: Number(form.harga),
                gambar: form.gambar || null
            };

            if (isEdit) {
                await adminApi.updateProduk(id, payload);
            } else {
                await adminApi.createProduk(payload);
            }

            navigate("/admin/produk");
        } catch (err) {
            setError(
                err.message ||
                (
                    isEdit
                        ? "Gagal memperbarui produk."
                        : "Gagal menambahkan produk."
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
                        Memuat data produk...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <div className="container py-4">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <p className="text-secondary small fw-bold text-uppercase mb-1">
                        ADMIN
                    </p>

                    <h2 className="fw-bold mb-1">
                        {isEdit
                            ? "Edit Produk"
                            : "Tambah Produk"}
                    </h2>

                    <p className="text-secondary mb-0">
                        {isEdit
                            ? "Perbarui informasi produk."
                            : "Tambahkan produk baru ke toko."}
                    </p>
                </div>

                <Link
                    to="/admin/produk"
                    className="btn btn-outline-secondary"
                >
                    ← Kembali
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div
                    className="alert alert-success"
                    role="alert"
                >
                    {success}
                </div>
            )}

            <div className="row g-4">

                {/* FORM */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit}>

                                {/* Nama Produk */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="nama_produk"
                                        className="form-label fw-semibold"
                                    >
                                        Nama Produk
                                    </label>

                                    <input
                                        id="nama_produk"
                                        type="text"
                                        name="nama_produk"
                                        className="form-control"
                                        value={form.nama_produk}
                                        onChange={handleChange}
                                        placeholder="Contoh: Kain Batik Tulis Motif Parang"
                                    />
                                </div>

                                {/* Kategori */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="kategori"
                                        className="form-label fw-semibold"
                                    >
                                        Kategori
                                    </label>

                                    <select
                                        id="kategori"
                                        name="kategori"
                                        className="form-select"
                                        value={form.kategori}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            -- Pilih Kategori --
                                        </option>
                                        <option value="Batik Tulis">
                                            Batik Tulis
                                        </option>
                                        <option value="Batik Cap">
                                            Batik Cap
                                        </option>
                                        <option value="Batik Printing">
                                            Batik Printing
                                        </option>
                                        <option value="Aksesoris Batik">
                                            Aksesoris Batik
                                        </option>
                                    </select>
                                </div>

                                {/* Deskripsi */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="deskripsi"
                                        className="form-label fw-semibold"
                                    >
                                        Deskripsi
                                    </label>

                                    <textarea
                                        id="deskripsi"
                                        name="deskripsi"
                                        className="form-control"
                                        rows="5"
                                        value={form.deskripsi}
                                        onChange={handleChange}
                                        placeholder="Masukkan deskripsi produk..."
                                    />
                                </div>

                                {/* Harga */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="harga"
                                        className="form-label fw-semibold"
                                    >
                                        Harga
                                    </label>

                                    <div className="input-group">
                                        <span className="input-group-text">
                                            Rp
                                        </span>

                                        <input
                                            id="harga"
                                            type="number"
                                            name="harga"
                                            className="form-control"
                                            value={form.harga}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="0"
                                        />
                                    </div>

                                    {form.harga !== "" && (
                                        <small className="text-secondary">
                                            {formatRupiah(form.harga)}
                                        </small>
                                    )}
                                </div>

                                {/* Gambar */}
                                <div className="mt-3 mb-4">
                                    <label
                                        htmlFor="gambar"
                                        className="form-label fw-semibold"
                                    >
                                        Gambar Produk
                                    </label>

                                    <input
                                        id="gambar"
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />

                                    <div className="form-text">
                                        Pilih gambar JPG, JPEG, PNG,
                                        atau format gambar lainnya.
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

                                {/* Tombol */}
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
                                                : "Tambah Produk"}
                                    </button>

                                    <Link
                                        to="/admin/produk"
                                        className="btn btn-outline-secondary"
                                    >
                                        Batal
                                    </Link>

                                </div>

                            </form>

                        </div>
                    </div>
                </div>

                {/* PREVIEW */}
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
                                        alt="Preview produk"
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

export default AdminProdukFormPage;