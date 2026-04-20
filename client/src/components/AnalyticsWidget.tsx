'use client';

import { useEffect } from 'react';

export default function AnalyticsWidget() {
  useEffect(() => {
    // Track auth events
    const handleAuthEvent = (event: CustomEvent) => {
      if (window.gtag && !navigator.doNotTrack) {
        gtag('event', event.detail.type, {
          event_category: 'Auth',
          event_label: event.detail.method,
          value: event.detail.success ? 1 : 0
        });
      }
    };

    // Track purchase events
    const handlePurchase = (event: CustomEvent) => {
      if (window.gtag && !navigator.doNotTrack) {
        gtag('event', 'purchase', {
          transaction_id: event.detail.orderId,
          value: event.detail.total,
          currency: 'USD',
          items: event.detail.items
        });
      }
    };

    window.addEventListener('auth_event', handleAuthEvent as EventListener);
    window.addEventListener('purchase_complete', handlePurchase as EventListener);

    return () => {
      window.removeEventListener('auth_event', handleAuthEvent as EventListener);
      window.removeEventListener('purchase_complete', handlePurchase as EventListener);
    };
  }, []);

  return null;
}