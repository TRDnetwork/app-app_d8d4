import React from 'react';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { PaymentMethods } from '../components/checkout/PaymentMethods';
import { OrderReview } from '../components/checkout/OrderReview';
import { useCheckoutStore } from '../stores/checkoutStore';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { usePageViewTracking } from '../hooks/useAnalytics';
import analytics from '../lib/analytics';
import { ANALYTICS_EVENTS } from '../lib/analyticsEvents';

export default function Checkout() {
  const { address, deliverySpeed, paymentMethod } = useCheckoutStore();
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.getTotal());
  const navigate = useNavigate();
  
  // Track page view
  usePageViewTracking('CHECKOUT');

  // Track checkout started event
  useEffect(() => {
    analytics.track(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
      itemCount: items.length,
      totalValue: total,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }, [items, total]);

  const handlePlaceOrder = () => {
    // In real app: create order via API, then redirect to confirmation
    navigate(`/order-confirmation/${Date.now()}`);
    
    // Track order completed event
    analytics.track(ANALYTICS_EVENTS.ORDER_COMPLETED, {
      orderId: Date.now().toString(),
      itemCount: items.length,
      totalValue: total,
      paymentMethod,
      deliverySpeed,
      address,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AddressSelector />
          <DeliveryOptions />
          <PaymentMethods />
        </div>
        <div>
          <OrderReview items={items} total={total} address={address} deliverySpeed={deliverySpeed} />
          <Button onClick={handlePlaceOrder} className="w-full mt-4">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}