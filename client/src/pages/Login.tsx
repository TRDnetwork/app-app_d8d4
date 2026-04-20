import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { trackAuthEvent } from '../lib/analytics';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: call login API, store token, redirect
    trackAuthEvent('login_attempt', 'email');
    navigate('/');
  };

  const handleGoogleLogin = () => {
    trackAuthEvent('login_attempt', 'google');
    // In real app: initiate Google OAuth flow
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Log In</Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="link">Forgot password?</Button>
      </div>
      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}