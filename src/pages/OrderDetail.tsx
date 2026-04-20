import React from 'react';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { InvoiceDownload } from '../components/order/InvoiceDownload';

const OrderDetail = () => {
  const order = {
    id: 'ORD-7X8K2M9N',
    date: '2023-10-15',
    status: 'delivered',
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 199.99, image: '/placeholder.svg' },
      { name: 'Phone Case', quantity: 2, price: 29.99, image: '/placeholder.svg' },
    ],
    subtotal: 259.97,
    delivery: 0,
    total: 259.97,
    address: {
      line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    deliverySpeed: 'Standard',
    paymentMethod: 'Visa •••• 4242',
    trackingNumber: 'TRK789012345',
    deliveredAt: '2023-10-20',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Order #{order.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            <OrderTimeline status={order.status} deliveredAt={order.deliveredAt} />
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 py-4 border-b border-border last:border-b-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>${order.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <p>{order.address.line1}</p>
            <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
            <p>{order.address.country}</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <p>{order.paymentMethod}</p>
          </div>
          <InvoiceDownload orderId={order.id} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;