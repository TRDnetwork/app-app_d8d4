import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderReview } from '../../src/components/checkout/OrderReview';

describe('OrderReview', () => {
  const mockOrder = {
    items: [
      {
        product: {
          _id: '123',
          title: 'Wireless Headphones',
          price: 99.99,
          image: 'headphones.jpg',
        },
        quantity: 1,
        price: 99.99,
      },
      {
        product: {
          _id: '456',
          title: 'Phone Case',
          price: 29.99,
          image: 'case.jpg',
        },
        quantity: 2,
        price: 29.99,
      },
    ],
    subtotal: 159.97,
    discount: 10,
    deliveryCharge: 5,
    total: 154.97,
  };

  it('renders order items correctly', () => {
    render(<OrderReview order={mockOrder} />);
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Phone Case')).toBeInTheDocument();
    expect(screen.getAllByText('Qty: 2')).toHaveLength(1);
  });

  it('displays item prices and quantities', () => {
    render(<OrderReview order={mockOrder} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$59.98')).toBeInTheDocument(); // 29.99 * 2
  });

  it('shows order summary with correct calculations', () => {
    render(<OrderReview order={mockOrder} />);
    
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    
    expect(screen.getByText('$159.97')).toBeInTheDocument();
    expect(screen.getByText('-$10.00')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('$154.97')).toBeInTheDocument();
  });

  it('formats currency correctly in summary', () => {
    render(<OrderReview order={mockOrder} />);
    
    const totalElement = screen.getByText('$154.97');
    expect(totalElement).toBeInTheDocument();
  });
});