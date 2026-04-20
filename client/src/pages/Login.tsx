import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../lib/auth';
import { trackAuthEvent, trackCTAClick } from '../lib/analytics';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getAuthError } = useAuth();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    }
    
    // Handle OAuth errors
    const authError = getAuthError();
    if (authError) {
      // Error is already displayed by the auth system
    }
  }, [user, navigate, searchParams]);

  const handleAuthSuccess = () => {
    trackAuthEvent('login');
  };

  const handleForgotPassword = () => {
    trackCTAClick('forgot_password', 'login_page');
  };

  return (
    <main id="main-content" className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to ShopSphere</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" onSuccess={handleAuthSuccess} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-accent hover:underline"
            aria-label="Forgot your password?"
          >
            Forgot password?
          </button>
          <div className="text-sm text-center text-text-dim">
            Don't have an account?{' '}
            <button
              onClick={() => {
                trackCTAClick('create_account', 'login_page');
                navigate('/register');
              }}
              className="text-accent hover:underline font-medium"
              aria-label="Create a new account"
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;
```

```typescript