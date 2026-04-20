import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, className }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isRefreshing) {
      const refresh = async () => {
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          setPullProgress(0);
        }
      };
      refresh();
    }
  }, [isRefreshing, onRefresh]);

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
    const diff = currentY.current - startY.current;
    
    if (diff > 0) {
      // Only allow pulling down
      e.preventDefault();
      const progress = Math.min(diff / 80, 1); // Max 80px pull
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullProgress > 0.6) {
      // Trigger refresh if pulled far enough
      setIsRefreshing(true);
    } else {
      // Reset if not pulled far enough
      setPullProgress(0);
    }
  };

  const getTransform = () => {
    if (isRefreshing) {
      return 'translateY(40px)';
    }
    return `translateY(${pullProgress * 40}px)`;
  };

  const getOpacity = () => {
    if (isRefreshing) {
      return 1;
    }
    return pullProgress;
  };

  return (
    <div 
      ref={containerRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="flex items-center justify-center h-10 transition-transform duration-200"
        style={{ 
          transform: getTransform(),
          opacity: getOpacity()
        }}
      >
        <div className="flex flex-col items-center">
          <div 
            className={`w-6 h-6 border-2 border-current border-t-transparent rounded-full transition-transform duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ 
              borderColor: pullProgress > 0.6 ? '#FF9900' : '#94A3B8',
              borderTopColor: 'transparent'
            }}
          />
          <span className="text-xs text-text_dim mt-1">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="transition-transform duration-300 ease-out"
        style={{ 
          transform: isRefreshing ? 'translateY(40px)' : `translateY(${pullProgress * 40}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;