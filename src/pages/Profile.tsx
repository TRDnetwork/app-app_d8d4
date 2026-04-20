import React from 'react';
import { Button } from '../components/ui/button';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Profile</h1>
      <div className="card">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="w-full p-2 border rounded" defaultValue="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full p-2 border rounded" defaultValue="john@example.com" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" className="w-full p-2 border rounded" defaultValue="+1 555-123-4567" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;