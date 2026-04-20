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
    <div 
      className="flex items-center gap-3 py-3 border-b border-border"
      role="listitem"
    >
      <img
        src={item.product.images?.[0]}
        alt={item.product.title}
        className="w-14 h-14 object-cover rounded min-h-14 min-w-14"
        aria-label={`Product image: ${item.product.title}`}
      />
      
      <div className="flex-1 min-w-0">
        <h3 
          className="font-medium text-sm line-clamp-2"
          role="heading"
          aria-level={3}
        >
          {item.product.title}
        </h3>
        {item.variant && (
          <p 
            className="text-xs text-text-dim"
            id={`variant-${item.product._id}`}
          >
            {item.variant}
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <span 
          className="font-bold text-sm"
          aria-label={`Price: ${formatCurrency(item.product.price)}`}
        >
          {formatCurrency(item.product.price)}
        </span>
        
        <div 
          className="flex items-center border border-border rounded min-h-10"
          role="group"
          aria-label="Quantity selector"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <span 
            className="w-8 text-center text-sm"
            id={`quantity-${item.product._id}`}
          >
            {item.quantity}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            aria-label="Increase quantity"
          >
            +
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-dim hover:text-error text-xs min-h-8 min-w-16"
            onClick={handleSaveForLater}
            aria-label="Save for later"
            tabIndex={0}
          >
            Save
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-text-dim hover:text-error text-xs min-h-8 min-w-16"
            onClick={handleRemove}
            aria-label="Remove item from cart"
            tabIndex={0}
          >
            <Trash2 
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;