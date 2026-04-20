import * as React from 'react';

interface SellerApplicationReceivedEmailProps {
  adminName: string;
  applicantName: string;
  businessName: string;
}

export const SellerApplicationReceivedEmail = ({
  adminName,
  applicantName,
  businessName,
}: SellerApplicationReceivedEmailProps) => {
  return (
    <div style={styles.container}>
      <table style={styles.table} cellPadding="0" cellSpacing="0" width="100%">
        <tr>
          <td style={styles.header}>
            <h1 style={styles.title}>ShopSphere Admin</h1>
            <p style={styles.subtitle}>New Seller Application Received</p>
          </td>
        </tr>
        <tr>
          <td style={styles.content}>
            <p style={styles.greeting}>Hi {adminName},</p>
            <p style={styles.text}>
              A new seller application has been submitted on <strong>ShopSphere</strong>.
            </p>

            <div style={styles.infoBox}>
              <p><strong>Applicant:</strong> {applicantName}</p>
              <p><strong>Business:</strong> {businessName}</p>
              <p><strong>Status:</strong> Pending Review</p>
            </div>

            <p style={styles.text}>
              Please log in to the admin panel to review the application and required documents.
            </p>

            <div style={styles.ctaContainer}>
              <a href="https://shopsphere.com/admin/sellers" style={styles.ctaButton}>
                Review Application
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style={styles.footer}>
            <p style={styles.footerText}>
              This is an automated notification from the ShopSphere platform.
            </p>
            <p style={styles.footerText}>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    padding: '20px',
  },
  table: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1E293B',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  },
  header: {
    backgroundColor: '#1E40AF',
    padding: '30px 20px',
    textAlign: 'center' as const,
  },
  title: {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#FF9900',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '18px',
    color: '#F8FAFC',
  },
  content: {
    padding: '30px 20px',
  },
  greeting: {
    fontSize: '18px',
    margin: '0 0 16px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px',
  },
  infoBox: {
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '16px',
    margin: '20px 0',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  ctaButton: {
    backgroundColor: '#FF9900',
    color: '#000',
    padding: '12px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    fontSize: '16px',
  },
  footer: {
    backgroundColor: '#0F172A',
    padding: '20px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#94A3B8',
  },
  footerText: {
    margin: '8px 0',
    lineHeight: '1.5',
  },
} as const;

export default SellerApplicationReceivedEmail;