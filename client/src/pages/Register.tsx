import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { trackAuthEvent } from '../lib/analytics';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: call register API, redirect to verify email
    trackAuthEvent('registration_started', 'email');
    navigate('/verify-email');
  };

  const handleGoogleRegister = () => {
    trackAuthEvent('registration_started', 'google');
    // In real app: initiate Google OAuth flow
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
    </div>
  );
}