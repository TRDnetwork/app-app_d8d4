import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Settings } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { toast } from '../../lib/hooks/use-toast';
import { speechRecognition, speechSynthesisService } from '../../lib/voice';

export function VoiceSettings() {
  const [autoListen, setAutoListen] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  useEffect(() => {
    setSpeechRecognitionAvailable(speechRecognition.isAvailable());
    setSpeechSynthesisAvailable(speechSynthesisService.isAvailable());
  }, []);

  const handleAutoListenChange = (checked: boolean) => {
    setAutoListen(checked);
    
    if (checked && !speechRecognition.isAvailable()) {
      toast({
        title: 'Auto-listen not available',
        description: 'Speech recognition is not supported in your browser.',
        variant: 'destructive',
      });
    }
  };

  const handleVoiceFeedbackChange = (checked: boolean) => {
    setVoiceFeedback(checked);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVoiceLanguage(event.target.value);
    
    if (speechRecognition.isAvailable()) {
      // In a real app, this would update the recognition language
      toast({
        title: 'Language updated',
        description: `Voice recognition language set to ${event.target.selectedOptions[0].text}`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Voice Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-listen">Auto-listen</Label>
            <p className="text-sm text-muted-foreground">
              Automatically start listening when the app is active
            </p>
          </div>
          <Switch
            id="auto-listen"
            checked={autoListen}
            onCheckedChange={handleAutoListenChange}
            disabled={!speechRecognitionAvailable}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-feedback">Voice feedback</Label>
            <p className="text-sm text-muted-foreground">
              Provide spoken feedback for actions
            </p>
          </div>
          <Switch
            id="voice-feedback"
            checked={voiceFeedback}
            onCheckedChange={handleVoiceFeedbackChange}
            disabled={!speechSynthesisAvailable}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="voice-language">Voice Recognition Language</Label>
          <select
            id="voice-language"
            value={voiceLanguage}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-input rounded-md"
            disabled={!speechRecognitionAvailable}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            <option value="de-DE">German (Germany)</option>
          </select>
          {!speechRecognitionAvailable && (
            <p className="text-sm text-muted-foreground">
              Speech recognition is not supported in your browser
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${speechRecognitionAvailable ? 'bg-success' : 'bg-destructive'}`} />
              <span className="text-sm">Speech Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${speechSynthesisAvailable ? 'bg-success' : 'bg-destructive'}`} />
              <span className="text-sm">Text-to-Speech</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

```typescript