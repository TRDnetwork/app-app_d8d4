import React from 'react';
import { Button } from '../components/ui/button';

const Addresses = () => {
  const addresses = [
    {
      id: '1',
      type: 'Home',
      line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      line1: '456 Office Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA',
      isDefault: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Addresses</h1>
      <div className="space-y-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="card flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">{addr.type}</span>
                {addr.isDefault && <span className="text-xs bg-accent text-primary-foreground px-2 py-1 rounded-full">Default</span>}
              </div>
              <p>{addr.line1}</p>
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Delete</Button>
              {!addr.isDefault && <Button size="sm">Set as Default</Button>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Button className="btn-primary">Add New Address</Button>
      </div>
    </div>
  );
};

export default Addresses;