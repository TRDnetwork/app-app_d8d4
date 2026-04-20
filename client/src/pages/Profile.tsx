import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { VoiceSettings } from '../components/voice/VoiceSettings';
import { VoiceCommandList } from '../components/voice/VoiceCommandList';
import { AudioRecorder } from '../components/voice/AudioRecorder';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Profile</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" defaultValue="john@example.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input type="tel" id="phone" defaultValue="+1 555-123-4567" />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <VoiceSettings />
          <VoiceCommandList />
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Audio Recorder</CardTitle>
          <CardDescription>Record and save audio messages</CardDescription>
        </CardHeader>
        <CardContent>
          <AudioRecorder />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
```