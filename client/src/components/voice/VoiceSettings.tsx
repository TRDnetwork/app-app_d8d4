import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useVoice } from '../../stores/voiceStore';

const VoiceSettings: React.FC = () => {
  const { 
    voices, 
    voice, 
    rate, 
    pitch, 
    setVoice, 
    setRate, 
    setPitch 
  } = useVoice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Settings</CardTitle>
        <CardDescription>Customize your voice interaction experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <Select value={voice?.name} onValueChange={(value) => {
            const selectedVoice = voices.find(v => v.name === value);
            if (selectedVoice) setVoice(selectedVoice);
          }}>
            <SelectTrigger id="voice">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rate">Speech Rate: {rate.toFixed(1)}</Label>
          <Slider
            id="rate"
            min={0.5}
            max={2}
            step={0.1}
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
          />
          <p className="text-xs text-text-dim">Adjust the speed of speech</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
          <Slider
            id="pitch"
            min={0}
            max={2}
            step={0.1}
            value={[pitch]}
            onValueChange={(value) => setPitch(value[0])}
          />
          <p className="text-xs text-text-dim">Adjust the tone of speech</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
```

```typescript