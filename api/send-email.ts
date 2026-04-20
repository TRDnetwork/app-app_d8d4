import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const templates = {
  'order-confirmation': (data: any) => `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1E293B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FF9900; margin: 0; font-size: 28px;">ShopSphere</h1>
        <p style="color: #94A3B8; margin: 10px 0 0;">Your order is confirmed!</p>
      </div>
      <div style="background-color: #0F172A; padding: 30px; border: 1px solid #334155; border-radius: 0 0 8px 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Order #${data.orderNumber}</h2>
        <p style="color: #94A3B8; line-height: 1.6;">Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #1E293B; border-radius: 6px;">
          <p style="color: #F8FAFC; margin: 5px 0;"><strong>Order Total:</strong> ₹${data.totalAmount.toFixed(2)}</p>
          <p style="color: #94A3B8; margin: 5px 0; font-size: 14px;">Placed on: ${new Date().toLocaleDateString()}</p>
        </div>

        <p style="color: #94A3B8; line-height: 1.6;">You can track your order status in your ShopSphere account.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/orders" style="background-color: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Track Your Order</a>
        </div>

        <p style="color: #94A3B8; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
          Need help? <a href="mailto:support@shopsphere.com" style="color: #FF9900; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    </div>
  `,
  'password-reset': (data: any) => `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1E293B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FF9900; margin: 0; font-size: 28px;">ShopSphere</h1>
        <p style="color: #94A3B8; margin: 10px 0 0;">Reset your password</p>
      </div>
      <div style="background-color: #0F172A; padding: 30px; border: 1px solid #334155; border-radius: 0 0 8px 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94A3B8; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.token}" style="background-color: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>

        <p style="color: #94A3B8; line-height: 1.6;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        
        <p style="color: #94A3B8; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
          Need help? <a href="mailto:support@shopsphere.com" style="color: #FF9900; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    </div>
  `,
  'welcome': (data: any) => `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1E293B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FF9900; margin: 0; font-size: 28px;">ShopSphere</h1>
        <p style="color: #94A3B8; margin: 10px 0 0;">Welcome to our community!</p>
      </div>
      <div style="background-color: #0F172A; padding: 30px; border: 1px solid #334155; border-radius: 0 0 8px 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Welcome, ${data.name}!</h2>
        <p style="color: #94A3B8; line-height: 1.6;">Thank you for joining ShopSphere. We're excited to have you on board.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #1E293B; border-radius: 6px;">
          <p style="color: #F8FAFC; margin: 5px 0;"><strong>Account Email:</strong> ${data.email}</p>
          <p style="color: #94A3B8; margin: 5px 0; font-size: 14px;">Joined: ${new Date().toLocaleDateString()}</p>
        </div>

        <p style="color: #94A3B8; line-height: 1.6;">Start exploring our wide range of products and enjoy a seamless shopping experience.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL}" style="background-color: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Start Shopping</a>
        </div>

        <p style="color: #94A3B8; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
          Need help getting started? <a href="mailto:support@shopsphere.com" style="color: #FF9900; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    </div>
  `,
  'seller-application-received': (data: any) => `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1E293B; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FF9900; margin: 0; font-size: 28px;">ShopSphere</h1>
        <p style="color: #94A3B8; margin: 10px 0 0;">Seller Application</p>
      </div>
      <div style="background-color: #0F172A; padding: 30px; border: 1px solid #334155; border-radius: 0 0 8px 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Application Received</h2>
        <p style="color: #94A3B8; line-height: 1.6;">Thank you for your interest in becoming a seller on ShopSphere. We've received your application and will review it shortly.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #1E293B; border-radius: 6px;">
          <p style="color: #F8FAFC; margin: 5px 0;"><strong>Business Name:</strong> ${data.businessName}</p>
          <p style="color: #94A3B8; margin: 5px 0; font-size: 14px;">Application ID: ${data.applicationId}</p>
          <p style="color: #94A3B8; margin: 5px 0; font-size: 14px;">Submitted: ${new Date().toLocaleDateString()}</p>
        </div>

        <p style="color: #94A3B8; line-height: 1.6;">Our team typically reviews applications within 3-5 business days. You'll receive another email once your application has been processed.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/seller/dashboard" style="background-color: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View Application Status</a>
        </div>

        <p style="color: #94A3B8; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
          Questions about your application? <a href="mailto:sellers@shopsphere.com" style="color: #FF9900; text-decoration: none;">Contact our seller support team</a>
        </p>
      </div>
    </div>
  `
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, data } = req.body;

  // Validate required fields
  if (!to || !template || !data) {
    return res.status(400).json({ error: 'Missing required fields: to, template, or data' });
  }

  // Validate template name
  if (!templates[template as keyof typeof templates]) {
    return res.status(400).json({ error: `Invalid template: ${template}` });
  }

  try {
    const emailHtml = templates[template as keyof typeof templates](data);

    const email = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: {
        'order-confirmation': `Your ShopSphere Order #${data.orderNumber} is Confirmed`,
        'password-reset': 'Reset Your ShopSphere Password',
        'welcome': 'Welcome to ShopSphere!',
        'seller-application-received': 'Your Seller Application Has Been Received'
      }[template] || 'ShopSphere Notification',
      html: emailHtml,
    });

    if (email.error) {
      console.error('Resend error:', email.error);
      return res.status(500).json({ error: 'Failed to send email', details: email.error });
    }

    return res.status(200).json({ success: true, messageId: email.data?.id });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}