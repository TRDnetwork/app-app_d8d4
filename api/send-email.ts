import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, data } = req.body;

  if (!to || !template) {
    return res.status(400).json({ error: 'Missing required fields: to, template' });
  }

  try {
    let htmlContent = '';
    let subject = '';

    switch (template) {
      case 'order-confirmation':
        subject = `Your Order #${data.orderNumber} is Confirmed - ShopSphere`;
        htmlContent = await import('../../src/emails/order-confirmation.js').then(mod =>
          mod.default(data)
        );
        break;
      case 'password-reset':
        subject = 'Reset Your ShopSphere Password';
        htmlContent = await import('../../src/emails/password-reset.js').then(mod =>
          mod.default(data)
        );
        break;
      case 'welcome':
        subject = 'Welcome to ShopSphere!';
        htmlContent = await import('../../src/emails/welcome.js').then(mod =>
          mod.default(data)
        );
        break;
      case 'seller-application-received':
        subject = 'Your Seller Application Has Been Received';
        htmlContent = await import('../../src/emails/seller-application-received.js').then(mod =>
          mod.default(data)
        );
        break;
      default:
        return res.status(400).json({ error: 'Invalid template' });
    }

    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const email = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, id: email.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
    });
  }
}