import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api";
import { formatTanggal, mediaUrl } from "../../utils";

function AdminArtikelDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await adminApi.getArtikelById(id);
                setData(response.data || response);
            } catch (err) {
                setError(err.message || "Gagal memuat detail artikel.");
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
                <Link to="/admin/artikel" className="btn btn-outline-secondary btn-sm">← Kembali</Link>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <h1 className="h4 fw-bold mb-0">Detail Artikel</h1>
                <div className="d-flex gap-2">
                    <Link to={`/admin/artikel/${id}/edit`} className="btn btn-dark btn-sm">Ubah</Link>
                    <Link to="/admin/artikel" className="btn btn-outline-secondary btn-sm">← Kembali</Link>
                </div>
            </div>

            <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                {data.gambar && (
                    <img
                        src={mediaUrl(data.gambar)}
                        alt={data.judul}
                        className="w-100 mb-3"
                        style={{ maxHeight: 320, objectFit: "cover", borderRadius: 4 }}
                    />
                )}
                <h2 className="h5 fw-bold mb-2">{data.judul}</h2>
                <p className="text-secondary small mb-3">
                    {formatTanggal(data.created_at)}
                    {data.updated_at ? ` · diperbarui ${formatTanggal(data.updated_at)}` : ""}
                </p>
                {data.ringkasan && (
                    <p className="fw-semibold mb-3">{data.ringkasan}</p>
                )}
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {data.isi || "-"}
                </div>
            </div>
        </div>
    );
}

export default AdminArtikelDetailPage;
