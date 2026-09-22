import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { api } from "../api";
import { mediaUrl, formatTanggal } from "../utils";

function ArtikelDetailPage() {
    const { id } = useParams();

    const [artikel, setArtikel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadArtikel = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.getArtikelById(id);

                setArtikel(response.data);
            } catch (err) {
                setError(
                    err.message || "Gagal mengambil detail artikel."
                );
            } finally {
                setLoading(false);
            }
        };

        loadArtikel();
    }, [id]);

    return (
        <>
            <Header />

            <main className="bg-light min-vh-100 py-5">
                <div className="container">

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Memuat...
                                </span>
                            </div>

                            <p className="text-secondary mt-3">
                                Memuat artikel...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-5">
                            <div className="alert alert-danger">
                                {error}
                            </div>

                            <Link
                                to="/artikel"
                                className="btn btn-batik-outline"
                            >
                                ← Kembali ke Artikel
                            </Link>
                        </div>
                    )}

                    {/* Detail artikel */}
                    {!loading && !error && artikel && (
                        <article className="mx-auto" style={{ maxWidth: "900px" }}>

                            {/* Breadcrumb */}
                            <nav
                                aria-label="breadcrumb"
                                className="mb-4"
                            >
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link
                                            to="/"
                                            className="text-decoration-none"
                                        >
                                            Beranda
                                        </Link>
                                    </li>

                                    <li className="breadcrumb-item">
                                        <Link
                                            to="/artikel"
                                            className="text-decoration-none"
                                        >
                                            Artikel
                                        </Link>
                                    </li>

                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Detail
                                    </li>
                                </ol>
                            </nav>

                            <div className="card border-0 shadow-sm overflow-hidden">

                                {/* Gambar */}
                                <img
                                    src={mediaUrl(artikel.gambar)}
                                    alt={artikel.judul}
                                    className="w-100"
                                    style={{
                                        height: "420px",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/placeholder.png";
                                    }}
                                />

                                <div className="card-body p-4 p-md-5">

                                    {/* Tanggal */}
                                    <p className="small text-secondary mb-2">
                                        {formatTanggal(
                                            artikel.created_at ||
                                            artikel.tanggal
                                        )}
                                    </p>

                                    {/* Judul */}
                                    <h1 className="fw-bold mb-4">
                                        {artikel.judul}
                                    </h1>

                                    {/* Isi */}
                                    <div
                                        className="text-secondary"
                                        style={{
                                            lineHeight: "1.8",
                                            whiteSpace: "pre-line"
                                        }}
                                    >
                                        {artikel.isi ||
                                            artikel.konten ||
                                            artikel.deskripsi ||
                                            "Isi artikel belum tersedia."}
                                    </div>

                                    {/* Kembali */}
                                    <div className="border-top mt-5 pt-4">
                                        <Link
                                            to="/artikel"
                                            className="btn btn-batik-outline"
                                        >
                                            ← Kembali ke Artikel
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </article>
                    )}

                    {/* Tidak ditemukan */}
                    {!loading && !error && !artikel && (
                        <div className="text-center py-5">
                            <div className="alert alert-warning">
                                Artikel tidak ditemukan.
                            </div>

                            <Link
                                to="/artikel"
                                className="btn btn-batik-outline"
                            >
                                Kembali ke Artikel
                            </Link>
                        </div>
                    )}

                </div>
            </main>
        </>
    );
}

export default ArtikelDetailPage;