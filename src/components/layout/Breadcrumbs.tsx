import React from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="text-sm text-text-dim mb-4">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <Link to={item.href} className="hover:text-text transition-colors">
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className="mx-2">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;