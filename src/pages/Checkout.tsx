import React from 'react';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { PaymentMethods } from '../components/checkout/PaymentMethods';
import { OrderReview } from '../components/checkout/OrderReview';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Checkout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <AddressSelector />
          <DeliveryOptions />
          <PaymentMethods />
        </div>
        <div>
          <OrderReview />
          <Button asChild className="mt-4 w-full">
            <Link to="/order-confirmation">Place Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;