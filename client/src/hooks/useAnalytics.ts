import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

// ANALYTICS: Hook for automatic page view tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    analytics.pageView(location.pathname);
    
    // Track specific page types
    if (location.pathname === '/login') {
      analytics.formSubmit('login_form', false); // Track form availability
    } else if (location.pathname === '/register') {
      analytics.formSubmit('registration_form', false);
    } else if (location.pathname === '/checkout') {
      analytics.initiateCheckout(0, 0); // Will be updated with actual values
    }
  }, [location]);
};