import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { api } from "../api";
import { mediaUrl, formatTanggal } from "../utils";

function ArtikelPage() {
    const [artikel, setArtikel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadArtikel = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.getArtikel();

                setArtikel(response.data || []);
            } catch (err) {
                setError(
                    err.message || "Gagal mengambil data artikel."
                );
            } finally {
                setLoading(false);
            }
        };

        loadArtikel();
    }, []);

    return (
        <>
            <Header />

            <main className="bg-light min-vh-100 py-5">
                <div className="container">

                    {/* Header halaman */}
                    <div className="mb-5">
                        <p className="small fw-bold text-secondary text-uppercase mb-2">
                            INFORMASI
                        </p>

                        <h1 className="fw-bold mb-2">
                            Artikel
                        </h1>

                        <p className="text-secondary mb-0">
                            Informasi dan artikel terbaru dari toko kami.
                        </p>
                    </div>

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

                            <p className="text-secondary mt-3 mb-0">
                                Memuat artikel...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {/* Data kosong */}
                    {!loading &&
                        !error &&
                        artikel.length === 0 && (
                            <div className="alert alert-secondary text-center">
                                Belum ada artikel tersedia.
                            </div>
                        )}

                    {/* Daftar artikel */}
                    {!loading &&
                        !error &&
                        artikel.length > 0 && (
                            <div className="row g-4">
                                {artikel.map((item) => (
                                    <div
                                        className="col-12 col-md-6 col-lg-4"
                                        key={item.id}
                                    >
                                        <div className="card h-100 border-0 shadow-sm overflow-hidden">

                                            <img
                                                src={mediaUrl(item.gambar)}
                                                alt={item.judul}
                                                className="card-img-top"
                                                style={{
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/placeholder.png";
                                                }}
                                            />

                                            <div className="card-body d-flex flex-column p-4">

                                                <small className="text-secondary mb-2">
                                                    {formatTanggal(
                                                        item.created_at ||
                                                        item.tanggal
                                                    )}
                                                </small>

                                                <h5 className="card-title fw-bold">
                                                    {item.judul}
                                                </h5>

                                                <p className="card-text text-secondary flex-grow-1">
                                                    {item.ringkasan ||
                                                        item.deskripsi ||
                                                        "Baca artikel untuk mengetahui informasi selengkapnya."}
                                                </p>

                                                <Link
                                                    to={`/artikel/${item.id}`}
                                                    className="btn btn-batik-outline align-self-start"
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
            </main>
        </>
    );
}

export default ArtikelPage;