export default function OrderConfirmationEmail({ userName, orderNumber, total, estimatedDelivery }) {
  return `
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
          <p>You can track your order at any time in your <a href="https://shopsphere.com/orders" style="color: #FF9900;">order history</a>.</p>
          <hr style="border: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 0.9rem; color: #94A3B8;">This is an automated message. Please do not reply directly to this email.</p>
        </td>
      </tr>
    </table>
  `;
}