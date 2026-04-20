import { config } from '../config/env';

// Email templates
export const verificationEmailTemplate = (verificationUrl: string, userName: string) => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Verify Your Email</h2>
        <p>Hi ${userName},</p>
        <p>Thanks for creating an account with ShopSphere. Please verify your email address to get started.</p>
        <p><a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #0F172A; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
`;

export const passwordResetTemplate = (resetUrl: string, userName: string) => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Reset Your Password</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #0F172A; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
`;

export const orderConfirmationTemplate = (orderNumber: string, total: number, estimatedDelivery: string, userName: string) => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Order Confirmed!</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for your order. Your order <strong>#${orderNumber}</strong> has been confirmed and will be processed shortly.</p>
        <p><strong>Total: $${total}</strong></p>
        <p>Estimated delivery: <strong>${estimatedDelivery}</strong></p>
        <p>You can track your order at any time in your <a href="${config.CLIENT_URL}/orders" style="color: #FF9900;">order history</a>.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
`;

export const welcomeTemplate = (userName: string) => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Welcome to ShopSphere!</h2>
        <p>Hi ${userName},</p>
        <p>Welcome to ShopSphere, your new destination for premium shopping experiences. We're excited to have you on board.</p>
        <p>Start exploring our curated collection of products and enjoy exclusive member benefits.</p>
        <p><a href="${config.CLIENT_URL}" style="color: #FF9900;">Start Shopping</a></p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
`;

export const sellerApplicationReceivedTemplate = (userName: string, businessName: string) => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
        <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="color: #FF9900; margin-top: 0;">Seller Application Received</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for applying to become a seller on ShopSphere. We've received your application for <strong>${businessName}</strong> and it's now under review.</p>
        <p>Our team typically responds within 3-5 business days. You'll receive another email once your application has been approved or if we need additional information.</p>
        <p>In the meantime, feel free to explore our <a href="${config.CLIENT_URL}/seller-guidelines" style="color: #FF9900;">seller guidelines</a>.</p>
        <hr style="border: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
`;
// SECURITY FIX: Removed hardcoded API keys and used config object for URLs
```

```typescript