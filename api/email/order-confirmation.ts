import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, order } = req.body;

  if (!to || !order) {
    return res.status(400).json({ error: 'Missing required fields: to, order' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()}`,
      html: OrderConfirmationEmail({ order }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}

function OrderConfirmationEmail({ order }: { order: any }) {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const total = order.total.toFixed(2);
  const subtotal = order.subtotal.toFixed(2);
  const tax = order.tax.toFixed(2);
  const shipping = order.shipping_cost.toFixed(2);

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1E40AF; font-size: 28px; margin: 0;">ShopSphere</h1>
        <p style="color: #64748B; font-size: 16px; margin-top: 8px;">Your order is confirmed!</p>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 12px 0;">Order #${order._id.toString().slice(-6).toUpperCase()}</h2>
        <p style="color: #64748B; font-size: 14px; margin: 0;">Placed on ${formattedDate}</p>
      </div>

      <h3 style="color: #0F172A; font-size: 18px; margin: 24px 0 12px 0;">Order Summary</h3>
      <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
        ${order.items
          .map(
            (item: any) => `
          <div style="padding: 16px; display: flex; border-bottom: 1px solid #E2E8F0;">
            <div style="flex: 1; color: #0F172A; font-size: 14px;">${item.quantity} × ${item.product_id.title}</div>
            <div style="color: #0F172A; font-weight: 600;">$${(item.price_at_purchase * item.quantity).toFixed(2)}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <div style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B;">Subtotal</span>
          <span style="color: #0F172A; font-weight: 500;">$${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B;">Shipping</span>
          <span style="color: #0F172A; font-weight: 500;">$${shipping}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748B;">Tax</span>
          <span style="color: #0F172A; font-weight: 500;">$${tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 12px;">
          <span>Total</span>
          <span>$${total}</span>
        </div>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
        <h3 style="color: #0F172A; font-size: 16px; margin: 0 0 12px 0;">Next Steps</h3>
        <ul style="color: #64748B; font-size: 14px; margin: 0; padding-left: 20px;">
          <li>Your order is being processed</li>
          <li>You'll receive a shipping confirmation email soon</li>
          <li>Track your order in your <a href="https://shopsphere.com/orders" style="color: #1E40AF;">Order History</a></li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #64748B; font-size: 12px;">
        <p style="margin: 8px 0;">ShopSphere Inc. • 123 Commerce St, San Francisco, CA 94107</p>
        <p style="margin: 8px 0;">
          <a href="https://shopsphere.com" style="color: #1E40AF; text-decoration: none;">Visit ShopSphere</a> | 
          <a href="https://shopsphere.com/contact" style="color: #1E40AF; text-decoration: none;">Contact Support</a>
        </p>
        <p style="margin: 8px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}