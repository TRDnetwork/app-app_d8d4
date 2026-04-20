/* Minimal analytics event tracking - <2KB */
export const trackEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  // Respect Do Not Track
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    return;
  }
  
  // Track standard events
  const eventMap: Record<string, string> = {
    'page_view': 'page_view',
    'form_submit': 'form_submit',
    'cta_click': 'click',
    'purchase': 'purchase',
    'add_to_cart': 'add_to_cart',
    'login': 'login',
    'sign_up': 'sign_up',
    'search': 'search'
  };
  
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', eventMap[action] || action, {
      ...params,
      timestamp: Date.now()
    });
  }
};

// Enhanced ecommerce tracking
export const trackPurchase = (orderId: string, value: number, currency: string = 'USD') => {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: value,
    currency: currency,
    items: []
  });
};

export const trackAddToCart = (productId: string, name: string, price: number) => {
  trackEvent('add_to_cart', {
    items: [{
      item_id: productId,
      item_name: name,
      price: price,
      currency: 'USD',
      quantity: 1
    }]
  });
};

// Initialize analytics with privacy defaults
export const initAnalytics = () => {
  // No additional initialization needed for GA4 snippet
  // Event tracking handled by trackEvent function
};

// Export for dashboard widget
export { AnalyticsDashboardWidget } from '@/components/AnalyticsDashboardWidget';