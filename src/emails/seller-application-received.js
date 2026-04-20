export default function sellerApplicationReceivedTemplate({ businessName }) {
  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; color: #F8FAFC; background-color: #0F172A; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #FF9900; margin: 0;">ShopSphere</h1>
        <p style="color: #94A3B8; margin-top: 8px;">Seller application received</p>
      </div>

      <div style="background-color: #1E293B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #F8FAFC;">Application Received</h2>
        <p style="color: #94A3B8; line-height: 1.6;">
          Thank you for your interest in becoming a seller on ShopSphere. 
          We've received your application for <strong>${businessName}</strong> and our team will review it shortly.
        </p>
      </div>

      <div style="background-color: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; color: #F8FAFC;">What Happens Next</h3>
        <ol style="color: #94A3B8; line-height: 1.8; padding-left: 20px;">
          <li style="margin-bottom: 12px;">Our team will review your application and business information</li>
          <li style="margin-bottom: 12px;">We may contact you for additional documentation if needed</li>
          <li style="margin-bottom: 12px;">You'll receive a decision email within 3-5 business days</li>
          <li>If approved, you'll get instructions to set up your seller dashboard</li>
        </ol>
      </div>

      <div style="background-color: #1E293B; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; color: #F8FAFC;">Need Help?</h3>
        <p style="color: #94A3B8; margin: 0;">
          If you have questions about your application, reply to this email or contact our seller support team at 
          <a href="mailto:sellers@shopsphere.com" style="color: #FF9900; text-decoration: underline;">sellers@shopsphere.com</a>
        </p>
      </div>

      <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
        <p style="margin: 0 0 8px 0;">ShopSphere • Premium E-Commerce Experience</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </div>
  `;
}