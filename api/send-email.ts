import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const templates = {
  order_confirmation: (data: { orderNumber: string; total: string; items: Array<{ name: string; quantity: number }> }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation #${data.orderNumber}</h2>
      <p>Thank you for your order! We're preparing your items for shipment.</p>
      <h3>Order Summary</h3>
      <ul>
        ${data.items.map(item => `<li>${item.name} × ${item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total: ${data.total}</strong></p>
      <p>Track your order at your <a href="${process.env.FRONTEND_URL}/orders">order history</a> page.</p>
      <footer style="margin-top: 20px; color: #666; font-size: 12px;">
        <p>ShopSphere Inc.</p>
        <p>123 Commerce St, Digital City</p>
        <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> from marketing emails</p>
      </footer>
    </div>
  `,
  password_reset: (data: { resetLink: string }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to create a new password:</p>
      <p><a href="${data.resetLink}" style="background: #1E40AF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      <footer style="margin-top: 20px; color: #666; font-size: 12px;">
        <p>ShopSphere Inc.</p>
        <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> from marketing emails</p>
      </footer>
    </div>
  `,
  welcome: (data: { name: string }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ShopSphere, ${data.name}!</h2>
      <p>Thank you for joining our marketplace. Start exploring thousands of products today.</p>
      <p><a href="${process.env.FRONTEND_URL}" style="background: #FF9900; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping</a></p>
      <footer style="margin-top: 20px; color: #666; font-size: 12px;">
        <p>ShopSphere Inc.</p>
        <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> from marketing emails</p>
      </footer>
    </div>
  `,
  seller_application_received: (data: { businessName: string }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Seller Application Received</h2>
      <p>Thank you for applying to sell on ShopSphere, ${data.businessName}!</p>
      <p>Our team will review your application within 3-5 business days. We'll notify you once a decision has been made.</p>
      <p>In the meantime, you can prepare your product catalog and familiarize yourself with our <a href="${process.env.FRONTEND_URL}/seller-guidelines">Seller Guidelines</a>.</p>
      <footer style="margin-top: 20px; color: #666; font-size: 12px;">
        <p>ShopSphere Inc.</p>
        <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> from marketing emails</p>
      </footer>
    </div>
  `
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, type, data, from = 'onboarding@resend.dev' } = req.body;

  // Validate required fields
  if (!to || !type || !data) {
    return res.status(400).json({ error: 'Missing required fields: to, type, or data' });
  }

  // Validate email type
  if (!templates[type as keyof typeof templates]) {
    return res.status(400).json({ error: 'Invalid email type' });
  }

  try {
    const emailHtml = templates[type as keyof typeof templates](data);

    const email = await resend.emails.send({
      from,
      to,
      subject:
        type === 'order_confirmation' ? `Order Confirmation #${data.orderNumber}` :
        type === 'password_reset' ? 'Reset Your ShopSphere Password' :
        type === 'welcome' ? 'Welcome to ShopSphere!' :
        type === 'seller_application_received' ? 'Seller Application Received' :
        'Notification from ShopSphere',
      html: emailHtml
    });

    return res.status(200).json({ success: true, emailId: email.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
}