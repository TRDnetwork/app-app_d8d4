import React, { useState, useRef, useEffect } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className = '' 
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Only enable on mobile devices
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      setStartX(e.touches[0].clientX);
      setCurrentX(e.touches[0].clientX);
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;
      
      const diffX = e.touches[0].clientX - startX;
      
      // Limit swipe distance
      if (Math.abs(diffX) < 100) {
        setCurrentX(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      if (!isSwiping) return;
      
      const diffX = currentX - startX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (diffX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      setIsSwiping(false);
      setCurrentX(startX);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('touchstart', handleTouchStart, { passive: true });
      card.addEventListener('touchmove', handleTouchMove, { passive: true });
      card.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (card) {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isSwiping, startX, currentX, onSwipeLeft, onSwipeRight, isMobile]);

  const translateX = isSwiping ? currentX - startX : 0;

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        touchAction: 'pan-y'
      }}
    >
      {children}
    </div>
  );
};

export default SwipeableCard;