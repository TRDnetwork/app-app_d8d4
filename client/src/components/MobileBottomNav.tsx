import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCartStore();
  
  // Only show on mobile devices
  if (window.innerWidth > 768) {
    return null;
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/wishlist', icon: Heart, label: 'Wishlist' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <item.icon 
              className={`h-5 w-5 ${isActive ? 'text-accent' : 'text-text_dim'}`} 
              aria-hidden="true" 
            />
            <span className={`text-xs ${isActive ? 'text-accent' : 'text-text_dim'}`}>
              {item.label}
            </span>
            {item.path === '/cart' && itemCount > 0 && (
              <span 
                className="absolute bottom-8 right-4 bg-accent text-background text-xs rounded-full h-5 w-5 flex items-center justify-center"
                aria-label={`${itemCount} items in cart`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;