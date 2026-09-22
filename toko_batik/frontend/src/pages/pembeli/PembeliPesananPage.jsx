import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi } from "../../api";
import { formatRupiah, formatTanggal, mediaUrl } from "../../utils";
import { SITE } from "../../constants";

function PembeliPesananPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await pembeliApi.getPembelian();
                setList(response.data || response || []);
            } catch (err) {
                setError(err.message || "Gagal memuat pesanan.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h4 fw-bold mb-1">Pesanan Saya</h1>
                    <p className="text-secondary mb-0 small">
                        {list.length} transaksi
                    </p>
                </div>
                <Link to="/pembeli/produk" className="btn btn-dark btn-sm">
                    + Pesan jasa
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="alert alert-light border mb-3">
                <div className="fw-semibold mb-1">Informasi pembayaran Bank Transfer</div>
                <div className="small text-secondary mb-0">
                    Bank: <strong className="text-dark">{SITE.bank}</strong>
                    {" · "}
                    No. Rekening: <strong className="text-dark">{SITE.no_rekening}</strong>
                    {" · "}
                    Atas Nama: <strong className="text-dark">{SITE.atas_nama}</strong>
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                </div>
            )}

            {!loading && !error && (
                <div className="bg-white" style={{ borderRadius: 4 }}>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr className="text-secondary small text-uppercase">
                                    <th className="ps-3">ID</th>
                                    <th>Produk</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Bayar</th>
                                    <th>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-secondary py-4">
                                            Belum ada pesanan.{" "}
                                            <Link to="/pembeli/produk">Pesan jasa sekarang</Link>.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((item) => (
                                        <tr key={item.id || item.id_pembelian}>
                                            <td className="ps-3">
                                                {item.id || item.id_pembelian}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {item.gambar && (
                                                        <img
                                                            src={mediaUrl(item.gambar)}
                                                            alt=""
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                objectFit: "cover",
                                                                borderRadius: 4,
                                                            }}
                                                        />
                                                    )}
                                                    <span>
                                                        {item.nama_produk || "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {formatRupiah(item.harga || item.total)}
                                            </td>
                                            <td>{item.status || "-"}</td>
                                            <td>{item.pembayaran || "-"}</td>
                                            <td>
                                                {formatTanggal(item.created_at)}
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

export default PembeliPesananPage;
