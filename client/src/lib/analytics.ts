/**
 * Privacy-friendly analytics tracking for ShopSphere e-commerce platform
 * Uses Google Analytics 4 with Do Not Track respect and minimal data collection
 */

// Check if analytics should be enabled (respects Do Not Track)
const isAnalyticsEnabled = (): boolean => {
  return !window.navigator.doNotTrack;
};

// Track page views
export const trackPageView = (path: string, title?: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', '/* ANALYTICS_KEY */', {
      page_path: path,
      page_title: title,
    });
  }
};

// Track events with enhanced e-commerce parameters
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isAnalyticsEnabled()) return;
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce specific event tracking
export const trackAddToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('add_to_cart', 'Ecommerce', productId, price * quantity);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }
};

export const trackRemoveFromCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('remove_from_cart', 'Ecommerce', productId, price * quantity);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }
};

export const trackBeginCheckout = (cartValue: number): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('begin_checkout', 'Ecommerce', undefined, cartValue);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: cartValue,
    });
  }
};

export const trackPurchase = (
  orderId: string,
  total: number,
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>
): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('purchase', 'Ecommerce', orderId, total);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: total,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
};

// User interaction tracking
export const trackLogin = (method: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('login', 'Auth', method);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

export const trackSignUp = (method: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('sign_up', 'Auth', method);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

export const trackSearch = (query: string, resultCount: number): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('search', 'Engagement', query, resultCount);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: query,
      result_count: resultCount,
    });
  }
};

// CTA tracking
export const trackCTAClick = (ctaName: string, location: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('cta_click', 'Engagement', `${location}:${ctaName}`);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'cta_click', {
      cta_name: ctaName,
      location: location,
    });
  }
};

// Form submission tracking
export const trackFormSubmit = (formName: string, success: boolean): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent(
    'form_submit', 
    'Engagement', 
    `${formName}:${success ? 'success' : 'failure'}`
  );
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      success: success,
    });
  }
};

// Product detail view tracking
export const trackProductView = (
  productId: string,
  productName: string,
  price: number
): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('view_item', 'Ecommerce', productId, price);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  }
};

// Category view tracking
export const trackCategoryView = (category: string): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('view_category', 'Engagement', category);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'view_category', {
      category: category,
    });
  }
};

// Wishlist tracking
export const trackAddToWishlist = (
  productId: string,
  productName: string,
  price: number
): void => {
  if (!isAnalyticsEnabled()) return;
  
  trackEvent('add_to_wishlist', 'Ecommerce', productId, price);
  
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_wishlist', {
      currency: 'USD',
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  }
};