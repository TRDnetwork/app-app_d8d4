import React from 'react';
import { AddressCard } from '../components/user/AddressCard';
import { Button } from '../components/ui/button';

export default function Addresses() {
  const addresses = [
    { id: '1', line1: '123 Main St', city: 'New York', state: 'NY', postal_code: '10001', country: 'USA', is_default: true },
    { id: '2', line1: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postal_code: '90210', country: 'USA', is_default: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Addresses</h1>
        <Button>Add New Address</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <AddressCard key={addr.id} address={addr} />
        ))}
      </div>
    </div>
  );
}