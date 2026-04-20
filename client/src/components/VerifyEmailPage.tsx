'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage({ token }: { token: string }) {
  const { toast } = useToast();
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useState(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Email verified successfully. You can now sign in.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to verify email",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail, toast]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        <p className="text-text_dim">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      {isSuccess ? (
        <>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Email Verified</h2>
          <p className="text-text_dim">Your email has been successfully verified.</p>
          <Button onClick={() => router.push('/auth/login')}>
            Continue to Sign In
          </Button>
        </>
      ) : (
        <>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-error/20">
            <svg className="h-8 w-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Verification Failed</h2>
          <p className="text-text_dim">The verification link is invalid or has expired.</p>
          <Button variant="outline" onClick={() => router.push('/auth/login')}>
            Return to Sign In
          </Button>
        </>
      )}
    </div>
  );
}