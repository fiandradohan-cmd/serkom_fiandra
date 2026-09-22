import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { saveSession } from "../utils";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [credential, setCredential] = useState("");
    const [passwd, setPasswd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!credential || !passwd) {
            setError("Username/email dan password wajib diisi.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.login(credential, passwd);

            saveSession(response.token, response.user);
            if (auth?.login) {
                auth.login(response.token, response.user);
            } else if (auth?.refreshSession) {
                auth.refreshSession();
            }

            if (response.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/pembeli");
            }
        } catch (err) {
            setError(err.message || "Login gagal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
            <div
                className="card border-0 shadow-sm w-100"
                style={{ maxWidth: "420px" }}
            >
                <div className="card-body p-4 p-md-5">

                    {/* Header */}
                    <div className="text-center mb-4">
                        <h1 className="h2 fw-bold text-dark mb-2">
                            Selamat Datang
                        </h1>

                        <p className="text-secondary small mb-0">
                            Silakan login untuk melanjutkan
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Username / Email */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Username / Email
                            </label>

                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={credential}
                                onChange={(e) =>
                                    setCredential(e.target.value)
                                }
                                placeholder="Masukkan username atau email"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Password
                            </label>

                            <input
                                type="password"
                                className="form-control form-control-lg"
                                value={passwd}
                                onChange={(e) =>
                                    setPasswd(e.target.value)
                                }
                                placeholder="Masukkan password"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="alert alert-danger py-2 small"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {/* Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-batik btn-lg w-100 fw-semibold"
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>
                                    Memproses...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <Link
                            to="/"
                            className="text-secondary text-decoration-none small"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;