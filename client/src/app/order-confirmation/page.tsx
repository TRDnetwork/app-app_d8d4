import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-lg border p-8 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
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
        </div>
        <h1 className="mb-4 text-2xl font-bold">Thank You for Your Order!</h1>
        <p className="mb-2 text-text_dim">Your order has been confirmed and will be processed soon.</p>
        <p className="mb-6">
          <span className="font-mono font-semibold">Order #</span>
          <span className="font-mono">ORD-7X8K2M9N</span>
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-orange-600">
          <Link href="/orders">View Order History</Link>
        </Button>
      </div>
    </div>
  );
}