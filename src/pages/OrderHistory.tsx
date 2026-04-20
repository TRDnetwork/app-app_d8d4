import React from 'react';
import { OrderTimeline } from '../components/order/OrderTimeline';

const OrderHistory = () => {
  const orders = [
    {
      id: 'ORD-7X8K2M9N',
      date: '2023-10-15',
      total: 259.97,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'ORD-5P3Q9R1S',
      date: '2023-09-22',
      total: 199.99,
      status: 'delivered',
      items: 1,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Order #{order.id}</h3>
                  <p className="text-text-dim">Placed on {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total}</p>
                  <p className="text-sm text-success">{order.status}</p>
                </div>
              </div>
              <p>{order.items} item(s)</p>
              <OrderTimeline status={order.status} />
              <div className="mt-4">
                <a href={`/order/${order.id}`} className="text-accent hover:underline">
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;