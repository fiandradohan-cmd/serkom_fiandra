import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { mediaUrl, formatTanggal } from "../../utils";

function PembeliArtikelPage() {
    const [artikel, setArtikel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.getArtikel();
                setArtikel(response.data || []);
            } catch (err) {
                setError(err.message || "Gagal mengambil data artikel.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <h1 className="h4 fw-bold mb-1">Artikel</h1>
            <p className="text-secondary mb-4">
                Baca informasi dan tips seputar layanan kami.
            </p>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="text-secondary mt-3">Memuat artikel...</p>
                </div>
            )}

            {!loading && error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && artikel.length === 0 && (
                <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                    <p className="text-secondary mb-0">Belum ada artikel tersedia.</p>
                </div>
            )}

            {!loading && !error && artikel.length > 0 && (
                <div className="row g-3">
                    {artikel.map((item) => (
                        <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                <img
                                    src={mediaUrl(item.gambar)}
                                    alt={item.judul}
                                    className="card-img-top"
                                    style={{ height: 180, objectFit: "cover" }}
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder.png";
                                    }}
                                />
                                <div className="card-body d-flex flex-column p-3">
                                    <small className="text-secondary mb-2">
                                        {formatTanggal(item.created_at || item.tanggal)}
                                    </small>
                                    <h2 className="h6 fw-bold mb-2">{item.judul}</h2>
                                    <p
                                        className="text-secondary small mb-3 flex-grow-1"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {item.ringkasan ||
                                            item.deskripsi ||
                                            "Baca artikel untuk informasi selengkapnya."}
                                    </p>
                                    <Link
                                        to={`/pembeli/artikel/${item.id}`}
                                        className="btn btn-outline-dark btn-sm align-self-start"
                                    >
                                        Baca Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PembeliArtikelPage;
