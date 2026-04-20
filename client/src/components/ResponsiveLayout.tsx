import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import BottomNavigation from './BottomNavigation';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {children}
      {isMobile && <BottomNavigation />}
    </>
  );
};

export default ResponsiveLayout;