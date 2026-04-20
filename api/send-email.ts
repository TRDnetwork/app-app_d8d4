import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template functions
const OrderConfirmationTemplate = ({ orderNumber, total, estimatedDelivery }: { orderNumber: string; total: number; estimatedDelivery: string }) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 8px;">Your order is confirmed</p>
    </div>
    <div style="background: #1E293B; border-radius: 8px; padding: 20px; color: #F8FAFC; margin-bottom: 20px;">
      <h2 style="margin: 0 0 15px 0; color: #F8FAFC;">Order #${orderNumber}</h2>
      <p style="margin: 5px 0;">Total: <strong>$${total.toFixed(2)}</strong></p>
      <p style="margin: 5px 0;">Estimated Delivery: <strong>${estimatedDelivery}</strong></p>
    </div>
    <p style="color: #94A3B8; font-size: 14px;">
      Thank you for shopping with ShopSphere. Your order is being processed and will be shipped soon.
    </p>
    <div style="margin-top: 30px; text-align: center; color: #94A3B8; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p>You're receiving this email because you placed an order on ShopSphere.</p>
    </div>
  </div>
`;

const PasswordResetTemplate = ({ resetLink }: { resetLink: string }) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 8px;">Reset your password</p>
    </div>
    <div style="background: #1E293B; border-radius: 8px; padding: 20px; color: #F8FAFC; margin-bottom: 20px;">
      <h2 style="margin: 0 0 15px 0; color: #F8FAFC;">Password Reset Request</h2>
      <p style="margin: 5px 0;">We received a request to reset your password. Click the button below to create a new password.</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="background: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="margin: 5px 0; font-size: 14px;">
        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
    <div style="margin-top: 30px; text-align: center; color: #94A3B8; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p>You're receiving this email because a password reset was requested for your account.</p>
    </div>
  </div>
`;

const SellerApplicationReceivedTemplate = ({ businessName }: { businessName: string }) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 8px;">Seller application received</p>
    </div>
    <div style="background: #1E293B; border-radius: 8px; padding: 20px; color: #F8FAFC; margin-bottom: 20px;">
      <h2 style="margin: 0 0 15px 0; color: #F8FAFC;">Application Received</h2>
      <p style="margin: 5px 0;">Thank you for applying to become a seller on ShopSphere, <strong>${businessName}</strong>.</p>
      <p style="margin: 5px 0;">Our team will review your application shortly. You will receive another email once your application has been approved or if we need additional information.</p>
    </div>
    <div style="margin-top: 30px; text-align: center; color: #94A3B8; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p>You're receiving this email because a seller application was submitted for your business.</p>
    </div>
  </div>
`;

const WelcomeTemplate = ({ name }: { name: string }) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 8px;">Welcome to our community</p>
    </div>
    <div style="background: #1E293B; border-radius: 8px; padding: 20px; color: #F8FAFC; margin-bottom: 20px;">
      <h2 style="margin: 0 0 15px 0; color: #F8FAFC;">Welcome, ${name}!</h2>
      <p style="margin: 5px 0;">Thank you for joining ShopSphere. We're excited to have you on board.</p>
      <p style="margin: 5px 0;">Start exploring our wide range of products and enjoy a seamless shopping experience.</p>
    </div>
    <div style="margin-top: 30px; text-align: center; color: #94A3B8; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p>You're receiving this email because you created an account on ShopSphere.</p>
    </div>
  </div>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, data } = req.body;

  if (!to || !template) {
    return res.status(400).json({ error: 'Missing required fields: to, template' });
  }

  try {
    let htmlContent = '';
    let subject = '';

    switch (template) {
      case 'order-confirmation':
        htmlContent = OrderConfirmationTemplate(data);
        subject = `Your ShopSphere Order #${data.orderNumber} is Confirmed`;
        break;
      case 'password-reset':
        htmlContent = PasswordResetTemplate(data);
        subject = 'Reset Your ShopSphere Password';
        break;
      case 'seller-application-received':
        htmlContent = SellerApplicationReceivedTemplate(data);
        subject = 'Your Seller Application Has Been Received';
        break;
      case 'welcome':
        htmlContent = WelcomeTemplate(data);
        subject = 'Welcome to ShopSphere!';
        break;
      default:
        return res.status(400).json({ error: 'Invalid template' });
    }

    const email = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent,
    });

    return res.status(200).json({ message: 'Email sent successfully', id: email.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}