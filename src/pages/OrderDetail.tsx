import React from 'react';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { InvoiceDownload } from '../components/order/InvoiceDownload';

const OrderDetail = () => {
  const order = {
    number: 'ORD-12345678',
    date: 'October 15, 2023',
    status: 'delivered',
    items: [
      {
        name: 'Wireless Headphones',
        price: 99.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
      {
        name: 'Phone Case',
        price: 29.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
    ],
    address: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'USA',
    },
    subtotal: 129.98,
    delivery: 5.0,
    total: 134.98,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Order {order.number}</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h2 className="mb-4 text-xl font-bold">Order Status</h2>
            <OrderTimeline status={order.status} />
          </div>
          <div className="card">
            <h2 className="mb-4 text-xl font-bold">Items</h2>
            <ul className="divide-y">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-text_dim">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="card mb-6">
            <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
            <address className="not-italic">
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
              <p>{order.address.country}</p>
            </address>
          </div>
          <div className="card">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{order.subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{order.delivery}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <dt>Total</dt>
                <dd>{order.total}</dd>
              </div>
            </dl>
            <InvoiceDownload orderId="123" className="mt-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;