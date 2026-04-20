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
    let htmlContent = '';
    let subject = '';

    switch (template) {
      case 'order-confirmation':
        subject = `Order Confirmed - ${data.orderNumber}`;
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
        subject = 'Seller Application Received';
        htmlContent = sellerApplicationReceivedTemplate(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid template' });
    }

    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const email = await resend.emails.send({
      from,
      to,
      subject,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, id: email.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}

function orderConfirmationTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Your order has been confirmed</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Order #${data.orderNumber}</h2>
        <p style="color: #94A3B8; margin: 5px 0;">Date: ${new Date(data.createdAt).toLocaleDateString()}</p>
        <p style="color: #94A3B8; margin: 5px 0;">Total: ₹${data.totalAmount.toFixed(2)}</p>
      </div>

      <h3 style="color: #F8FAFC; margin: 20px 0 12px 0;">Items in Your Order</h3>
      <div style="background-color: #1E293B; border-radius: 8px; overflow: hidden;">
        ${data.items.map((item: any) => `
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
        <p style="margin: 4px 0; color: #94A3B8;">${data.address.label}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${data.address.street}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${data.address.city}, ${data.address.state} ${data.address.zip}</p>
        <p style="margin: 4px 0; color: #94A3B8;">${data.address.country}</p>
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

function passwordResetTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Reset your account password</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94A3B8; margin: 20px 0;">We received a request to reset the password for your ShopSphere account. Click the button below to choose a new password.</p>
        
        <a href="${data.resetLink}" style="display: inline-block; background-color: #FF9900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
          Reset Password
        </a>
        
        <p style="color: #94A3B8; margin: 20px 0; font-size: 0.9rem;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Need help? <a href="https://shopsphere.local/contact" style="color: #FF9900; text-decoration: none;">Contact our support team</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}

function welcomeTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Welcome to the future of e-commerce</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Welcome, ${data.name}!</h2>
        <p style="color: #94A3B8; margin: 20px 0;">Thank you for joining ShopSphere. We're excited to have you on board.</p>
        
        <p style="color: #94A3B8; margin: 20px 0;">
          Start exploring our marketplace, save your favorite products, and enjoy a seamless shopping experience.
        </p>
        
        <a href="https://shopsphere.local/products" style="display: inline-block; background-color: #FF9900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
          Start Shopping
        </a>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Need help getting started? <a href="https://shopsphere.local/help" style="color: #FF9900; text-decoration: none;">Visit our help center</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}

function sellerApplicationReceivedTemplate(data: any) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Seller application received</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Application Received</h2>
        <p style="color: #94A3B8; margin: 20px 0;">Hello ${data.name},</p>
        <p style="color: #94A3B8; margin: 20px 0;">
          Thank you for applying to become a seller on ShopSphere. We've received your application for <strong>${data.businessName}</strong> and our team will review it shortly.
        </p>
        <p style="color: #94A3B8; margin: 20px 0;">
          You will receive another email once your application has been reviewed. The approval process typically takes 2-3 business days.
        </p>
        <p style="color: #94A3B8; margin: 20px 0;">
          In the meantime, feel free to explore our seller guidelines and best practices in our <a href="https://shopsphere.local/seller-guide" style="color: #FF9900; text-decoration: none;">Seller Resource Center</a>.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Questions about your application? <a href="https://shopsphere.local/seller-support" style="color: #FF9900; text-decoration: none;">Contact seller support</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}