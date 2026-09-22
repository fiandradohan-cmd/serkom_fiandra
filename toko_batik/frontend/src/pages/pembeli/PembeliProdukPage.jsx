import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { mediaUrl, formatRupiah } from "../../utils";

function PembeliProdukPage() {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.getProduk();
                setProduk(response.data || []);
            } catch (err) {
                setError(err.message || "Gagal mengambil data produk.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <h1 className="h4 fw-bold mb-1">Katalog Produk</h1>
            <p className="text-secondary mb-4">
                Pilih produk yang ingin Anda pesan.
            </p>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="text-secondary mt-3">Memuat produk...</p>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && produk.length === 0 && (
                <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                    <p className="text-secondary mb-0">Belum ada produk tersedia.</p>
                </div>
            )}

            {!loading && !error && produk.length > 0 && (
                <div className="row g-3">
                    {produk.map((item) => (
                        <div
                            className="col-12 col-sm-6 col-lg-4 col-xl-3"
                            key={item.id_produk}
                        >
                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                <img
                                    src={mediaUrl(item.gambar)}
                                    alt={item.nama_produk}
                                    className="card-img-top"
                                    style={{ height: 180, objectFit: "cover" }}
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder.png";
                                    }}
                                />
                                <div className="card-body d-flex flex-column p-3">
                                    <span className="badge text-bg-secondary align-self-start mb-2">
                                        {item.kategori}
                                    </span>
                                    <h2 className="h6 fw-bold mb-2">{item.nama_produk}</h2>
                                    <p
                                        className="text-secondary small mb-3 flex-grow-1"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {item.deskripsi || "-"}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center gap-2 mt-auto">
                                        <strong>{formatRupiah(item.harga)}</strong>
                                        <Link
                                            to={`/pembeli/produk/${item.id_produk}`}
                                            className="btn btn-dark btn-sm"
                                        >
                                            Detail / Beli
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PembeliProdukPage;
