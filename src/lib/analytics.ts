/**
 * Analytics tracking service for ShopSphere e-commerce platform
 * Implements GA4 event tracking with privacy considerations
 */

// Type definitions for analytics events
type EventCategory = 
  | 'engagement'
  | 'ecommerce'
  | 'auth'
  | 'navigation'
  | 'form';

type EventAction = 
  | 'page_view'
  | 'click'
  | 'submit'
  | 'login'
  | 'register'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'view_item'
  | 'view_item_list'
  | 'select_item'
  | 'add_to_wishlist';

interface EventParams {
  category?: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Check if analytics should be enabled based on DNT and environment
 */
const shouldTrack = (): boolean => {
  // Disable in development
  if (import.meta.env.DEV) return false;
  
  // Respect Do Not Track
  if (window.navigator.doNotTrack === '1') return false;
  
  return true;
};

/**
 * Track a custom event in GA4
 */
const trackEvent = (params: EventParams): void => {
  if (!shouldTrack()) return;
  
  try {
    if (window.gtag) {
      window.gtag('event', params.action, {
        event_category: params.category || 'engagement',
        event_label: params.label,
        value: params.value,
        ...params
      });
    }
  } catch (error) {
    console.debug('Analytics tracking error:', error);
  }
};

/**
 * Track page views
 */
const trackPageView = (path: string): void => {
  if (!shouldTrack()) return;
  
  try {
    if (window.gtag) {
      window.gtag('config', '/* ANALYTICS_KEY */', {
        page_path: path
      });
    }
  } catch (error) {
    console.debug('Page view tracking error:', error);
  }
};

/**
 * Track form submissions
 */
const trackFormSubmit = (formName: string, success: boolean = true): void => {
  trackEvent({
    category: 'form',
    action: 'submit',
    label: `${formName}_${success ? 'success' : 'error'}`
  });
};

/**
 * Track CTA clicks
 */
const trackCTAClick = (ctaName: string, location: string): void => {
  trackEvent({
    category: 'engagement',
    action: 'click',
    label: `${ctaName}_cta_${location}`
  });
};

/**
 * Track product views
 */
const trackProductView = (productId: string, productName: string): void => {
  trackEvent({
    category: 'ecommerce',
    action: 'view_item',
    label: productId,
    items: [{
      item_id: productId,
      item_name: productName
    }]
  });
};

/**
 * Track add to cart
 */
const trackAddToCart = (
  productId: string, 
  productName: string, 
  price: number, 
  quantity: number = 1
): void => {
  trackEvent({
    category: 'ecommerce',
    action: 'add_to_cart',
    label: productId,
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  });
};

/**
 * Track checkout steps
 */
const trackCheckoutStep = (step: number, option?: string): void => {
  const stepNames = ['address', 'delivery', 'payment', 'review'];
  trackEvent({
    category: 'ecommerce',
    action: 'begin_checkout',
    label: stepNames[step - 1],
    value: step,
    checkout_step: step,
    checkout_option: option
  });
};

/**
 * Track purchases
 */
const trackPurchase = (
  orderId: string, 
  total: number, 
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>
): void => {
  trackEvent({
    category: 'ecommerce',
    action: 'purchase',
    label: orderId,
    value: total,
    transaction_id: orderId,
    currency: 'USD',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

/**
 * Track searches
 */
const trackSearch = (query: string, resultCount: number): void => {
  trackEvent({
    category: 'engagement',
    action: 'search',
    label: query,
    value: resultCount
  });
};

/**
 * Track authentication events
 */
const trackAuthEvent = (action: 'login' | 'register' | 'logout', method: string): void => {
  trackEvent({
    category: 'auth',
    action: action,
    label: method
  });
};

export const analytics = {
  trackEvent,
  trackPageView,
  trackFormSubmit,
  trackCTAClick,
  trackProductView,
  trackAddToCart,
  trackCheckoutStep,
  trackPurchase,
  trackSearch,
  trackAuthEvent
};