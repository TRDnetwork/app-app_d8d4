export default function PasswordResetEmail({ resetLink }) {
  return `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #1E293B; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 24px; background-color: #1E40AF; text-align: center;">
          <h1 style="margin: 0; font-size: 2rem; color: #fff;">ShopSphere</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #FF9900; margin-top: 0;">Reset Your Password</h2>
          <p>Hi there,</p>
          <p>We received a request to reset your password. Click the button below to choose a new one.</p>
          <p><a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #0F172A; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
        </td>
      </tr>
    </table>
  `;
}