import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

function RegisterPage() {
    const navigate = useNavigate();

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
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setSuccess("");

        if (
            !form.nama_d ||
            !form.nama_b ||
            !form.kelamin ||
            !form.lahir ||
            !form.alamat ||
            !form.phone ||
            !form.email ||
            !form.uname ||
            !form.passwd
        ) {
            setError("Semua data wajib diisi.");
            return;
        }

        try {
            setLoading(true);

            await api.register(form);

            setSuccess(
                "Pendaftaran berhasil. Silakan login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(
                err.message || "Pendaftaran gagal."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7">

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">

                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h1 className="fw-bold mb-2">
                                        Buat Akun
                                    </h1>

                                    <p className="text-secondary mb-0">
                                        Daftar untuk mulai menggunakan layanan kami
                                    </p>
                                </div>

                                {/* Pesan */}
                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">

                                        {/* Nama depan */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Nama Depan
                                            </label>

                                            <input
                                                type="text"
                                                name="nama_d"
                                                value={form.nama_d}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nama depan"
                                            />
                                        </div>

                                        {/* Nama belakang */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Nama Belakang
                                            </label>

                                            <input
                                                type="text"
                                                name="nama_b"
                                                value={form.nama_b}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nama belakang"
                                            />
                                        </div>

                                        {/* Kelamin */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Jenis Kelamin
                                            </label>

                                            <select
                                                name="kelamin"
                                                value={form.kelamin}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="">
                                                    Pilih jenis kelamin
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
                                            <label className="form-label fw-semibold">
                                                Tanggal Lahir
                                            </label>

                                            <input
                                                type="date"
                                                name="lahir"
                                                value={form.lahir}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Alamat */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                Alamat
                                            </label>

                                            <textarea
                                                name="alamat"
                                                value={form.alamat}
                                                onChange={handleChange}
                                                className="form-control"
                                                rows="3"
                                                placeholder="Masukkan alamat"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                No. Telepon
                                            </label>

                                            <input
                                                type="text"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="nama@email.com"
                                            />
                                        </div>

                                        {/* Username */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                Username
                                            </label>

                                            <input
                                                type="text"
                                                name="uname"
                                                value={form.uname}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Buat username"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                Password
                                            </label>

                                            <input
                                                type="password"
                                                name="passwd"
                                                value={form.passwd}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Buat password"
                                            />
                                        </div>

                                        {/* Tombol */}
                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-batik w-100"
                                                disabled={loading}
                                            >
                                                {loading
                                                    ? "Mendaftarkan..."
                                                    : "Daftar"}
                                            </button>
                                        </div>

                                    </div>
                                </form>

                                {/* Footer */}
                                <div className="text-center mt-4">
                                    <span className="text-secondary">
                                        Sudah memiliki akun?{" "}
                                    </span>

                                    <Link
                                        to="/login"
                                        className="fw-semibold text-dark text-decoration-none"
                                    >
                                        Login
                                    </Link>
                                </div>

                                <div className="text-center mt-3">
                                    <Link
                                        to="/"
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        ← Kembali ke Beranda
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;