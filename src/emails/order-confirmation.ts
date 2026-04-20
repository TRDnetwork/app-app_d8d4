import { formatCurrency } from '../lib/formatters';

interface OrderData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  deliveryAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  estimatedDelivery: string;
}

export default function orderConfirmationTemplate(data: OrderData): string {
  const {
    customerName,
    orderNumber,
    orderDate,
    deliveryAddress,
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    estimatedDelivery,
  } = data;

  const addressLines = [
    deliveryAddress.line1,
    deliveryAddress.line2,
    `${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.postal_code}`,
    deliveryAddress.country,
  ].filter(Boolean);

  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">
          Shop<span style="color: #1E293B;">Sphere</span>
        </h1>
        <p style="color: #94A3B8; margin-top: 10px;">Order Confirmation</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #F8FAFC; margin: 0 0 10px 0;">Hello ${customerName},</h2>
        <p style="color: #94A3B8; margin: 0;">
          Thank you for your order! We're preparing your items for shipment.
        </p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
          <div>
            <p style="color: #94A3B8; margin: 0 0 5px 0; font-size: 0.9rem;">Order Number</p>
            <p style="color: #F8FAFC; margin: 0; font-weight: 500;">#${orderNumber}</p>
          </div>
          <div style="text-align: right;">
            <p style="color: #94A3B8; margin: 0 0 5px 0; font-size: 0.9rem;">Order Date</p>
            <p style="color: #F8FAFC; margin: 0; font-weight: 500;">${orderDate}</p>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <p style="color: #94A3B8; margin: 0 0 10px 0; font-size: 0.9rem;">Delivery Address</p>
          <p style="color: #F8FAFC; margin: 0;">${addressLines.join(', ')}</p>
        </div>

        <div>
          <p style="color: #94A3B8; margin: 0 0 10px 0; font-size: 0.9rem;">Estimated Delivery</p>
          <p style="color: #F8FAFC; margin: 0; font-weight: 500;">${estimatedDelivery}</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #F8FAFC; margin: 0 0 15px 0; font-size: 1.2rem;">Order Items</h3>
        ${items.map(item => `
          <div style="display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #334155;">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
            <div style="flex: 1;">
              <p style="color: #F8FAFC; margin: 0 0 5px 0; font-weight: 500;">${item.name}</p>
              <p style="color: #94A3B8; margin: 0 0 5px 0; font-size: 0.9rem;">Quantity: ${item.quantity}</p>
              <p style="color: #F8FAFC; margin: 0; font-weight: 500;">${formatCurrency(item.price)}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Subtotal</span>
          <span style="color: #F8FAFC;">${formatCurrency(subtotal)}</span>
        </div>
        ${discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #94A3B8;">Discount</span>
            <span style="color: #10B981;">-${formatCurrency(discount)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Delivery</span>
          <span style="color: #F8FAFC;">${deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #334155; font-weight: 600;">
          <span style="color: #F8FAFC;">Total</span>
          <span style="color: #FF9900; font-size: 1.2rem;">${formatCurrency(total)}</span>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; background: #1E293B; border-radius: 8px;">
        <p style="color: #94A3B8; margin: 0 0 15px 0;">
          Questions about your order? Visit our <a href="https://shopsphere.com/help" style="color: #FF9900; text-decoration: none;">Help Center</a>
        </p>
        <a href="https://shopsphere.com/orders/${orderNumber}" style="background: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
          Track Your Order
        </a>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94A3B8; font-size: 0.8rem;">
        <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p style="margin: 0;">
          You're receiving this email because you placed an order on ShopSphere.
          <br />
          <a href="https://shopsphere.com/unsubscribe" style="color: #94A3B8; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}