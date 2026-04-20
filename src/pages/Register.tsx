import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import AuthForm from '../components/auth/AuthForm';
import { trackAuthEvent, trackCTAClick } from '../lib/analytics';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    trackAuthEvent('register');
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join ShopSphere and start shopping today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="register" onSuccess={handleAuthSuccess} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-text-dim">
            Already have an account?{' '}
            <button
              onClick={() => {
                trackCTAClick('sign_in', 'register_page');
                navigate('/login');
              }}
              className="text-accent hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;