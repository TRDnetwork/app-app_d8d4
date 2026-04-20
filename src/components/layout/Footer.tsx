import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-text mb-4">ShopSphere</h3>
            <p className="text-text-dim text-sm mb-4">
              Premium e-commerce platform with AI recommendations, secure checkout, and real-time order tracking.
            </p>
            <div className="flex gap-4">
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
            <h4 className="font-medium text-text mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-text-dim">
              <li><a href="#" className="hover:text-text transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-text transition-colors">Deals</a></li>
              <li><a href="#" className="hover:text-text transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-text transition-colors">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-dim">
              <li><a href="#" className="hover:text-text transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-text transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-text transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-text transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-4">Stay Updated</h4>
            <p className="text-text-dim text-sm mb-4">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-card border-border" />
              <Button>Join</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-dim">
          &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;