import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getSession } from "../utils";
import { useAuth } from "../context/AuthContext";

function PembeliLayout() {
    const navigate = useNavigate();
    const session = getSession();
    const user = session?.user;
    const auth = useAuth();

    const handleLogout = () => {
        if (auth?.logout) {
            auth.logout();
        } else {
            localStorage.removeItem("session");
        }
        navigate("/login");
    };

    const menuItems = [
        { to: "/pembeli", end: true, label: "Dashboard", icon: "▦" },
        { to: "/pembeli/pesanan", label: "Pesanan Saya", icon: "☰" },
        { to: "/pembeli/produk", label: "Katalog Produk", icon: "▣" },
        { to: "/pembeli/artikel", label: "Artikel", icon: "≡" },
        { to: "/pembeli/profil", label: "Profil Saya", icon: "◉" },
    ];

    return (
        <div className="d-flex min-vh-100" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <aside
                className="d-flex flex-column text-white"
                style={{
                    width: 240,
                    minWidth: 240,
                    background: "#1a1a1a",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflowY: "auto",
                }}
            >
                <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom border-secondary">
                    <div
                        className="d-flex align-items-center justify-content-center rounded"
                        style={{ width: 36, height: 36, background: "#333" }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 700 }}>BN</span>
                    </div>
                    <div>
                        <div className="fw-bold" style={{ fontSize: 14 }}>
                            Panel Pembeli
                        </div>
                        <div className="text-secondary" style={{ fontSize: 11 }}>
                            Batik Nusantara
                        </div>
                    </div>
                </div>

                <nav className="flex-grow-1 py-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${
                                    isActive ? "text-white" : "text-secondary"
                                }`
                            }
                            style={({ isActive }) => ({
                                background: isActive ? "#2d2d2d" : "transparent",
                                borderLeft: isActive
                                    ? "3px solid #f0ad4e"
                                    : "3px solid transparent",
                                fontSize: 14,
                            })}
                        >
                            <span style={{ width: 20, textAlign: "center" }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-top border-secondary px-3 py-3">
                    <NavLink
                        to="/"
                        className="d-block text-secondary text-decoration-none mb-2"
                        style={{ fontSize: 13 }}
                    >
                        Lihat beranda
                    </NavLink>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-link p-0 text-warning text-decoration-none"
                        style={{ fontSize: 13 }}
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-grow-1 d-flex flex-column" style={{ background: "#f5f5f0" }}>
                <header
                    className="d-flex align-items-center justify-content-between px-4 py-2 bg-white border-bottom"
                    style={{ minHeight: 56 }}
                >
                    <div />
                    <div className="d-flex align-items-center gap-2">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: 32,
                                height: 32,
                                background: "#333",
                                color: "#fff",
                                fontSize: 12,
                            }}
                        >
                            {(user?.nama_d || user?.uname || "P")[0].toUpperCase()}
                        </div>
                        <span className="small text-secondary">
                            {user?.nama_d || user?.uname || "Pembeli"}
                        </span>
                    </div>
                </header>

                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PembeliLayout;
