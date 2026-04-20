import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ id, title, price, quantity, image, onRemove }) => {
  const { updateItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateItem(id, newQuantity);
    }
  };

  return (
    <div 
      className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0"
      role="listitem"
      aria-label={`Cart item: ${title}`}
    >
      {/* Product image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="h-20 w-20 object-cover rounded"
          loading="lazy"
        />
      </div>

      {/* Product details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground">
          <a href={`/product/${id}`} className="hover:text-primary transition-colors">
            {title}
          </a>
        </h3>
        <p className="mt-1 text-sm text-text_dim">₹{price.toFixed(2)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity - 1)}
          aria-label={`Decrease quantity of ${title}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          className="h-8 w-16 text-center text-sm"
          min="1"
          aria-label={`Quantity of ${title}`}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity + 1)}
          aria-label={`Increase quantity of ${title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Item total */}
      <div className="text-sm font-medium text-foreground">
        ₹{(price * quantity).toFixed(2)}
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-text_dim hover:text-destructive"
        onClick={() => onRemove(id)}
        aria-label={`Remove ${title} from cart`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;