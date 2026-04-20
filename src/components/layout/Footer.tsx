import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">ShopSphere</h3>
            <p className="text-text_dim mb-4">Premium e-commerce platform with advanced shopping experience.</p>
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
              <li><a href="#" className="hover:text-foreground">All Products</a></li>
              <li><a href="#" className="hover:text-foreground">Deals</a></li>
              <li><a href="#" className="hover:text-foreground">New Arrivals</a></li>
              <li><a href="#" className="hover:text-foreground">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-text_dim">
              <li><a href="#" className="hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground">Returns</a></li>
              <li><a href="#" className="hover:text-foreground">Order Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-text_dim text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-surface border-border" />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-text_dim text-sm">
          &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;