export default function passwordResetTemplate({ resetLink, email }) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #FF9900; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Secure password reset</p>
      </div>

      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #F8FAFC;">Password Reset Request</h2>
        <p style="color: #94A3B8; line-height: 1.6;">
          We received a request to reset the password for your account (${email}). 
          If you didn't make this request, you can safely ignore this email.
        </p>
      </div>

      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <p style="color: #94A3B8; margin: 0 0 16px 0;">Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #FF9900; color: #0F172A; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #94A3B8; margin: 16px 0 0 0; font-size: 0.9rem;">
          This link expires in 1 hour for security reasons.
        </p>
      </div>

      <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; color: #F8FAFC;">Security Tip</h3>
        <p style="color: #94A3B8; font-size: 0.9rem; margin: 0;">
          Never share your password reset link with anyone. ShopSphere will never ask for your password via email.
        </p>
      </div>

      <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
        <p style="margin: 0 0 8px 0;">ShopSphere • Premium E-Commerce Experience</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}