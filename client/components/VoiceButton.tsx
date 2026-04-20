'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { voiceAgent } from '@/lib/voice';

export function VoiceButton() {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = async () => {
    if (isListening) {
      voiceAgent.stopListening();
      setIsListening(false);
    } else {
      try {
        await voiceAgent.startListening();
        setIsListening(true);
        
        // Provide audio feedback
        voiceAgent.speak('Listening. Speak your command.');
      } catch (error) {
        console.error('Failed to start listening:', error);
        toast({
          variant: 'destructive',
          title: 'Could Not Start Listening',
          description: 'Please check your microphone permissions',
        });
      }
    }
  };

  // Update listening state
  useState(() => {
    const interval = setInterval(() => {
      setIsListening(voiceAgent.isListening());
    }, 100);
    
    return () => clearInterval(interval);
  });

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={`transition-colors ${
        isListening ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
```

```typescript