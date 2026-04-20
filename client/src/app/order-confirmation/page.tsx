import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id') || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been successfully processed. We're preparing your
            items for shipment.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-2">Order Details</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Order ID:</span>{' '}
                <span className="font-mono">{sessionId}</span>
              </p>
              <p>
                <span className="text-gray-600">Status:</span>{' '}
                <span className="text-green-600 font-medium">Confirmed</span>
              </p>
              <p>
                <span className="text-gray-600">Estimated Delivery:</span>{' '}
                5-7 business days
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to your registered email address
            with tracking information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/orders">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}