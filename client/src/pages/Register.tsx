import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePageViewTracking } from '../hooks/useAnalytics';
import analytics from '../lib/analytics';
import { ANALYTICS_EVENTS } from '../lib/analyticsEvents';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  
  // Track page view
  usePageViewTracking('REGISTER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: call register API, redirect to verify email
    navigate('/verify-email');
    
    // Track sign up event
    analytics.track(ANALYTICS_EVENTS.SIGN_UP, {
      method: 'email',
      emailDomain: email.split('@')[1],
    });
  };

  const handleGoogleRegister = () => {
    // Track OAuth login
    analytics.track(ANALYTICS_EVENTS.OAUTH_LOGIN, {
      provider: 'google',
    });
  };

  const handleFacebookRegister = () => {
    // Track OAuth login
    analytics.track(ANALYTICS_EVENTS.OAUTH_LOGIN, {
      provider: 'facebook',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={handleGoogleRegister}>
          Continue with Google
        </Button>
      </div>
      <div className="mt-2">
        <Button variant="outline" className="w-full" onClick={handleFacebookRegister}>
          Continue with Facebook
        </Button>
      </div>
    </div>
  );
}