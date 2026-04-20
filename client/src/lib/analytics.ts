import { authStore } from '../stores/authStore';
import { cartStore } from '../stores/cartStore';

// Replace with actual GA4 measurement ID
const GA4_MEASUREMENT_ID = '/* ANALYTICS_KEY */';

// Check if analytics should be enabled (DNT, etc.)
const isAnalyticsEnabled = () => {
  // Respect Do Not Track
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    return false;
  }
  
  // Additional privacy checks could be added here
  return true;
};

// Send event to GA4
const sendEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (!isAnalyticsEnabled()) return;
  
  // Add user ID if available
  const user = authStore.getState().user;
  if (user) {
    params.user_id = user.id;
  }
  
  // Add cart info if available
  const cart = cartStore.getState();
  if (cart.items.length > 0) {
    params.cart_total = cart.getTotal();
    params.cart_items = cart.items.length;
  }
  
  // Send to GA4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Page view tracking
export const trackPageView = (path: string, title: string) => {
  if (!isAnalyticsEnabled()) return;
  
  sendEvent('page_view', {
    page_path: path,
    page_title: title
  });
};

// CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  sendEvent('cta_click', {
    cta_name: ctaName,
    location: location
  });
};

// Form submissions
export const trackFormSubmit = (formName: string, success: boolean) => {
  sendEvent('form_submit', {
    form_name: formName,
    success: success
  });
};

// Authentication events
export const trackAuthEvent = (eventType: string) => {
  sendEvent('auth_event', {
    auth_type: eventType
  });
};

// Search events
export const trackSearch = (query: string, resultCount: number) => {
  sendEvent('search', {
    search_term: query,
    result_count: resultCount
  });
};

// Product events
export const trackProductView = (productId: string, productName: string) => {
  sendEvent('view_item', {
    items: [{
      item_id: productId,
      item_name: productName
    }]
  });
};

export const trackAddToCart = (
  productId: string, 
  productName: string, 
  price: number, 
  quantity: number
) => {
  sendEvent('add_to_cart', {
    currency: 'USD',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  });
};

export const trackWishlistEvent = (action: 'add' | 'remove', productId: string) => {
  sendEvent('wishlist_event', {
    action: action,
    product_id: productId
  });
};

// Purchase event
export const trackPurchase = (
  orderId: string,
  total: number,
  items: Array<{
    productId: string,
    name: string,
    price: number,
    quantity: number
  }>
) => {
  sendEvent('purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'USD',
    items: items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Initialize analytics
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);
  
  // Listen for route changes in SPA
  let lastPath = window.location.pathname;
  const checkUrlChange = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      trackPageView(currentPath, document.title);
      lastPath = currentPath;
    }
  };
  
  // Check for URL changes (for SPA routing)
  setInterval(checkUrlChange, 250);
};

// Export for use in components
export default {
  trackPageView,
  trackCTAClick,
  trackFormSubmit,
  trackAuthEvent,
  trackSearch,
  trackProductView,
  trackAddToCart,
  trackWishlistEvent,
  trackPurchase,
  initAnalytics
};
```

```typescript