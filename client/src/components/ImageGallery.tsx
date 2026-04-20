import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleTouchStart = () => {
    setIsZoomed(true);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  // Only show thumbnails on larger screens
  const showThumbnails = window.innerWidth > 768;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main image */}
      <div className="flex-1 relative">
        <div 
          className={cn(
            "relative overflow-hidden rounded-lg",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={mainImage}
            alt="Main product"
            className={cn(
              "w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg",
              isZoomed && "scale-125"
            )}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
          />
          
          {/* Zoom overlay */}
          {isZoomed && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"
              style={{
                backgroundSize: '200% 200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
          )}
        </div>
      </div>
      
      {/* Thumbnails - only on larger screens */}
      {showThumbnails && (
        <div className="flex flex-col space-y-2 md:w-20">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={cn(
                "w-full h-20 object-cover border border-border rounded cursor-pointer hover:border-accent transition-colors",
                mainImage === img && "border-accent ring-2 ring-accent"
              )}
              aria-label={`Thumbnail ${i + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;