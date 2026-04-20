import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from './SearchBar';

const Header: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent">ShopSphere</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-text hover:text-accent transition-colors">Home</Link>
            <Link to="/products" className="text-text hover:text-accent transition-colors">Products</Link>
            <Link to="/deals" className="text-text hover:text-accent transition-colors">Deals</Link>
            <Link to="/categories" className="text-text hover:text-accent transition-colors">Categories</Link>
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          {user ? (
            <div className="relative flex items-center gap-2">
              <span className="text-text text-sm">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <User className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;