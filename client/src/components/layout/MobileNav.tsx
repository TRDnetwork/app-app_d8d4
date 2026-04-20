import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/authStore';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    navigate('/search');
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        ></div>
      )}

      {/* Mobile menu */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="text-2xl font-bold text-primary" onClick={() => setIsOpen(false)}>
              ShopSphere
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Products</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Wishlist</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Orders</span>
            </Link>
            <button
              onClick={handleSearch}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-surface transition-colors text-left"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <Link to="/cart" onClick={() => setIsOpen(false)}>
                    Cart (0)
                  </Link>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full"
                  asChild
                >
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
```

```typescript