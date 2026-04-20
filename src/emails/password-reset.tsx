export function renderPasswordResetEmail(resetLink: string): string {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Reset your account password</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94A3B8; margin: 20px 0;">We received a request to reset the password for your ShopSphere account. Click the button below to choose a new password.</p>
        
        <a href="${resetLink}" style="display: inline-block; background-color: #FF9900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
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