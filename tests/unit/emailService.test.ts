import { describe, it, expect, vi } from 'vitest';
import { EmailService } from '../../server/src/services/emailService';
import { Resend } from 'resend';

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'email_123' }, error: null }),
      },
    })),
  };
});

describe('EmailService', () => {
  it('sends order confirmation email successfully', async () => {
    const sendSpy = vi.spyOn(Resend.prototype.emails, 'send');
    
    await EmailService.sendOrderConfirmation('order_123');
    
    expect(sendSpy).toHaveBeenCalledWith({
      from: expect.any(String),
      to: expect.any(Array),
      subject: expect.stringContaining('Order Confirmation'),
      html: expect.stringContaining('ShopSphere'),
      text: expect.stringContaining('ShopSphere'),
    });
  });

  it('sends password reset email successfully', async () => {
    const sendSpy = vi.spyOn(Resend.prototype.emails, 'send');
    
    await EmailService.sendPasswordReset('test@example.com', 'reset_token_123');
    
    expect(sendSpy).toHaveBeenCalledWith({
      from: expect.any(String),
      to: ['test@example.com'],
      subject: 'Password Reset Request',
      html: expect.stringContaining('Password Reset'),
      text: expect.stringContaining('Password Reset'),
    });
  });

  it('sends email verification successfully', async () => {
    const sendSpy = vi.spyOn(Resend.prototype.emails, 'send');
    
    await EmailService.sendEmailVerification('test@example.com', 'verify_token_123');
    
    expect(sendSpy).toHaveBeenCalledWith({
      from: expect.any(String),
      to: ['test@example.com'],
      subject: 'Verify your email address',
      html: expect.stringContaining('Verify your email'),
      text: expect.stringContaining('Verify your email'),
    });
  });

  it('handles email sending errors gracefully', async () => {
    // Mock error response
    vi.spyOn(Resend.prototype.emails, 'send').mockResolvedValue({
      data: null,
      error: { message: 'Failed to send email' },
    });

    await expect(EmailService.sendOrderConfirmation('order_123')).rejects.toThrow();
  });
});