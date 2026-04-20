import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User, Menu } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/products', icon: Menu, label: 'Browse' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="grid grid-cols-5 gap-1 px-1 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center py-2 px-1 text-xs
                transition-colors duration-200
                ${isActive 
                  ? 'text-primary' 
                  : 'text-text_dim hover:text-text'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className={`h-6 w-6 mb-1 ${isActive ? 'text-current' : ''}`} 
                aria-hidden="true"
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;