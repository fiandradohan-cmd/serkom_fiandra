import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, pembeliApi } from "../../api";
import { mediaUrl, formatRupiah, getSession } from "../../utils";
import { SITE } from "../../constants";
import { useAuth } from "../../context/AuthContext";

function PembeliProdukDetailPage() {
    const { id_produk } = useParams();
    const id = id_produk;
    const navigate = useNavigate();
    const { isLoggedIn, user: session } = useAuth();
    const user = session?.user || null;

    const [produk, setProduk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        nama_pembeli: "",
        alamat_pembeli: "",
        phone_pembeli: "",
        metode_pembayaran: "Bank Transfer",
        pengiriman: "JNT Express",
        catatan: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.getProdukById(id);
                setProduk(response.data);
            } catch (err) {
                setError(err.message || "Gagal mengambil detail produk.");
            } finally {
                setLoading(false);
            }
        };
        if (id) load();
    }, [id]);

    useEffect(() => {
        if (isLoggedIn && user) {
            const s = getSession();
            const u = s?.user || user;
            setForm((prev) => ({
                ...prev,
                nama_pembeli:
                    `${u.nama_d || ""} ${u.nama_b || ""}`.trim() || prev.nama_pembeli,
                phone_pembeli: u.phone || prev.phone_pembeli,
                alamat_pembeli: u.alamat || prev.alamat_pembeli,
            }));
        }
    }, [isLoggedIn, user]);

    const handleBeliClick = () => {
        setShowForm(true);
        setFormError("");
        setSuccessMsg("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitBeli = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMsg("");
        setSubmitting(true);

        try {
            await pembeliApi.createPembelian({
                id_produk: Number(id),
                nama_pembeli: form.nama_pembeli.trim(),
                alamat_pembeli: form.alamat_pembeli.trim(),
                phone_pembeli: form.phone_pembeli.trim(),
                metode_pembayaran: form.metode_pembayaran,
                pengiriman: form.pengiriman,
                catatan: form.catatan.trim() || null,
            });

            setSuccessMsg("Pembelian berhasil dibuat!");
            setShowForm(false);
            setTimeout(() => navigate("/pembeli/pesanan"), 1200);
        } catch (err) {
            setFormError(err.message || "Gagal membuat pembelian.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-secondary mt-3">Memuat detail produk...</p>
            </div>
        );
    }

    if (error || !produk) {
        return (
            <div>
                <div className="alert alert-danger">
                    {error || "Produk tidak ditemukan."}
                </div>
                <Link to="/pembeli/produk" className="btn btn-outline-dark btn-sm">
                    ← Kembali ke Katalog
                </Link>
            </div>
        );
    }

    return (
        <div>
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/pembeli" className="text-decoration-none">
                            Dashboard
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/pembeli/produk" className="text-decoration-none">
                            Katalog
                        </Link>
                    </li>
                    <li className="breadcrumb-item active">Detail</li>
                </ol>
            </nav>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <div className="row g-4">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <img
                            src={mediaUrl(produk.gambar)}
                            alt={produk.nama_produk}
                            className="w-100"
                            style={{ height: 320, objectFit: "cover" }}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                            }}
                        />
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="bg-white p-4 h-100" style={{ borderRadius: 4 }}>
                        <span className="badge text-bg-secondary mb-2">
                            {produk.kategori}
                        </span>
                        <h1 className="h3 fw-bold mb-2">{produk.nama_produk}</h1>
                        <h4 className="fw-bold mb-3">{formatRupiah(produk.harga)}</h4>
                        <h6 className="fw-bold">Deskripsi</h6>
                        <p className="text-secondary mb-4">
                            {produk.deskripsi || "Tidak ada deskripsi."}
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={handleBeliClick}
                            >
                                Beli Sekarang
                            </button>
                            <Link
                                to="/pembeli/produk"
                                className="btn btn-outline-dark"
                            >
                                ← Kembali ke Katalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="bg-white p-4 mt-4" style={{ borderRadius: 4 }}>
                    <h5 className="fw-bold mb-3">Form Pembelian</h5>
                    {formError && <div className="alert alert-danger">{formError}</div>}
                    <form onSubmit={handleSubmitBeli}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="nama_pembeli"
                                    className="form-control"
                                    value={form.nama_pembeli}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">No. Telepon / WA</label>
                                <input
                                    type="text"
                                    name="phone_pembeli"
                                    className="form-control"
                                    value={form.phone_pembeli}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Alamat Pengiriman</label>
                                <textarea
                                    name="alamat_pembeli"
                                    className="form-control"
                                    rows={2}
                                    value={form.alamat_pembeli}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Metode Pembayaran</label>
                                <select
                                    name="metode_pembayaran"
                                    className="form-select"
                                    value={form.metode_pembayaran}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="COD">COD</option>
                                </select>
                            </div>
                            {form.metode_pembayaran === "Bank Transfer" && (
                                <div className="col-12">
                                    <div className="alert alert-light border small mb-0">
                                        <div className="fw-semibold mb-1">Transfer ke rekening toko:</div>
                                        <div>Bank: <strong>{SITE.bank}</strong></div>
                                        <div>No. Rekening: <strong>{SITE.no_rekening}</strong></div>
                                        <div>Atas Nama: <strong>{SITE.atas_nama}</strong></div>
                                    </div>
                                </div>
                            )}
                            <div className="col-md-6">
                                <label className="form-label">Kurir</label>
                                <select
                                    name="pengiriman"
                                    className="form-select"
                                    value={form.pengiriman}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="JNT Express">JNT Express</option>
                                    <option value="JNE">JNE</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Catatan (opsional)</label>
                                <textarea
                                    name="catatan"
                                    className="form-control"
                                    rows={2}
                                    value={form.catatan}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <button
                                type="submit"
                                className="btn btn-dark"
                                disabled={submitting}
                            >
                                {submitting ? "Memproses..." : "Konfirmasi Pembelian"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowForm(false)}
                                disabled={submitting}
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PembeliProdukDetailPage;
