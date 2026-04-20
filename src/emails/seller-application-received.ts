/**
 * Seller Application Received Email Template
 * Sent to admin when a new seller application is submitted
 */
export const sellerApplicationReceivedTemplate = (data: {
  applicantName: string;
  applicantEmail: string;
  businessName: string;
  submittedAt: string;
}) => `
  <div style="font-family: 'Source Sans Pro', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #F8FAFC; background-color: #0F172A;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9900; font-size: 2.5rem; margin: 0;">ShopSphere</h1>
      <p style="color: #94A3B8; margin-top: 10px;">New seller application received</p>
    </div>

    <div style="background-color: #1E293B; border-radius: 8px; padding: 24px;">
      <h2 style="color: #FF9900; margin-top: 0; margin-bottom: 16px; font-size: 1.5rem;">New Seller Application</h2>
      <p style="margin-bottom: 16px; line-height: 1.6;">A new seller has applied to join the ShopSphere marketplace. Please review the application details below.</p>
      
      <div style="background-color: #0F172A; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <p style="margin: 8px 0; color: #94A3B8;">Applicant Name</p>
            <p style="margin: 8px 0; font-weight: bold;">${data.applicantName}</p>
          </div>
          <div>
            <p style="margin: 8px 0; color: #94A3B8;">Email</p>
            <p style="margin: 8px 0;">${data.applicantEmail}</p>
          </div>
          <div>
            <p style="margin: 8px 0; color: #94A3B8;">Business Name</p>
            <p style="margin: 8px 0; font-weight: bold;">${data.businessName}</p>
          </div>
          <div>
            <p style="margin: 8px 0; color: #94A3B8;">Submitted</p>
            <p style="margin: 8px 0;">${data.submittedAt}</p>
          </div>
        </div>
      </div>

      <p style="margin-bottom: 24px; line-height: 1.6;">Log in to the admin panel to review and approve or reject this application. Approved sellers will be able to list products and manage orders.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a 
          href="https://admin.shopsphere.com/seller-applications" 
          style="background-color: #FF9900; color: #0F172A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;"
        >
          Review Application
        </a>
      </div>

      <div style="margin-top: 24px; padding: 16px; background-color: #0F172A; border-radius: 6px;">
        <p style="margin: 8px 0; color: #94A3B8; font-size: 0.9rem;">
          <strong>Admin Note:</strong> All seller applications are reviewed for legitimacy and business compliance. Please respond within 48 hours to maintain a positive experience for potential sellers.
        </p>
      </div>
    </div>

    <div style="text-align: center; color: #94A3B8; font-size: 0.9rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
      <p style="margin: 8px 0;">This is an automated message, please do not reply.</p>
      <p style="margin: 8px 0;">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      <p style="margin: 8px 0;">
        <a href="https://admin.shopsphere.com" style="color: #FF9900; text-decoration: none;">Admin Dashboard</a> | 
        <a href="https://shopsphere.com/help/admin" style="color: #FF9900; text-decoration: none; margin-left: 8px;">Admin Help</a>
      </p>
    </div>
  </div>
`;