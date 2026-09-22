import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { formatTanggal, mediaUrl } from "../../utils";

function AdminArtikelPage() {
    const [artikel, setArtikel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);

    const loadArtikel = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getArtikel();
            setArtikel(response.data || []);
        } catch (err) {
            setError(
                err.message || "Gagal mengambil data artikel."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtikel();
    }, []);

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Apakah Anda yakin ingin menghapus artikel ini?"
            )
        ) {
            return;
        }

        try {
            setDeleting(id);

            await adminApi.deleteArtikel(id);

            setArtikel((data) =>
                data.filter((item) => item.id !== id)
            );
        } catch (err) {
            alert(
                err.message ||
                "Gagal menghapus artikel."
            );
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="container-fluid py-4">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Kelola Artikel
                    </h2>

                    <p className="text-secondary mb-0">
                        Kelola artikel yang ditampilkan kepada pengunjung.
                    </p>
                </div>

                <Link
                    to="/admin/artikel/tambah"
                    className="btn btn-primary"
                >
                    + Tambah Artikel
                </Link>

            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Memuat...
                        </span>
                    </div>

                    <p className="text-secondary mt-3 mb-0">
                        Memuat data artikel...
                    </p>

                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                artikel.length === 0 && (
                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <h5 className="fw-semibold">
                                Belum ada artikel
                            </h5>

                            <p className="text-secondary mb-3">
                                Tambahkan artikel pertama Anda.
                            </p>

                            <Link
                                to="/admin/artikel/tambah"
                                className="btn btn-primary"
                            >
                                Tambah Artikel
                            </Link>

                        </div>

                    </div>
                )}

            {/* Table */}
            {!loading &&
                !error &&
                artikel.length > 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-0">

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">
                                        <tr>

                                            <th className="px-3">
                                                Gambar
                                            </th>

                                            <th>
                                                Judul
                                            </th>

                                            <th>
                                                Tanggal
                                            </th>

                                            <th className="text-end px-3">
                                                Aksi
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {artikel.map((item) => (

                                            <tr key={item.id}>

                                                {/* Gambar */}
                                                <td className="px-3">

                                                    <img
                                                        src={mediaUrl(
                                                            item.gambar
                                                        )}
                                                        alt={
                                                            item.judul
                                                        }
                                                        className="rounded"
                                                        style={{
                                                            width: "70px",
                                                            height: "55px",
                                                            objectFit: "cover"
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "/placeholder.png";
                                                        }}
                                                    />

                                                </td>

                                                {/* Judul */}
                                                <td>

                                                    <div className="fw-semibold">
                                                        {item.judul}
                                                    </div>

                                                    <small className="text-secondary">
                                                        ID: {item.id}
                                                    </small>

                                                </td>

                                                {/* Tanggal */}
                                                <td>

                                                    {formatTanggal(
                                                        item.created_at
                                                    )}

                                                </td>

                                                {/* Aksi */}
                                                <td className="text-end px-3">

                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Link
                                                            to={`/admin/artikel/${item.id}`}
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            <i class="bi bi-eye-fill"></i>
                                                        </Link>
                                                        <Link
                                                            to={`/admin/artikel/${item.id}/edit`}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i class="bi bi-pen-fill"></i>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            disabled={
                                                                deleting ===
                                                                item.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                        >

                                                            {deleting ===
                                                            item.id
                                                                ? "Menghapus..."
                                                                : ""}
                                                                <i class="bi bi-trash"></i>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}

export default AdminArtikelPage;
