import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, formatTanggal, mediaUrl } from "../../utils";
import { SITE } from "../../constants";

function AdminPembelianDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.pathname.endsWith("/edit");

    const [pembelian, setPembelian] = useState(null);
    const [form, setForm] = useState({
        nama_pembeli: "",
        alamat_pembeli: "",
        phone_pembeli: "",
        metode_pembayaran: "Bank Transfer",
        pembayaran: "Belum",
        pengiriman: "JNT Express",
        status: "Tertunda",
        catatan: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await adminApi.getPembelianById(id);
                const data = response.data;
                setPembelian(data);
                setForm({
                    nama_pembeli: data.nama_pembeli || "",
                    alamat_pembeli: data.alamat_pembeli || "",
                    phone_pembeli: data.phone_pembeli || "",
                    metode_pembayaran: data.metode_pembayaran || "Bank Transfer",
                    pembayaran: data.pembayaran || data.status_bayar || "Belum",
                    pengiriman: data.pengiriman || data.kurir || "JNT Express",
                    status: data.status || data.status_proses || "Tertunda",
                    catatan: data.catatan || "",
                });
            } catch (err) {
                setError(err.message || "Gagal mengambil data pesanan.");
                setPembelian(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) load();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            // Kirim data lengkap agar backend update tidak mengosongkan field
            const payload = {
                nama_pembeli: form.nama_pembeli,
                alamat_pembeli: form.alamat_pembeli,
                phone_pembeli: form.phone_pembeli,
                metode_pembayaran: form.metode_pembayaran,
                pembayaran: form.pembayaran,
                pengiriman: form.pengiriman,
                status: form.status,
                catatan: form.catatan || null,
                foto_bukti: pembelian?.foto_bukti || null,
            };

            await adminApi.updatePembelian(id, payload);
            setSuccess("Pesanan berhasil diperbarui.");
            setPembelian((prev) => ({ ...prev, ...payload }));

            if (isEditMode) {
                setTimeout(() => navigate(`/admin/pesanan/${id}`), 800);
            }
        } catch (err) {
            setError(err.message || "Gagal memperbarui pesanan.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Hapus pesanan #${id}? Tindakan ini tidak dapat dibatalkan.`)) {
            return;
        }
        try {
            setDeleting(true);
            await adminApi.deletePembelian(id);
            navigate("/admin/pesanan");
        } catch (err) {
            setError(err.message || "Gagal menghapus pesanan.");
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-secondary mt-3">Memuat detail pesanan...</p>
            </div>
        );
    }

    if (!pembelian) {
        return (
            <div>
                <div className="alert alert-danger">
                    {error || "Pembelian tidak ditemukan."}
                </div>
                <Link to="/admin/pesanan" className="btn btn-outline-secondary btn-sm">
                    ← Kembali ke Pesanan
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <Link
                    to="/admin/pesanan"
                    className="btn btn-sm btn-outline-secondary mb-3"
                >
                    ← Kembali
                </Link>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                        <h2 className="h4 fw-bold mb-1">
                            {isEditMode ? "Edit" : "Detail"} Pesanan #{id}
                        </h2>
                        <p className="text-secondary mb-0">
                            {isEditMode
                                ? "Ubah data dan status pesanan."
                                : "Lihat detail pesanan pelanggan."}
                        </p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        {!isEditMode && (
                            <Link
                                to={`/admin/pesanan/${id}/edit`}
                                className="btn btn-sm btn-outline-dark"
                            >
                                Edit
                            </Link>
                        )}
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Menghapus..." : "Hapus"}
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Informasi Pesanan</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <small className="text-secondary">ID Pesanan</small>
                                    <div className="fw-semibold">#{id}</div>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-secondary">Tanggal</small>
                                    <div className="fw-semibold">
                                        {formatTanggal(pembelian.created_at)}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-secondary">Pembeli</small>
                                    <div className="fw-semibold">
                                        {pembelian.nama_pembeli || "-"}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-secondary">Telepon</small>
                                    <div className="fw-semibold">
                                        {pembelian.phone_pembeli || "-"}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <small className="text-secondary">Alamat</small>
                                    <div className="fw-semibold">
                                        {pembelian.alamat_pembeli || "-"}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-secondary">Metode Bayar</small>
                                    <div className="fw-semibold">
                                        {pembelian.metode_pembayaran || "-"}
                                    </div>
                                    {(pembelian.metode_pembayaran || "").includes("Bank") && (
                                        <div className="small text-secondary mt-1">
                                            {SITE.bank} · {SITE.no_rekening} a.n. {SITE.atas_nama}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <small className="text-secondary">Kurir</small>
                                    <div className="fw-semibold">
                                        {pembelian.pengiriman || "-"}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <small className="text-secondary">Catatan</small>
                                    <div className="fw-semibold">
                                        {pembelian.catatan || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Produk</h5>
                            <div className="d-flex align-items-center gap-3">
                                {pembelian.gambar && (
                                    <img
                                        src={mediaUrl(pembelian.gambar)}
                                        alt={pembelian.nama_produk || "Produk"}
                                        width={64}
                                        height={64}
                                        className="rounded"
                                        style={{ objectFit: "cover" }}
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.png";
                                        }}
                                    />
                                )}
                                <div>
                                    <div className="fw-semibold">
                                        {pembelian.nama_produk || "-"}
                                    </div>
                                    <div className="text-secondary small">
                                        {pembelian.kategori || ""}
                                    </div>
                                    <div className="fw-bold">
                                        {formatRupiah(pembelian.harga || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">
                                {isEditMode ? "Form Edit Pesanan" : "Ubah Status"}
                            </h5>

                            <form onSubmit={handleSubmit}>
                                {isEditMode && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">Nama Pembeli</label>
                                            <input
                                                type="text"
                                                name="nama_pembeli"
                                                className="form-control"
                                                value={form.nama_pembeli}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Telepon</label>
                                            <input
                                                type="text"
                                                name="phone_pembeli"
                                                className="form-control"
                                                value={form.phone_pembeli}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Alamat</label>
                                            <textarea
                                                name="alamat_pembeli"
                                                className="form-control"
                                                rows={2}
                                                value={form.alamat_pembeli}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Metode Pembayaran</label>
                                            <select
                                                name="metode_pembayaran"
                                                className="form-select"
                                                value={form.metode_pembayaran}
                                                onChange={handleChange}
                                            >
                                                <option value="Bank Transfer">Bank Transfer</option>
                                                <option value="COD">COD</option>
                                            </select>
                                            {form.metode_pembayaran === "Bank Transfer" && (
                                                <div className="alert alert-light border small mt-2 mb-0">
                                                    <div className="fw-semibold mb-1">Rekening toko:</div>
                                                    <div>Bank: <strong>{SITE.bank}</strong></div>
                                                    <div>No. Rek: <strong>{SITE.no_rekening}</strong></div>
                                                    <div>A.n. <strong>{SITE.atas_nama}</strong></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Kurir</label>
                                            <select
                                                name="pengiriman"
                                                className="form-select"
                                                value={form.pengiriman}
                                                onChange={handleChange}
                                            >
                                                <option value="JNT Express">JNT Express</option>
                                                <option value="JNE">JNE</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Catatan</label>
                                            <textarea
                                                name="catatan"
                                                className="form-control"
                                                rows={2}
                                                value={form.catatan}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Status Pembayaran</label>
                                    <select
                                        name="pembayaran"
                                        className="form-select"
                                        value={form.pembayaran}
                                        onChange={handleChange}
                                    >
                                        <option value="Belum">Belum</option>
                                        <option value="Dibayar">Dibayar</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Status Proses</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Tertunda">Tertunda</option>
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Dikirim">Dikirim</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Dibatalkan">Dibatalkan</option>
                                    </select>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-dark"
                                        disabled={saving}
                                    >
                                        {saving ? "Menyimpan..." : "Simpan"}
                                    </button>
                                    {isEditMode && (
                                        <Link
                                            to={`/admin/pesanan/${id}`}
                                            className="btn btn-outline-secondary"
                                        >
                                            Batal
                                        </Link>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPembelianDetailPage;
