import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { authStore } from '../../stores/authStore';
import { cartStore } from '../../stores/cartStore';
import VoiceActivationButton from '../VoiceActivationButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = authStore();
  const { getTotalItems } = cartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVoiceCommand = (command: string) => {
    const [action, value] = command.split(':');
    
    switch (action) {
      case 'navigate':
        navigate(`/${value.toLowerCase().replace(/\s+/g, '-')}`);
        break;
      case 'search':
        navigate(`/search?q=${encodeURIComponent(value)}`);
        break;
      case 'addTask':
        // Handle add task command
        break;
      case 'time':
        // Handle time command
        break;
      case 'date':
        // Handle date command
        break;
      case 'weather':
        // Handle weather command
        break;
      case 'help':
        // Handle help command
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border" role="banner">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-accent font-display" aria-label="ShopSphere home">
              ShopSphere
            </Link>
            <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
              <Link to="/" className="text-text hover:text-accent transition-colors" aria-current={window.location.pathname === '/' ? 'page' : undefined}>
                Home
              </Link>
              <Link to="/products" className="text-text hover:text-accent transition-colors" aria-current={window.location.pathname === '/products' ? 'page' : undefined}>
                Products
              </Link>
              <Link to="/wishlist" className="text-text hover:text-accent transition-colors" aria-current={window.location.pathname === '/wishlist' ? 'page' : undefined}>
                Wishlist
              </Link>
              {user?.role === 'seller' && (
                <Link to="/seller" className="text-text hover:text-accent transition-colors" aria-current={window.location.pathname === '/seller' ? 'page' : undefined}>
                  Seller
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-text hover:text-accent transition-colors" aria-current={window.location.pathname === '/admin' ? 'page' : undefined}>
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Search products</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Search products"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-text hover:text-accent transition-colors" aria-label="Shopping cart">
              <ShoppingCart size={20} aria-hidden="true" />
              {getTotalItems() > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${getTotalItems()} items in cart`}
                >
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group" role="navigation" aria-label="User menu">
                <button 
                  className="flex items-center space-x-2 text-text hover:text-accent transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  aria-controls="user-menu"
                >
                  <User size={20} aria-hidden="true" />
                  <span className="font-medium">{user.name}</span>
                </button>
                <div 
                  id="user-menu"
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                  role="menu"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                    role="menuitem"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-text hover:bg-muted hover:text-accent"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-text hover:text-accent transition-colors" aria-label="Login">
                <User size={20} aria-hidden="true" />
                <span>Login</span>
              </Link>
            )}

            {/* Voice activation button */}
            <VoiceActivationButton onCommand={handleVoiceCommand} />

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="mt-4 md:hidden bg-surface border-t border-border"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3 py-4 px-2">
              <div className="relative mb-3">
                <label htmlFor="mobile-search" className="sr-only">Search products</label>
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none"
                  aria-label="Search products"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" aria-hidden="true" />
              </div>
              <Link
                to="/"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                className="px-3 py-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
              >
                Wishlist
              </Link>
              {user?.role === 'seller' && (
                <Link
                  to="/seller"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  Seller
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  Admin
                </Link>
              )}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-text hover:text-accent text-left"
                    role="menuitem"
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
```

```typescript