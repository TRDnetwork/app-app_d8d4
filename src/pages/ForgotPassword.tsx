import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: call forgot password API
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <p className="text-text-dim mb-6">Enter your email to receive a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Send Reset Link</Button>
      </form>
    </div>
  );
}