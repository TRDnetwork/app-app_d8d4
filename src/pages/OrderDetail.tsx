import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { InvoiceDownload } from '../components/order/InvoiceDownload';
import { useOrder } from '../hooks/useOrder';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id!);

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order #{order.order_number}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OrderTimeline status={order.status} />
        </div>
        <div>
          <InvoiceDownload orderId={order._id} />
        </div>
      </div>
    </div>
  );
}