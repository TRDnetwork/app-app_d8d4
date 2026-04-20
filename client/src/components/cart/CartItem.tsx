import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { cartStore } from '../../stores/cartStore';
import { trackRemoveFromCart, trackCTAClick } from '../../lib/analytics';

const CartItem: React.FC<{ item: any }> = ({ item }) => {
  const removeItem = cartStore((state) => state.remove);

  const handleRemove = () => {
    removeItem(item.product._id);
    
    trackRemoveFromCart(item.product._id, item.quantity, {
      product_name: item.product.title,
      price: item.product.price
    });
  };

  const handleSaveForLater = () => {
    trackCTAClick('save_for_later', 'cart', {
      product_id: item.product._id,
      product_name: item.product.title
    });
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border">
      <img
        src={item.product.images?.[0]}
        alt={item.product.title}
        className="w-16 h-16 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-medium">{item.product.title}</h3>
        {item.variant && (
          <p className="text-sm text-text-dim">Variant: {item.variant}</p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-bold">{formatCurrency(item.product.price)}</span>
        
        <div className="flex items-center border border-border rounded">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            +
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-text-dim hover:text-error"
          onClick={handleSaveForLater}
          aria-label="Save for later"
        >
          Save
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-text-dim hover:text-error"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;