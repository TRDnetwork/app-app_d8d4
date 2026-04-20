import React from 'react';
import { Button } from '../components/ui/button';

const Addresses = () => {
  const addresses = [
    {
      id: '1',
      type: 'home',
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'USA',
      is_default: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Addresses</h1>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="card flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <h3 className="text-lg font-bold">{addr.type === 'home' ? 'Home' : addr.type === 'work' ? 'Work' : 'Other'}</h3>
              <p>{addr.line1}</p>
              <p>{addr.city}, {addr.state} {addr.postal_code}</p>
              <p>{addr.country}</p>
              {addr.is_default && <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">Default</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-6">Add New Address</Button>
    </div>
  );
};

export default Addresses;