import React from 'react';

export const Banner = () => (
  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
    <img
      src="/placeholder.svg?height=320&width=1200"
      alt="Hero Banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-2">Summer Sale</h2>
        <p className="text-lg md:text-xl">Up to 50% off on selected items</p>
      </div>
    </div>
  </div>
);