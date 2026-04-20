import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { analytics } from '../../lib/analytics';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = e.currentTarget.value;
      analytics.search(query, 0); // Will be updated with actual result count
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCartClick = () => {
    analytics.ctaClick('cart_icon', 'header');
  };

  const handleLoginClick = () => {
    analytics.ctaClick('login_button', 'header');
  };

  const handleRegisterClick = () => {
    analytics.ctaClick('register_button', 'header');
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopSphere
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-text hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="text-text hover:text-primary transition-colors">Products</Link>
            <Link to="/wishlist" className="text-text hover:text-primary transition-colors">Wishlist</Link>
            <Link to="/orders" className="text-text hover:text-primary transition-colors">Orders</Link>
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 bg-surface border-border"
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative" onClick={handleCartClick}>
            <ShoppingCart className="h-6 w-6 text-text" />
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {items.length}
            </span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-text hidden md:inline">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild onClick={handleLoginClick}>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild onClick={handleRegisterClick}>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;