import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { formatCurrency } from '../lib/formatters';
import { formatDate } from '../lib/formatters';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth('/api/orders');
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-text-dim">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Order #<span className="text-accent">{order.order_number}</span>
                </h3>
                <p className="text-text-dim">{formatDate(order.created_at)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-success text-success-foreground' :
                order.status === 'cancelled' ? 'bg-destructive text-destructive-foreground' :
                'bg-warning text-warning-foreground'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span>{order.items.length} items</span>
              <span>•</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <Button asChild size="sm" variant="secondary">
              <a href={`/order/${order._id}`}>