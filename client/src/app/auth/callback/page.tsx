```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      // No token, redirect to login
      router.push('/auth/login');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        <p className="mt-4 text-text_dim">Completing authentication...</p>
      </div>
    </div>
  );
}
```