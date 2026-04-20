import { useEffect } from 'react';
import analytics, { AnalyticsEvent } from '../lib/analytics';
import { ANALYTICS_EVENTS } from '../lib/analyticsEvents';

/**
 * Custom hook for analytics tracking
 */
export const useAnalytics = () => {
  /**
   * Track a page view
   */
  const trackPageView = (page: keyof typeof ANALYTICS_EVENTS.PAGE_VIEW_EVENTS) => {
    const event = ANALYTICS_EVENTS.PAGE_VIEW_EVENTS[page];
    analytics.track(event, {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
    });
  };

  /**
   * Track a generic event
   */
  const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  };

  /**
   * Identify the current user
   */
  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    analytics.identify(userId, properties);
  };

  /**
   * Reset user identification
   */
  const resetUser = () => {
    analytics.reset();
  };

  return {
    trackPageView,
    trackEvent,
    identifyUser,
    resetUser,
  };
};

/**
 * Hook to automatically track page views
 */
export const usePageViewTracking = (page: keyof typeof ANALYTICS_EVENTS.PAGE_VIEW_EVENTS) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(page);
  }, [trackPageView, page]);
};