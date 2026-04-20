import React from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { wishlistStore } from '../stores/wishlistStore';

const Wishlist = () => {
  const items = wishlistStore((s) => s.items);

  if (