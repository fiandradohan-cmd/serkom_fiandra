import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, formatTanggal } from "../../utils";

function AdminPembelianPage() {
    const [pembelian, setPembelian] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadPembelian = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await adminApi.getPembelian();
            setPembelian(response.data || []);
        } catch (err) {
            setError(err.message || "Gagal mengambil data pesanan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPembelian();
    }, []);

    const getOrderId = (item) => item.id ?? item.id_pembelian;

    const getStatusBadge = (status) => {
        const s = String(status || "").toLowerCase();
        if (s.includes("selesai") || s.includes("dibayar")) return "text-bg-success";
        if (s.includes("batal") || s.includes("belum") || s.includes("tertunda"))
            return "text-bg-danger";
        return "text-bg-warning";
    };

    const handleDelete = async (item) => {
        const id = getOrderId(item);
        if (!id) return;
        if (!window.confirm(`Hapus pesanan #${id}? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }
        try {
            setDeletingId(id);
            await adminApi.deletePembelian(id);
            setPembelian((prev) => prev.filter((p) => getOrderId(p) !== id));
        } catch (err) {
            alert(err.message || "Gagal menghapus pesanan.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="h4 fw-bold mb-1">Kelola Pesanan</h2>
                <p className="text-secondary mb-0">Kelola pesanan pelanggan.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="text-secondary mt-3">Memuat pesanan...</p>
                </div>
            )}

            {!loading && !error && (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-3">ID</th>
                                    <th>Pembeli</th>
                                    <th>Produk</th>
                                    <th>Tanggal</th>
                                    <th>Total</th>
                                    <th>Pembayaran</th>
                                    <th>Status</th>
                                    <th className="text-end px-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pembelian.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-secondary">
                                            Belum ada pesanan.
                                        </td>
                                    </tr>
                                ) : (
                                    pembelian.map((item) => {
                                        const id = getOrderId(item);
                                        return (
                                            <tr key={id}>
                                                <td className="px-3 fw-semibold">#{id}</td>
                                                <td>
                                                    {item.nama_pembeli ||
                                                        item.nama_d ||
                                                        item.uname ||
                                                        "-"}
                                                </td>
                                                <td>{item.nama_produk || "-"}</td>
                                                <td>
                                                    {formatTanggal(
                                                        item.created_at || item.tanggal
                                                    )}
                                                </td>
                                                <td className="fw-semibold">
                                                    {formatRupiah(item.harga || item.total || 0)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${getStatusBadge(
                                                            item.pembayaran || item.status_bayar
                                                        )}`}
                                                    >
                                                        {item.pembayaran ||
                                                            item.status_bayar ||
                                                            "Belum"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${getStatusBadge(
                                                            item.status || item.status_proses
                                                        )}`}
                                                    >
                                                        {item.status ||
                                                            item.status_proses ||
                                                            "-"}
                                                    </span>
                                                </td>
                                                <td className="text-end px-3">
                                                    <div className="d-flex justify-content-end gap-1 flex-wrap">
                                                        <Link
                                                            to={`/admin/pesanan/${id}`}
                                                            className="btn btn-sm btn-outline-dark"
                                                        >
                                                            <i class="bi bi-eye-fill"></i>
                                                        </Link>
                                                        <Link
                                                            to={`/admin/pesanan/${id}/edit`}
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            <i class="bi bi-pen-fill"></i>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            disabled={deletingId === id}
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            {deletingId === id
                                                                ? "..."
                                                                : ""}
                                                                <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPembelianPage;
