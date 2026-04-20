import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLImageElement>(null);

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || !isZoomed) return;
    
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main image with zoom */}
      <div 
        className="relative flex-1 cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onClick={toggleZoom}
      >
        <img
          ref={mainImageRef}
          src={images[mainImageIndex]}
          alt={`Main product image ${mainImageIndex + 1}`}
          className={`
            w-full h-96 object-contain rounded-lg
            ${isZoomed ? 'hidden' : 'block'}
          `}
          style={{ transition: 'transform 0.2s' }}
        />
        
        {/* Zoomed view */}
        {isZoomed && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
            <img
              src={images[mainImageIndex]}
              alt={`Zoomed product image ${mainImageIndex + 1}`}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(2)`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-white bg-black/50 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <ZoomIn className="h-4 w-4 rotate-45" />
            </Button>
          </div>
        )}
        
        {/* Zoom button */}
        {!isZoomed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 text-white bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setMainImageIndex(i);
              setIsZoomed(false);
            }}
            className={`
              flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden
              transition-all duration-200
              ${mainImageIndex === i 
                ? 'border-accent scale-105' 
                : 'border-border hover:border-accent/50'
              }
            `}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {/* Image navigation buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center text-sm text-text_dim">
          {mainImageIndex + 1} of {images.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ImageGallery;