import { vi } from 'vitest';

export const mockStripe = {
  elements: vi.fn().mockReturnValue({
    create: vi.fn().mockReturnValue({
      mount: vi.fn(),
      unmount: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn(),
    }),
  }),
  createPaymentMethod: vi.fn().mockResolvedValue({
    paymentMethod: {
      id: 'pm_123',
      card: {
        last4: '4242',
        brand: 'visa',
      },
    },
  }),
  confirmCardPayment: vi.fn().mockResolvedValue({
    paymentIntent: {
      status: 'succeeded',
    },
  }),
};