import * as React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ userName, resetLink }: PasswordResetEmailProps) => {
  return (
    <div style={styles.container}>
      <table style={styles.table} cellPadding="0" cellSpacing="0" width="100%">
        <tr>
          <td style={styles.header}>
            <h1 style={styles.title}>ShopSphere</h1>
            <p style={styles.subtitle}>Secure Password Reset</p>
          </td>
        </tr>
        <tr>
          <td style={styles.content}>
            <p style={styles.greeting}>Hi {userName},</p>
            <p style={styles.text}>
              We received a request to reset your password. Click the button below to securely reset it.
            </p>
            <p style={styles.text}>
              This link will expire in 15 minutes for security reasons.
            </p>

            <div style={styles.ctaContainer}>
              <a href={resetLink} style={styles.ctaButton}>
                Reset Your Password
              </a>
            </div>

            <p style={styles.text}>
              If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style={styles.footer}>
            <p style={styles.footerText}>
              You're receiving this email because a password reset was requested for your ShopSphere account.
            </p>
            <p style={styles.footerText}>
              <a href="https://shopsphere.com/unsubscribe" style={styles.unsubscribeLink}>
                Unsubscribe
              </a>
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
    backgroundColor: '#DC2626',
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
  unsubscribeLink: {
    color: '#EF4444',
    textDecoration: 'underline',
  },
} as const;

export default PasswordResetEmail;