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
    const { to, orderNumber, customerName, items, total, estimatedDelivery } = req.body;

    // Validate required fields
    if (!to || !orderNumber || !customerName || !items || !total) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'ShopSphere <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: `Your ShopSphere Order #${orderNumber} is Confirmed!`,
      html: OrderConfirmationEmail({ 
        orderNumber, 
        customerName, 
        items, 
        total, 
        estimatedDelivery 
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

function OrderConfirmationEmail({ 
  orderNumber, 
  customerName, 
  items, 
  total, 
  estimatedDelivery 
}: { 
  orderNumber: string; 
  customerName: string; 
  items: Array<{ name: string; quantity: number; price: number }>; 
  total: number; 
  estimatedDelivery?: string;
}) {
  const formattedItems = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
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
              <h2 style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin: 0 0 1rem 0;">Order Confirmed, ${customerName}!</h2>
              <p style="color: #4b5563; line-height: 1.5; margin: 0 0 1.5rem 0;">Thank you for your order. We're preparing your items for shipment.</p>
              
              <!-- Order Info -->
              <div style="background-color: #f3f4f6; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0;">
                <table width="100%">
                  <tr>
                    <td style="padding: 8px 0;"><strong>Order Number:</strong></td>
                    <td style="padding: 8px 0; text-align: right; font-family: 'Courier New', monospace; font-size: 1.125rem; font-weight: 600;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Estimated Delivery:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${estimatedDelivery || '5-7 business days'}</td>
                  </tr>
                </table>
              </div>

              <!-- Order Items -->
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 1.5rem 0 1rem 0;">Order Summary</h3>
              <table width="100%" style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 8px 0; color: #6b7280; font-weight: 500;">Item</th>
                    <th style="text-align: center; padding: 8px 0; color: #6b7280; font-weight: 500;">Qty</th>
                    <th style="text-align: right; padding: 8px 0; color: #6b7280; font-weight: 500;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${formattedItems}
                </tbody>
              </table>

              <!-- Total -->
              <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
                <table width="100%">
                  <tr>
                    <td style="width: 80%; text-align: right; padding: 8px 0;"><strong>Total:</strong></td>
                    <td style="text-align: right; padding: 8px 0; font-size: 1.25rem; font-weight: 600;">$${total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- Next Steps -->
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 1.5rem 0 1rem 0;">Next Steps</h3>
              <ol style="color: #4b5563; padding-left: 1.25rem; margin: 0;">
                <li style="margin-bottom: 0.5rem;">You'll receive a shipping confirmation email when your order ships</li>
                <li style="margin-bottom: 0.5rem;">Track your order in your <a href="https://shopsphere.com/orders" style="color: #1e40af; text-decoration: none;">account dashboard</a></li>
                <li>Questions? <a href="https://shopsphere.com/contact" style="color: #1e40af; text-decoration: none;">Contact our support team</a></li>
              </ol>
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
              <p style="color: #6b7280; font-size: 0.75rem; margin-top: 0.5rem;">
                <a href="https://shopsphere.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from marketing emails
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}