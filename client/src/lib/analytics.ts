// ANALYTICS: Event tracking utilities
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(event, properties);
  }
};

// Track common e-commerce events
export const analytics = {
  pageView: (path: string) => {
    trackEvent('$pageview', { path });
  },
  
  formSubmit: (formName: string, success: boolean) => {
    trackEvent('form_submit', { form_name: formName, success });
  },
  
  ctaClick: (ctaName: string, location: string) => {
    trackEvent('cta_click', { cta_name: ctaName, location });
  },
  
  addToCart: (productId: string, price: number, quantity: number = 1) => {
    trackEvent('add_to_cart', { product_id: productId, price, quantity });
  },
  
  removeFromCart: (productId: string, quantity: number = 1) => {
    trackEvent('remove_from_cart', { product_id: productId, quantity });
  },
  
  initiateCheckout: (value: number, itemCount: number) => {
    trackEvent('initiate_checkout', { value, item_count: itemCount });
  },
  
  purchase: (orderId: string, value: number, currency: string = 'USD') => {
    trackEvent('purchase', { order_id: orderId, value, currency });
  },
  
  login: (method: string) => {
    trackEvent('login', { method });
  },
  
  signUp: (method: string) => {
    trackEvent('sign_up', { method });
  },
  
  search: (query: string, resultCount: number) => {
    trackEvent('search', { query, result_count: resultCount });
  },
  
  viewProduct: (productId: string, price: number) => {
    trackEvent('view_product', { product_id: productId, price });
  },
  
  addWishlist: (productId: string) => {
    trackEvent('add_to_wishlist', { product_id: productId });
  },
  
  removeWishlist: (productId: string) => {
    trackEvent('remove_from_wishlist', { product_id: productId });
  }
};