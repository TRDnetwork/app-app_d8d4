import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  useEffect(() => {
    // The Supabase auth callback is handled by the auth listener
    // This component just provides a loading state
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}
```

```typescript