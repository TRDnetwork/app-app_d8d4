interface WelcomeData {
  customerName: string;
  email: string;
}

export default function welcomeTemplate(data: WelcomeData): string {
  const { customerName, email } = data;

  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">
          Shop<span style="color: #1E293B;">Sphere</span>
        </h1>
        <p style="color: #94A3B8; margin-top: 10px;">Welcome Aboard</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #F8FAFC; margin: 0 0 10px 0;">Welcome, ${customerName}!</h2>
        <p style="color: #94A3B8; margin: 0;">
          Thank you for joining ShopSphere. We're excited to have you on board.
        </p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #F8FAFC; margin: 0 0 15px 0; font-size: 1.2rem;">Your Account</h3>
        <p style="color: #94A3B8; margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="color: #94A3B8; margin: 0;"><strong>Status:</strong> Active</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #F8FAFC; margin: 0 0 15px 0; font-size: 1.2rem;">Get Started</h3>
        <ul style="color: #94A3B8; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Browse our <a href="https://shopsphere.com/products" style="color: #FF9900; text-decoration: none;">featured products</a></li>
          <li style="margin-bottom: 8px;">Check out current <a href="https://shopsphere.com/deals" style="color: #FF9900; text-decoration: none;">deals and discounts</a></li>
          <li style="margin-bottom: 8px;">Explore our <a href="https://shopsphere.com/categories" style="color: #FF9900; text-decoration: none;">product categories</a></li>
          <li>Set up your <a href="https://shopsphere.com/profile" style="color: #FF9900; text-decoration: none;">profile and preferences</a></li>
        </ul>
      </div>

      <div style="text-align: center; padding: 20px; background: #1E293B; border-radius: 8px;">
        <a href="https://shopsphere.com/products" style="background: #FF9900; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
          Start Shopping
        </a>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94A3B8; font-size: 0.8rem;">
        <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p style="margin: 0;">
          You're receiving this email because you created an account on ShopSphere.
          <br />
          <a href="https://shopsphere.com/unsubscribe" style="color: #94A3B8; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}