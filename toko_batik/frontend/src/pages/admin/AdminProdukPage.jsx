import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, mediaUrl } from "../../utils";

function AdminProdukPage() {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);

    const loadProduk = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getProduk();
            setProduk(response.data || []);
        } catch (err) {
            setError(err.message || "Gagal mengambil data produk.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduk();
    }, []);

    const handleDelete = async (id) => {
        const yakin = window.confirm(
            "Apakah Anda yakin ingin menghapus produk ini?"
        );

        if (!yakin) return;

        try {
            setDeleting(id);

            await adminApi.deleteProduk(id);

            setProduk((data) =>
                data.filter((item) => item.id_produk !== id)
            );
        } catch (err) {
            alert(err.message || "Gagal menghapus produk.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Kelola Produk</h2>
                    <p className="text-secondary mb-0">
                        Daftar produk
                    </p>
                </div>

                <Link
                    to="/admin/produk/tambah"
                    className="btn btn-primary"
                >
                    + Produk baru
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger" role="alert">
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
                        Memuat data produk...
                    </p>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && produk.length === 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <h5 className="fw-semibold">
                            Belum ada produk
                        </h5>

                        <p className="text-secondary mb-3">
                            Tambahkan produk pertama Anda.
                        </p>

                        <Link
                            to="/admin/produk/tambah"
                            className="btn btn-primary"
                        >
                            Tambah Produk
                        </Link>
                    </div>
                </div>
            )}

            {/* Desktop table */}
            {!loading && produk.length > 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-3">Gambar</th>
                                        <th>Produk</th>
                                        <th>Kategori</th>
                                        <th>Harga</th>
                                        <th className="text-end px-3">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {produk.map((item) => (
                                        <tr key={item.id_produk}>
                                            <td className="px-3">
                                                <img
                                                    src={mediaUrl(item.gambar)}
                                                    alt={item.nama_produk}
                                                    className="rounded"
                                                    style={{
                                                        width: "65px",
                                                        height: "65px",
                                                        objectFit: "cover"
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/placeholder.png";
                                                    }}
                                                />
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {item.nama_produk}
                                                </div>

                                                <small className="text-secondary">
                                                    ID: {item.id_produk}
                                                </small>
                                            </td>

                                            <td>
                                                <span className="badge text-bg-light border">
                                                    {item.kategori}
                                                </span>
                                            </td>

                                            <td className="fw-semibold">
                                                {formatRupiah(item.harga)}
                                            </td>

                                            <td className="text-end px-3">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        to={`/admin/produk/${item.id_produk}`}
                                                        className="btn btn-sm btn-outline-secondary"
                                                    >
                                                        <i class="bi bi-eye-fill"></i>
                                                    </Link>
                                                    <Link
                                                        to={`/admin/produk/${item.id_produk}/edit`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i class="bi bi-pen-fill"></i>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={
                                                            deleting === item.id_produk
                                                        }
                                                        onClick={() =>
                                                            handleDelete(item.id_produk)
                                                        }
                                                    >
                                                        {deleting === item.id_produk
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

export default AdminProdukPage;