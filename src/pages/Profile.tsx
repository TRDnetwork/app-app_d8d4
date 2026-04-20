import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Profile</h1>
      <div className="max-w-2xl">
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-text-dim mb-2">Name</label>
              <Input defaultValue="John Doe" />
            </div>
            <div>
              <label className="block text-text-dim mb-2">Email</label>
              <Input defaultValue="john@example.com" disabled />
            </div>
            <div>
              <label className="block text-text-dim mb-2">Phone</label>
              <Input defaultValue="+1 (555) 123-4567" />
            </div>
            <Button className="btn-primary">Save Changes</Button>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-4 mb-4">
            <img src="/placeholder.svg" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <Button variant="outline">Upload New</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;