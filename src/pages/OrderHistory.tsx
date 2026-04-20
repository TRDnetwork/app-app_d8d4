import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/order/OrderCard';

export default function OrderHistory() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}