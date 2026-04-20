import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ShoppingCart, User } from 'lucide-react';
import { authStore } from '../../stores/authStore';
import { cartStore } from '../../stores/cartStore';

const Header: React.FC = () => {
  const user = authStore((state) => state.user);
  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();
  const cartCount = cartStore((state) => state.getItemCount());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur supports-backdrop-blur:bg-surface/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-text">
            Shop<span className="text-accent">Sphere</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/products" className="text-text-dim hover:text-text transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-text-dim hover:text-text transition-colors">
              Categories
            </Link>
            <Link to="/deals" className="text-text-dim hover:text-text transition-colors">
              Deals
            </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 bg-card border-border"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${e.currentTarget.value}`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-primary-foreground text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-dim">Hi, {user.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;