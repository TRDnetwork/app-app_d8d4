import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-accent mb-4">ShopSphere</h3>
            <p className="text-text_dim text-sm">Premium e-commerce platform with curated products, fast delivery, and trusted reviews.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-text_dim hover:text-accent">Help Center</Link></li>
              <li><Link to="/returns" className="text-text_dim hover:text-accent">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="text-text_dim hover:text-accent">Shipping Info</Link></li>
              <li><Link to="/contact" className="text-text_dim hover:text-accent">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-text_dim hover:text-accent">About Us</Link></li>
              <li><Link to="/careers" className="text-text_dim hover:text-accent">Careers</Link></li>
              <li><Link to="/press" className="text-text_dim hover:text-accent">Press</Link></li>
              <li><Link to="/blog" className="text-text_dim hover:text-accent">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-text_dim hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-text_dim hover:text-accent">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-text_dim hover:text-accent">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-text_dim text-sm">
          &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};