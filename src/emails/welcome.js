export default function welcomeTemplate({ name }) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #FF9900; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Welcome to the future of shopping</p>
      </div>

      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
        <h2 style="margin: 0 0 16px 0; color: #F8FAFC;">Welcome, ${name}!</h2>
        <p style="color: #94A3B8; line-height: 1.6;">
          Thank you for joining ShopSphere. We're excited to have you on board.
        </p>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center;">
          <div style="background-color: #10B981; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
            <span style="color: white; font-weight: bold;">1</span>
          </div>
          <div>
            <h3 style="margin: 0 0 4px 0; color: #F8FAFC;">Explore Our Collection</h3>
            <p style="margin: 0; color: #94A3B8; font-size: 0.9rem;">Discover thousands of products across multiple categories</p>
          </div>
        </div>

        <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center;">
          <div style="background-color: #3B82F6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
            <span style="color: white; font-weight: bold;">2</span>
          </div>
          <div>
            <h3 style="margin: 0 0 4px 0; color: #F8FAFC;">Enjoy Secure Shopping</h3>
            <p style="margin: 0; color: #94A3B8; font-size: 0.9rem;">Your data and payments are protected with bank-level security</p>
          </div>
        </div>

        <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center;">
          <div style="background-color: #8B5CF6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
            <span style="color: white; font-weight: bold;">3</span>
          </div>
          <div>
            <h3 style="margin: 0 0 4px 0; color: #F8FAFC;">Earn Rewards</h3>
            <p style="margin: 0; color: #94A3B8; font-size: 0.9rem;">Join our loyalty program and earn points on every purchase</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #1E40AF; border-radius: 8px;">
        <p style="margin: 0; color: #F8FAFC;">
          Start shopping now and experience the ShopSphere difference.
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