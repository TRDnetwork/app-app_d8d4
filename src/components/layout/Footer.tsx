import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-accent mb-4">ShopSphere</h3>
            <p className="text-text_dim mb-4">Premium e-commerce platform built for trust, speed, and satisfaction.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-text_dim">
              <li><Link to="/products" className="hover:text-accent">All Products</Link></li>
              <li><Link to="/deals" className="hover:text-accent">Deals of the Day</Link></li>
              <li><Link to="/new" className="hover:text-accent">New Arrivals</Link></li>
              <li><Link to="/brands" className="hover:text-accent">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-text_dim">
              <li><Link to="/help" className="hover:text-accent">Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-accent">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-accent">Shipping Info</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-text_dim">
              <li><Link to="/profile" className="hover:text-accent">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-accent">Order History</Link></li>
              <li><Link to="/addresses" className="hover:text-accent">Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-accent">Wishlist</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-text_dim">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;