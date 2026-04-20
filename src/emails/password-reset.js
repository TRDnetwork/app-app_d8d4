export default function PasswordResetEmail({ resetLink }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Source Sans Pro', sans-serif; background-color: #0F172A; color: #F8FAFC; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1E293B; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #1E40AF;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FF9900;">ShopSphere</h1>
              <p style="margin: 8px 0 0; color: #E2E8F0; font-size: 16px;">Password Reset</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; color: #F8FAFC;">Reset Your Password</h2>
              <p style="margin: 0 0 24px; color: #E2E8F0;">We received a request to reset your password. Click the button below to choose a new one.</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
              </div>
              
              <p style="margin: 0 0 8px; color: #E2E8F0;">This link will expire in 1 hour.</p>
              <p style="margin: 0; color: #94A3B8; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #0F172A; color: #94A3B8; font-size: 14px;">
              <p style="margin: 0 0 8px;">ShopSphere • Your trusted e-commerce partner</p>
              <p style="margin: 0;">
                <a href="https://shopsphere.com" style="color: #FF9900; text-decoration: none;">Visit our site</a> | 
                <a href="https://shopsphere.com/contact" style="color: #FF9900; text-decoration: none; margin: 0 8px;">Contact Support</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}