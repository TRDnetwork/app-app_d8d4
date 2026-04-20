/**
 * Analytics tracking utilities for ShopSphere e-commerce platform
 * Implements GA4 event tracking with privacy considerations
 */

// Track authentication events
export const trackAuthEvent = (action: 'login' | 'register' | 'logout', method: 'email' | 'google' | 'facebook' = 'email') => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'authentication', {
    method: method,
    action: action,
    timestamp: new Date().toISOString()
  });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'cta_click', {
    cta_name: ctaName,
    location: location,
    timestamp: new Date().toISOString()
  });
};

// Track form submissions
export const trackFormSubmit = (formName: string, success: boolean, metadata: Record<string, any> = {}) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'form_submit', {
    form_name: formName,
    success: success,
    ...metadata,
    timestamp: new Date().toISOString()
  });
};

// Track product interactions
export const trackProductView = (productId: string, productName: string, category: string, price: number) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'view_item', {
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price: price
    }]
  });
};

export const trackAddToCart = (productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'add_to_cart', {
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price: price,
      quantity: quantity
    }]
  });
};

export const trackRemoveFromCart = (productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'remove_from_cart', {
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price: price,
      quantity: quantity
    }]
  });
};

// Track checkout steps
export const trackCheckoutStep = (step: number, option?: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'begin_checkout', {
    checkout_step: step,
    checkout_option: option
  });
};

// Track purchases
export const trackPurchase = (orderId: string, total: number, items: Array<{
  productId: string,
  productName: string,
  category: string,
  price: number,
  quantity: number
}>, coupon?: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'USD',
    coupon: coupon,
    items: items.map(item => ({
      item_id: item.productId,
      item_name: item.productName,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Track page views (for SPA routing)
export const trackPageView = (path: string, title: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.origin + path,
    page_path: path
  });
};

// Track search events
export const trackSearch = (query: string, resultCount: number) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'search', {
    search_term: query,
    result_count: resultCount
  });
};

// Track wishlist interactions
export const trackWishlistAdd = (productId: string, productName: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'wishlist_add', {
    item_id: productId,
    item_name: productName
  });
};

export const trackWishlistRemove = (productId: string, productName: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'wishlist_remove', {
    item_id: productId,
    item_name: productName
  });
};

// Track reviews and ratings
export const trackReviewSubmit = (productId: string, rating: number) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'review_submit', {
    item_id: productId,
    rating: rating
  });
};

// Track sharing
export const trackShare = (method: string, productId?: string) => {
  if (navigator.doNotTrack && navigator.doNotTrack === "1") return;
  
  gtag('event', 'share', {
    method: method,
    item_id: productId
  });
};

// Privacy-safe gtag function
function gtag() {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(arguments);
  }
}