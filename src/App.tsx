import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import SellerDashboard from './seller/pages/Dashboard';
import SellerProducts from './seller/pages/Products';
import SellerAddProduct from './seller/pages/AddProduct';
import SellerOrders from './seller/pages/Orders';
import AdminDashboard from './admin/pages/Dashboard';
import AdminUsers from './admin/pages/Users';
import AdminSellers from './admin/pages/Sellers';
import AdminCategories from './admin/pages/Categories';
import AdminBanners from './admin/pages/Banners';
import AdminCoupons from './admin/pages/Coupons';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Customer Routes */}
            <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/order-confirmation/:id" element={isAuthenticated ? <OrderConfirmation /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/order/:id" element={isAuthenticated ? <OrderTracking /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/wishlist" element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} />

            {/* Seller Routes */}
            <Route path="/seller" element={isAuthenticated && user?.role === 'seller' ? <SellerDashboard /> : <Navigate to="/" />} />
            <Route path="/seller/products" element={isAuthenticated && user?.role === 'seller' ? <SellerProducts /> : <Navigate to="/" />} />
            <Route path="/seller/products/add" element={isAuthenticated && user?.role === 'seller' ? <SellerAddProduct /> : <Navigate to="/" />} />
            <Route path="/seller/orders" element={isAuthenticated && user?.role === 'seller' ? <SellerOrders /> : <Navigate to="/" />} />

            {/* Admin Routes */}
            <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/users" element={isAuthenticated && user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
            <Route path="/admin/sellers" element={isAuthenticated && user?.role === 'admin' ? <AdminSellers /> : <Navigate to="/" />} />
            <Route path="/admin/categories" element={isAuthenticated && user?.role === 'admin' ? <AdminCategories /> : <Navigate to="/" />} />
            <Route path="/admin/banners" element={isAuthenticated && user?.role === 'admin' ? <AdminBanners /> : <Navigate to="/" />} />
            <Route path="/admin/coupons" element={isAuthenticated && user?.role === 'admin' ? <AdminCoupons /> : <Navigate to="/" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;