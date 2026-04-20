import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Profile() {
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john@example.com');
  const [phone, setPhone] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: call API to update profile
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input value={email} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}