import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SITE, KATEGORI_PRODUK } from "../constants";
import { api } from "../api";
import { mediaUrl, formatRupiah, formatTanggal } from "../utils";
import { useCart } from "../context/CartContext";
import { checkPembeliCartAccess } from "../utils/cartAccess";
import heroImg from "../assets/batik-nusantara.jpg";

function HomePage() {
    const navigate = useNavigate();
    const [produk, setProduk] = useState([]);
    const [artikel, setArtikel] = useState([]);
    const [loadingProduk, setLoadingProduk] = useState(true);
    const [loadingArtikel, setLoadingArtikel] = useState(true);
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [addedId, setAddedId] = useState(null);
    const [cartError, setCartError] = useState("");
    const { addItem } = useCart();

    const handleAddCart = (item) => {
        const access = checkPembeliCartAccess();
        if (!access.ok) {
            if (access.needLogin) {
                navigate("/login", { state: { from: "/" } });
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

    useEffect(() => {
        const load = async () => {
            try {
                setLoadingProduk(true);
                const response = await api.getProduk();
                setProduk(response.data || []);
            } catch {
                setProduk([]);
            } finally {
                setLoadingProduk(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoadingArtikel(true);
                const response = await api.getArtikel();
                setArtikel((response.data || []).slice(0, 4));
            } catch {
                setArtikel([]);
            } finally {
                setLoadingArtikel(false);
            }
        };
        load();
    }, []);

    const kategoriList = useMemo(() => {
        const fromData = [
            ...new Set(produk.map((p) => p.kategori).filter(Boolean)),
        ];
        const merged = [
            ...new Set([...(KATEGORI_PRODUK || []), ...fromData]),
        ];
        return ["Semua", ...merged];
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

        return q ? filtered : filtered.slice(0, 8);
    }, [produk, kategoriAktif, searchQuery]);

    return (
        <>
            <Header />

            <main style={{ background: "var(--batik-cream)" }}>
                {/* ===== HERO BATIK ===== */}
                <section className="batik-hero py-5">
                    <div className="container py-4 py-lg-5">
                        <div className="row align-items-center g-4 g-lg-5">
                            <div className="col-lg-6">
                                <span className="badge-batik mb-3">
                                    Warisan Budaya Indonesia
                                </span>
                                <h1 className="display-4 fw-bold mb-3 mt-3">
                                    Keindahan Batik
                                    <br />
                                    dari Tangan Pengrajin
                                </h1>
                                <p className="lead mb-4" style={{ maxWidth: 480 }}>
                                    Koleksi batik tulis, batik cap, dan batik printing
                                    berkualitas dari Solo, Yogyakarta, dan Pekalongan.
                                    Setiap helai menyimpan cerita dan keahlian turun-temurun.
                                </p>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Link
                                        to="/produk"
                                        className="btn btn-batik-gold px-4 py-2"
                                    >
                                        Jelajahi Koleksi
                                    </Link>
                                    <a
                                        href={SITE.link_wa}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-light px-4 py-2 fw-semibold"
                                    >
                                        Hubungi Kami
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div
                                    className="rounded-3 overflow-hidden shadow"
                                    style={{
                                        border: "4px solid var(--batik-gold)",
                                        borderRadius: 16,
                                    }}
                                >
                                    <img
                                        src={heroImg}
                                        alt="Koleksi batik Nusantara"
                                        className="img-fluid w-100"
                                        style={{
                                            maxHeight: 400,
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== PRODUK ===== */}
                <section className="container py-5">
                    <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-2">
                        <div>
                            <p
                                className="fw-bold small mb-1"
                                style={{ color: "var(--batik-gold)", letterSpacing: 1.5 }}
                            >
                                KOLEKSI
                            </p>
                            <h2 className="section-title-batik mb-0">
                                Produk Batik Kami
                            </h2>
                        </div>
                        <Link to="/produk" className="btn btn-batik-outline btn-sm">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="ornament-line" />

                    {cartError && (
                        <div className="alert alert-warning py-2 mb-3" role="alert">
                            {cartError}
                        </div>
                    )}

                    {/* Pencarian barang */}
                    <div className="mb-3">
                        <div className="input-group search-batik shadow-sm">
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
                        {searchQuery.trim() && (
                            <p className="small mt-2 mb-0" style={{ color: "var(--batik-muted)" }}>
                                Hasil untuk &quot;{searchQuery.trim()}&quot;:{" "}
                                {produkTampil.length} produk
                            </p>
                        )}
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

                    {loadingProduk && (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm" role="status" />
                            <p className="small mt-2 mb-0" style={{ color: "var(--batik-muted)" }}>
                                Memuat produk...
                            </p>
                        </div>
                    )}

                    {!loadingProduk && produkTampil.length === 0 && (
                        <p style={{ color: "var(--batik-muted)" }}>
                            {searchQuery.trim()
                                ? `Tidak ada produk yang cocok dengan "${searchQuery.trim()}".`
                                : kategoriAktif !== "Semua"
                                  ? `Belum ada produk untuk kategori "${kategoriAktif}".`
                                  : "Belum ada produk tersedia."}
                        </p>
                    )}

                    {!loadingProduk && produkTampil.length > 0 && (
                        <div className="row g-4">
                            {produkTampil.map((item) => (
                                <div
                                    key={item.id_produk}
                                    className="col-12 col-sm-6 col-lg-3"
                                >
                                    <div className="card card-batik h-100 border-0 shadow-sm overflow-hidden">
                                        <img
                                            src={mediaUrl(item.gambar)}
                                            alt={item.nama_produk}
                                            className="card-img-top"
                                            style={{ height: 200, objectFit: "cover" }}
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.png";
                                            }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <span className="badge-kat align-self-start mb-2">
                                                {item.kategori}
                                            </span>
                                            <h3 className="h6 fw-bold mb-2 text-batik">
                                                {item.nama_produk}
                                            </h3>
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
                                                {item.deskripsi || "-"}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-auto gap-2 flex-wrap">
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
                                                        className="btn btn-batik btn-sm"
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

                {/* ===== ARTIKEL ===== */}
                <section className="container pb-5">
                    <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-2">
                        <div>
                            <p
                                className="fw-bold small mb-1"
                                style={{ color: "var(--batik-gold)", letterSpacing: 1.5 }}
                            >
                                PENGETAHUAN
                            </p>
                            <h2 className="section-title-batik mb-0">
                                Artikel Batik
                            </h2>
                        </div>
                        <Link to="/artikel" className="btn btn-batik-outline btn-sm">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="ornament-line" />

                    {loadingArtikel && (
                        <div className="text-center py-4">
                            <div className="spinner-border spinner-border-sm" role="status" />
                            <p className="small mt-2 mb-0" style={{ color: "var(--batik-muted)" }}>
                                Memuat artikel...
                            </p>
                        </div>
                    )}

                    {!loadingArtikel && artikel.length === 0 && (
                        <p style={{ color: "var(--batik-muted)" }}>
                            Belum ada artikel tersedia.
                        </p>
                    )}

                    {!loadingArtikel && artikel.length > 0 && (
                        <div className="row g-4">
                            {artikel.map((item) => (
                                <div key={item.id} className="col-12 col-md-6 col-lg-3">
                                    <div className="card card-batik h-100 border-0 shadow-sm overflow-hidden">
                                        <img
                                            src={mediaUrl(item.gambar)}
                                            alt={item.judul}
                                            className="card-img-top"
                                            style={{ height: 160, objectFit: "cover" }}
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.png";
                                            }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <small
                                                className="mb-2"
                                                style={{ color: "var(--batik-muted)" }}
                                            >
                                                {formatTanggal(
                                                    item.created_at || item.tanggal
                                                )}
                                            </small>
                                            <h3 className="h6 fw-bold mb-2 text-batik">
                                                {item.judul}
                                            </h3>
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
                                                {item.ringkasan ||
                                                    item.deskripsi ||
                                                    "Baca selengkapnya..."}
                                            </p>
                                            <Link
                                                to={`/artikel/${item.id}`}
                                                className="btn btn-batik-outline btn-sm align-self-start"
                                            >
                                                Baca
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ===== KEUNGGULAN ===== */}
                <section className="container pb-5">
                    <div className="mb-2">
                        <p
                            className="fw-bold small mb-1"
                            style={{ color: "var(--batik-gold)", letterSpacing: 1.5 }}
                        >
                            MENGAPA KAMI
                        </p>
                        <h2 className="section-title-batik">
                            Kenapa Memilih Batik Nusantara?
                        </h2>
                    </div>
                    <div className="ornament-line" />

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-batik h-100 p-4">
                                <div className="fs-2 mb-3">🧵</div>
                                <h3 className="h5 fw-bold text-batik">
                                    Langsung dari Pengrajin
                                </h3>
                                <p className="mb-0" style={{ color: "var(--batik-muted)" }}>
                                    Bekerja sama dengan pengrajin lokal Solo, Yogyakarta,
                                    dan Pekalongan. Setiap produk autentik dan berkualitas.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-batik h-100 p-4">
                                <div className="fs-2 mb-3">✨</div>
                                <h3 className="h5 fw-bold text-batik">
                                    Motif & Makna
                                </h3>
                                <p className="mb-0" style={{ color: "var(--batik-muted)" }}>
                                    Dari Parang, Kawung, hingga Mega Mendung — setiap motif
                                    memiliki filosofi yang kami jaga dan sampaikan.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-batik h-100 p-4">
                                <div className="fs-2 mb-3">📦</div>
                                <h3 className="h5 fw-bold text-batik">
                                    Mudah Dipesan
                                </h3>
                                <p className="mb-0" style={{ color: "var(--batik-muted)" }}>
                                    Pesan online dengan mudah. Kami siap membantu memilih
                                    batik yang tepat untuk kebutuhan Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="footer-batik pt-5 pb-3">
                    <div className="container">
                        <div className="row g-4 mb-4">
                            <div className="col-md-6 col-lg-3">
                                <h5 className="fw-bold mb-2" style={{ color: "var(--batik-gold)" }}>
                                    {SITE.nama_toko}
                                </h5>
                                <p className="text-secondary small mb-3">
                                    Toko pengrajin batik yang menyediakan batik tulis,
                                    batik cap, dan batik printing berkualitas dari tangan
                                    pengrajin lokal.
                                </p>
                                <p
                                    className="text-uppercase small fw-semibold mb-2"
                                    style={{ letterSpacing: 1, color: "var(--batik-gold)" }}
                                >
                                    Hubungi Kami
                                </p>
                                <div className="d-flex gap-2">
                                    <a
                                        href={SITE.link_wa}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="d-inline-flex align-items-center justify-content-center text-decoration-none"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: "rgba(201,162,39,0.2)",
                                            border: "1px solid var(--batik-gold)",
                                            color: "var(--batik-gold)",
                                        }}
                                        aria-label="WhatsApp"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={SITE.link_ig || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="d-inline-flex align-items-center justify-content-center text-decoration-none"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: "rgba(201,162,39,0.2)",
                                            border: "1px solid var(--batik-gold)",
                                            color: "var(--batik-gold)",
                                        }}
                                        aria-label="Instagram"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={SITE.link_fb || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="d-inline-flex align-items-center justify-content-center text-decoration-none"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: "rgba(201,162,39,0.2)",
                                            border: "1px solid var(--batik-gold)",
                                            color: "var(--batik-gold)",
                                        }}
                                        aria-label="Facebook"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="col-6 col-lg-3">
                                <p
                                    className="text-uppercase small fw-semibold mb-3"
                                    style={{ letterSpacing: 1, color: "var(--batik-gold)" }}
                                >
                                    Produk
                                </p>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <Link to="/produk" className="text-secondary text-decoration-none small">
                                            Semua Produk
                                        </Link>
                                    </li>
                                    {KATEGORI_PRODUK.map((kat) => (
                                        <li key={kat} className="mb-2">
                                            <Link
                                                to="/produk"
                                                className="text-secondary text-decoration-none small"
                                            >
                                                {kat}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="col-6 col-lg-3">
                                <p
                                    className="text-uppercase small fw-semibold mb-3"
                                    style={{ letterSpacing: 1, color: "var(--batik-gold)" }}
                                >
                                    Menu
                                </p>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <Link to="/" className="text-secondary text-decoration-none small">
                                            Beranda
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/produk" className="text-secondary text-decoration-none small">
                                            Toko
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/artikel" className="text-secondary text-decoration-none small">
                                            Artikel
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/login" className="text-secondary text-decoration-none small">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link to="/register" className="text-secondary text-decoration-none small">
                                            Daftar
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <p
                                    className="text-uppercase small fw-semibold mb-3"
                                    style={{ letterSpacing: 1, color: "var(--batik-gold)" }}
                                >
                                    Contact
                                </p>
                                <p className="text-secondary small mb-2">{SITE.alamat}</p>
                                <p className="text-secondary small mb-2">{SITE.email}</p>
                                <p className="text-secondary small mb-0">{SITE.phone}</p>
                            </div>
                        </div>

                        <div
                            className="pt-3"
                            style={{ borderTop: "1px solid rgba(201,162,39,0.3)" }}
                        >
                            <p className="text-secondary small mb-0 text-center">
                                © {new Date().getFullYear()} {SITE.nama_toko}. Melestarikan
                                Warisan Batik Indonesia.
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}

export default HomePage;
