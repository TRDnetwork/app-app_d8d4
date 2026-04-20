export default function WelcomeEmail({ userName }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ShopSphere</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Source Sans Pro', sans-serif; background-color: #0F172A; color: #F8FAFC; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1E293B; border: 1px solid #334155; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #1E40AF;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FF9900;">ShopSphere</h1>
              <p style="margin: 8px 0 0; color: #E2E8F0; font-size: 16px;">Welcome Aboard</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; color: #F8FAFC;">Welcome, ${userName}!</h2>
              <p style="margin: 0 0 24px; color: #E2E8F0;">We're thrilled to have you join ShopSphere. Your journey to smarter shopping starts now.</p>
              
              <div style="background-color: #0F172A; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
                <h3 style="margin: 0 0 12px; color: #FF9900; font-size: 18px;">Get Started</h3>
                <p style="margin: 0; color: #E2E8F0;">Browse our curated collection, save your favorites, and enjoy fast, secure delivery.</p>
              </div>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://shopsphere.com/products" style="display: inline-block; padding: 12px 24px; background-color: #FF9900; color: #000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Start Shopping</a>
              </div>
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