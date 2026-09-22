import { Link, useNavigate } from "react-router-dom";
import { SITE, PUBLIC_NAV } from "../constants";
import { getSession } from "../utils";
import { useCart } from "../context/CartContext";
import { checkPembeliCartAccess } from "../utils/cartAccess";

const Header = () => {
    const navigate = useNavigate();
    const session = getSession();
    const user = session?.user;
    const isLoggedIn = Boolean(session?.token && user);
    const isAdmin = user?.role === "admin";
    const isPembeli = user?.role === "pembeli";
    const panelPath = isAdmin ? "/admin" : "/pembeli";
    const panelLabel = isAdmin ? "Panel Admin" : "Panel Pembeli";
    const { totalQty } = useCart();

    const handleCartClick = (e) => {
        const access = checkPembeliCartAccess();
        if (!access.ok) {
            e.preventDefault();
            if (access.needLogin) {
                navigate("/login", { state: { from: "/keranjang" } });
                return;
            }
            alert(access.reason || "Hanya pembeli yang dapat membuka keranjang.");
        }
    };

    return (
        <header className="batik-header sticky-top">
            <div className="container py-2 py-md-3">
                <div className="d-flex align-items-center justify-content-between gap-3">
                    <Link
                        to="/"
                        className="text-decoration-none d-flex align-items-center gap-2"
                        aria-label={SITE.nama_toko || "Batik Nusantara"}
                    >
                        <span
                            className="d-none d-sm-inline fw-bold"
                            style={{
                                color: "var(--batik-soga)",
                                fontSize: "1.05rem",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {SITE.nama_toko}
                        </span>
                    </Link>

                    <nav className="d-flex align-items-center gap-2 gap-md-3 flex-wrap justify-content-end">
                        {PUBLIC_NAV.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-decoration-none nav-link-batik px-1 px-md-2"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <Link
                            to="/keranjang"
                            onClick={handleCartClick}
                            className="btn btn-batik-outline px-2 px-md-3 py-1 position-relative"
                            style={{ borderRadius: "6px", fontSize: "14px" }}
                            aria-label="Keranjang"
                            title={
                                isPembeli
                                    ? "Keranjang belanja"
                                    : "Login sebagai pembeli untuk mengakses keranjang"
                            }
                        >
                            🛒
                            <span className="d-none d-md-inline ms-1">Keranjang</span>
                            {isPembeli && totalQty > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                    style={{
                                        background: "var(--batik-terracotta)",
                                        fontSize: "0.65rem",
                                    }}
                                >
                                    {totalQty > 99 ? "99+" : totalQty}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <Link
                                to={panelPath}
                                className="btn btn-batik px-3 py-1"
                                style={{ borderRadius: "6px", fontSize: "14px" }}
                            >
                                {panelLabel}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-batik-outline px-3 py-1"
                                    style={{ borderRadius: "6px", fontSize: "14px" }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-batik px-3 py-1"
                                    style={{ borderRadius: "6px", fontSize: "14px" }}
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
