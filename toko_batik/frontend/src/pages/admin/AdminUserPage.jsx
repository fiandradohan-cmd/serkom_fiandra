import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";

function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getUsers();

            setUsers(response.data || []);
        } catch (err) {
            setError(err.message || "Gagal mengambil data user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        const yakin = window.confirm(
            "Apakah Anda yakin ingin menghapus user ini?"
        );

        if (!yakin) return;

        try {
            await adminApi.deleteUser(id);
            await loadUsers();
        } catch (err) {
            setError(err.message || "Gagal menghapus user.");
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Kelola User
                    </h2>

                    <p className="text-secondary mb-0">
                        Kelola akun admin dan pembeli.
                    </p>
                </div>

                <Link
                    to="/admin/users/tambah"
                    className="btn btn-dark"
                >
                    + Tambah User
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
                        className="spinner-border"
                        role="status"
                    ></div>

                    <p className="text-secondary mt-3">
                        Memuat data user...
                    </p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-3">
                                        ID
                                    </th>
                                    <th>Nama</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-end px-3">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5 text-secondary"
                                        >
                                            Belum ada user.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-3">
                                                {user.id}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {user.nama_d}{" "}
                                                    {user.nama_b}
                                                </div>
                                            </td>

                                            <td>
                                                {user.uname}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.role ===
                                                        "admin"
                                                            ? "text-bg-dark"
                                                            : "text-bg-secondary"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="text-end px-3">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        to={`/admin/users/${user.id}`}
                                                        className="btn btn-sm btn-outline-dark"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUserPage;