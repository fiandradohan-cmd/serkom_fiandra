import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { SITE } from "../constants";
import { useCart } from "../context/CartContext";
import { mediaUrl, formatRupiah } from "../utils";
import { checkPembeliCartAccess } from "../utils/cartAccess";

function CartPage() {
    const navigate = useNavigate();
    const [allowed, setAllowed] = useState(false);
    const [denyMsg, setDenyMsg] = useState("");
    const { items, removeItem, updateQty, clearCart, totalHarga, totalQty } =
        useCart();

    useEffect(() => {
        const access = checkPembeliCartAccess();
        if (!access.ok) {
            if (access.needLogin) {
                navigate("/login", { state: { from: "/keranjang" } });
                return;
            }
            setAllowed(false);
            setDenyMsg(access.reason || "Akses ditolak.");
            return;
        }
        setAllowed(true);
    }, [navigate]);

    const waMessage = () => {
        if (items.length === 0) return "";
        const lines = items.map(
            (i, idx) =>
                `${idx + 1}. ${i.nama_produk} x${i.qty} = ${formatRupiah(
                    i.harga * i.qty
                )}`
        );
        return encodeURIComponent(
            `Halo ${SITE.nama_toko}, saya ingin memesan:\n\n${lines.join(
                "\n"
            )}\n\nTotal: ${formatRupiah(totalHarga)}\n\nTerima kasih.`
        );
    };

    return (
        <>
            <Header />
            <main style={{ background: "var(--batik-cream)", minHeight: "70vh" }}>
                <div className="container py-4 py-md-5">
                    {!allowed ? (
                        <div className="text-center py-5">
                            <div className="alert alert-warning d-inline-block">
                                {denyMsg || "Memeriksa akses..."}
                            </div>
                            <div className="mt-3">
                                <Link to="/" className="btn btn-batik-outline">
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    ) : (
                    <>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div>
                            <p
                                className="fw-bold small mb-1"
                                style={{
                                    color: "var(--batik-gold)",
                                    letterSpacing: 1.5,
                                }}
                            >
                                KERANJANG
                            </p>
                            <h1 className="section-title-batik h3 mb-0">
                                Keranjang Belanja
                            </h1>
                        </div>
                        {items.length > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={clearCart}
                            >
                                Kosongkan
                            </button>
                        )}
                    </div>
                    <div className="ornament-line" />

                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="fs-1 mb-3">🛒</div>
                            <p style={{ color: "var(--batik-muted)" }}>
                                Keranjang masih kosong.
                            </p>
                            <Link to="/produk" className="btn btn-batik mt-2">
                                Lihat Produk
                            </Link>
                        </div>
                    ) : (
                        <div className="row g-4">
                            <div className="col-lg-8">
                                <div className="d-flex flex-column gap-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id_produk}
                                            className="card card-batik border-0 shadow-sm"
                                        >
                                            <div className="card-body p-3">
                                                <div className="d-flex gap-3 align-items-start">
                                                    <img
                                                        src={mediaUrl(item.gambar)}
                                                        alt={item.nama_produk}
                                                        style={{
                                                            width: 88,
                                                            height: 88,
                                                            objectFit: "cover",
                                                            borderRadius: 8,
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "/placeholder.png";
                                                        }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between gap-2">
                                                            <div>
                                                                <span className="badge-kat">
                                                                    {item.kategori ||
                                                                        "Batik"}
                                                                </span>
                                                                <h2 className="h6 fw-bold mt-1 mb-1 text-batik">
                                                                    <Link
                                                                        to={`/produk/${item.id_produk}`}
                                                                        className="text-decoration-none text-batik"
                                                                    >
                                                                        {item.nama_produk}
                                                                    </Link>
                                                                </h2>
                                                                <p className="price-batik mb-2 mb-md-0">
                                                                    {formatRupiah(
                                                                        item.harga
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link text-danger text-decoration-none"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id_produk
                                                                    )
                                                                }
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <label className="small mb-0">
                                                                    Jumlah
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    className="form-control form-control-sm"
                                                                    style={{ width: 80 }}
                                                                    value={item.qty}
                                                                    onChange={(e) =>
                                                                        updateQty(
                                                                            item.id_produk,
                                                                            e.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <strong className="text-batik">
                                                                {formatRupiah(
                                                                    item.harga *
                                                                        item.qty
                                                                )}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div
                                    className="card border-0 shadow-sm sticky-top"
                                    style={{
                                        top: 90,
                                        background: "var(--batik-white)",
                                        borderTop: "3px solid var(--batik-gold)",
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <h3 className="h6 fw-bold text-batik mb-3">
                                            Ringkasan
                                        </h3>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span style={{ color: "var(--batik-muted)" }}>
                                                Total item
                                            </span>
                                            <span>{totalQty}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="fw-semibold">Total</span>
                                            <span className="price-batik">
                                                {formatRupiah(totalHarga)}
                                            </span>
                                        </div>
                                        <a
                                            href={`${SITE.link_wa}?text=${waMessage()}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-batik w-100 mb-2"
                                        >
                                            Pesan via WhatsApp
                                        </a>
                                        <Link
                                            to="/produk"
                                            className="btn btn-batik-outline w-100"
                                        >
                                            Lanjut Belanja
                                        </Link>
                                        <p
                                            className="small mt-3 mb-0"
                                            style={{ color: "var(--batik-muted)" }}
                                        >
                                            Atau login sebagai pembeli untuk membuat
                                            pesanan resmi di sistem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                    )}
                </div>
            </main>
        </>
    );
}

export default CartPage;
