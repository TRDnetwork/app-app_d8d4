import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './stores/cart';
import { WishlistProvider } from './stores/wishlist';
import { ToastProvider } from './components/ui/toast';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <AppRoutes />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;