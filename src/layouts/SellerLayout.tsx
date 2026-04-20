import React from 'react';
import SellerHeader from '../seller/components/SellerHeader';
import SellerSidebar from '../seller/components/SellerSidebar';

const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-surface">
      <SellerSidebar />
      <div className="flex-1 flex flex-col">
        <SellerHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;