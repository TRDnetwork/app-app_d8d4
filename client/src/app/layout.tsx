import { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'ShopSphere - Premium E-Commerce Marketplace',
  description: 'Discover amazing products with fast delivery and secure payments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}