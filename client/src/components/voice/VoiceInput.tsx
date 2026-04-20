import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from '../../lib/hooks/use-toast';
import { speechRecognition, voiceCommandProcessor } from '../../lib/voice';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, placeholder = 'Start speaking...', disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(speechRecognition);

  useEffect(() => {
    if (!recognitionRef.current.isAvailable()) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive',
      });
    }
  }, []);

  const startListening = () => {
    if (disabled) return;

    setIsProcessing(true);
    
    recognitionRef.current.startListening(
      (text) => {
        setTranscript(text);
        onTranscript(text);
        
        // Process voice commands
        voiceCommandProcessor.processCommand(text);
      },
      (error) => {
        setIsProcessing(false);
        setIsListening(false);
        
        if (error === 'not-allowed') {
          toast({
            title: 'Permission denied',
            description: 'Please allow microphone access to use voice input.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Listening error',
            description: 'There was an error with speech recognition.',
            variant: 'destructive',
          });
        }
      }
    );
    
    setIsListening(true);
    setIsProcessing(false);
  };

  const stopListening = () => {
    recognitionRef.current.stopListening();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pr-12 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        disabled={disabled || isProcessing}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={toggleListening}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-4 w-4 text-destructive" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      {isListening && (
        <div className="absolute top-full left-0 mt-2 flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
}
```

```typescript