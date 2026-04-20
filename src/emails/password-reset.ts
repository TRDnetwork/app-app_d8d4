interface PasswordResetData {
  resetUrl: string;
  email: string;
  expiresAt: string;
}

export default function passwordResetTemplate(data: PasswordResetData): string {
  const { resetUrl, email, expiresAt } = data;

  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">
          Shop<span style="color: #1E293B;">Sphere</span>
        </h1>
        <p style="color: #94A3B8; margin-top: 10px;">Password Reset</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #F8FAFC; margin: 0 0 10px 0;">Password Reset Request</h2>
        <p style="color: #94A3B8; margin: 0;">
          We received a request to reset the password for your account (${email}).
        </p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #94A3B8; margin: 0 0 15px 0;">
          Click the button below to reset your password. This link will expire at ${expiresAt}.
        </p>
        <a href="${resetUrl}" style="background: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
          Reset Password
        </a>
      </div>

      <div style="background: #1E293B; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #94A3B8; margin: 0; font-size: 0.9rem;">
          <strong>Didn't request this?</strong> You can safely ignore this email. Your password won't change until you use the link above to create a new one.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94A3B8; font-size: 0.8rem;">
        <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p style="margin: 0;">
          This link expires in 1 hour. For security, do not share this email with anyone.
        </p>
      </div>
    </div>
  `;
}