export default function WelcomeEmail({ name }) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Welcome to the future of shopping</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Welcome, ${name}!</h2>
        <p>Thanks for joining ShopSphere. You now have access to millions of products, fast delivery, and exclusive deals.</p>
        <p>Start exploring today:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://shopsphere.com" style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Shopping</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
        <br />
        <a href="https://shopsphere.com/unsubscribe" style="color: #EF4444;">Unsubscribe</a>
      </div>
    </div>
  `;
}