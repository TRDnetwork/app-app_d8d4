import React from 'react';
import { Button } from '../ui/button';
import { useCartStore } from '../../stores/cartStore';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, image }) => {
  const { t } = useTranslation();
  const { update, remove } = useCartStore();

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-border">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 object-cover rounded"
        loading="lazy"
        width={80}
        height={80}
      />
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-accent font-bold">{formatCurrency(price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => update(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => update(id, quantity + 1)}
        >
          +
        </Button>
      </div>
      <div className="text-right">
        <p className="font-bold">{formatCurrency