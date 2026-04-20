import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressStep } from '../../src/components/Checkout/AddressStep';
import { DeliveryStep } from '../../src/components/Checkout/DeliveryStep';
import { PaymentStep } from '../../src/components/Checkout/PaymentStep';
import { ReviewStep } from '../../src/components/Checkout/ReviewStep';
import { useCheckoutStore } from '../../src/stores/checkoutStore';
import { useAuth } from '../../src/lib/auth';

// Mock dependencies
vi.mock('../../src/stores/checkoutStore', () => ({
  useCheckoutStore: vi.fn()
}));

vi.mock('../../src/lib/auth', () => ({
  useAuth: vi.fn()
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    redirectToCheckout: vi.fn().mockResolvedValue({ error: null })
  })
}));

describe('Checkout Components', () => {
  const mockUser = {
    _id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    addresses: [
      {
        _id: 'addr1',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        phone: '+1234567890',
        label: 'Home',
        is_default: true
      }
    ]
  };

  const mockCartItems = [
    {
      _id: 'item1',
      product_id: 'prod1',
      title: 'Wireless Headphones',
      price: 29.99,
      quantity: 2,
      image: 'https://example.com/headphones.jpg'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });
  });

  describe('AddressStep Component', () => {
    it('displays saved addresses and allows selection', () => {
      const mockSetAddress = vi.fn();
      const mockOnNext = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        address: null,
        setAddress: mockSetAddress
      });

      render(<AddressStep onNext={mockOnNext} />);

      expect(screen.getByText(/shipping address/i)).toBeInTheDocument();
      expect(screen.getByText(/home/i)).toBeInTheDocument();
      expect(screen.getByText(/123 main st/i)).toBeInTheDocument();

      const addressElement = screen.getByText(/home/i).closest('div');
      fireEvent.click(addressElement!);

      expect(mockSetAddress).toHaveBeenCalledWith(mockUser.addresses[0]);
      expect(mockOnNext).toHaveBeenCalled();
    });

    it('allows adding new address', async () => {
      const mockSetAddress = vi.fn();
      const mockOnNext = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        address: null,
        setAddress: mockSetAddress
      });

      render(<AddressStep onNext={mockOnNext} />);

      const addNewButton = screen.getByRole('button', { name: /add new address/i });
      fireEvent.click(addNewButton);

      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/street/i), {
        target: { value: '456 Oak Ave' }
      });
      fireEvent.change(screen.getByLabelText(/city/i), {
        target: { value: 'Boston' }
      });
      fireEvent.change(screen.getByLabelText(/state/i), {
        target: { value: 'MA' }
      });
      fireEvent.change(screen.getByLabelText(/zip/i), {
        target: { value: '02101' }
      });
      fireEvent.change(screen.getByLabelText(/country/i), {
        target: { value: 'USA' }
      });
      fireEvent.change(screen.getByLabelText(/phone/i), {
        target: { value: '+1987654321' }
      });

      const saveButton = screen.getByRole('button', { name: /save & continue/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockSetAddress).toHaveBeenCalledWith(expect.objectContaining({
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          phone: '+1987654321'
        }));
        expect(mockOnNext).toHaveBeenCalled();
      });
    });
  });

  describe('DeliveryStep Component', () => {
    it('displays delivery options and allows selection', () => {
      const mockSetDeliveryOption = vi.fn();
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        deliveryOption: null,
        setDeliveryOption: mockSetDeliveryOption
      });

      render(<DeliveryStep onNext={mockOnNext} onBack={mockOnBack} />);

      expect(screen.getByText(/delivery method/i)).toBeInTheDocument();
      expect(screen.getByText(/standard delivery/i)).toBeInTheDocument();
      expect(screen.getByText(/express delivery/i)).toBeInTheDocument();
      expect(screen.getByText(/same day delivery/i)).toBeInTheDocument();

      const expressOption = screen.getByText(/express delivery/i).closest('div');
      fireEvent.click(expressOption!);

      expect(mockSetDeliveryOption).toHaveBeenCalledWith(expect.objectContaining({
        id: 'express',
        price: 9.99
      }));
      expect(mockOnNext).toHaveBeenCalled();
    });

    it('disables continue button when no option is selected', () => {
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        deliveryOption: null,
        setDeliveryOption: vi.fn()
      });

      render(<DeliveryStep onNext={mockOnNext} onBack={mockOnBack} />);

      const continueButton = screen.getByRole('button', { name: /continue to payment/i });
      expect(continueButton).toBeDisabled();
    });
  });

  describe('PaymentStep Component', () => {
    it('displays payment methods and allows selection', () => {
      const mockSetPaymentMethod = vi.fn();
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        paymentMethod: null,
        setPaymentMethod: mockSetPaymentMethod,
        cartTotal: 59.98,
        deliveryOption: { price: 9.99 }
      });

      render(<PaymentStep onNext={mockOnNext} onBack={mockOnBack} />);

      expect(screen.getByText(/payment method/i)).toBeInTheDocument();
      expect(screen.getByText(/credit\/debit card/i)).toBeInTheDocument();
      expect(screen.getByText(/upi/i)).toBeInTheDocument();
      expect(screen.getByText(/cash on delivery/i)).toBeInTheDocument();

      const cardOption = screen.getByText(/credit\/debit card/i).closest('div');
      fireEvent.click(cardOption!);

      expect(mockSetPaymentMethod).toHaveBeenCalledWith('card');
    });

    it('displays card form when card payment is selected', () => {
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        paymentMethod: 'card',
        setPaymentMethod: vi.fn(),
        cartTotal: 59.98,
        deliveryOption: { price: 9.99 }
      });

      render(<PaymentStep onNext={mockOnNext} onBack={mockOnBack} />);

      expect(screen.getByLabelText(/name on card/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    });

    it('processes card payment and redirects to checkout', async () => {
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        paymentMethod: 'card',
        setPaymentMethod: vi.fn(),
        cartTotal: 59.98,
        deliveryOption: { price: 9.99 }
      });

      render(<PaymentStep onNext={mockOnNext} onBack={mockOnBack} />);

      fireEvent.change(screen.getByLabelText(/name on card/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4242 4242 4242 4242' }
      });
      fireEvent.change(screen.getByLabelText(/expiry/i), {
        target: { value: '12/25' }
      });
      fireEvent.change(screen.getByLabelText(/cvv/i), {
        target: { value: '123' }
      });

      const payButton = screen.getByRole('button', { name: /pay now/i });
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/stripe/create-checkout-session', expect.any(Object));
      });
    });

    it('proceeds to order confirmation for non-card payments', async () => {
      const mockOnNext = vi.fn();
      const mockOnBack = vi.fn();
      (useCheckoutStore as vi.Mock).mockReturnValue({
        paymentMethod: 'cod',
        setPaymentMethod: vi.fn(),
        cartTotal: 59.98,
        deliveryOption: { price: 9.99 }
      });

      render(<PaymentStep onNext={mockOnNext} onBack={mockOnBack} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });