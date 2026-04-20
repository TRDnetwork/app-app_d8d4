import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User, Menu } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/products', icon: Menu, label: 'Products' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center p-3 text-xs
                ${isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-6 w-6 mb-1" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;