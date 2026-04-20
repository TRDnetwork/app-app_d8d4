/**
 * Order Confirmation Email Template
 * Sent to customer after successful payment
 */
export default function OrderConfirmationEmail(data) {
  const { orderNumber, customerName, items, total, estimatedDelivery } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Your Order is Confirmed</title>
        <style>
          body {
            font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #0f172a;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #1e293b;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Playfair Display', Georgia, serif;
            color: #ff9900;
            margin: 0;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
          }
          h1 {
            font-size: 24px;
            margin-top: 0;
            color: #1e40af;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .order-info {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .items {
            margin: 25px 0;
          }
          .item {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .item-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            margin-right: 15px;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            font-weight: 600;
            margin: 0 0 4px 0;
          }
          .item-price {
            color: #10b981;
            font-weight: 600;
          }
          .total {
            text-align: right;
            font-size: 18px;
            font-weight: 700;
            margin: 20px 0;
          }
          .delivery {
            background-color: #fffbeb;
            border: 1px solid #fcd34d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .footer a {
            color: #1e40af;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container {
              margin: 15px;
            }
            .content {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ShopSphere</h1>
          </div>
          <div class="content">
            <h1>Order Confirmed!</h1>
            <p class="greeting">Hi ${customerName},</p>
            <p>Thank you for your order. We're getting your items ready to ship.</p>

            <div class="order-info">
              <strong>Order Number:</strong> ${orderNumber}<br/>
              <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
              <strong>Total:</strong> ${total}
            </div>

            <div class="items">
              ${items
                .map(
                  (item) => `
                <div class="item">
                  <img src="${item.image}" alt="${item.name}" class="item-image" />
                  <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div>Quantity: ${item.quantity}</div>
                    <div class="item-price">${item.price}</div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="total">Total: ${total}</div>

            <div class="delivery">
              <strong>Estimated Delivery:</strong> ${estimatedDelivery}
            </div>

            <p>You can track your order anytime in your <a href="${process.env.FRONTEND_URL}/orders">Order History</a>.</p>
            <p>Thanks again for shopping with us!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/contact">Contact Us</a> | 
              <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a> | 
              <a href="${process.env.FRONTEND_URL}/terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}