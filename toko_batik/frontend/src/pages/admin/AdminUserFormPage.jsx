import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api";

function AdminUserFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        nama_d: "",
        nama_b: "",
        kelamin: "",
        lahir: "",
        alamat: "",
        phone: "",
        email: "",
        role: "pembeli",
        uname: "",
        passwd: "",
        foto: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;

        const loadUser = async () => {
            try {
                const response = await adminApi.getUser(id);
                const user = response.data;

                setForm({
                    nama_d: user.nama_d || "",
                    nama_b: user.nama_b || "",
                    kelamin: user.kelamin || "",
                    lahir: user.lahir || "",
                    alamat: user.alamat || "",
                    phone: user.phone || "",
                    email: user.email || "",
                    role: user.role || "pembeli",
                    uname: user.uname || "",
                    passwd: "",
                    foto: user.foto || ""
                });
            } catch (err) {
                setError(
                    err.message || "Gagal mengambil data user."
                );
            } finally {
                setLoadingData(false);
            }
        };

        loadUser();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const payload = { ...form };

            // Saat edit, password kosong tidak dikirim
            if (isEdit && !payload.passwd) {
                delete payload.passwd;
            }

            if (isEdit) {
                await adminApi.updateUser(id, payload);
            } else {
                await adminApi.createUser(payload);
            }

            navigate("/admin/users");
        } catch (err) {
            setError(
                err.message || "Gagal menyimpan data user."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="container-fluid py-5 text-center">
                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <p className="text-secondary mt-3">
                    Memuat data user...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="mb-4">
                <Link
                    to="/admin/users"
                    className="btn btn-sm btn-outline-secondary mb-3"
                >
                    ← Kembali
                </Link>

                <h2 className="fw-bold mb-1">
                    {isEdit
                        ? "Edit User"
                        : "Tambah User"}
                </h2>

                <p className="text-secondary mb-0">
                    {isEdit
                        ? "Perbarui data akun user."
                        : "Tambahkan akun user baru."}
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Nama depan */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Nama Depan
                                </label>

                                <input
                                    type="text"
                                    name="nama_d"
                                    value={form.nama_d}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Nama belakang */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Nama Belakang
                                </label>

                                <input
                                    type="text"
                                    name="nama_b"
                                    value={form.nama_b}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Kelamin */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Kelamin
                                </label>

                                <select
                                    name="kelamin"
                                    value={form.kelamin}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">
                                        Pilih kelamin
                                    </option>

                                    <option value="L">
                                        Laki-laki
                                    </option>

                                    <option value="P">
                                        Perempuan
                                    </option>
                                </select>
                            </div>

                            {/* Tanggal lahir */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Tanggal Lahir
                                </label>

                                <input
                                    type="date"
                                    name="lahir"
                                    value={form.lahir}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Alamat */}
                            <div className="col-12">
                                <label className="form-label">
                                    Alamat
                                </label>

                                <textarea
                                    name="alamat"
                                    value={form.alamat}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            {/* Phone */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Nomor HP
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Username */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="uname"
                                    value={form.uname}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="pembeli">
                                        Pembeli
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>
                            </div>

                            {/* Password */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    {isEdit
                                        ? "Password Baru"
                                        : "Password"}
                                </label>

                                <input
                                    type="password"
                                    name="passwd"
                                    value={form.passwd}
                                    onChange={handleChange}
                                    className="form-control"
                                    required={!isEdit}
                                />

                                {isEdit && (
                                    <small className="text-secondary">
                                        Kosongkan jika tidak ingin
                                        mengubah password.
                                    </small>
                                )}
                            </div>

                            {/* Foto */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Foto
                                </label>

                                <input
                                    type="text"
                                    name="foto"
                                    value={form.foto}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="/uploads/images/..."
                                />
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Link
                                to="/admin/users"
                                className="btn btn-outline-secondary"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                className="btn btn-dark"
                                disabled={loading}
                            >
                                {loading
                                    ? "Menyimpan..."
                                    : "Simpan User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminUserFormPage;