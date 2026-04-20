import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

/**
 * Component that wraps the app to track page views
 */
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return <>{children}</>;
};

export default AnalyticsWrapper;