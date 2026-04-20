import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import MobileNav from './MobileNav';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95" role="banner">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary" aria-label="ShopSphere home">
            ShopSphere
          </Link>
          <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
            <Link to="/" className="text-text hover:text-primary transition-colors" aria-current={window.location.pathname === '/' ? 'page' : undefined}>
              Home
            </Link>
            <Link to="/products" className="text-text hover:text-primary transition-colors" aria-current={window.location.pathname === '/products' ? 'page' : undefined}>
              Products
            </Link>
            <Link to="/wishlist" className="text-text hover:text-primary transition-colors" aria-current={window.location.pathname === '/wishlist' ? 'page' : undefined}>
              Wishlist
            </Link>
            <Link to="/orders" className="text-text hover:text-primary transition-colors" aria-current={window.location.pathname === '/orders' ? 'page' : undefined}>
              Orders
            </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="search-input" className="sr-only">Search for products</label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" aria-hidden="true" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search for products..."
              className="pl-10 bg-surface border-border w-full"
              aria-label="Search for products"
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative" aria-label="Shopping cart">
            <ShoppingCart className="h-6 w-6 text-text" aria-hidden="true" />
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs" aria-label="3 items in cart">
              0
            </span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-text hidden md:inline">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild aria-label="Login">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild aria-label="Register">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
```

```typescript