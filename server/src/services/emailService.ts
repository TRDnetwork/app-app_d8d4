import { Resend } from 'resend';
import { cleanEnv, str } from 'envalid';
import path from 'path';
import fs from 'fs';

const env = cleanEnv(process.env, {
  RESEND_API_KEY: str(),
  EMAIL_FROM: str(),
});

const resend = new Resend(env.RESEND_API_KEY);

const loadTemplate = (templateName: string, replacements: Record<string, string>) => {
  const templatePath = path.join(__dirname, '../../templates/emails', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf-8');

  Object.entries(replacements).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return html;
};

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  replacements: Record<string, string>
) => {
  try {
    const html = loadTemplate(template, replacements);

    const data = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};