import { useEffect } from 'react';

// Initialize PostHog for e-commerce
const ANALYTICS_KEY = 'phc_/* ANALYTICS_KEY */';
const POSTHOG_HOST = 'https://app.posthog.com';

// Track events with type safety
type EventName =
  | 'page_view'
  | 'cta_click'
  | 'form_submit'
  | 'auth_complete'
  | 'search_initiated'
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'wishlist_added'
  | 'checkout_started'
  | 'purchase_completed';

interface EventProperties {
  [key: string]: any;
}

// Initialize PostHog script
const initPostHog = () => {
  if (typeof window === 'undefined') return;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  // Load PostHog script asynchronously
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://cdn.jsdelivr.net/npm/posthog-js@latest/dist/posthog.min.js`;
  script.onload = () => {
    try {
      // @ts-ignore - posthog is loaded on window
      window.posthog.init(ANALYTICS_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: false, // Disable automatic event capture
        capture_pageview: false, // We'll handle page views manually
      });
    } catch (error) {
      console.warn('PostHog initialization failed:', error);
    }
  };
  document.head.appendChild(script);
};

// Track events with retry mechanism
const trackEvent = (eventName: EventName, properties?: EventProperties) => {
  if (typeof window === 'undefined') return;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  // Retry mechanism for PostHog
  const sendEvent = () => {
    try {
      // @ts-ignore - posthog is loaded on window
      if (window.posthog) {
        // @ts-ignore
        window.posthog.capture(eventName, properties);
      } else {
        // PostHog not ready, try again after delay
        setTimeout(sendEvent, 500);
      }
    } catch (error) {
      console.warn(`Failed to track event ${eventName}:`, error);
    }
  };

  sendEvent();
};

// Hook for page view tracking
export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    // Delay tracking to ensure PostHog is initialized
    const timer = setTimeout(() => {
      trackEvent('page_view', { page_name: pageName });
    }, 1000);

    return () => clearTimeout(timer);
  }, [pageName]);
};

// Hook for CTA click tracking
export const useCTATracking = (ctaName: string) => {
  const trackClick = () => {
    trackEvent('cta_click', { cta_name: ctaName });
  };

  return trackClick;
};

// Hook for form submission tracking
export const useFormTracking = (formName: string) => {
  const trackSubmit = (additionalProps?: EventProperties) => {
    trackEvent('form_submit', {
      form_name: formName,
      ...additionalProps,
    });
  };

  return trackSubmit;
};

// Hook for authentication event tracking
export const useAuthTracking = () => {
  const trackAuth = (authType: 'login' | 'register' | 'logout', method: 'email' | 'google' | 'facebook') => {
    trackEvent('auth_complete', {
      auth_type: authType,
      auth_method: method,
    });
  };

  return trackAuth;
};

// Hook for search tracking
export const useSearchTracking = () => {
  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent('search_initiated', {
      search_query: query,
      results_count: resultsCount,
    });
  };

  return trackSearch;
};

// Hook for product view tracking
export const useProductViewTracking = () => {
  const trackProductView = (productId: string, productName: string) => {
    trackEvent('product_viewed', {
      product_id: productId,
      product_name: productName,
    });
  };

  return trackProductView;
};

// Hook for cart tracking
export const useCartTracking = () => {
  const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => {
    trackEvent('product_added_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
    });
  };

  return { trackAddToCart };
};

// Hook for wishlist tracking
export const useWishlistTracking = () => {
  const trackWishlistAdd = (productId: string, productName: string) => {
    trackEvent('wishlist_added', {
      product_id: productId,
      product_name: productName,
    });
  };

  return trackWishlistAdd;
};

// Hook for checkout tracking
export const useCheckoutTracking = () => {
  const trackCheckoutStart = (cartValue: number, itemCount: number) => {
    trackEvent('checkout_started', {
      cart_value: cartValue,
      item_count: itemCount,
    });
  };

  return trackCheckoutStart;
};

// Hook for purchase tracking
export const usePurchaseTracking = () => {
  const trackPurchase = (orderId: string, value: number, currency: string = 'USD', items?: Array<{id: string, name: string, price: number, quantity: number}>) => {
    trackEvent('purchase_completed', {
      order_id: orderId,
      value,
      currency,
      items,
    });
  };

  return trackPurchase;
};

// Initialize analytics on module load
initPostHog();

// Export types for external use
export type { EventName, EventProperties };
```