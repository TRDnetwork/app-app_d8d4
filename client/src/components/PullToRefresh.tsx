import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Only enable on mobile devices
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (containerRef.current && containerRef.current.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        currentY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling && containerRef.current && containerRef.current.scrollTop === 0) {
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;
        
        if (diff > 0) {
          e.preventDefault();
          setIsPulling(true);
          setPullProgress(Math.min(diff / 60, 1));
        }
      } else if (isPulling) {
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;
        setPullProgress(Math.min(diff / 60, 1));
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling) {
        setIsPulling(false);
        
        if (pullProgress > 0.8) {
          setIsRefreshing(true);
          try {
            await onRefresh();
          } catch (error) {
            console.error('Refresh failed:', error);
          } finally {
            setIsRefreshing(false);
          }
        }
        
        setPullProgress(0);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isPulling, pullProgress, onRefresh, isMobile]);

  return (
    <div 
      ref={containerRef} 
      className="flex-1 overflow-y-auto relative"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull indicator */}
      {isMobile && (
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center h-12 bg-surface z-10"
          style={{ 
            transform: `translateY(${isPulling || isRefreshing ? '0' : '-100%'})`,
            opacity: isPulling || isRefreshing ? 1 : 0,
            transition: 'transform 0.3s, opacity 0.3s'
          }}
        >
          <div className="flex flex-col items-center">
            <svg 
              className={`w-6 h-6 text-text_dim transition-transform ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.504 7.504 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm text-text_dim mt-1">
              {isRefreshing ? 'Refreshing...' : pullProgress > 0.8 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      
      <div 
        className="pt-12"
        style={{ 
          transform: isPulling ? `translateY(${pullProgress * 60}px)` : 'translateY(0)',
          transition: isRefreshing ? 'none' : 'transform 0.3s'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;