interface SellerApplicationData {
  businessName: string;
  submittedAt: string;
}

export default function sellerApplicationReceivedTemplate(data: SellerApplicationData): string {
  const { businessName, submittedAt } = data;

  return `
    <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FF9900; font-family: 'Playfair Display', serif; font-size: 2.5rem; margin: 0;">
          Shop<span style="color: #1E293B;">Sphere</span>
        </h1>
        <p style="color: #94A3B8; margin-top: 10px;">Seller Application</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #F8FAFC; margin: 0 0 10px 0;">Application Received</h2>
        <p style="color: #94A3B8; margin: 0;">
          Thank you for your interest in selling on ShopSphere.
        </p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #F8FAFC; margin: 0 0 15px 0; font-size: 1.2rem;">Application Details</h3>
        <p style="color: #94A3B8; margin: 0 0 10px 0;"><strong>Business Name:</strong> ${businessName}</p>
        <p style="color: #94A3B8; margin: 0;"><strong>Submitted:</strong> ${submittedAt}</p>
      </div>

      <div style="background: #1E293B; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #F8FAFC; margin: 0 0 15px 0; font-size: 1.2rem;">Next Steps</h3>
        <p style="color: #94A3B8; margin: 0 0 10px 0;">
          Our team will review your application within 3-5 business days.
        </p>
        <p style="color: #94A3B8; margin: 0;">
          We'll notify you via email once a decision has been made. If approved, you'll receive instructions on how to set up your seller dashboard.
        </p>
      </div>

      <div style="background: #1E293B; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #94A3B8; margin: 0; font-size: 0.9rem;">
          <strong>Questions?</strong> Contact our seller support team at <a href="mailto:sellers@shopsphere.com" style="color: #FF9900; text-decoration: none;">sellers@shopsphere.com</a>
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #94A3B8; font-size: 0.8rem;">
        <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        <p style="margin: 0;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
}