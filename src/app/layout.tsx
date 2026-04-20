import { notFound } from 'next/navigation';
import { i18n, Locale } from '@/i18n/config';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShopSphere - Premium E-Commerce Marketplace',
  description: 'Discover amazing products with fast delivery and secure payments',
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!i18n.locales.includes(params.locale)) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body className="bg-bg text-text antialiased">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-accent">ShopSphere</h1>
            <LanguageSwitcher />
          </div>
        </header>
        {children}
        <footer className="border-t border-border mt-12 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-text_dim text-sm">
              © {new Date().getFullYear()} ShopSphere. All rights reserved.
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}