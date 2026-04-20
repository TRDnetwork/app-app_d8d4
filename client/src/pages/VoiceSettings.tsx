import React from 'react';
import { useVoice } from '../lib/voice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import VoiceCommandList from '../components/VoiceCommandList';
import VoiceControl from '../components/VoiceControl';

const VoiceSettings: React.FC = () => {
  const { 
    voices, 
    currentVoice, 
    speechRate, 
    speechPitch, 
    selectVoice, 
    setRate, 
    setPitch 
  } = useVoice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display">Voice Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Voice Control</CardTitle>
              <CardDescription>Manage your voice interaction settings</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceControl />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
              <CardDescription>Available voice commands for navigation and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceCommandList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
```