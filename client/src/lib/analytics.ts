import posthog from 'posthog-js';

// Initialize PostHog with environment variable
export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Respect Do Not Track
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
      return;
    }

    posthog.init(/* ANALYTICS_KEY */, {
      api_host: 'https://app.posthog.com',
      autocapture: false, // Disable automatic event capture for privacy
      capture_pageview: false, // We'll handle page views manually
      loaded: (posthog) => {
        // Identify user after login/registration
        if (posthog.get_distinct_id()) {
          posthog.identify(posthog.get_distinct_id());
        }
      }
    });
  }
};

// Track page views
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      page_name: pageName,
      ...properties
    });
  }
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('cta_clicked', {
      cta_name: ctaName,
      location,
      ...properties
    });
  }
};

// Track authentication events
export const trackAuthEvent = (eventType: 'login' | 'register' | 'logout', properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('auth_event', {
      event_type: eventType,
      ...properties
    });
  }
};

// Track search events
export const trackSearch = (query: string, resultCount: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('search_performed', {
      search_query: query,
      result_count: result_count,
      ...properties
    });
  }
};

// Track product events
export const trackProductView = (productId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('product_viewed', {
      product_id: productId,
      ...properties
    });
  }
};

export const trackAddToCart = (productId: string, quantity: number, price: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('product_added_to_cart', {
      product_id: productId,
      quantity,
      price,
      ...properties
    });
  }
};

export const trackRemoveFromCart = (productId: string, quantity: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('product_removed_from_cart', {
      product_id: productId,
      quantity,
      ...properties
    });
  }
};

// Track checkout events
export const trackCheckoutStarted = (cartValue: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('checkout_started', {
      cart_value: cartValue,
      ...properties
    });
  }
};

export const trackCheckoutStep = (step: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('checkout_step_completed', {
      step,
      ...properties
    });
  }
};

// Track purchase
export const trackPurchase = (orderId: string, value: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('purchase_completed', {
      order_id: orderId,
      value,
      ...properties
    });
  }
};

// Track wishlist events
export const trackWishlistAdd = (productId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('product_added_to_wishlist', {
      product_id: productId,
      ...properties
    });
  }
};

export const trackWishlistRemove = (productId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('product_removed_from_wishlist', {
      product_id: productId,
      ...properties
    });
  }
};

// Track review events
export const trackReviewSubmitted = (productId: string, rating: number, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('review_submitted', {
      product_id: productId,
      rating,
      ...properties
    });
  }
};

// Track form submissions
export const trackFormSubmit = (formName: string, success: boolean, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('form_submitted', {
      form_name: formName,
      success,
      ...properties
    });
  }
};