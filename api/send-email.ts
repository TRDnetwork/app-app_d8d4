import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
import orderConfirmationTemplate from '../../src/emails/order-confirmation';
import passwordResetTemplate from '../../src/emails/password-reset';
import welcomeTemplate from '../../src/emails/welcome';
import sellerApplicationReceivedTemplate from '../../src/emails/seller-application-received';

const FROM_EMAIL = 'onboarding@resend.dev';
const TO_EMAIL = process.env.NODE_ENV === 'production' 
  ? 'hello@shopsphere.com' 
  : 'delivered@resend.dev';

type EmailType = 'order_confirmation' | 'password_reset' | 'welcome' | 'seller_application_received';

interface EmailPayload {
  to?: string;
  type: EmailType;
  data: Record<string, any>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, type, data } = req.body as EmailPayload;

  // Validate required fields
  if (!type || !data) {
    return res.status(400).json({ error: 'Missing required fields: type, data' });
  }

  try {
    let htmlContent = '';
    let subject = '';

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmed - #${data.orderNumber}`;
        htmlContent = orderConfirmationTemplate(data);
        break;
      case 'password_reset':
        subject = 'Reset Your ShopSphere Password';
        htmlContent = passwordResetTemplate(data);
        break;
      case 'welcome':
        subject = 'Welcome to ShopSphere!';
        htmlContent = welcomeTemplate(data);
        break;
      case 'seller_application_received':
        subject = 'Seller Application Received';
        htmlContent = sellerApplicationReceivedTemplate(data);
        break;
      default:
        return res.status(400).json({ error: `Unsupported email type: ${type}` });
    }

    const emailTo = to || TO_EMAIL;

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailTo,
      subject,
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return res.status(500).json({ error: emailResponse.error.message });
    }

    return res.status(200).json({ success: true, id: emailResponse.data?.id });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}