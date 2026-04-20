import * as React from 'react';

interface OrderConfirmationEmailProps {
  order: {
    _id: string;
    created_at: string;
    items: Array<{
      quantity: number;
      product_id: { title: string };
      price_at_purchase: number;
    }>;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    total: number;
  };
}

export default function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const total = order.total.toFixed(2);
  const subtotal = order.subtotal.toFixed(2);
  const tax = order.tax.toFixed(2);
  const shipping = order.shipping_cost.toFixed(2);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1E40AF', fontSize: '28px', margin: '0' }}>ShopSphere</h1>
        <p style={{ color: '#64748B', fontSize: '16px', marginTop: '8px' }}>Your order is confirmed!</p>
      </div>

      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ color: '#0F172A', fontSize: '20px', margin: '0 0 12px 0' }}>
          Order #{order._id.toString().slice(-6).toUpperCase()}
        </h2>
        <p style={{ color: '#64748B', fontSize: '14px', margin: '0' }}>Placed on {formattedDate}</p>
      </div>

      <h3 style={{ color: '#0F172A', fontSize: '18px', margin: '24px 0 12px 0' }}>Order Summary</h3>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        {order.items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              display: 'flex',
              borderBottom: '1px solid #E2E8F0',
            }}
          >
            <div style={{ flex: 1, color: '#0F172A', fontSize: '14px' }}>
              {item.quantity} × {item.product_id.title}
            </div>
            <div style={{ color: '#0F172A', fontWeight: '600' }}>
              ${(item.price_at_purchase * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#64748B' }}>Subtotal</span>
          <span style={{ color: '#0F172A', fontWeight: '500' }}>${subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#64748B' }}>Shipping</span>
          <span style={{ color: '#0F172A', fontWeight: '500' }}>${shipping}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#64748B' }}>Tax</span>
          <span style={{ color: '#0F172A', fontWeight: '500' }}>${tax}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: '700',
            color: '#0F172A',
            marginTop: '12px',
          }}
        >
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          background: '#F8FAFC',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <h3 style={{ color: '#0F172A', fontSize: '16px', margin: '0 0 12px 0' }}>Next Steps</h3>
        <ul style={{ color: '#64748B', fontSize: '14px', margin: '0', paddingLeft: '20px' }}>
          <li>Your order is being processed</li>
          <li>You'll receive a shipping confirmation email soon</li>
          <li>
            Track your order in your{' '}
            <a href="https://shopsphere.com/orders" style={{ color: '#1E40AF' }}>
              Order History
            </a>
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748B', fontSize: '12px' }}>
        <p style={{ margin: '8px 0' }}>
          ShopSphere Inc. • 123 Commerce St, San Francisco, CA 94107
        </p>
        <p style={{ margin: '8px 0' }}>
          <a href="https://shopsphere.com" style={{ color: '#1E40AF', textDecoration: 'none' }}>
            Visit ShopSphere
          </a>{' '}
          |{' '}
          <a href="https://shopsphere.com/contact" style={{ color: '#1E40AF', textDecoration: 'none' }}>
            Contact Support
          </a>
        </p>
        <p style={{ margin: '8px 0' }}>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  );
}