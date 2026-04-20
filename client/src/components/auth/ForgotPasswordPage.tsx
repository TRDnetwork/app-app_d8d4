import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Loader2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is already handled by the auth system
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSubmitted ? 'Check your email' : 'Reset your password'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted 
              ? 'We\'ve sent a password reset link to your email address.'
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-accent hover:underline"
              >
                Back to sign in
              </button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6">
            <div className="text-center text-sm text-text-dim">
              <p>
                A password reset link has been sent to <strong>{email}</strong>.
              </p>
              <p className="mt-2">
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-accent hover:bg-orange-600"
            >
              Back to sign in
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
```

```typescript