import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import AuthForm from '../components/auth/AuthForm';
import { trackCTAClick } from '../lib/analytics';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    trackCTAClick('back_to_login', 'forgot_password_page');
    navigate('/login');
  };

  return (
    <main id="main-content" className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="forgot-password" />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <button
            onClick={handleBackToLogin}
            className="text-sm text-accent hover:underline"
            aria-label="Back to login"
          >
            Back to login
          </button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ForgotPasswordPage;
```

```typescript