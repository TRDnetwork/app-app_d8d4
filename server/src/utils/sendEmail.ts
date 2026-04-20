import { EmailService } from '../services/emailService';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends an email using the configured email service
 * @param options - Email options including recipient, subject, and message
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // For password reset emails
    if (options.subject === 'Password Reset Request') {
      // Extract token from message (assuming it's in the resetUrl)
      const tokenMatch = options.message.match(/token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : '';
      
      await EmailService.sendPasswordReset(options.email, token);
      return;
    }
    
    // For email verification emails
    if (options.subject === 'Verify your email address') {
      // Extract token from message (assuming it's in the verificationUrl)
      const tokenMatch = options.message.match(/token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : '';
      
      await EmailService.sendEmailVerification(options.email, token);
      return;
    }
    
    // Default case - log error for unhandled email types
    console.error('Unhandled email type:', options.subject);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
```

```typescript