/**
 * Welcome Email Template
 * Sent to new users after registration
 */
export const welcomeTemplate = (data: {
  name: string;
  email: string;
}) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #F8FAFC; background-color: #0F172A;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 10px;">Welcome to our community</p>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px;">
      <h2 style="color: #FF9900; margin-top: 0; margin-bottom: 16px; font-size: 1.5rem;">Welcome, ${data.name}!</h2>
      <p style="margin-bottom: 16px; line-height: 1.6;">Thank you for joining ShopSphere! We're excited to have you on board.</p>
      
      <p style="margin-bottom: 24px; line-height: 1.6;">Your account has been successfully created with the email address <strong>${data.email}</strong>. You can now browse our catalog, save items to your wishlist, and enjoy a personalized shopping experience.</p>
      
      <div style="margin: 30px 0;">
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 16px; display: flex; align-items: flex-start;">
            <span style="background-color: #FF9900; color: #0F172A; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; flex-shrink: 0;">1</span>
            <span>Explore our <a href="https://shopsphere.com/products" style="color: #FF9900; text-decoration: none;">featured products</a> and special deals</span>
          </li>
          <li style="margin-bottom: 16px; display: flex; align-items: flex-start;">
            <span style="background-color: #FF9900; color: #0F172A; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; flex-shrink: 0;">2</span>
            <span>Add items to your <a href="https://shopsphere.com/wishlist" style="color: #FF9900; text-decoration: none;">wishlist</a> for later purchase</span>
          </li>
          <li style="display: flex; align-items: flex-start;">
            <span style="background-color: #FF9900; color: #0F172A; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; flex-shrink: 0;">3</span>
            <span>Complete your first order and earn <strong>loyalty points</strong></span>
          </li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a 
          href="https://shopsphere.com/products" 
          style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"
        >
          Start Shopping
        </a>
      </div>
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