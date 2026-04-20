import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 rounded border p-6">
            <h2 className="mb-4 text-lg font-semibold">1. Shipping Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="rounded border p-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="rounded border p-2"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                className="w-full rounded border p-2"
                required
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input type="text" placeholder="City" className="rounded border p-2" required />
                <input type="text" placeholder="State" className="rounded border p-2" required />
                <input type="text" placeholder="ZIP" className="rounded border p-2" required />
              </div>
              <input
                type="text"
                placeholder="Phone"
                className="w-full rounded border p-2"
                required
              />
              <div className="flex items-center">
                <input type="checkbox" id="save" className="mr-2" />
                <label htmlFor="save" className="text-sm text-text_dim">
                  Save this information for next time
                </label>
              </div>
            </form>
          </div>

          <div className="mb-6 rounded border p-6">
            <h2 className="mb-4 text-lg font-semibold">2. Payment Method</h2>
            <div className="space-y-4">
              <div className="rounded border p-4">
                <label className="flex cursor-pointer items-center">
                  <input type="radio" name="payment" className="mr-3" defaultChecked />
                  <span>Credit Card</span>
                </label>
                <div className="ml-6 mt-3 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full rounded border p-2"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="rounded border p-2"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="rounded border p-2"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded border p-4">
                <label className="flex cursor-pointer items-center">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>PayPal</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded border p-6">
            <h2 className="mb-4 text-lg font-semibold">3. Review Order</h2>
            <div className="space-y-2">
              {[
                { name: 'Wireless Headphones', price: 99.99 },
                { name: 'Smart Watch', price: 199.99 },
              ].map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>$299.98</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-8 rounded border p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <Button asChild className="w-full bg-accent hover:bg-orange-600">
              <Link href="/order-confirmation">Place Order</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-text_dim">
              By placing your order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}