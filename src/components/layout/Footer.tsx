import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4 font-display">ShopSphere</h3>
            <p className="text-text-dim mb-4">Premium e-commerce platform with fast delivery and secure payments.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-dim hover:text-accent transition-colors">FB</a>
              <a href="#" className="text-text-dim hover:text-accent transition-colors">TW</a>
              <a href="#" className="text-text-dim hover:text-accent transition-colors">IG</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-text-dim hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-text-dim hover:text-accent transition-colors">Categories</Link></li>
              <li><Link to="/deals" className="text-text-dim hover:text-accent transition-colors">Deals</Link></li>
              <li><Link to="/new-arrivals" className="text-text-dim hover:text-accent transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-text-dim hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-text-dim hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-text-dim hover:text-accent transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-text-dim hover:text-accent transition-colors">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-text-dim hover:text-accent transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-text-dim hover:text-accent transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="text-text-dim hover:text-accent transition-colors">Wishlist</Link></li>
              <li><Link to="/settings" className="text-text-dim hover:text-accent transition-colors">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-text-dim">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;