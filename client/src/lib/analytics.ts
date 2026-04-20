import { useEffect } from 'react';

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA4_MEASUREMENT_ID', {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Hook for page view tracking
export const usePageView = (url: string) => {
  useEffect(() => {
    trackPageView(url);
  }, [url]);
};

// Hook for event tracking
export const useTrackEvent = (action: string, category: string, label?: string) => {
  useEffect(() => {
    trackEvent(action, category, label);
  }, [action, category, label]);
};