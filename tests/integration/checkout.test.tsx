
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Checkout } from '../../src/pages/Checkout';
import { useCheckoutStore } from '../../src/stores/checkoutStore';
import { useCartStore } from '../../src/stores/cartStore';

// Mock the stores
vi.mock('../../src/stores/checkoutStore', () => ({
  useCheckoutStore: vi.fn(),
}));

vi.mock('../../src/stores/cartStore', () => ({
  useCartStore: vi.fn(),
}));

describe('Checkout Flow', () => {
  it('displays checkout steps navigation', () => {
    (useCheckoutStore as any).mockReturnValue({
      currentStep: 1,
      address: null,
      deliverySpeed: null,
      paymentMethod: null,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
      selectAddress: vi.fn(),
      selectDeliveryOption: vi.fn(),
      selectPaymentMethod: vi.fn(),
    });

    (useCartStore as any).mockReturnValue({
      items: [],
      total: 0,
      itemCount: 0,
    });

    render(<Checkout />);
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows order summary with correct totals', () => {
    const mockItems = [
      {
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      }
    ];

    (useCheckoutStore as any).mockReturnValue({
      currentStep: 1,
      address: null,
      deliverySpeed: null,
      paymentMethod: null,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
      selectAddress: vi.fn(),
      selectDeliveryOption: vi.fn(),
      selectPaymentMethod: vi.fn(),
    });

    (useCartStore as any).mockReturnValue({
      items: mockItems,
      total: 999,
      itemCount: 1,
    });

    render(<Checkout />);
    
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$999.00')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$999.00')).toBeInTheDocument();
  });

  it('navigates between steps with next/previous buttons', async () => {
    const mockGoToNextStep = vi.fn();
    const mockGoToPreviousStep = vi.fn();

    (useCheckoutStore as any).mockReturnValue({
      currentStep: 1,
      address: null,
      deliverySpeed: null,
      paymentMethod: null,
      goToNextStep: mockGoToNextStep,
      goToPreviousStep: mockGoToPreviousStep,
      selectAddress: vi.fn(),
      selectDeliveryOption: vi.fn(),
      selectPaymentMethod: vi.fn(),
    });

    (useCartStore as any).mockReturnValue({
      items: [],
      total: 0,
      itemCount: 1,
    });

    render(<Checkout />);
    
    const nextButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockGoToNextStep).toHaveBeenCalled();
    });
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(mockGoToPreviousStep).toHaveBeenCalled();
    });
  });

  it('disables next button when required information is missing', () => {
    (useCheckoutStore as any).mockReturnValue({
      currentStep: 1,
      address: null,
      deliverySpeed: null,
      paymentMethod: null,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
      selectAddress: vi.fn(),
      selectDeliveryOption: vi.fn(),
      selectPaymentMethod: vi.fn(),
    });

    (useCartStore as any).mockReturnValue({
      items: [],
      total: 0,
      itemCount: 1,
    });

    render(<Checkout />);
    
    const nextButton = screen.getByRole('button', { name: /continue/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when required information is provided', () => {
    (useCheckoutStore as any).mockReturnValue({
      currentStep: 1,
      address: { id: '1', type: 'home', line1: '123 Main St', city: 'SF', state: 'CA', postal_code: '94107', country: 'US', is_default: true, created_at: '2024-01-01' },
      deliverySpeed: null,
      paymentMethod: null,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
      selectAddress: vi.fn(),
      selectDeliveryOption: vi.fn(),
      selectPaymentMethod: vi.fn(),
    });

    (useCartStore as any).mockReturnValue({
      items: [],
      total: 0,
      itemCount: 1,
    });

    render(<Checkout />);
    
    const nextButton = screen.getByRole('button', { name: /continue/i });
    expect(nextButton).not.toBeDisabled();
  });
});
```