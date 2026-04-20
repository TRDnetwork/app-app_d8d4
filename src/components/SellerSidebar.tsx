import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingBag, BarChart, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/seller', icon: Home },
  { name: 'Products', path: '/seller/products', icon: Package },
  { name: 'Add Product', path: '/seller/add-product', icon: Package },
  { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
  { name: 'Analytics', path: '/seller/analytics', icon: BarChart },
  { name: 'Settings', path: '/seller/settings', icon: Settings },
];

const SellerSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border fixed h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Seller Dashboard</h2>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SellerSidebar;