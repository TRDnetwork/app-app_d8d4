import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Store, Folder, Image, Gift, BarChart } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Sellers', path: '/admin/sellers', icon: Store },
  { name: 'Categories', path: '/admin/categories', icon: Folder },
  { name: 'Banners', path: '/admin/banners', icon: Image },
  { name: 'Coupons', path: '/admin/coupons', icon: Gift },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border fixed h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
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

export default AdminSidebar;