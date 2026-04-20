import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 md:w-20">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            className={`w-full h-20 object-cover cursor-pointer rounded border-2 ${
              mainImage === img ? 'border-primary' : 'border-border'
            }`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <div className="flex-1">
        <img
          src={mainImage}
          alt="Main product"
          className="w-full h-96 object-contain bg-surface rounded"
        />
      </div>
    </div>
  );
};

export default ImageGallery;