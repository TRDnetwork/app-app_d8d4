/* ANALYTICS_KEY */
import { useAuth } from './auth';

// Global function for tracking events with privacy considerations
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // Respect Do Not Track
  if (navigator.doNotTrack && navigator.doNotTrack === "1") {
    return;
  }
  
  // Only send events if gtag is available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...eventParams,
      // Ensure no personally identifiable information is sent
      user_id: undefined,
    });
  }
};

// Hook for component-level event tracking
export const useAnalytics = () => {
  const { user } = useAuth();
  
  const trackPageView = (path: string) => {
    trackEvent('page_view', {
      page_path: path,
      // Don't include user ID for privacy
    });
  };
  
  const trackFormSubmit = (formName: string) => {
    trackEvent('form_submit', {
      form_name: formName,
    });
  };
  
  const trackCTAClick = (ctaName: string, ctaLocation: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
    });
  };
  
  const trackAddToCart = (product: { _id: string; name: string; price: number; category: string }) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        }
      ]
    });
  };
  
  const trackPurchase = (orderId: string, value: number, currency: string = 'USD') => {
    trackEvent('purchase', {
      transaction_id: orderId,
      value: value,
      currency: currency,
    });
  };
  
  const trackLogin = (method: string) => {
    trackEvent('login', {
      method: method,
    });
  };
  
  const trackSignUp = (method: string) => {
    trackEvent('sign_up', {
      method: method,
    });
  };
  
  const trackSearch = (searchTerm: string, resultCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount,
    });
  };
  
  return {
    trackPageView,
    trackFormSubmit,
    trackCTAClick,
    trackAddToCart,
    trackPurchase,
    trackLogin,
    trackSignUp,
    trackSearch,
  };
};
```

```typescript