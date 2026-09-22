import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";

import ProdukPage from "./pages/ProdukPage";
import ProdukDetailPage from "./pages/ProdukDetailPage";
import ArtikelPage from "./pages/ArtikelPage";
import ArtikelDetailPage from "./pages/ArtikelDetailPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProdukPage from "./pages/admin/AdminProdukPage";
import AdminProdukFormPage from "./pages/admin/AdminProdukFormPage";
import AdminProdukDetailPage from "./pages/admin/AdminProdukDetailPage";
import AdminArtikelPage from "./pages/admin/AdminArtikelPage";
import AdminArtikelFormPage from "./pages/admin/AdminArtikelFormPage";
import AdminArtikelDetailPage from "./pages/admin/AdminArtikelDetailPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserFormPage from "./pages/admin/AdminUserFormPage";
import AdminPembelianPage from "./pages/admin/AdminPembelianPage";
import AdminPembelianDetailPage from "./pages/admin/AdminPembelianDetailPage";
import AdminProfilPage from "./pages/admin/AdminProfilPage";

import PembeliLayout from "./layouts/PembeliLayout";
import PembeliDashboardPage from "./pages/pembeli/PembeliDashboardPage";
import PembeliProfilPage from "./pages/pembeli/PembeliProfilPage";
import PembeliPesananPage from "./pages/pembeli/PembeliPesananPage";
import PembeliProdukPage from "./pages/pembeli/PembeliProdukPage";
import PembeliProdukDetailPage from "./pages/pembeli/PembeliProdukDetailPage";
import PembeliArtikelPage from "./pages/pembeli/PembeliArtikelPage";
import PembeliArtikelDetailPage from "./pages/pembeli/PembeliArtikelDetailPage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/keranjang" element={<CartPage />} />

                    <Route path="/produk" element={<ProdukPage />} />
                    <Route path="/produk/:id_produk" element={<ProdukDetailPage />} />

                    <Route path="/artikel" element={<ArtikelPage />} />
                    <Route path="/artikel/:id" element={<ArtikelDetailPage />} />

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />

                        <Route path="produk" element={<AdminProdukPage />} />
                        <Route path="produk/tambah" element={<AdminProdukFormPage />} />
                        <Route path="produk/:id" element={<AdminProdukDetailPage />} />
                        <Route path="produk/:id/edit" element={<AdminProdukFormPage />} />

                        <Route path="artikel" element={<AdminArtikelPage />} />
                        <Route path="artikel/tambah" element={<AdminArtikelFormPage />} />
                        <Route path="artikel/:id" element={<AdminArtikelDetailPage />} />
                        <Route path="artikel/:id/edit" element={<AdminArtikelFormPage />} />

                        <Route path="pembeli" element={<AdminUsersPage />} />
                        <Route path="pembeli/tambah" element={<AdminUserFormPage />} />
                        <Route path="pembeli/:id/edit" element={<AdminUserFormPage />} />

                        <Route path="pesanan" element={<AdminPembelianPage />} />
                        <Route path="pesanan/:id" element={<AdminPembelianDetailPage />} />
                        <Route path="pesanan/:id/edit" element={<AdminPembelianDetailPage />} />
                        <Route path="pembelian" element={<AdminPembelianPage />} />
                        <Route path="pembelian/:id" element={<AdminPembelianDetailPage />} />
                        <Route path="pembelian/:id/edit" element={<AdminPembelianDetailPage />} />

                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="users/tambah" element={<AdminUserFormPage />} />
                        <Route path="users/:id/edit" element={<AdminUserFormPage />} />

                        <Route path="profil" element={<AdminProfilPage />} />
                    </Route>

                    <Route path="/pembeli" element={<PembeliLayout />}>
                        <Route index element={<PembeliDashboardPage />} />
                        <Route path="pesanan" element={<PembeliPesananPage />} />
                        <Route path="profil" element={<PembeliProfilPage />} />
                        <Route path="produk" element={<PembeliProdukPage />} />
                        <Route path="produk/:id_produk" element={<PembeliProdukDetailPage />} />
                        <Route path="artikel" element={<PembeliArtikelPage />} />
                        <Route path="artikel/:id" element={<PembeliArtikelDetailPage />} />
                    </Route>
                </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
