import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import { mediaUrl, formatTanggal } from "../../utils";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            // Prefer pembeli endpoint
            let response;
            try {
                response = await adminApi.getPembeli();
            } catch {
                response = await adminApi.getUsers("pembeli");
            }
            setUsers(response.data || response || []);
        } catch (err) {
            setError(err.message || "Gagal mengambil data pembeli.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        const yakin = window.confirm(
            "Apakah Anda yakin ingin menghapus pembeli ini?"
        );
        if (!yakin) return;

        try {
            setDeleting(id);
            await adminApi.deleteUser(id);
            setUsers((data) => data.filter((item) => (item.id || item.id_user) !== id));
        } catch (err) {
            alert(err.message || "Gagal menghapus pembeli.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h1 className="h4 fw-bold mb-1">Kelola Pembeli</h1>
                    <p className="text-secondary mb-0 small">
                        {users.length} akun pembeli
                    </p>
                </div>
                <Link to="/admin/pembeli/tambah" className="btn btn-dark btn-sm">
                    + Pembeli baru
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <p className="text-secondary mt-2">Memuat data pembeli...</p>
                </div>
            )}

            {!loading && !error && (
                <div className="bg-white" style={{ borderRadius: 4 }}>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr className="text-secondary small text-uppercase">
                                    <th className="ps-3">Foto</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Telepon</th>
                                    <th>Daftar</th>
                                    <th className="pe-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-secondary py-4">
                                            Belum ada akun pembeli. Klik &quot;Pembeli baru&quot; untuk menambah.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => {
                                        const id = u.id || u.id_user;
                                        return (
                                            <tr key={id}>
                                                <td className="ps-3">
                                                    <img
                                                        src={mediaUrl(u.foto || u.gambar)}
                                                        alt=""
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            objectFit: "cover",
                                                            borderRadius: 4,
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23ddd' width='40' height='40'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    {[u.nama_d, u.nama_b].filter(Boolean).join(" ") ||
                                                        u.nama ||
                                                        "-"}
                                                </td>
                                                <td>{u.email || "-"}</td>
                                                <td>{u.uname || u.username || "-"}</td>
                                                <td>{u.phone || u.telepon || u.no_hp || "-"}</td>
                                                <td>{formatTanggal(u.created_at || u.tanggal_daftar)}</td>
                                                <td className="pe-3">
                                                    <div className="d-flex gap-1">
                                                        <Link
                                                            to={`/admin/pembeli/${id}/edit`}
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            <i class="bi bi-pen-fill"></i>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            disabled={deleting === id}
                                                            onClick={() => handleDelete(id)}
                                                        >
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

export default AdminUsersPage;
