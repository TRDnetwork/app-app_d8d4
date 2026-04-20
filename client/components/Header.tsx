'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/i18n/navigation';
import { VoiceButton } from './VoiceButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-accent">
              ShopSphere
            </Link>
          </div>

          <div className="hidden flex-1 max-w-xl px-8 md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <VoiceButton />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="py-2 md:hidden">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t md:hidden">
            <nav className="flex flex-col space-y-4 py-4">
              <Link href="/products" className="px-4 py-2 text-text_dim hover:text-text">
                Products
              </Link>
              <Link href="/cart" className="px-4 py-2 text-text_dim hover:text-text">
                Cart
              </Link>
              <Link href="/orders" className="px-4 py-2 text-text_dim hover:text-text">
                Orders
              </Link>
              <Link href="/wishlist" className="px-4 py-2 text-text_dim hover:text-text">
                Wishlist
              </Link>
              <Link href="/profile" className="px-4 py-2 text-text_dim hover:text-text">
                Profile
              </Link>
              <Link href="/voice" className="px-4 py-2 text-text_dim hover:text-text">
                Voice Assistant
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
```