import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    toast({
      variant: 'destructive',
      title: 'Unauthorized',
      description: 'Please log in to proceed with checkout.',
    });
    return <Navigate to="/login" />;
  }

  return (
    <div className="container px-4 py-8">
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;