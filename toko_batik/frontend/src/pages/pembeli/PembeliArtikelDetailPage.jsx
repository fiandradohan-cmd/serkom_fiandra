import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api";
import { mediaUrl, formatTanggal } from "../../utils";

function PembeliArtikelDetailPage() {
    const { id } = useParams();
    const [artikel, setArtikel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.getArtikelById(id);
                setArtikel(response.data);
            } catch (err) {
                setError(err.message || "Gagal mengambil detail artikel.");
            } finally {
                setLoading(false);
            }
        };
        if (id) load();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-secondary mt-3">Memuat artikel...</p>
            </div>
        );
    }

    if (error || !artikel) {
        return (
            <div>
                <div className="alert alert-danger">
                    {error || "Artikel tidak ditemukan."}
                </div>
                <Link to="/pembeli/artikel" className="btn btn-outline-dark btn-sm">
                    ← Kembali ke Artikel
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
                        <Link to="/pembeli/artikel" className="text-decoration-none">
                            Artikel
                        </Link>
                    </li>
                    <li className="breadcrumb-item active">Detail</li>
                </ol>
            </nav>

            <div className="bg-white overflow-hidden shadow-sm" style={{ borderRadius: 4 }}>
                <img
                    src={mediaUrl(artikel.gambar)}
                    alt={artikel.judul}
                    className="w-100"
                    style={{ height: 320, objectFit: "cover" }}
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                    }}
                />
                <div className="p-4 p-md-5">
                    <p className="small text-secondary mb-2">
                        {formatTanggal(artikel.created_at || artikel.tanggal)}
                    </p>
                    <h1 className="h3 fw-bold mb-4">{artikel.judul}</h1>
                    <div
                        className="text-secondary"
                        style={{ lineHeight: 1.8, whiteSpace: "pre-line" }}
                    >
                        {artikel.isi ||
                            artikel.konten ||
                            artikel.deskripsi ||
                            "Isi artikel belum tersedia."}
                    </div>
                    <div className="border-top mt-4 pt-3">
                        <Link to="/pembeli/artikel" className="btn btn-outline-dark btn-sm">
                            ← Kembali ke Artikel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PembeliArtikelDetailPage;
