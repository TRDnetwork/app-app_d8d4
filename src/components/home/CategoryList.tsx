import React from 'react';

export const CategoryList = () => {
  const categories = [
    { name: 'Electronics', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Clothing', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Home & Kitchen', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Books', image: '/placeholder.svg?height=100&width=100' },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.name} className="text-center">
            <img src={cat.image} alt={cat.name} className="w-16 h-16 mx-auto mb-2 rounded" />
            <p className="font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};