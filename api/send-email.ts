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
    let subject = '';
    let html = '';

    switch (template) {
      case 'order-confirmation':
        subject = `Your ShopSphere Order #${data.orderNumber} is Confirmed!`;
        html = await import('../../src/emails/order-confirmation.js').then(mod => mod.default(data));
        break;
      case 'password-reset':
        subject = 'Reset Your ShopSphere Password';
        html = await import('../../src/emails/password-reset.js').then(mod => mod.default(data));
        break;
      case 'welcome':
        subject = 'Welcome to ShopSphere!';
        html = await import('../../src/emails/welcome.js').then(mod => mod.default(data));
        break;
      case 'seller-application-received':
        subject = 'Your Seller Application Has Been Received';
        html = await import('../../src/emails/seller-application-received.js').then(mod => mod.default(data));
        break;
      default:
        return res.status(400).json({ error: 'Invalid template' });
    }

    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const email = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return res.status(200).json({ message: 'Email sent', id: email.data?.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}