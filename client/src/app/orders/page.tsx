import Link from 'next/link';

export default function OrdersPage() {
  const orders = [
    {
      id: 'ORD-7X8K2M9N',
      date: '2023-12-01',
      total: 299.98,
      status: 'Delivered',
    },
    {
      id: 'ORD-5P3Q9R1S',
      date: '2023-11-15',
      total: 149.99,
      status: 'Delivered',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <div className="rounded border p-8 text-center">
          <p className="text-text_dim">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded border p-6">
              <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <h3 className="font-semibold">
                    Order{' '}
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-accent hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </h3>
                  <p className="text-sm text-text_dim">Placed on {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <p
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  View Details
                </Link>
                <Link
                  href="#"
                  className="text-sm text-accent hover:underline"
                >
                  Track Order
                </Link>
                <Link
                  href="#"
                  className="text-sm text-accent hover:underline"
                >
                  Reorder
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}