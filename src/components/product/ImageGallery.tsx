import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || 'https://via.placeholder.com/500');

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex lg:flex-col lg:w-20 space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            className="w-20 h-20 object-cover border border-border rounded cursor-pointer flex-shrink-0"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <div className="flex-1">
        <img
          src={mainImage}
          alt="Main product"
          className="w-full h-auto max-h-96 object-cont