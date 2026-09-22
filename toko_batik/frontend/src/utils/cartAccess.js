import { getSession } from "../utils";

/**
 * Cek akses keranjang — sama seperti fitur beli:
 * wajib login sebagai pembeli.
 *
 * @returns {{ ok: boolean, reason?: string, needLogin?: boolean }}
 */
export function checkPembeliCartAccess() {
    const session = getSession();
    const token = session?.token || null;
    const role = session?.user?.role || null;

    if (!token || !session?.user) {
        return {
            ok: false,
            needLogin: true,
            reason: "Silakan login sebagai pembeli untuk menggunakan keranjang.",
        };
    }

    if (role === "admin") {
        return {
            ok: false,
            needLogin: false,
            reason:
                "Hanya akun pembeli yang dapat menggunakan keranjang. Anda sedang login sebagai admin.",
        };
    }

    if (role !== "pembeli") {
        return {
            ok: false,
            needLogin: false,
            reason: "Hanya akun pembeli yang dapat menggunakan keranjang.",
        };
    }

    return { ok: true };
}
