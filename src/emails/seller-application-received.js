export default function SellerApplicationReceivedEmail({ businessName }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Source Sans Pro', sans-serif; background-color: #0F172A; color: #F8FAFC; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1E293B; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #1E40AF;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FF9900;">ShopSphere</h1>
              <p style="margin: 8px 0 0; color: #E2E8F0; font-size: 16px;">Seller Application</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; color: #F8FAFC;">Application Received</h2>
              <p style="margin: 0 0 24px; color: #E2E8F0;">Thank you for your interest in selling on ShopSphere! We've received your application for:</p>
              
              <div style="background-color: #0F172A; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 12px; color: #FF9900; font-size: 18px;">${businessName}</h3>
                <p style="margin: 0; color: #E2E8F0;">Our team will review your application within 3-5 business days.</p>
              </div>
              
              <p style="margin: 0; color: #94A3B8; font-size: 14px;">You'll receive another email once your application has been processed. In the meantime, feel free to explore our seller resources.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #0F172A; color: #94A3B8; font-size: 14px;">
              <p style="margin: 0 0 8px;">ShopSphere • Your trusted e-commerce partner</p>
              <p style="margin: 0;">
                <a href="https://shopsphere.com/sell" style="color: #FF9900; text-decoration: none;">Seller Center</a> | 
                <a href="https://shopsphere.com/contact" style="color: #FF9900; text-decoration: none; margin: 0 8px;">Contact Support</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}