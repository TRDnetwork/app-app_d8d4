import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './stores/cart';
import { WishlistProvider } from './stores/wishlist';
import { ToastProvider } from './components/ui/toast';
import AppRoutes from './routes';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
                {/* a11y fix: Added role="main" and id for skip link */}
                <main id="main-content" role="main">
                  <AppRoutes />
                </main>
                <BottomNavigation />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;