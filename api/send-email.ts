import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Define allowed template types
type TemplateType = 'order_confirmation' | 'password_reset' | 'welcome' | 'seller_application_received';

// Template renderer map
const renderTemplate = {
  order_confirmation: (data: any) => `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Order Confirmed!</h2>
        <p>Hi ${data.userName},</p>
        <p>Thank you for your order. Your order <strong>#${data.orderNumber}</strong> has been confirmed and will be processed shortly.</p>
        <p><strong>Total: $${data.total}</strong></p>
        <p>Estimated delivery: <strong>${data.estimatedDelivery}</strong></p>
        <p>You can track your order at any time in your <a href="https://shopsphere.com/orders" style="color: #FF9900;">order history</a>.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>`,

  password_reset: (data: any) => `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Reset Your Password</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <p><a href="${data.resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #0F172A; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>`,

  welcome: (data: any) => `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Welcome to ShopSphere!</h2>
        <p>Hi ${data.userName},</p>
        <p>Welcome to ShopSphere, your new destination for premium shopping experiences. We're excited to have you on board.</p>
        <p>Start exploring our curated collection of products and enjoy exclusive member benefits.</p>
        <p><a href="https://shopsphere.com" style="color: #FF9900;">Start Shopping</a></p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>`,

  seller_application_received: (data: any) => `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Seller Application Received</h2>
        <p>Hi ${data.userName},</p>
        <p>Thank you for applying to become a seller on ShopSphere. We've received your application for <strong>${data.businessName}</strong> and it's now under review.</p>
        <p>Our team typically responds within 3-5 business days. You'll receive another email once your application has been approved or if we need additional information.</p>
        <p>In the meantime, feel free to explore our <a href="https://shopsphere.com/seller-guidelines" style="color: #FF9900;">seller guidelines</a>.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>`
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, type, data } = req.body;

  // Validate required fields
  if (!to || !type || !data) {
    return res.status(400).json({ error: 'Missing required fields: to, type, data' });
  }

  // Validate template type
  if (!Object.keys(renderTemplate).includes(type)) {
    return res.status(400).json({ error: 'Invalid template type' });
  }

  try {
    const renderedHtml = renderTemplate[type as TemplateType](data);

    const email = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject:
        type === 'order_confirmation' ? 'Your ShopSphere Order Has Been Confirmed' :
        type === 'password_reset' ? 'Reset Your ShopSphere Password' :
        type === 'welcome' ? 'Welcome to ShopSphere!' :
        type === 'seller_application_received' ? 'Seller Application Received' :
        'Notification from ShopSphere',
      html: renderedHtml,
    });

    if (email.error) {
      console.error('Resend error:', email.error);
      return res.status(500).json({ error: email.error.message });
    }

    return res.status(200).json({ success: true, id: email.data?.id });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}