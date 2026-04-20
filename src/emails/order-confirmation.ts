/**
 * Order Confirmation Email Template
 * Sent to customer after successful order placement
 */
export const orderConfirmationTemplate = (data: {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  estimatedDelivery: string;
}) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #F8FAFC; background-color: #0F172A;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 10px;">Your order has been confirmed</p>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h2 style="color: #FF9900; margin-top: 0; margin-bottom: 16px; font-size: 1.5rem;">Hello ${data.customerName},</h2>
      <p style="margin-bottom: 16px; line-height: 1.6;">Thank you for your order! We're preparing your items for shipment. You can track your order using the order number below.</p>
      
      <div style="background-color: #0F172A; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <p style="margin: 8px 0; color: #94A3B8;">Order Number</p>
        <p style="margin: 8px 0; font-size: 1.2rem; font-weight: bold; color: #FF9900;">${data.orderNumber}</p>
        
        <p style="margin: 8px 0; color: #94A3B8;">Order Date</p>
        <p style="margin: 8px 0;">${data.orderDate}</p>
        
        <p style="margin: 8px 0; color: #94A3B8;">Estimated Delivery</p>
        <p style="margin: 8px 0;">${data.estimatedDelivery}</p>
      </div>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #FF9900; margin-top: 0; margin-bottom: 16px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #334155;">
            <th style="text-align: left; padding: 8px 0; color: #94A3B8;">Item</th>
            <th style="text-align: center; padding: 8px 0; color: #94A3B8;">Quantity</th>
            <th style="text-align: right; padding: 8px 0; color: #94A3B8;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 12px 0;">${item.name}</td>
              <td style="text-align: center; padding: 12px 0;">${item.quantity}</td>
              <td style="text-align: right; padding: 12px 0;">${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; text-align: right;">
        <p style="margin: 8px 0; font-size: 1.1rem;">
          <span style="color: #94A3B8;">Total: </span>
          <span style="font-weight: bold; color: #FF9900;">${data.total}</span>
        </p>
      </div>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #FF9900; margin-top: 0; margin-bottom: 16px;">Shipping Address</h3>
      <address style="margin: 0; font-style: normal; line-height: 1.6;">
        <p style="margin: 8px 0;">${data.shippingAddress.line1}</p>
        ${data.shippingAddress.line2 ? `<p style="margin: 8px 0;">${data.shippingAddress.line2}</p>` : ''}
        <p style="margin: 8px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
        <p style="margin: 8px 0;">${data.shippingAddress.country}</p>
      </address>
    </div>

    <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="margin: 8px 0;">This is an automated message, please do not reply.</p>
      <p style="margin: 8px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p style="margin: 8px 0;">
        <a href="https://shopsphere.com" style="color: #FF9900; text-decoration: none;">Visit our website</a> | 
        <a href="https://shopsphere.com/contact" style="color: #FF9900; text-decoration: none; margin-left: 8px;">Contact Support</a>
      </p>
    </div>
  </div>
`;