import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { trackCTAClick } from '../lib/analytics';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail } = useAuth();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link');
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setIsVerified(true);
      } catch (err: any) {
        setError(err.message || 'Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleContinue = () => {
    trackCTAClick('continue_shopping', 'verify_email_page');
    navigate('/login');
  };

  return (
    <main id="main-content" className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            Confirming your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {isVerifying ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
              <p className="text-text-dim">Verifying your email address...</p>
            </>
          ) : isVerified ? (
            <>
              <CheckCircle className="h-12 w-12 text-success" />
              <p className="text-center">
                Your email has been successfully verified! You can now log in to your account.
              </p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 text-error flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-center text-error">
                {error}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={handleContinue}
            className="w-full bg-accent hover:bg-orange-600"
            disabled={isVerifying}
          >
            Continue to Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default VerifyEmailPage;
```

```typescript