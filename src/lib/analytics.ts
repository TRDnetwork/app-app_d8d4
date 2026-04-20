/**
 * Analytics tracking for ShopSphere e-commerce platform
 * Lightweight (<2KB) implementation with privacy considerations
 */

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && !navigator.doNotTrack) {
    window.gtag('config', '/* ANALYTICS_KEY */', {
      page_path: path,
      page_title: title,
      anonymize_ip: true
    });
  }
};

// Track events
export const trackEvent = (
  action: string, 
  category: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag && !navigator.doNotTrack) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      anonymize_ip: true
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'engagement', formName);
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', 'engagement', `${location}_${ctaName}`);
};

// Track authentication events
export const trackAuthEvent = (action: 'login' | 'register' | 'logout') => {
  trackEvent(action, 'authentication');
};

// Track purchase events (e-commerce)
export const trackPurchase = (
  transactionId: string, 
  value: number, 
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.gtag && !navigator.doNotTrack) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      anonymize_ip: true
    });
  }
};

// Track product view
export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_item', 'engagement', productName, 1);
};

// Track add to cart
export const trackAddToCart = (
  productId: string, 
  productName: string, 
  price: number, 
  quantity: number = 1
) => {
  trackEvent('add_to_cart', 'engagement', productName, price * quantity);
};

// Track wishlist interaction
export const trackWishlistEvent = (action: 'add' | 'remove', productId: string) => {
  trackEvent(`wishlist_${action}`, 'engagement', productId);
};

// Track search
export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('search', 'engagement', query, resultCount);
};