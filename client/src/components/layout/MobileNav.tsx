import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

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
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
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

            {/* Navigation links */}
            <nav className="flex-1 p-4 space-y-6">
              <Link 
                to="/" 
                className="block text-xl font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="block text-xl font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/wishlist" 
                className="block text-xl font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Wishlist
              </Link>
              <Link 
                to="/orders" 
                className="block text-xl font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>
              
              {/* User section */}
              <div className="pt-6 border-t border-border">
                {user ? (
                  <div className="space-y-4">
                    <p className="text-lg font-medium">Hello, {user.name}</p>
                    <Link 
                      to="/profile" 
                      className="block text-text hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/addresses" 
                      className="block text-text hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Addresses
                    </Link>
                    <button 
                      onClick={() => {
                        // Handle logout
                        setIsOpen(false);
                      }}
                      className="text-text hover:text-primary transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      to="/login" 
                      className="block text-text hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block text-text hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Bottom action buttons */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Link to="/search" className="flex items-center space-x-2 text-text hover:text-primary">
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Link>
                <Link to="/cart" className="flex items-center space-x-2 text-text hover:text-primary relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;