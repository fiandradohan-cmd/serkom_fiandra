import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { api, pembeliApi } from "../api";
import { mediaUrl, formatRupiah, getSession } from "../utils";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkPembeliCartAccess } from "../utils/cartAccess";
import { SITE } from "../constants";

function ProdukDetailPage() {
    const { id_produk } = useParams();
    const id = id_produk;
    const navigate = useNavigate();
    const { isLoggedIn, user: session } = useAuth();
    const user = session?.user || null;
    const { addItem } = useCart();
    const [cartMsg, setCartMsg] = useState("");

    const [produk, setProduk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form beli
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
        catatan: ""
    });

    useEffect(() => {
        const loadProduk = async () => {
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

        if (id) loadProduk();
    }, [id]);

    // Prefill form dari session jika login
    useEffect(() => {
        if (isLoggedIn && user) {
            const session = getSession();
            const u = session?.user || user;
            setForm((prev) => ({
                ...prev,
                nama_pembeli: `${u.nama_d || ""} ${u.nama_b || ""}`.trim() || prev.nama_pembeli,
                phone_pembeli: u.phone || prev.phone_pembeli,
                alamat_pembeli: u.alamat || prev.alamat_pembeli
            }));
        }
    }, [isLoggedIn, user]);

    const handleBeliClick = () => {
        // Hanya percaya session di localStorage (agar setelah logout tidak stale)
        const session = getSession();
        const token = session?.token || null;
        const role = session?.user?.role || null;

        if (!token || !session?.user) {
            setShowForm(false);
            setFormError("");
            navigate("/login", { state: { from: `/produk/${id}` } });
            return;
        }

        if (role === "admin") {
            setShowForm(false);
            setFormError(
                "Hanya akun pembeli yang dapat melakukan pembelian. Anda sedang login sebagai admin."
            );
            return;
        }

        if (role !== "pembeli") {
            setShowForm(false);
            setFormError("Hanya akun pembeli yang dapat melakukan pembelian. Silakan login sebagai pembeli.");
            return;
        }

        setFormError("");
        setSuccessMsg("");
        setShowForm(true);
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
            const payload = {
                id_produk: Number(id),
                nama_pembeli: form.nama_pembeli.trim(),
                alamat_pembeli: form.alamat_pembeli.trim(),
                phone_pembeli: form.phone_pembeli.trim(),
                metode_pembayaran: form.metode_pembayaran,
                pengiriman: form.pengiriman,
                catatan: form.catatan.trim() || null
            };

            await pembeliApi.createPembelian(payload);

            setSuccessMsg("Pembelian berhasil dibuat! Silakan cek menu Pesanan di dashboard pembeli.");
            setShowForm(false);

            // Redirect ke pesanan setelah 1.5 detik
            setTimeout(() => {
                navigate("/pembeli/pesanan");
            }, 1500);
        } catch (err) {
            setFormError(err.message || "Gagal membuat pembelian.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="container py-5">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Memuat...</span>
                        </div>
                        <p className="text-secondary mt-3">Memuat detail produk...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="container py-5">
                    <div className="alert alert-danger text-center">{error}</div>
                    <div className="text-center">
                        <Link to="/produk" className="btn btn-batik-outline">
                            Kembali ke Produk
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    if (!produk) {
        return (
            <>
                <Header />
                <main className="container py-5">
                    <div className="alert alert-warning text-center">
                        Produk tidak ditemukan.
                    </div>
                    <div className="text-center">
                        <Link to="/produk" className="btn btn-batik-outline">
                            Kembali ke Produk
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="container py-5">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">
                                Beranda
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/produk" className="text-decoration-none">
                                Produk
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Detail
                        </li>
                    </ol>
                </nav>

                {successMsg && (
                    <div className="alert alert-success">{successMsg}</div>
                )}

                <div className="row g-4 align-items-start">
                    {/* Gambar produk */}
                    <div className="col-12 col-md-6">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <img
                                src={mediaUrl(produk.gambar)}
                                alt={produk.nama_produk}
                                className="img-fluid w-100"
                                style={{ height: "400px", objectFit: "cover" }}
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                        </div>
                    </div>

                    {/* Informasi produk */}
                    <div className="col-12 col-md-6">
                        <span className="badge text-bg-secondary mb-3">
                            {produk.kategori}
                        </span>

                        <h1 className="fw-bold mb-3">{produk.nama_produk}</h1>

                        <h3 className="fw-bold mb-4">
                            {formatRupiah(produk.harga)}
                        </h3>

                        <div className="mb-4">
                            <h5 className="fw-bold">Deskripsi</h5>
                            <p className="text-secondary lh-lg">
                                {produk.deskripsi || "Tidak ada deskripsi produk."}
                            </p>
                        </div>

                        <div className="border-top pt-4">
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="border rounded p-3">
                                        <small className="text-secondary d-block">
                                            Kategori
                                        </small>
                                        <strong>{produk.kategori}</strong>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="border rounded p-3">
                                        <small className="text-secondary d-block">
                                            Harga
                                        </small>
                                        <strong>{formatRupiah(produk.harga)}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="btn btn-batik-gold"
                                    onClick={() => {
                                        const access = checkPembeliCartAccess();
                                        if (!access.ok) {
                                            if (access.needLogin) {
                                                navigate("/login", {
                                                    state: { from: `/produk/${id}` },
                                                });
                                                return;
                                            }
                                            setCartMsg("");
                                            setFormError(access.reason || "Akses ditolak.");
                                            return;
                                        }
                                        addItem(produk, 1);
                                        setFormError("");
                                        setCartMsg("Ditambahkan ke keranjang!");
                                        setTimeout(() => setCartMsg(""), 2000);
                                    }}
                                >
                                    + Keranjang
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-batik"
                                    onClick={handleBeliClick}
                                >
                                    Beli Sekarang
                                </button>
                                <Link to="/produk" className="btn btn-batik-outline">
                                    ← Kembali ke Produk
                                </Link>
                                <Link to="/keranjang" className="btn btn-batik-outline">
                                    Lihat Keranjang
                                </Link>
                            </div>
                            {cartMsg && (
                                <div className="alert alert-success mt-3 mb-0 py-2">
                                    {cartMsg}
                                </div>
                            )}

                            {formError && !showForm && (
                                <div className="alert alert-warning mt-3 mb-0">
                                    {formError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Pembelian */}
                {showForm && (
                    <div className="row mt-5">
                        <div className="col-12 col-lg-8 mx-auto">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold mb-3">Form Pembelian</h4>
                                    <p className="text-secondary small mb-4">
                                        Produk: <strong>{produk.nama_produk}</strong> —{" "}
                                        {formatRupiah(produk.harga)}
                                    </p>

                                    {formError && (
                                        <div className="alert alert-danger">{formError}</div>
                                    )}

                                    <form onSubmit={handleSubmitBeli}>
                                        <div className="mb-3">
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

                                        <div className="mb-3">
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

                                        <div className="mb-3">
                                            <label className="form-label">Alamat Pengiriman</label>
                                            <textarea
                                                name="alamat_pembeli"
                                                className="form-control"
                                                rows={3}
                                                value={form.alamat_pembeli}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="row g-3 mb-3">
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
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Catatan (opsional)</label>
                                            <textarea
                                                name="catatan"
                                                className="form-control"
                                                rows={2}
                                                value={form.catatan}
                                                onChange={handleChange}
                                                placeholder="Contoh: warna, ukuran, dll."
                                            />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-batik"
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
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

export default ProdukDetailPage;
