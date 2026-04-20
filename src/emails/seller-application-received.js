export default function SellerApplicationReceivedEmail({ userName, businessName }) {
  return `
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
          <p>In the meantime, feel free to explore our <a href="https://shopsphere.com/seller-guidelines" style="color: #FF9900;">seller guidelines</a>.</p>
          <hr style="border: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
        </td>
      </tr>
    </table>
  `;
}