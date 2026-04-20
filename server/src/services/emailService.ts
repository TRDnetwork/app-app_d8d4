import { Resend } from 'resend';

// Initialize Resend with environment variable
const resend = new Resend(process.env.RESEND_API_KEY); // SECURITY FIX: Use environment variable

// Email templates
const templates = {
  orderConfirmation: (orderId: string, orderDate: string, items: Array<{name: string, price: number, quantity: number}>, total: number) => `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 28px; margin: 0;">ShopSphere</h1>
        <p style="color: #64748B; font-size: 14px;">Your order has been confirmed</p>
      </div>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 15px 0;">Order #${orderId}</h2>
        <p style="color: #64748B; font-size: 14px; margin: 0 0 5px 0;">Placed on ${orderDate}</p>
        <p style="color: #64748B; font-size: 14px; margin: 0;">Status: <strong style="color: #1E40AF;">Confirmed</strong></p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0F172A; font-size: 16px; margin: 0 0 10px 0;">Order Summary</h3>
        ${items.map(item => `
          <div style="display: flex; padding: 10px 0; border-bottom: 1px solid #E2E8F0;">
            <div style="flex: 1;">
              <p style="color: #0F172A; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">${item.name}</p>
              <p style="color: #64748B; font-size: 12px; margin: 0;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <p style="color: #0F172A; font-size: 14px; font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `).join('')}
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #E2E8F0; padding-top: 8px;">
          <span style="color: #0F172A; font-size: 16px;">Total</span>
          <span style="color: #0F172A; font-size: 16px;">$${total.toFixed(2)}</span>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <p style="color: #64748B; font-size: 14px; margin: 0;">Thank you for shopping with ShopSphere!</p>
      </div>
    </div>
  `,
  
  passwordReset: (resetUrl: string) => `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 28px; margin: 0;">ShopSphere</h1>
        <p style="color: #64748B; font-size: 14px;">Password Reset Request</p>
      </div>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 15px 0;">Password Reset</h2>
        <p style="color: #64748B; font-size: 14px; margin: 0;">You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #FF9900; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 15px 0;">Reset Password</a>
        <p style="color: #64748B; font-size: 14px; margin: 0;">This link expires in 10 minutes.</p>
      </div>

      <div style="text-align: center; color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <p style="margin: 0;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `,

  emailVerification: (verificationUrl: string) => `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 28px; margin: 0;">ShopSphere</h1>
        <p style="color: #64748B; font-size: 14px;">Verify Your Email Address</p>
      </div>
      
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 15px 0;">Welcome to ShopSphere!</h2>
        <p style="color: #64748B; font-size: 14px; margin: 0;">Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #FF9900; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 15px 0;">Verify Email</a>
        <p style="color: #64748B; font-size: 14px; margin: 0;">This link expires in 24 hours.</p>
      </div>

      <div style="text-align: center; color: #64748B; font-size: 12px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <p style="margin: 0;">If you didn't create an account, please ignore this email.</p>
      </div>
    </div>
  `
};

class EmailService {
  /**
   * Sends order confirmation email
   * @param orderId - The order ID
   * @param email - Recipient email address
   * @param orderDate - Date the order was placed
   * @param items - Array of order items
   * @param total - Total order amount
   */
  static async sendOrderConfirmation(
    orderId: string, 
    email: string, 
    orderDate: string,
    items: Array<{name: string, price: number, quantity: number}>,
    total: number
  ): Promise<void> {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ShopSphere <onboarding@resend.dev>', // SECURITY FIX: Use environment variable
        to: [email],
        subject: `Order Confirmation #${orderId}`,
        html: templates.orderConfirmation(orderId, orderDate, items, total),
      });

      if (error) {
        console.error('Error sending order confirmation email:', error);
        throw new Error(error.message);
      }

      console.log('Order confirmation email sent successfully:', data);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Sends password reset email
   * @param email - Recipient email address
   * @param token - Password reset token
   */
  static async sendPasswordReset(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`; // SECURITY FIX: Use environment variable
      
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ShopSphere <onboarding@resend.dev>', // SECURITY FIX: Use environment variable
        to: [email],
        subject: 'Password Reset Request',
        html: templates.passwordReset(resetUrl),
      });

      if (error) {
        console.error('Error sending password reset email:', error);
        throw new Error(error.message);
      }

      console.log('Password reset email sent successfully:', data);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  /**
   * Sends email verification email
   * @param email - Recipient email address
   * @param token - Verification token
   */
  static async sendEmailVerification(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`; // SECURITY FIX: Use environment variable
      
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ShopSphere <onboarding@resend.dev>', // SECURITY FIX: Use environment variable
        to: [email],
        subject: 'Verify your email address',
        html: templates.emailVerification(verificationUrl),
      });

      if (error) {
        console.error('Error sending email verification:', error);
        throw new Error(error.message);
      }

      console.log('Email verification sent successfully:', data);
    } catch (error) {
      console.error('Failed to send email verification:', error);
      throw error;
    }
  }
}

export default EmailService;
```

```typescript
// SECURITY FIX: Use environment variables for Stripe keys