import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-accent mb-4">ShopSphere</h3>
            <p className="text-text-dim text-sm mb-4">
              Premium e-commerce platform with a focus on quality, service, and value.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-text-dim hover:text-accent">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-dim hover:text-accent">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-dim hover:text-accent">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-text-dim hover:text-accent">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-text mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-text-dim">
              <li><a href="#" className="hover:text-accent">All Products</a></li>
              <li><a href="#" className="hover:text-accent">Deals & Promotions</a></li>
              <li><a href="#" className="hover:text-accent">New Arrivals</a></li>
              <li><a href="#" className="hover:text-accent">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-dim">
              <li><a href="#" className="hover:text-accent">Help Center</a></li>
              <li><a href="#" className="hover:text-accent">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-accent">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-4">Stay Updated</h4>
            <p className="text-text-dim text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="h-9" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-dim text-sm">
            &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-text-dim hover:text-accent text-sm">Privacy Policy</a>
            <a href="#" className="text-text-dim hover:text-accent text-sm">Terms of Service</a>
            <a href="#" className="text-text-dim hover:text-accent text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;