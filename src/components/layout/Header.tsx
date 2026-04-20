import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-display font-bold text-accent">
            ShopSphere
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <Link to="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link>
            {user?.role === 'seller' && <Link to="/seller" className="hover:text-accent transition-colors">Seller</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="hover:text-accent transition-colors">Admin</Link>}
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 bg-muted text-text"
              onChange={(e) => navigate(`/search?q=${e.target.value}`)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingBag className="h-6 w-6 text-text" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {items.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={user.profile_picture_url || 'https://via.placeholder.com/32'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="lg:hidden px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text_dim" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10 bg-muted text-text"
            onChange={(e) => navigate(`/search?q=${e.target.value}`)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;