import { Order } from '@/types';

interface OrderConfirmationEmailProps {
  order: Order;
}

export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 28px; margin: 0;">ShopSphere</h1>
        <p style="color: #64748B; font-size: 14px;">Your order has been confirmed</p>
      </div>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 15px 0;">Order #${order.id}</h2>
        <p style="color: #64748B; font-size: 14px; margin: 0 0 5px 0;">Placed on ${new Date(order.date).toLocaleDateString()}</p>
        <p style="color: #64748B; font-size: 14px; margin: 0;">Status: <strong style="color: #1E40AF;">${order.status}</strong></p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0F172A; font-size: 16px; margin: 0 0 10px 0;">Order Summary</h3>
        ${order.items.map(item => `
          <div style="display: flex; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />
            <div style="flex: 1;">
              <p style="color: #0F172A; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">${item.name}</p>
              <p style="color: #64748B; font-size: 12px; margin: 0;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <p style="color: #0F172A; font-size: 14px; font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `).join('')}
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B; font-size: 14px;">Subtotal</span>
          <span style="color: #0F172A; font-size: 14px;">$${order.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B; font-size: 14px;">Shipping</span>
          <span style="color: #0F172A; font-size: 14px;">$${order.shipping.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B; font-size: 14px;">Tax</span>
          <span style="color: #0F172A; font-size: 14px;">$${order.tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #E2E8F0; padding-top: 8px;">
          <span style="color: #0F172A; font-size: 16px;">Total</span>
          <span style="color: #0F172A; font-size: 16px;">$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #64748B; font-size: 14px; margin: 0;">Thank you for shopping with ShopSphere!</p>
      </div>

      <div style="text-align: center; color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <p style="margin: 0;">ShopSphere Inc. • 123 Commerce St, San Francisco, CA 94107</p>
        <p style="margin: 10px 0 0 0;">
          <a href="#" style="color: #1E40AF; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
          <a href="#" style="color: #1E40AF; text-decoration: none; margin: 0 10px;">Terms of Service</a> | 
          <a href="#" style="color: #1E40AF; text-decoration: none; margin: 0 10px;">Contact Us</a>
        </p>
      </div>
    </div>
  `;
}