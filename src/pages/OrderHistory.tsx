import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const orders = [
    {
      id: '123',
      number: 'ORD-12345678',
      date: '2023-10-15',
      total: 129.99,
      status: 'delivered',
    },
    {
      id: '124',
      number: 'ORD-12345679',
      date: '2023-09-20',
      total: 89.5,
      status: 'delivered',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-bold">{order.number}</h3>
                <p className="text-text_dim">{order.date}</p>
                <p className="font-medium">{order.total}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/order/${order.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;