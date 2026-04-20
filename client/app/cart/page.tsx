import { Button } from '@/components/ui/button';
import Link from 'next/link';

const cartItems = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 149.99,
    quantity: 1,
    image: 'https://via.placeholder.com/100x100?text=Headphones',
  },
  {
    id: '2',
    name: 'Premium Audio Cable',
    price: 29.99,
    quantity: 2,
    image: 'https://via.placeholder.com/100x100?text=Cable',
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Button asChild className="mt-4">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Cart Items */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center p-4 border-b border-gray-200 last:border-b-0 gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                      <select
                        value={item.quantity}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        Save for Later
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 w-full sm:w-auto">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Free delivery on orders over $50
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}