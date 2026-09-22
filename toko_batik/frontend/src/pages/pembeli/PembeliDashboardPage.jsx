import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi, api } from "../../api";
import { formatRupiah, formatTanggal, mediaUrl, getSession } from "../../utils";

function PembeliDashboardPage() {
    const [stats, setStats] = useState(null);
    const [produk, setProduk] = useState([]);
    const [artikel, setArtikel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const session = getSession();
    const user = session?.user;

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const [dashRes, produkRes, artikelRes] = await Promise.all([
                    pembeliApi.getDashboard().catch(() => ({ data: null })),
                    api.getProduk().catch(() => ({ data: [] })),
                    api.getArtikel().catch(() => ({ data: [] })),
                ]);

                setStats(dashRes.data || dashRes);
                setProduk((produkRes.data || []).slice(0, 8));
                setArtikel((artikelRes.data || []).slice(0, 4));
            } catch (err) {
                setError(err.message || "Gagal memuat dashboard.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getValue = (...keys) => {
        if (!stats) return 0;
        for (const key of keys) {
            if (stats[key] !== undefined && stats[key] !== null) {
                return Number(stats[key]) || 0;
            }
        }
        return 0;
    };

    const cards = [
        {
            label: "TOTAL PESANAN",
            value: getValue("total_pembelian", "total_pesanan"),
            border: "#f0ad4e",
        },
        {
            label: "BELUM DIBAYAR",
            value: getValue("belum_dibayar"),
            border: "#d9534f",
        },
        {
            label: "SUDAH DIBAYAR",
            value: getValue("sudah_dibayar"),
            border: "#5cb85c",
        },
        {
            label: "SELESAI",
            value: getValue("selesai"),
            border: "#5bc0de",
        },
    ];

    return (
        <div>
            <h1 className="h4 fw-bold mb-1">Dashboard</h1>
            <p className="text-secondary mb-4">
                Selamat datang, {user?.nama_d || user?.uname || "Pembeli"}!
            </p>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="text-secondary mt-3">Memuat dashboard...</p>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {/* Stats */}
                    <div className="row g-3 mb-4">
                        {cards.map((c) => (
                            <div key={c.label} className="col-6 col-lg-3">
                                <div
                                    className="bg-white p-3 h-100"
                                    style={{
                                        borderLeft: `4px solid ${c.border}`,
                                        borderRadius: 4,
                                    }}
                                >
                                    <div
                                        className="text-uppercase text-secondary mb-1"
                                        style={{ fontSize: 11, letterSpacing: 0.5 }}
                                    >
                                        {c.label}
                                    </div>
                                    <div className="fw-bold" style={{ fontSize: 28 }}>
                                        {c.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Menu cepat */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <h5 className="fw-bold mb-3">Menu cepat</h5>
                        <div className="d-flex flex-wrap gap-2">
                            <Link to="/pembeli/produk" className="btn btn-outline-dark btn-sm">
                                Lihat semua produk
                            </Link>
                            <Link to="/pembeli/artikel" className="btn btn-outline-dark btn-sm">
                                Baca semua artikel
                            </Link>
                            <Link to="/pembeli/pesanan" className="btn btn-outline-dark btn-sm">
                                Pesanan saya
                            </Link>
                            <Link to="/pembeli/profil" className="btn btn-outline-dark btn-sm">
                                Edit profil
                            </Link>
                        </div>
                    </div>

                    {/* Katalog Produk */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="fw-bold mb-0">Katalog Produk</h5>
                            <Link to="/pembeli/produk" className="btn btn-sm btn-outline-dark">
                                Lihat semua →
                            </Link>
                        </div>

                        {produk.length === 0 ? (
                            <p className="text-secondary mb-0 small">
                                Belum ada produk tersedia.
                            </p>
                        ) : (
                            <div className="row g-3">
                                {produk.map((item) => (
                                    <div
                                        key={item.id_produk}
                                        className="col-6 col-md-4 col-lg-3"
                                    >
                                        <Link
                                            to={`/pembeli/produk/${item.id_produk}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                                <img
                                                    src={mediaUrl(item.gambar)}
                                                    alt={item.nama_produk}
                                                    className="card-img-top"
                                                    style={{
                                                        height: 140,
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/placeholder.png";
                                                    }}
                                                />
                                                <div className="card-body p-3">
                                                    <span className="badge text-bg-secondary mb-1" style={{ fontSize: 10 }}>
                                                        {item.kategori}
                                                    </span>
                                                    <h6
                                                        className="fw-bold mb-1 text-truncate"
                                                        title={item.nama_produk}
                                                    >
                                                        {item.nama_produk}
                                                    </h6>
                                                    <div className="fw-semibold text-dark">
                                                        {formatRupiah(item.harga)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Artikel */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="fw-bold mb-0">Artikel Terbaru</h5>
                            <Link to="/pembeli/artikel" className="btn btn-sm btn-outline-dark">
                                Lihat semua →
                            </Link>
                        </div>

                        {artikel.length === 0 ? (
                            <p className="text-secondary mb-0 small">
                                Belum ada artikel tersedia.
                            </p>
                        ) : (
                            <div className="row g-3">
                                {artikel.map((item) => (
                                    <div
                                        key={item.id}
                                        className="col-12 col-md-6"
                                    >
                                        <Link
                                            to={`/pembeli/artikel/${item.id}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                                <div className="row g-0">
                                                    <div className="col-4">
                                                        <img
                                                            src={mediaUrl(item.gambar)}
                                                            alt={item.judul}
                                                            className="w-100 h-100"
                                                            style={{
                                                                objectFit: "cover",
                                                                minHeight: 100,
                                                            }}
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "/placeholder.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-8">
                                                        <div className="card-body p-3">
                                                            <small className="text-secondary d-block mb-1">
                                                                {formatTanggal(
                                                                    item.created_at ||
                                                                        item.tanggal
                                                                )}
                                                            </small>
                                                            <h6 className="fw-bold mb-1">
                                                                {item.judul}
                                                            </h6>
                                                            <p
                                                                className="text-secondary small mb-0"
                                                                style={{
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                        <h5 className="fw-bold mb-2">Tips</h5>
                        <p className="text-secondary mb-0 small">
                            Pilih produk dari katalog di atas, lalu klik <strong>Beli Sekarang</strong>.
                            Setelah memesan, cek status di menu Pesanan Saya. Hubungi toko jika
                            butuh penyesuaian.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export default PembeliDashboardPage;
