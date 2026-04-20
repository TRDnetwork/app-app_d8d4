/**
 * Password Reset Email Template
 * Sent to user when they request a password reset
 */
export const passwordResetTemplate = (data: {
  resetLink: string;
  email: string;
  expiresInHours: number;
}) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #F8FAFC; background-color: #0F172A;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 10px;">Reset your password</p>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px;">
      <h2 style="color: #FF9900; margin-top: 0; margin-bottom: 16px; font-size: 1.5rem;">Password Reset Request</h2>
      <p style="margin-bottom: 16px; line-height: 1.6;">We received a request to reset your password for the email address <strong>${data.email}</strong>.</p>
      
      <p style="margin-bottom: 24px; line-height: 1.6;">Click the button below to create a new password. This link will expire in ${data.expiresInHours} hours.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a 
          href="${data.resetLink}" 
          style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"
        >
          Reset Password
        </a>
      </div>

      <p style="margin-bottom: 16px; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      
      <div style="margin-top: 24px; padding: 16px; background-color: #0F172A; border-radius: 6px;">
        <p style="margin: 8px 0; color: #94A3B8; font-size: 0.9rem;">
          <strong>Security Tip:</strong> Never share your password reset link with anyone. ShopSphere will never ask for your password via email.
        </p>
      </div>
    </div>

    <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="margin: 8px 0;">This is an automated message, please do not reply.</p>
      <p style="margin: 8px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p style="margin: 8px 0;">
        <a href="https://shopsphere.com" style="color: #FF9900; text-decoration: none;">Visit our website</a> | 
        <a href="https://shopsphere.com/help" style="color: #FF9900; text-decoration: none; margin-left: 8px;">Help Center</a>
      </p>
    </div>
  </div>
`;