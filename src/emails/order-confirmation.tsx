import { Order } from '@/types';

export function renderOrderConfirmationEmail(order: Order): string {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Your order has been confirmed</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Order #${order.orderNumber}</h2>
        <p style="color: #94A3B8; margin: 5px 0;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p style="color: #94A3B8; margin: 5px 0;">Total: ₹${order.totalAmount.toFixed(2)}</p>
      </div>

      <h3 style="color: #F8FAFC; margin: 20px 0 12px 0;">Items in Your Order</h3>
      <div style="background-color: #1E293B; border-radius: 8px; overflow: hidden;">
        ${order.items.map((item) => `
          <div style="padding: 16px; border-bottom: 1px solid #334155; display: flex; align-items: center;">
            <img src="${item.product.images[0]}" alt="${item.product.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 16px;" />
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: 600;">${item.product.title}</p>
              <p style="margin: 4px 0 0 0; color: #94A3B8;">Qty: ${item.quantity} × ₹${item.price.toFixed(2)}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 24px; padding: 20px; background-color: #1E293B; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; color: #F8FAFC;">Delivery Address</h3>
        <p style="margin: 4px 0; color: #94A3B8;">${order.address.label}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${order.address.street}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${order.address.city}, ${order.address.state} ${order.address.zip}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${order.address.country}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Thank you for shopping with ShopSphere. We hope you love your purchase!</p>
        <p style="margin-top: 16px;">Need help? <a href="https://shopsphere.local/contact" style="color: #FF9900; text-decoration: none;">Contact our support team</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p><a href="#" style="color: #94A3B8; text-decoration: underline;">Unsubscribe</a> from promotional emails</p>
      </div>
    </div>
  `;
}