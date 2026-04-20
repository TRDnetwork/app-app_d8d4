import { useAuthStore } from '../stores/authStore';

// Track events with PostHog
export const trackEvent = (event: string, properties: Record<string, any> = {}) => {
  // Only track if PostHog is available and user hasn't opted out
  if (typeof window !== 'undefined' && window.ph && !navigator.doNotTrack) {
    const user = useAuthStore.getState().user;
    
    // Add user ID if available
    if (user?.id) {
      properties.userId = user.id;
    }
    
    // Send event to PostHog
    window.ph('capture', event, properties);
  }
};

// Track page views
export const trackPageView = (pageName: string, properties: Record<string, any> = {}) => {
  trackEvent('$pageview', {
    $current_url: window.location.href,
    page_name: pageName,
    ...properties
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submitted', {
    form_name: formName,
    success,
    page: window.location.pathname
  });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string = 'unknown') => {
  trackEvent('cta_clicked', {
    cta_name: ctaName,
    location,
    page: window.location.pathname
  });
};

// Track authentication events
export const trackAuthEvent = (eventType: string, method: string = 'email') => {
  trackEvent('auth_event', {
    event_type: eventType,
    method,
    page: window.location.pathname
  });
};

// Track purchase
export const trackPurchase = (orderId: string, revenue: number, items: Array<{id: string, name: string, price: number, quantity: number}>) => {
  trackEvent('purchase_completed', {
    order_id: orderId,
    revenue,
    currency: 'USD',
    items
  });
};