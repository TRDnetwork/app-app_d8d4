```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'resetting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/auth/forgot-password');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStatus('resetting');
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Password Reset!</h2>
          <p className="mt-2 text-text_dim">Your password has been successfully reset.</p>
          <Button className="mt-6" onClick={() => router.push('/auth/login')}>
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="mt-2 text-text_dim">Enter your new password below.</p>
          
          {error && (
            <div className="mt-4 rounded-lg bg-error/10 p-4 text-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={status === 'resetting'}>
              {status === 'resetting' ? 'Resetting...' : 'Reset Password'}
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