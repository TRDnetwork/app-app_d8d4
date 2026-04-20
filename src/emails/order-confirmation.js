export default function OrderConfirmationEmail({ userName, orderNumber, totalAmount, items }) {
  const formattedItems = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">×${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Source Sans Pro', sans-serif; background-color: #0F172A; color: #F8FAFC; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1E293B; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #1E40AF;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FF9900;">ShopSphere</h1>
              <p style="margin: 8px 0 0; color: #E2E8F0; font-size: 16px;">Order Confirmation</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; color: #F8FAFC;">Hi ${userName},</h2>
              <p style="margin: 0 0 24px; color: #E2E8F0;">Thank you for your order! We're preparing your items for shipment.</p>
              
              <table style="width: 100%; margin: 24px 0; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background-color: #0F172A; border-radius: 6px;">
                    <strong style="color: #FF9900;">Order Number</strong><br>
                    <span style="color: #F8FAFC; font-size: 18px; font-family: monospace;">${orderNumber}</span>
                  </td>
                  <td style="padding: 12px; background-color: #0F172A; border-radius: 6px;">
                    <strong style="color: #FF9900;">Total Amount</strong><br>
                    <span style="color: #F8FAFC; font-size: 18px;">$${totalAmount.toFixed(2)}</span>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 24px 0 12px; font-size: 18px; color: #F8FAFC;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #0F172A;">
                    <th style="padding: 12px; text-align: left; color: #94A3B8;">Item</th>
                    <th style="padding: 12px; text-align: right; color: #94A3B8;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #94A3B8;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${formattedItems}
                </tbody>
              </table>
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