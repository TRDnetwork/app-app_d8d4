import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './analytics';

// Hook to track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Map URL paths to readable page names
    const pageNames: Record<string, string> = {
      '/': 'Home',
      '/products': 'Product List',
      '/cart': 'Cart',
      '/checkout': 'Checkout',
      '/orders': 'Order History',
      '/profile': 'Profile',
      '/addresses': 'Addresses',
      '/wishlist': 'Wishlist',
      '/search': 'Search',
      '/login': 'Login',
      '/register': 'Register',
      '/forgot-password': 'Forgot Password',
      '/reset-password': 'Reset Password',
      '/verify-email': 'Verify Email'
    };

    const pageName = pageNames[location.pathname] || location.pathname;
    trackPageView(pageName);
  }, [location]);
};