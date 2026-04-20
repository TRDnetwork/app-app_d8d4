import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
import orderConfirmationTemplate from '../../src/emails/order-confirmation';
import passwordResetTemplate from '../../src/emails/password-reset';
import welcomeTemplate from '../../src/emails/welcome';
import sellerApplicationReceivedTemplate from '../../src/emails/seller-application-received';

const FROM_EMAIL = 'onboarding@resend.dev';
const TO_EMAIL = 'delivered@resend.dev'; // In production, replace with actual recipient

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body;

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing email type or data' });
  }

  try {
    let htmlContent = '';
    let subject = '';

    switch (type) {
      case 'order_confirmation':
        htmlContent = orderConfirmationTemplate(data);
        subject = `Order Confirmed - ${data.orderNumber} - ShopSphere`;
        break;
      case 'password_reset':
        htmlContent = passwordResetTemplate(data);
        subject = 'Reset Your ShopSphere Password';
        break;
      case 'welcome':
        htmlContent = welcomeTemplate(data);
        subject = 'Welcome to ShopSphere!';
        break;
      case 'seller_application_received':
        htmlContent = sellerApplicationReceivedTemplate(data);
        subject = 'Seller Application Received - ShopSphere';
        break;
      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL], // In production: data.to or role-based routing
      subject,
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return res.status(500).json({ error: 'Failed to send email', details: emailResponse.error });
    }

    return res.status(200).json({ success: true, data: emailResponse.data });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}