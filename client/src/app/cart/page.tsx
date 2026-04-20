import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 199.99,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="rounded border p-8 text-center">
          <p className="text-text_dim">Your cart is empty</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded border p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-accent">${item.price}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="rounded-l border p-1 text-sm hover:bg-gray-100">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="rounded-r border p-1 text-sm hover:bg-gray-100">+</button>
                    </div>
                  </div>
                  <button className="text-text_dim hover:text-text">×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded border p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text_dim">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text_dim">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button asChild className="mt-6 w-full bg-accent hover:bg-orange-600">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}