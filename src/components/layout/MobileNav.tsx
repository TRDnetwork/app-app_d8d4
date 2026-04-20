import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-4">
            <Link
              to="/"
              className="block text-text hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block text-text hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="block text-text hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/deals"
              className="block text-text hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Deals
            </Link>
            <Link
              to="/cart"
              className="block text-text hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;