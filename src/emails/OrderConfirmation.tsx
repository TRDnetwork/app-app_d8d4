import * as React from 'react';

interface OrderConfirmationEmailProps {
  userName: string;
  orderNumber: string;
  totalAmount: string;
  deliveryEstimate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    image: string;
  }>;
}

export const OrderConfirmationEmail = ({
  userName,
  orderNumber,
  totalAmount,
  deliveryEstimate,
  items,
}: OrderConfirmationEmailProps) => {
  return (
    <div style={styles.container}>
      <table style={styles.table} cellPadding="0" cellSpacing="0" width="100%">
        <tr>
          <td style={styles.header}>
            <h1 style={styles.title}>ShopSphere</h1>
            <p style={styles.subtitle}>Your order has been confirmed!</p>
          </td>
        </tr>
        <tr>
          <td style={styles.content}>
            <p style={styles.greeting}>Hi {userName},</p>
            <p style={styles.text}>
              Thank you for shopping with <strong>ShopSphere</strong>. Your order <strong>#{orderNumber}</strong> has been confirmed and will be processed shortly.
            </p>
            <p style={styles.text}>
              <strong>Estimated Delivery:</strong> {deliveryEstimate}
            </p>

            <h2 style={styles.sectionTitle}>Order Summary</h2>
            <table style={styles.itemsTable} cellPadding="0" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={styles.tdItem}>
                      <img src={item.image} alt={item.name} style={styles.productImage} />
                      <span>{item.name}</span>
                    </td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.totalRow}>
              <strong>Total: {totalAmount}</strong>
            </div>

            <div style={styles.ctaContainer}>
              <a href="https://shopsphere.com/orders" style={styles.ctaButton}>
                View Your Order
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style={styles.footer}>
            <p style={styles.footerText}>
              You're receiving this email because you placed an order on ShopSphere.
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
  sectionTitle: {
    fontSize: '20px',
    margin: '24px 0 16px',
    color: '#FF9900',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '10px',
    borderBottom: '2px solid #334155',
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    fontSize: '14px',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #334155',
    fontSize: '14px',
  },
  tdItem: {
    display: 'flex' as const,
    alignItems: 'center',
    gap: '10px',
    padding: '12px 10px',
    borderBottom: '1px solid #334155',
    fontSize: '14px',
  },
  productImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover' as const,
    borderRadius: '6px',
  },
  totalRow: {
    textAlign: 'right' as const,
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#FF9900',
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

export default OrderConfirmationEmail;