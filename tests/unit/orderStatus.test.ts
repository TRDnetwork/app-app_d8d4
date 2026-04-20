import { describe, it, expect } from 'vitest';
import { getOrderStatusInfo } from '../../client/src/lib/orderStatus';

describe('getOrderStatusInfo', () => {
  it('returns correct info for placed status', () => {
    const statusInfo = getOrderStatusInfo('placed');
    expect(statusInfo).toEqual({
      label: 'Order Placed',
      color: 'bg-blue-100 text-blue-800',
      description: 'Your order has been received and is being processed.'
    });
  });

  it('returns correct info for confirmed status', () => {
    const statusInfo = getOrderStatusInfo('confirmed');
    expect(statusInfo).toEqual({
      label: 'Order Confirmed',
      color: 'bg-green-100 text-green-800',
      description: 'Your order has been confirmed and is being prepared for shipment.'
    });
  });

  it('returns correct info for shipped status', () => {
    const statusInfo = getOrderStatusInfo('shipped');
    expect(statusInfo).toEqual({
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800',
      description: 'Your order has been shipped and is on its way to you.'
    });
  });

  it('returns correct info for out for delivery status', () => {
    const statusInfo = getOrderStatusInfo('out for delivery');
    expect(statusInfo).toEqual({
      label: 'Out for Delivery',
      color: 'bg-orange-100 text-orange-800',
      description: 'Your order is out for delivery and will arrive soon.'
    });
  });

  it('returns correct info for delivered status', () => {
    const statusInfo = getOrderStatusInfo('delivered');
    expect(statusInfo).toEqual({
      label: 'Delivered',
      color: 'bg-green-100 text-green-800',
      description: 'Your order has been delivered successfully.'
    });
  });

  it('returns correct info for cancelled status', () => {
    const statusInfo = getOrderStatusInfo('cancelled');
    expect(statusInfo).toEqual({
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      description: 'Your order has been cancelled.'
    });
  });

  it('returns default info for unknown status', () => {
    const statusInfo = getOrderStatusInfo('unknown' as any);
    expect(statusInfo).toEqual({
      label: 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      description: 'Order status is unknown.'
    });
  });

  it('handles empty status', () => {
    const statusInfo = getOrderStatusInfo('');
    expect(statusInfo).toEqual({
      label: 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      description: 'Order status is unknown.'
    });
  });
});