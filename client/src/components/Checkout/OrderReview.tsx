import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { useCartStore } from '../../stores/cartStore';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Truck, CreditCard, MapPin } from 'lucide-react';

const OrderReview: React.FC = () => {
  const { selectedAddress, deliveryOption, paymentMethod } = useCheckoutStore();
  const { items, total } = useCartStore();

  const deliveryCharge = deliveryOption?.price || 0;
  const finalTotal = total + deliveryCharge;

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Shipping Address</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="font-medium capitalize">{selectedAddress?.type} Address</div>
            <div>{selectedAddress?.line1}</div>
            {selectedAddress?.line2 && <div>{selectedAddress.line2}</div>}
            <div>
              {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}
            </div>
            <div>{selectedAddress?.country}</div>
          </div>
          <Button variant="link" className="p-0 h-auto mt-2 text-accent">
            Change Address
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Delivery Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <div className="font-medium">{deliveryOption?.label}</div>
              <div className="text-text_dim text-sm mt-1">{deliveryOption?.estimated}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {deliveryOption?.price === 0 ? 'Free' : formatCurrency(deliveryOption?.price)}
              </div>
            </div>
          </div>
          <Button variant="link" className="p-0 h-auto mt-2 text-accent">
            Change Delivery
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <div className="font-medium">
                {paymentMethod?.type === 'card' 
                  ? `Card ending in ${paymentMethod?.last4}` 
                  : paymentMethod?.type === 'upi' 
                    ? 'UPI' 
                    : 'Cash on Delivery'
                }
              </div>
              {paymentMethod?.type === 'card' && (
                <div className="text-text_dim text-sm mt-1 capitalize">{paymentMethod?.brand}</div>
              )}
            </div>
            <div className="text-right">
              <Badge variant="secondary">
                {paymentMethod?.type === 'card' ? 'Card' : paymentMethod?.type === 'upi' ? 'UPI' : 'COD'}
              </Badge>
            </div>
          </div>
          <Button variant="link" className="p-0 h-auto mt-2 text-accent">
            Change Payment
          </Button>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>{items.length} items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-2 border-b border-border last:border-b-0">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium line-clamp-2">{item.name}</div>
                <div className="text-text_dim text-sm">Qty: {item.quantity}</div>
              </div>
              <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text_dim">Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text_dim">Delivery</span>
            <span>{deliveryOption?.price === 0 ? 'Free' : formatCurrency(deliveryOption?.price)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReview;
```

```typescript