import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, data } = req.body;

  if (!to || !template) {
    return res.status(400).json({ error: 'Missing required fields: to, template' });
  }

  try {
    let subject = '';
    let htmlContent = '';

    // Render template based on type
    switch (template) {
      case 'order-confirmation':
        subject = `Your ShopSphere Order #${data.orderNumber} is Confirmed!`;
        htmlContent = orderConfirmationTemplate(data);
        break;
      case 'password-reset':
        subject = 'Reset Your ShopSphere Password';
        htmlContent = passwordResetTemplate(data);
        break;
      case 'welcome':
        subject = 'Welcome to ShopSphere!';
        htmlContent = welcomeTemplate(data);
        break;
      case 'seller-application-received':
        subject = 'Your Seller Application Has Been Received';
        htmlContent = sellerApplicationReceivedTemplate(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid template' });
    }

    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const emailRes = await resend.emails.send({
      from,
      to,
      subject,
      html: htmlContent,
    });

    return res.status(200).json({ message: 'Email sent', id: emailRes.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}

// Template: Order Confirmation
function orderConfirmationTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Your order is confirmed!</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Order #${data.orderNumber}</h2>
        <p>Thank you for your purchase, <strong>${data.customerName}</strong>! Your order has been confirmed and is being processed.</p>
        <p><strong>Total: ${data.total}</strong></p>
        <p>We'll send another email when your order ships.</p>
        <hr style="border: 1px solid #334155; margin: 20px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">
          Need help? Visit our <a href="https://shopsphere.com/help" style="color: #FF9900;">Help Center</a> or reply to this email.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
        <br />
        <a href="https://shopsphere.com/unsubscribe" style="color: #EF4444;">Unsubscribe</a>
      </div>
    </div>
  `;
}

// Template: Password Reset
function passwordResetTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Secure password reset</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </div>
  `;
}

// Template: Welcome Email
function welcomeTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Welcome to the future of shopping</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Welcome, ${data.name}!</h2>
        <p>Thanks for joining ShopSphere. You now have access to millions of products, fast delivery, and exclusive deals.</p>
        <p>Start exploring today:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shopsphere.com" style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
        <br />
        <a href="https://shopsphere.com/unsubscribe" style="color: #EF4444;">Unsubscribe</a>
      </div>
    </div>
  `;
}

// Template: Seller Application Received
function sellerApplicationReceivedTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Seller application update</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Application Received</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for applying to become a seller on ShopSphere. We’ve received your application for <strong>${data.businessName}</strong> and are reviewing it.</p>
        <p>You’ll receive another email within 3-5 business days with our decision.</p>
        <p>If you have questions, reply to this email or visit our <a href="https://shopsphere.com/seller-help" style="color: #FF9900;">Seller Help Center</a>.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </div>
  `;
}