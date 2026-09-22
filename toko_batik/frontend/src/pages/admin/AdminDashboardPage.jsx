import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, mediaUrl } from "../../utils";

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError("");
                const [response, produkRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getProduk().catch(() => ({ data: [] })),
                ]);
                const data = response.data || response;
                setStats(data.stats || data);
                setRecent(data.recentPembelian || data.recent || []);
                setProduk((produkRes.data || []).slice(0, 8));
            } catch (err) {
                setError(err.message || "Gagal mengambil statistik.");
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const getValue = (...keys) => {
        if (!stats) return 0;
        for (const key of keys) {
            if (stats[key] !== undefined && stats[key] !== null) {
                return stats[key];
            }
        }
        return 0;
    };

    const cardsTop = [
        {
            label: "PEMBELI TERDAFTAR",
            value: getValue("total_pembeli", "pembeli", "jumlah_pembeli", "total_users"),
            border: "#f0ad4e",
        },
        {
            label: "TOTAL TRANSAKSI",
            value: getValue("total_pembelian", "pembelian", "jumlah_pembelian", "total_transaksi"),
            border: "#333",
        },
        {
            label: "PRODUK DI KATALOG",
            value: getValue("total_produk", "produk", "jumlah_produk"),
            border: "#5cb85c",
        },
        {
            label: "PRODUK TERJUAL",
            value: getValue("produk_terjual", "total_terjual", "jumlah_terjual"),
            border: "#f0ad4e",
            sub: "Jumlah pesanan",
        },
    ];

    const cardsBottom = [
        {
            label: "ARTIKEL",
            value: getValue("total_artikel", "artikel", "jumlah_artikel"),
            border: "#5bc0de",
        },
        {
            label: "PESANAN AKTIF",
            value: getValue("pesanan_aktif", "aktif"),
            border: "#d9534f",
        },
        {
            label: "BELUM DIBAYAR",
            value: getValue("belum_dibayar", "unpaid"),
            border: "#d9534f",
        },
    ];

    return (
        <div>
            <h1 className="h4 fw-bold mb-4">Dashboard</h1>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Memuat...</span>
                    </div>
                    <p className="text-secondary mt-3">Memuat dashboard...</p>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {/* Top stats */}
                    <div className="row g-3 mb-3">
                        {cardsTop.map((c) => (
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
                                    {c.sub && (
                                        <div className="text-secondary" style={{ fontSize: 12 }}>
                                            {c.sub}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom stats */}
                    <div className="row g-3 mb-4">
                        {cardsBottom.map((c) => (
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

                    {/* Pendapatan */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 className="fw-bold mb-1">Pendapatan (dibayar)</h5>
                                <p className="text-secondary mb-0 small">
                                    Total dari pesanan dengan status pembayaran &quot;Dibayar&quot;.
                                </p>
                            </div>
                            <div className="fw-bold text-warning" style={{ fontSize: 22 }}>
                                {formatRupiah(
                                    getValue("pendapatan", "total_pendapatan", "revenue")
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transaksi terbaru */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Transaksi terbaru</h5>
                            <Link
                                to="/admin/pesanan"
                                className="btn btn-sm btn-outline-secondary"
                            >
                                Lihat semua
                            </Link>
                        </div>
                        {recent && recent.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                    <thead>
                                        <tr className="text-secondary small">
                                            <th>ID</th>
                                            <th>Pembeli</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent.slice(0, 5).map((r) => (
                                            <tr key={r.id_pembelian || r.id}>
                                                <td>{r.id_pembelian || r.id}</td>
                                                <td>
                                                    {r.nama_pembeli ||
                                                        r.nama_d ||
                                                        r.username ||
                                                        "-"}
                                                </td>
                                                <td>{formatRupiah(r.total || r.harga_total)}</td>
                                                <td>{r.status || r.status_bayar || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-secondary mb-0">Belum ada pesanan.</p>
                        )}
                    </div>

                    {/* Produk terbaru */}
                    <div className="bg-white p-4 mb-4" style={{ borderRadius: 4 }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Produk di Katalog</h5>
                            <Link to="/admin/produk" className="btn btn-sm btn-outline-secondary">
                                Lihat semua
                            </Link>
                        </div>
                        {produk.length === 0 ? (
                            <p className="text-secondary mb-0 small">Belum ada produk.</p>
                        ) : (
                            <div className="row g-3">
                                {produk.map((item) => (
                                    <div key={item.id_produk} className="col-6 col-md-4 col-lg-3">
                                        <Link
                                            to={`/admin/produk/${item.id_produk}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                                <img
                                                    src={mediaUrl(item.gambar)}
                                                    alt={item.nama_produk}
                                                    className="card-img-top"
                                                    style={{ height: 120, objectFit: "cover" }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.png";
                                                    }}
                                                />
                                                <div className="card-body p-2">
                                                    <div className="small fw-semibold text-truncate" title={item.nama_produk}>
                                                        {item.nama_produk}
                                                    </div>
                                                    <div className="small text-secondary">
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

                    {/* Quick actions */}
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="/admin/produk/tambah" className="btn btn-outline-secondary btn-sm">
                            + Tambah produk
                        </Link>
                        <Link to="/admin/artikel/tambah" className="btn btn-outline-secondary btn-sm">
                            + Tulis artikel
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboardPage;
