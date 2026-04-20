/**
 * Seller Application Received Email Template
 * Sent to user after submitting seller application
 */
export default function SellerApplicationReceivedEmail(data) {
  const { businessName } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Seller Application Received</title>
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
          .info {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .status {
            background-color: #fffbeb;
            border: 1px solid #fcd34d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
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
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ShopSphere</h1>
          </div>
          <div class="content">
            <h1>Thank You for Your Seller Application</h1>
            <p>We've received your application to sell on ShopSphere under the business name: <strong>${businessName}</strong>.</p>

            <div class="info">
              <strong>Application ID:</strong> SELL-${Date.now()}<br/>
              <strong>Date Submitted:</strong> ${new Date().toLocaleDateString()}
            </div>

            <div class="status">
              <strong>Next Steps:</strong><br/>
              Our team will review your application within 3-5 business days. We may contact you for additional information if needed.
            </div>

            <p>You'll receive another email once your application has been approved or if we need more details.</p>
            <p>Thanks for choosing ShopSphere as your selling platform!</p>
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