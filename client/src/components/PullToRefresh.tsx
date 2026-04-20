import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  children, 
  onRefresh, 
  threshold = 80 
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (refreshing) {
      onRefresh().finally(() => {
        setRefreshing(false);
        setPullDistance(0);
      });
    }
  }, [refreshing, onRefresh]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      setIsPulling(true);
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance > threshold) {
      setRefreshing(true);
    } else {
      setPullDistance(0);
    }
  };

  const pullTransform = `translateY(${pullDistance}px)`;
  const opacity = pullDistance > threshold ? 1 : pullDistance / threshold;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center bg-card transition-transform duration-150 z-10"
        style={{ 
          transform: pullTransform,
          height: pullDistance
        }}
      >
        <div 
          className="text-muted-foreground text-sm transition-opacity"
          style={{ opacity }}
        >
          {pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
        </div>
        <div 
          className="mt-2 w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin"
          style={{ 
            opacity,
            display: pullDistance > 0 ? 'block' : 'none'
          }}
        />
      </div>

      {/* Content */}
      <div 
        style={{ 
          transform: refreshing ? 'translateY(60px)' : pullTransform,
          transition: refreshing ? 'transform 0.2s ease-in' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};