'use client';

import { ReactNode } from 'react';

export function Carousel({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
        {children}
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}