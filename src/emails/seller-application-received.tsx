export function renderSellerApplicationReceivedEmail(data: { name: string; businessName: string }): string {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Seller application received</p>
      </div>
      
      <div style="background-color: #1E293B; padding: 30px; border-radius: 8px;">
        <h2 style="color: #F8FAFC; margin-top: 0;">Application Received</h2>
        <p style="color: #94A3B8; margin: 20px 0;">Hello ${data.name},</p>
        <p style="color: #94A3B8; margin: 20px 0;">
          Thank you for applying to become a seller on ShopSphere. We've received your application for <strong>${data.businessName}</strong> and our team will review it shortly.
        </p>
        <p style="color: #94A3B8; margin: 20px 0;">
          You will receive another email once your application has been reviewed. The approval process typically takes 2-3 business days.
        </p>
        <p style="color: #94A3B8; margin: 20px 0;">
          In the meantime, feel free to explore our seller guidelines and best practices in our <a href="https://shopsphere.local/seller-guide" style="color: #FF9900; text-decoration: none;">Seller Resource Center</a>.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #94A3B8; font-size: 0.9rem;">
        <p>Questions about your application? <a href="https://shopsphere.local/seller-support" style="color: #FF9900; text-decoration: none;">Contact seller support</a></p>
        <p style="margin-top: 20px; font-size: 0.8rem;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}