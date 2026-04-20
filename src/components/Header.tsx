import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useCartStore } from '../stores/cart';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary">ShopSphere</Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
            </nav>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <img
                    src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{user.name}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" className="px-4 py-2 hover:bg-muted rounded">Home</Link>
              <Link to="/products" className="px-4 py-2 hover:bg-muted rounded">Products</Link>
              <Link to="/wishlist" className="px-4 py-2 hover:bg-muted rounded">Wishlist</Link>
              <div className="px-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;