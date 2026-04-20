import React, { useState } from 'react';
import { Button } from './ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: {
    _id: string;
    product_id: string;
    title: string;
    price_snapshot: number;
    quantity: number;
    image: string;
  };
  onUpdate: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> =