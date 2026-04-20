import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-3 text-xs transition-colors ${
            isActive('/') ? 'text-primary' : 'text-text_dim'
          }`}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <Home className="h-6 w-6 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link
          to="/search"
          className={`flex flex-col items-center justify-center p-3 text-xs transition-colors ${
            isActive('/search') ? 'text-primary' : 'text-text_dim'
          }`}
          aria-current={isActive('/search') ? 'page' : undefined}
        >
          <Search className="h-6 w-6 mb-1" />
          <span>Search</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center justify-center p-3 text-xs transition-colors ${
            isActive('/cart') ? 'text-primary' : 'text-text_dim'
          }`}
          aria-current={isActive('/cart') ? 'page' : undefined}
        >
          <ShoppingCart className="h-6 w-6 mb-1" />
          <span>Cart</span>
        </Link>
        
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center p-3 text-xs transition-colors ${
            isActive('/wishlist') ? 'text-primary' : 'text-text_dim'
          }`}
          aria-current={isActive('/wishlist') ? 'page' : undefined}
        >
          <Heart className="h-6 w-6 mb-1" />
          <span>Wishlist</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center p-3 text-xs transition-colors ${
            isActive('/profile') ? 'text-primary' : 'text-text_dim'
          }`}
          aria-current={isActive('/profile') ? 'page' : undefined}
        >
          <User className="h-6 w-6 mb-1" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
```

```typescript