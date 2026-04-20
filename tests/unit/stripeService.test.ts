import { describe, it, expect, vi } from 'vitest';
import { StripeService } from '../../server/src/services/stripeService';
import Stripe from 'stripe';

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      paymentIntents: {
        create: vi.fn().mockResolvedValue({
          id: 'pi_123',
          client_secret: 'cs_123',
          amount: 1000,
          currency: 'usd',
        }),
        confirm: vi.fn().mockResolvedValue({
          id: 'pi_123',
          status: 'succeeded',
        }),
        retrieve: vi.fn().mockResolvedValue({
          id: 'pi_123',
          status: 'succeeded',
        }),
      },
      refunds: {
        create: vi.fn().mockResolvedValue({
          id: 're_123',
          status: 'succeeded',
        }),
      },
      customers: {
        retrieve: vi.fn().mockResolvedValue({
          id: 'cus_123',
        }),
        create: vi.fn().mockResolvedValue({
          id: 'cus_123',
        }),
      },
      setupIntents: {
        create: vi.fn().mockResolvedValue({
          id: 'seti_123',
          client_secret: 'seti_123_secret',
        }),
      },
      paymentMethods: {
        list: vi.fn().mockResolvedValue({
          data: [],
        }),
      },
    })),
  };
});

describe('StripeService', () => {
  it('creates payment intent successfully', async () => {
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: 10.99,
      currency: 'usd',
      orderId: 'order_123',
      customerId: 'user_123',
    });

    expect(paymentIntent.id).toBe('pi_123');
    expect(paymentIntent.client_secret).toBe('cs_123');
    expect(paymentIntent.amount).toBe(1099); // 10.99 * 100 cents
    expect(paymentIntent.currency).toBe('usd');
  });

  it('confirms payment intent successfully', async () => {
    const paymentIntent = await StripeService.confirmPaymentIntent('pi_123');
    
    expect(paymentIntent.id).toBe('pi_123');
    expect(paymentIntent.status).toBe('succeeded');
  });

  it('retrieves payment intent successfully', async () => {
    const paymentIntent = await StripeService.getPaymentIntent('pi_123');
    
    expect(paymentIntent.id).toBe('pi_123');
    expect(paymentIntent.status).toBe('succeeded');
  });

  it('creates refund successfully', async () => {
    const refund = await StripeService.refundPayment('pi_123', 10.99);
    
    expect(refund.id).toBe('re_123');
    expect(refund.status).toBe('succeeded');
  });

  it('creates setup intent for saved cards', async () => {
    const setupIntent = await StripeService.createSetupIntent('user_123');
    
    expect(setupIntent.id).toBe('seti_123');
    expect(setupIntent.client_secret).toBe('seti_123_secret');
  });

  it('lists payment methods for customer', async () => {
    const paymentMethods = await StripeService.listPaymentMethods('user_123');
    
    expect(Array.isArray(paymentMethods.data)).toBe(true);
  });
});