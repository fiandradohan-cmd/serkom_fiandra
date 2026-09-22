import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, formatTanggal, mediaUrl } from "../../utils";

function AdminProdukDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await adminApi.getProdukById(id);
                setData(response.data || response);
            } catch (err) {
                setError(err.message || "Gagal memuat detail produk.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="alert alert-danger">{error}</div>
                <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">← Kembali</Link>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <h1 className="h4 fw-bold mb-0">Detail Produk</h1>
                <div className="d-flex gap-2">
                    <Link to={`/admin/produk/${id}/edit`} className="btn btn-dark btn-sm">Ubah</Link>
                    <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">← Kembali</Link>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-md-4">
                    <div className="bg-white p-3" style={{ borderRadius: 4 }}>
                        <img
                            src={mediaUrl(data.gambar)}
                            alt={data.nama_produk}
                            className="w-100"
                            style={{ maxHeight: 280, objectFit: "cover", borderRadius: 4 }}
                            onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23eee' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999'%3ENo image%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-8">
                    <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th className="text-secondary" style={{ width: 140 }}>ID</th>
                                    <td>{data.id_produk}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">Nama</th>
                                    <td className="fw-semibold">{data.nama_produk}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">Kategori</th>
                                    <td>{data.kategori || "-"}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">Harga</th>
                                    <td className="fw-semibold text-warning">{formatRupiah(data.harga)}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">Dibuat</th>
                                    <td>{formatTanggal(data.created_at)}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">Diubah</th>
                                    <td>{formatTanggal(data.updated_at)}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary align-top">Deskripsi</th>
                                    <td style={{ whiteSpace: "pre-wrap" }}>{data.deskripsi || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProdukDetailPage;
