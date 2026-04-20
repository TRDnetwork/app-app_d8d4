import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
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
import ResponsiveLayout from './components/ResponsiveLayout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ResponsiveLayout>