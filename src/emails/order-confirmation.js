export default function orderConfirmationTemplate({ 
  customerName, 
  orderNumber, 
  total, 
  estimatedDelivery, 
  items 
}) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #FF9900; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Your order has been confirmed</p>
      </div>

      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #F8FAFC;">Hello ${customerName},</h2>
        <p style="color: #94A3B8; line-height: 1.6;">
          Thank you for your order! We're preparing your items for shipment.
        </p>
      </div>

      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #F8FAFC;">Order Details</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Order Number:</span>
          <span style="color: #F8FAFC; font-weight: 600;">${orderNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Total Amount:</span>
          <span style="color: #F8FAFC; font-weight: 600;">$${total.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #94A3B8;">Estimated Delivery:</span>
          <span style="color: #F8FAFC;">${new Date(estimatedDelivery).toLocaleDateString()}</span>
        </div>
      </div>

      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #F8FAFC;">Items Ordered</h3>
        ${items.map(item => `
          <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #334155;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 16px;" />
            <div style="flex: 1;">
              <p style="margin: 0 0 4px 0; color: #F8FAFC;">${item.name}</p>
              <p style="margin: 0; color: #94A3B8;">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; color: #F8FAFC;">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1E40AF; border-radius: 8px;">
        <p style="margin: 0; color: #F8FAFC;">
          Track your order in real-time in your 
          <a href="${process.env.FRONTEND_URL}/orders" style="color: #FF9900; text-decoration: underline;">Order History</a>
        </p>
      </div>

      <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
        <p style="margin: 0 0 8px 0;">ShopSphere • Premium E-Commerce Experience</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p style="margin: 8px 0 0 0;">
          <a href="#" style="color: #94A3B8; text-decoration: underline;">Privacy Policy</a> • 
          <a href="#" style="color: #94A3B8; text-decoration: underline;">Terms of Service</a>
        </p>
      </div>
    </div>
  `;
}