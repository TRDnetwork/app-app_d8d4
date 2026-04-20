```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setStatus('sent');
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Check Your Email</h2>
          <p className="mt-2 text-text_dim">
            We've sent a password reset link to {email}. Please check your inbox.
          </p>
          <Button className="mt-6" onClick={() => router.push('/auth/login')}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-text_dim">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="mt-4 rounded-lg bg-error/10 p-4 text-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-text_dim">
            <span>Remember your password? </span>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-accent hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```