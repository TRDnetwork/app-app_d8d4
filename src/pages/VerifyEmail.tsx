import React from 'react';
import { Button } from '../components/ui/button';

export default function VerifyEmail() {
  // In real app: verify token from URL param
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Email Verified</h1>
      <p className="text-text-dim mb-6">Your email has been successfully verified.</p>
      <Button>Continue to Dashboard</Button>
    </div>
  );
}