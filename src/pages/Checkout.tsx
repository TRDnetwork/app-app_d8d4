import React from 'react';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { PaymentMethods } from '../components/checkout/PaymentMethods';
import { OrderReview } from '../components/checkout/OrderReview';
import { useCheckoutStore } from '../stores/checkoutStore';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { address, deliverySpeed, paymentMethod } = useCheckoutStore();
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.getTotal());
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // In real app: create order via API, then redirect to confirmation
    navigate(`/order-confirmation/${Date.now()}`);
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