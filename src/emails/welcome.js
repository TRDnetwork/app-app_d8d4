export default function WelcomeEmail({ userName }) {
  return `
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
          <p><a href="https://shopsphere.com" style="color: #FF9900;">Start Shopping</a></p>
          <hr style="border: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
        </td>
      </tr>
    </table>
  `;
}