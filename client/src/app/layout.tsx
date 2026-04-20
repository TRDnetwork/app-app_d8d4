import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopSphere - Premium E-Commerce Marketplace',
  description: 'Shop the best products with fast delivery and trusted sellers',
  openGraph: {
    title: 'ShopSphere',
    description: 'Premium e-commerce platform with AI recommendations and secure payments',
    url: 'https://shopsphere.com',
    siteName: 'ShopSphere',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopSphere',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}