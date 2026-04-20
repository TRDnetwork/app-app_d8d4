'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-accent" aria-label="ShopSphere home">
              ShopSphere
            </Link>
          </div>

          <div className="hidden flex-1 max-w-xl px-8 md:block">
            <div className="relative">
              <label htmlFor="search" className="sr-only">Search for products</label>
              <Input
                id="search"
                type="text"
                placeholder="Search for products..."
                className="pr-10"
                aria-label="Search for products"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 py-4" role="navigation" aria-label="Main navigation">
                  <Link 
                    href="/products" 
                    className={`py-2 ${pathname === '/products' ? 'text-accent font-medium' : 'text-text_dim'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === '/products' ? 'page' : undefined}
                  >
                    Products
                  </Link>
                  <Link 
                    href="/cart" 
                    className={`py-2 ${pathname === '/cart' ? 'text-accent font-medium' : 'text-text_dim'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === '/cart' ? 'page' : undefined}
                  >
                    Cart
                  </Link>
                  <Link 
                    href="/orders" 
                    className={`py-2 ${pathname === '/orders' ? 'text-accent font-medium' : 'text-text_dim'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === '/orders' ? 'page' : undefined}
                  >
                    Orders
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className={`py-2 ${pathname === '/wishlist' ? 'text-accent font-medium' : 'text-text_dim'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === '/wishlist' ? 'page' : undefined}
                  >
                    Wishlist
                  </Link>
                  <Link 
                    href="/profile" 
                    className={`py-2 ${pathname === '/profile' ? 'text-accent font-medium' : 'text-text_dim'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === '/profile' ? 'page' : undefined}
                  >
                    Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart" aria-label="View shopping cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login" aria-label="Account login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="py-2 md:hidden">
          <div className="relative">
            <label htmlFor="mobile-search" className="sr-only">Search for products</label>
            <Input
              id="mobile-search"
              type="text"
              placeholder="Search for products..."
              className="pr-10"
              aria-label="Search for products"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}