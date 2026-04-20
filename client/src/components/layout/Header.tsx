import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authStore } from '../../stores/authStore';
import { cartStore } from '../../stores/cartStore';
import { trackCTAClick, trackSearch } from '../../lib/analytics';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { VoiceControl } from '../voice/VoiceControl';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = authStore();
  const { getTotalItems } = cartStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    trackAuthEvent('logout');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery, 0); // Result count will be updated when results load
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-2xl font-bold text-accent font-display"
                onClick={() => trackCTAClick('logo', 'header')}
              >
                ShopSphere
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="text-text hover:text-accent transition-colors"
                  onClick={() => trackCTAClick('home', 'header')}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/products" 
                  className="text-text hover:text-accent transition-colors"
                  onClick={() => trackCTAClick('products', 'header')}
                >
                  {t('nav.products')}
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-text hover:text-accent transition-colors"
                  onClick={() => trackCTAClick('wishlist', 'header')}
                >
                  {t('nav.wishlist')}
                </Link>
                {user?.role === 'seller' && (
                  <Link 
                    to="/seller" 
                    className="text-text hover:text-accent transition-colors"
                    onClick={() => trackCTAClick('seller', 'header')}
                  >
                    {t('nav.seller')}
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-text hover:text-accent transition-colors"
                    onClick={() => trackCTAClick('admin', 'header')}
                  >
                    {t('nav.admin')}
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex-1 max-w-xl mx-8 hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" />
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/cart" 
                className="relative text-text hover:text-accent transition-colors"
                onClick={() => trackCTAClick('cart', 'header')}
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* Voice control button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-text hover:text-accent"
                onClick={() => {
                  trackCTAClick('voice_control', 'header');
                }}
                aria-label="Voice control"
              >
                <Mic size={20} />
              </Button>

              {user ? (
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 text-text hover:text-accent transition-colors"
                    onClick={() => trackCTAClick('user_menu', 'header')}
                  >
                    <User size={20} />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                      onClick={() => trackCTAClick('profile', 'user_menu')}
                    >
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-text hover:bg-muted hover:text-accent"
                      onClick={() => trackCTAClick('order_history', 'user_menu')}
                    >
                      {t('nav.orderHistory')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-text hover:bg-muted hover:text-accent"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 text-text hover:text-accent transition-colors"
                  onClick={() => trackCTAClick('login', 'header')}
                >
                  <User size={20} />
                  <span>{t('nav.login')}</span>
                </Link>
              )}

              <LanguageSwitcher />
              
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
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 rounded-full bg-muted text-text placeholder-text-dim focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-dim" />
                  </form>
                </div>
                <Link
                  to="/"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => {
                    trackCTAClick('home', 'mobile_menu');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/products"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => {
                    trackCTAClick('products', 'mobile_menu');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('nav.products')}
                </Link>
                <Link
                  to="/wishlist"
                  className="px-3 py-2 text-text hover:text-accent transition-colors"
                  onClick={() => {
                    trackCTAClick('wishlist', 'mobile_menu');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('nav.wishlist')}
                </Link>
                {user?.role === 'seller' && (
                  <Link
                    to="/seller"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => {
                      trackCTAClick('seller', 'mobile_menu');
                      setIsMenuOpen(false);
                    }}
                  >
                    {t('nav.seller')}
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-text hover:text-accent transition-colors"
                    onClick={() => {
                      trackCTAClick('admin', 'mobile_menu');
                      setIsMenuOpen(false);
                    }}
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                {user && (
                  <>
                    <Link
                      to="/profile"
                      className="px-3 py-2 text-text hover:text-accent transition-colors"
                      onClick={() => {
                        trackCTAClick('profile', 'mobile_menu');
                        setIsMenuOpen(false);
                      }}
                    >
                      {t('nav.profile')}
                    </Link>
                    <Link
                      to="/orders"
                      className="px-3 py-2 text-text hover:text-accent transition-colors"
                      onClick={() => {
                        trackCTAClick('order_history', 'mobile_menu');
                        setIsMenuOpen(false);
                      }}
                    >
                      {t('nav.orderHistory')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-text hover:text-accent text-left"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Voice control component */}
      <VoiceControl />
    </>
  );
};

export default Header;
```

```typescript