/**
 * Welcome Email Template
 * Sent to new users after registration
 */
export default function WelcomeEmail(data) {
  const { customerName } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome to ShopSphere</title>
        <style>
          body {
            font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #0f172a;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1e293b;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Playfair Display', Georgia, serif;
            color: #ff9900;
            margin: 0;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
          }
          h1 {
            font-size: 24px;
            margin-top: 0;
            color: #1e40af;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background-color: #ff9900;
            color: #0f172a;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          }
          .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
          }
          .feature {
            text-align: center;
            padding: 15px;
            background-color: #f1f5f9;
            border-radius: 8px;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .footer a {
            color: #1e40af;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container {
              margin: 15px;
            }
            .content {
              padding: 20px;
            }
            .features {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ShopSphere</h1>
          </div>
          <div class="content">
            <h1>Welcome to ShopSphere!</h1>
            <p class="greeting">Hi ${customerName},</p>
            <p>Thanks for joining us! We're excited to have you on board.</p>

            <p>Your account is now active, and you can start shopping, saving favorites, and earning loyalty points.</p>

            <div class="features">
              <div class="feature">
                <strong>Fast Delivery</strong>
                <p>Get your orders in 3-5 days</p>
              </div>
              <div class="feature">
                <strong>Easy Returns</strong>
                <p>30-day return policy</p>
              </div>
              <div class="feature">
                <strong>Loyalty Program</strong>
                <p>Earn points on every purchase</p>
              </div>
              <div class="feature">
                <strong>24/7 Support</strong>
                <p>We're always here to help</p>
              </div>
            </div>

            <div class="cta">
              <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
            </div>

            <p>Thanks again for choosing ShopSphere!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/contact">Contact Us</a> | 
              <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a> | 
              <a href="${process.env.FRONTEND_URL}/terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}