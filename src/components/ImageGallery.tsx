import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex space-x-4">
      <div className="flex flex-col space-y-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            className="w-16 h-16 object-cover border border-border rounded cursor-pointer hover:border-accent"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <div className="flex-1 relative">
        <img
          src={mainImage}
          alt="Main product"
          className="w-full h-96 object-contain rounded"
          style={{ transition: 'transform 0.2s' }}
          onMouseMove={(e) => {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            e.currentTarget.style.transformOrigin = `${x * 100}% ${y * 10