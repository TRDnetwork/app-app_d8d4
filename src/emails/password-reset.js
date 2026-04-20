/**
 * Password Reset Email Template
 * Sent when user requests password reset
 */
export default function PasswordResetEmail(data) {
  const { resetLink } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Reset Your Password</title>
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
          .instructions {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #ff9900;
            color: #0f172a;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
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
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>

            <div class="instructions">
              To reset your password, click the button below. This link will expire in 1 hour.
            </div>

            <a href="${resetLink}" class="button">Reset Password</a>

            <p>For security reasons, please do not share this link with anyone.</p>
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