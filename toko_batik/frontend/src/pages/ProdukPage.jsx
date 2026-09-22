import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { api } from "../api";
import { mediaUrl, formatRupiah } from "../utils";
import { useCart } from "../context/CartContext";
import { checkPembeliCartAccess } from "../utils/cartAccess";
import { KATEGORI_PRODUK } from "../constants";

function ProdukPage() {
    const navigate = useNavigate();
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [addedId, setAddedId] = useState(null);
    const [cartError, setCartError] = useState("");
    const { addItem } = useCart();

    useEffect(() => {
        const loadProduk = async () => {
            try {
                const response = await api.getProduk();
                setProduk(response.data || []);
            } catch (err) {
                setError(err.message || "Gagal mengambil data produk.");
            } finally {
                setLoading(false);
            }
        };

        loadProduk();
    }, []);

    const kategoriList = useMemo(() => {
        const fromData = [
            ...new Set(produk.map((p) => p.kategori).filter(Boolean)),
        ];
        return ["Semua", ...new Set([...(KATEGORI_PRODUK || []), ...fromData])];
    }, [produk]);

    const produkTampil = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let filtered = produk;

        if (kategoriAktif !== "Semua") {
            filtered = filtered.filter((p) => p.kategori === kategoriAktif);
        }

        if (q) {
            filtered = filtered.filter((p) => {
                const nama = (p.nama_produk || "").toLowerCase();
                const desk = (p.deskripsi || "").toLowerCase();
                const kat = (p.kategori || "").toLowerCase();
                return nama.includes(q) || desk.includes(q) || kat.includes(q);
            });
        }

        return filtered;
    }, [produk, kategoriAktif, searchQuery]);

    const handleAddCart = (item) => {
        const access = checkPembeliCartAccess();
        if (!access.ok) {
            if (access.needLogin) {
                navigate("/login", { state: { from: "/produk" } });
                return;
            }
            setCartError(access.reason || "Akses ditolak.");
            setTimeout(() => setCartError(""), 4000);
            return;
        }
        addItem(item, 1);
        setAddedId(item.id_produk);
        setCartError("");
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <>
            <Header />

            <main style={{ background: "var(--batik-cream)", minHeight: "100vh" }}>
                <section className="container py-5">
                    <div className="mb-3">
                        <p
                            className="fw-bold small mb-1"
                            style={{ color: "var(--batik-gold)", letterSpacing: 1.5 }}
                        >
                            TOKO
                        </p>
                        <h1 className="section-title-batik h2 mb-2">Produk Kami</h1>
                        <p className="mb-0" style={{ color: "var(--batik-muted)" }}>
                            Pilih berbagai koleksi batik berkualitas dari pengrajin lokal.
                        </p>
                    </div>
                    <div className="ornament-line" />

                    {cartError && (
                        <div className="alert alert-warning py-2 mb-3" role="alert">
                            {cartError}
                        </div>
                    )}

                    <div className="mb-3">
                        <div className="input-group shadow-sm">
                            <span
                                className="input-group-text bg-white border-end-0"
                                style={{ borderColor: "var(--batik-border)" }}
                            >
                                🔍
                            </span>
                            <input
                                type="search"
                                className="form-control border-start-0"
                                placeholder="Cari batik, motif, kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    borderColor: "var(--batik-border)",
                                    background: "var(--batik-white)",
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {kategoriList.map((kat) => (
                            <button
                                key={kat}
                                type="button"
                                className={`kat-pill ${
                                    kategoriAktif === kat ? "active" : ""
                                }`}
                                onClick={() => setKategoriAktif(kat)}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Memuat...</span>
                            </div>
                            <p className="mt-3 mb-0" style={{ color: "var(--batik-muted)" }}>
                                Memuat produk...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    )}

                    {!loading && !error && produkTampil.length === 0 && (
                        <div className="text-center py-5">
                            <p className="mb-0" style={{ color: "var(--batik-muted)" }}>
                                {searchQuery.trim()
                                    ? `Tidak ada produk untuk "${searchQuery.trim()}".`
                                    : "Belum ada produk tersedia."}
                            </p>
                        </div>
                    )}

                    {!loading && !error && produkTampil.length > 0 && (
                        <div className="row g-4">
                            {produkTampil.map((item) => (
                                <div
                                    className="col-12 col-sm-6 col-lg-4 col-xl-3"
                                    key={item.id_produk}
                                >
                                    <div className="card card-batik h-100 border-0 shadow-sm overflow-hidden">
                                        <img
                                            src={mediaUrl(item.gambar)}
                                            alt={item.nama_produk}
                                            className="card-img-top"
                                            style={{ height: 210, objectFit: "cover" }}
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.png";
                                            }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <span className="badge-kat align-self-start mb-2">
                                                {item.kategori}
                                            </span>
                                            <h2 className="h6 fw-bold text-batik mb-2">
                                                {item.nama_produk}
                                            </h2>
                                            <p
                                                className="small mb-3 flex-grow-1"
                                                style={{
                                                    color: "var(--batik-muted)",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {item.deskripsi}
                                            </p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center gap-2 flex-wrap">
                                                <span className="price-batik">
                                                    {formatRupiah(item.harga)}
                                                </span>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-batik-gold btn-sm"
                                                        onClick={() => handleAddCart(item)}
                                                    >
                                                        {addedId === item.id_produk
                                                            ? "✓"
                                                            : "+ Keranjang"}
                                                    </button>
                                                    <Link
                                                        to={`/produk/${item.id_produk}`}
                                                        className="btn btn-batik btn-sm px-3"
                                                    >
                                                        Detail
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default ProdukPage;
