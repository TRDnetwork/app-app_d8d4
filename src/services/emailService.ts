// Mock email service for demonstration
// In production, this would use a real email service like SendGrid, Mailgun, etc.

interface EmailOptions {
  to: string;
  template: string;
  data: Record<string, any>;
}

/**
 * Email service for sending billing-related emails
 */
class EmailService {
  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    console.log(`Sending email to ${options.to} with template ${options.template}`);
    console.log('Data:', options.data);
    
    // In production, integrate with a real email service
    // For example:
    // await sendgrid.send({
    //   to: options.to,
    //   from: 'billing@fitnessapp.com',
    //   templateId: this.getTemplateId(options.template),
    //   dynamicTemplateData: options.data,
    // });
  }

  /**
   * Get template ID for a template name
   */
  private getTemplateId(template: string): string {
    const templates: Record<string, string> = {
      'trial_started': 'd-trial-started',
      'trial_expiring': 'd-trial-expiring',
      'trial_ended': 'd-trial-ended',
      'trial_extended': 'd-trial-extended',
      'subscription_cancelled': 'd-subscription-cancelled',
      'invoice_paid': 'd-invoice-paid',
      'usage_alert': 'd-usage-alert',
    };
    
    return templates[template] || '';
  }
}

export default new EmailService();
```

```typescript