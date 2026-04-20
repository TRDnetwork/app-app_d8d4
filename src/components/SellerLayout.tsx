import React from 'react';
import Header from './Header';
import Sidebar from './SellerSidebar';

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;