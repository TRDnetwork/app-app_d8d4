import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopSphere - Premium E-Commerce Marketplace',
  description: 'Shop the best products with fast delivery and trusted reviews',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="flex min-h-screen flex-col">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}