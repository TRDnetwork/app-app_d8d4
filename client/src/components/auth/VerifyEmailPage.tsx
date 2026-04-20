import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

  const handleVerifyEmail = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    setError(null);
    
    try {
      await verifyEmail(token);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      await resendVerificationEmail();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to {user?.email}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        {!token && (
          <Button onClick={handleResendEmail} disabled={isResending}>
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
        )}
        
        <Button variant="outline" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>
    </div>
  );
}
```

```typescript