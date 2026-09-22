import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "batik_nusantara_cart";

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => loadCart());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (produk, qty = 1) => {
        if (!produk?.id_produk) return;

        setItems((prev) => {
            const existing = prev.find((i) => i.id_produk === produk.id_produk);
            if (existing) {
                return prev.map((i) =>
                    i.id_produk === produk.id_produk
                        ? { ...i, qty: i.qty + qty }
                        : i
                );
            }
            return [
                ...prev,
                {
                    id_produk: produk.id_produk,
                    nama_produk: produk.nama_produk,
                    harga: Number(produk.harga) || 0,
                    gambar: produk.gambar || "",
                    kategori: produk.kategori || "",
                    qty: qty,
                },
            ];
        });
    };

    const removeItem = (id_produk) => {
        setItems((prev) => prev.filter((i) => i.id_produk !== id_produk));
    };

    const updateQty = (id_produk, qty) => {
        const n = Math.max(1, Number(qty) || 1);
        setItems((prev) =>
            prev.map((i) => (i.id_produk === id_produk ? { ...i, qty: n } : i))
        );
    };

    const clearCart = () => setItems([]);

    const totalQty = useMemo(
        () => items.reduce((sum, i) => sum + i.qty, 0),
        [items]
    );

    const totalHarga = useMemo(
        () => items.reduce((sum, i) => sum + i.harga * i.qty, 0),
        [items]
    );

    const value = {
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalQty,
        totalHarga,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart harus dipakai di dalam CartProvider");
    }
    return ctx;
}
