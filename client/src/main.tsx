import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './stores/authStore';
import { CartProvider } from './stores/cartStore';
import { WishlistProvider } from './stores/wishlistStore';
import { analytics } from './lib/analytics';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Enhanced analytics initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Track initial page view
    analytics.trackPageView(window.location.pathname, document.title);
    
    // Track navigation events
    let previousPath = window.location.pathname;
    
    // Listen for client-side routing changes
    const handleNavigation = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== previousPath) {
        analytics.trackPageView(currentPath, document.title);
        previousPath = currentPath;
      }
    };
    
    // For apps using hash routing
    window.addEventListener('hashchange', handleNavigation);
    
    // For apps using the History API
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleNavigation();
    };
    
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
});