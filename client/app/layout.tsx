import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ReduxProvider } from '@/store/redux-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ShopSphere - Premium E-Commerce Marketplace',
  description:
    'Shop the latest products with fast delivery, secure payments, and trusted sellers.',
  openGraph: {
    title: 'ShopSphere',
    description:
      'Shop the latest products with fast delivery, secure payments, and trusted sellers.',
    url: 'https://shopsphere.com',
    siteName: 'ShopSphere',
    images: [
      {
        url: 'https://shopsphere.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopSphere',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#FF9900',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}