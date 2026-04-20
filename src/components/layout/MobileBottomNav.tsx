import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cartStore } from '../../stores/cartStore';

const MobileBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { getTotalItems } = cartStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center px-5 py-2 transition-colors ${
            isActive('/') ? 'text-accent' : 'text-text-dim'
          }`}
          aria-label={t('nav.home')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">{t('nav.home')}</span>
        </Link>
        
        <Link 
          to="/products" 
          className={`flex flex-col items-center px-5 py-2 transition-colors ${
            location.pathname.startsWith('/products') || location.pathname.startsWith('/search') ? 'text-accent' : 'text-text-dim'
          }`}
          aria-label={t('nav.products')}
        >
          <Menu size={20} />
          <span className="text-xs mt-1">{t('nav.products')}</span>
        </Link>
        
        <Link 
          to="/cart" 
          className={`flex flex-col items-center px-5 py-2 transition-colors relative ${
            isActive('/cart') ? 'text-accent' : 'text-text-dim'
          }`}
          aria-label={t('header.cart')}
        >
          <ShoppingCart size={20} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
          <span className="text-xs mt-1">{t('header.cart')}</span>
        </Link>
        
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center px-5 py-2 transition-colors ${
            isActive('/wishlist') ? 'text-accent' : 'text-text-dim'
          }`}
          aria-label={t('nav.wishlist')}
        >
          <Heart size={20} />
          <span className="text-xs mt-1">{t('nav.wishlist')}</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center px-5 py-2 transition-colors ${
            location.pathname.startsWith('/profile') || location.pathname.startsWith('/orders') || location.pathname.startsWith('/addresses') ? 'text-accent' : 'text-text-dim'
          }`}
          aria-label={t('nav.profile')}
        >
          <User size={20} />
          <span className="text-xs mt-1">{t('nav.profile')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;