import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { mediaUrl, saveSession, getSession } from "../../utils";

function AdminProfilPage() {
    const [form, setForm] = useState({
        nama_d: "",
        nama_b: "",
        kelamin: "",
        lahir: "",
        alamat: "",
        phone: "",
        email: "",
        uname: "",
        foto: "",
        passwd_lama: "",
        passwd_baru: "",
    });
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await adminApi.getMe();
                const data = response.data || response;
                setForm((prev) => ({
                    ...prev,
                    nama_d: data.nama_d || "",
                    nama_b: data.nama_b || "",
                    kelamin: data.kelamin || "",
                    lahir: data.lahir ? String(data.lahir).slice(0, 10) : "",
                    alamat: data.alamat || "",
                    phone: data.phone != null ? String(data.phone) : "",
                    email: data.email || "",
                    uname: data.uname || "",
                    foto: data.foto || "",
                }));
                if (data.foto) setPreview(mediaUrl(data.foto));
            } catch (err) {
                setError(err.message || "Gagal memuat profil.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        try {
            setUploading(true);
            setError("");
            const response = await adminApi.uploadGambar(file);
            const data = response.data || response;
            const filename = data.gambar || data.filename || data.file || data.path;
            if (!filename) throw new Error("Upload gagal.");
            setForm((prev) => ({ ...prev, foto: filename }));
            setSuccess("Foto berhasil diupload.");
        } catch (err) {
            setError(err.message || "Gagal upload foto.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            setSaving(true);
            const payload = {
                nama_d: form.nama_d,
                nama_b: form.nama_b,
                kelamin: form.kelamin,
                lahir: form.lahir || null,
                alamat: form.alamat,
                phone: form.phone,
                email: form.email,
                uname: form.uname,
                foto: form.foto || null,
            };
            if (form.passwd_baru) {
                payload.passwd_lama = form.passwd_lama;
                payload.passwd_baru = form.passwd_baru;
            }
            const response = await adminApi.putMe(payload);
            const session = getSession();
            if (session?.token) {
                saveSession(session.token, {
                    ...(session.user || {}),
                    nama_d: form.nama_d,
                    uname: form.uname,
                    foto: form.foto,
                    role: "admin",
                });
            }
            setSuccess(response.message || "Profil berhasil diperbarui.");
            setForm((prev) => ({ ...prev, passwd_lama: "", passwd_baru: "" }));
        } catch (err) {
            setError(err.message || "Gagal menyimpan profil.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-secondary mt-3">Memuat profil...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="h4 fw-bold mb-4">Profil Saya</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="bg-white p-4" style={{ borderRadius: 4 }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Nama Depan</label>
                                    <input name="nama_d" className="form-control" value={form.nama_d} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Nama Belakang</label>
                                    <input name="nama_b" className="form-control" value={form.nama_b} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Username</label>
                                    <input name="uname" className="form-control" value={form.uname} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Telepon</label>
                                    <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Jenis Kelamin</label>
                                    <select name="kelamin" className="form-select" value={form.kelamin} onChange={handleChange}>
                                        <option value="">-- Pilih --</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Tanggal Lahir</label>
                                    <input type="date" name="lahir" className="form-control" value={form.lahir} onChange={handleChange} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Alamat</label>
                                    <textarea name="alamat" className="form-control" rows={3} value={form.alamat} onChange={handleChange} />
                                </div>
                                <div className="col-12"><hr /><p className="text-secondary small mb-0">Ubah password (opsional)</p></div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Password Lama</label>
                                    <input type="password" name="passwd_lama" className="form-control" value={form.passwd_lama} onChange={handleChange} autoComplete="current-password" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Password Baru</label>
                                    <input type="password" name="passwd_baru" className="form-control" value={form.passwd_baru} onChange={handleChange} autoComplete="new-password" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button type="submit" className="btn btn-dark" disabled={saving || uploading}>
                                    {saving ? "Menyimpan..." : "Simpan Profil"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="bg-white p-4 text-center" style={{ borderRadius: 4 }}>
                        <div className="mb-3">
                            {preview ? (
                                <img src={preview} alt="Foto" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%" }} />
                            ) : (
                                <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 120, height: 120, background: "#ddd", fontSize: 36 }}>
                                    {(form.nama_d || "A")[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="btn btn-outline-secondary btn-sm">
                            {uploading ? "Mengupload..." : "Ganti foto"}
                            <input type="file" accept="image/*" className="d-none" onChange={handleFileChange} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfilPage;
