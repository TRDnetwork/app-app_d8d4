import { notFound } from 'next/navigation';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Mock order data
  const order = {
    id: params.id,
    date: 'December 1, 2023',
    status: 'Delivered',
    trackingNumber: '1Z999AA1234567890',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States',
    },
    items: [
      {
        name: 'Wireless Headphones',
        price: 99.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
      {
        name: 'Smart Watch',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
      },
    ],
    subtotal: 299.98,
    shipping: 9.99,
    tax: 24.00,
    total: 333.97,
  };

  if (!order) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row">
        <h1 className="text-2xl font-bold">Order {order.id}</h1>
        <div className="flex gap-4">
          <button className="text-sm text-accent hover:underline">Download Invoice</button>
          <button className="text-sm text-accent hover:underline">Return Items</button>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="mb-8 rounded border p-6">
        <h2 className="mb-4 text-lg font-semibold">Order Status</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { status: 'Placed', date: 'Dec 1', active: true },
            { status: 'Confirmed', date: 'Dec 1', active: true },
            { status: 'Shipped', date: 'Dec 2', active: true },
            { status: 'Out for Delivery', date: 'Dec 3', active: true },
            { status: 'Delivered', date: 'Dec 4', active: true },
          ].map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                  step.active
                    ? 'bg-accent text-white'
                    : 'border-2 border-border text-text_dim'
                }`}
              >
                {step.active && (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium">{step.status}</p>
              <p className="text-xs text-text_dim">{step.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded border p-6">
          <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zip}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <div className="rounded border p-6">
          <h3 className="mb-4 text-lg font-semibold">Tracking Information</h3>
          <p>
            <span className="font-medium">Carrier:</span> UPS
          </p>
          <p>
            <span className="font-medium">Tracking #:</span>{' '}
            <span className="font-mono">{order.trackingNumber}</span>
          </p>
          <button className="mt-2 text-sm text-accent hover:underline">
            Track Package
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8 rounded border p-6">
        <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-text_dim">
                  Quantity: {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded border p-6">
        <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text_dim">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text_dim">Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text_dim">Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}