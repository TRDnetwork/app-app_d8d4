import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './stores/authStore';
import { CartProvider } from './stores/cartStore';
import { WishlistProvider } from './stores/wishlistStore';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);