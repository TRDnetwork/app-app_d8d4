export function renderWelcomeEmail(name: string): string {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Welcome to the future of e-commerce</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #94A3B8; margin: 20px 0;">Thank you for joining ShopSphere. We're excited to have you on board.</p>
        
        <p style="color: #94A3B8; margin: 20px 0;">
          Start exploring our marketplace, save your favorite products, and enjoy a seamless shopping experience.
        </p>
        
        <a href="https://shopsphere.local/products" style="display: inline-block; background-color: #FF9900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
          Start Shopping
        </a>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Need help getting started? <a href="https://shopsphere.local/help" style="color: #FF9900; text-decoration: none;">Visit our help center</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}