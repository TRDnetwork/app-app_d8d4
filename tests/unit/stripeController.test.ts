import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createCheckoutSession, handleWebhook } from '../../server/src/controllers/stripeController';
import Stripe from 'stripe';

// Mock Stripe
vi.mock('stripe');

describe('Stripe Controller', () => {
  const mockRequest = {
    body: { userId: 'user123' },
    headers: { 'stripe-signature': 'test-signature' },
    raw: '{"type":"checkout.session.completed"}'
  };

  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_123';
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  describe('createCheckoutSession', () => {
    it('creates a checkout session with correct parameters', async () => {
      const mockSession = { id: 'cs_test_123' };
      (Stripe as vi.Mock).mockImplementation(() => ({
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue(mockSession)
          }
        }
      }));

      await createCheckoutSession(mockRequest as any, mockResponse as any);

      expect(mockResponse.json).toHaveBeenCalledWith({ id: 'cs_test_123' });
    });

    it('handles errors during checkout session creation', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (Stripe as vi.Mock).mockImplementation(() => ({
        checkout: {
          sessions: {
            create: vi.fn().mockRejectedValue(new Error('Stripe error'))
          }
        }
      }));

      await createCheckoutSession(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Stripe error' });
      consoleSpy.mockRestore();
    });
  });

  describe('handleWebhook', () => {
    it('verifies webhook signature and handles checkout.session.completed event', async () => {
      const mockEvent = { type: 'checkout.session.completed' };
      (Stripe as vi.Mock).mockImplementation(() => ({
        webhooks: {
          constructEvent: vi.fn().mockReturnValue(mockEvent)
        }
      }));

      await handleWebhook(mockRequest as any, mockResponse as any);

      expect(Stripe).toHaveBeenCalledWith('sk_test_123', { apiVersion: '2023-10-16' });
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });

    it('returns 400 for invalid webhook signature', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (Stripe as vi.Mock).mockImplementation(() => ({
        webhooks: {
          constructEvent: vi.fn().mockImplementation(() => {
            throw new Error('Invalid signature');
          })
        }
      }));

      await handleWebhook(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Webhook Error: Invalid signature');
      consoleSpy.mockRestore();
    });

    it('handles missing STRIPE_WEBHOOK_SECRET', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      delete process.env.STRIPE_WEBHOOK_SECRET;

      await handleWebhook(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Webhook secret not configured');
      consoleSpy.mockRestore();
    });
  });
});