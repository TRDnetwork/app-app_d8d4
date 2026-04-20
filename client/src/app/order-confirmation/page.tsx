'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const { toast } = useToast();

  useEffect(() => {
    if (!session_id) {
      router.push('/cart');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/payment/order-details?session_id=${session_id}`);
        const data = await res.json();
        
        if (data.success) {
          setOrderDetails(data.order);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load order details',
        });
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [session_id, router, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <CardTitle className="text-2xl">Thank you for your order!</CardTitle>
            <p className="text-gray-600 mt-2">Your order has been confirmed and will be processed shortly.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-mono font-bold">{orderDetails?.orderNumber}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${orderDetails?.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${orderDetails?.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${orderDetails?.shipping_cost === 0 ? 'Free' : orderDetails?.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>${orderDetails?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• You will receive an email confirmation with your order details</li>
              <li>• Track your order status in your account dashboard</li>
              <li>• Estimated delivery: {orderDetails?.estimatedDelivery}</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <a href="/orders">View Order History</a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}