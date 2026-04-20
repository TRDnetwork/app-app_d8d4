export default function SellerApplicationReceivedEmail({ name, businessName }) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F172A; color: #F8FAFC;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8;">Seller application update</p>
      </div>
      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="color: #FF9900; margin-top: 0;">Application Received</h2>
        <p>Hello ${name},</p>
        <p>Thank you for applying to become a seller on ShopSphere. We’ve received your application for <strong>${businessName}</strong> and are reviewing it.</p>
        <p>You’ll receive another email within 3-5 business days with our decision.</p>
        <p>If you have questions, reply to this email or visit our <a href="https://shopsphere.com/seller-help" style="color: #FF9900;">Seller Help Center</a>.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.8rem; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </div>
  `;
}