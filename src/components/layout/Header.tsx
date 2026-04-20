import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { authStore } from '../../stores/authStore';
import { cartStore } from '../../stores/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = authStore();
  const { getTotalItems } = cartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-accent font-display">
              ShopSphere
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-text hover:text-accent transition-colors">Home</Link>
              <Link to="/products" className="text-text hover:text-accent transition-colors">Products</Link>
              <Link to="/wishlist" className="text-text hover:text-accent transition-colors">Wishlist</Link>
              {user?.role === 'seller' && (
                <Link to="/seller" className="text-text hover:text-accent transition-colors">Seller</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-text hover:text-accent transition-colors">Admin</Link>
              )}
            </nav>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-text hover:text-accent transition-colors">
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-text hover:text-accent transition-colors">
                  <User size={20} />
                  <span className="font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-text hover:bg-muted hover:text-accent"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-text hover:text-accent transition-colors">
                <User size={20} />
                <span>Login</span>
              </Link>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden bg-surface border-t border-border">
            <div className="flex flex-col space-y-3 py-4 px-2">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" />
              </div>
              <Link
                to="/"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              {user?.role === 'seller' && (
                <Link
                  to="/seller"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seller
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-text hover:text-accent text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;