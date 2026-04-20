import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, token, userName } = req.body;

    if (!to || !token || !userName) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: 'Reset Your ShopSphere Password',
      html: PasswordResetEmail({ 
        userName, 
        resetLink 
      })
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: error 
      });
    }

    res.status(200).json({ 
      success: true, 
      data 
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

function PasswordResetEmail({ 
  userName, 
  resetLink 
}: { 
  userName: string; 
  resetLink: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f9fafb; color: #1f2937;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 2rem 2rem 1rem; text-align: center; background-color: #fff;">
              <h1 style="color: #1e40af; font-size: 1.875rem; font-weight: bold; margin: 0;">ShopSphere</h1>
              <p style="color: #6b7280; margin-top: 0.5rem;">Premium E-Commerce Marketplace</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <h2 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin: 0 0 1rem 0;">Hi ${userName},</h2>
              <p style="color: #4b5563; line-height: 1.5; margin: 0 0 1.5rem 0;">We received a request to reset your password. Click the button below to create a new password.</p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${resetLink}" style="background-color: #1e40af; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.375rem; font-weight: 500; display: inline-block;">Reset Password</a>
              </div>

              <p style="color: #4b5563; line-height: 1.5; margin: 0 0 1rem 0;">This link will expire in 1 hour for security reasons.</p>
              <p style="color: #4b5563; line-height: 1.5; margin: 0;">If you didn't request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 2rem; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1rem 0;">
                ShopSphere<br>
                123 Commerce Street, San Francisco, CA 94107
              </p>
              <p style="color: #6b7280; font-size: 0.75rem; margin: 0;">
                © ${new Date().getFullYear()} ShopSphere. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}