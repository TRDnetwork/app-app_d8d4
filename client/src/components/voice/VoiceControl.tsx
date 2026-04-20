import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../../stores/voiceStore';

const VoiceControl: React.FC = () => {
  const { 
    isListening, 
    isMuted, 
    startListening, 
    stopListening, 
    toggleMute,
    speak,
    voice,
    rate,
    pitch
  } = useVoice();
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        // Process commands when speech ends
        if (!event.results[current].isFinal) return;
        
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart recognition for continuous listening
          recognitionRef.current.start();
        }
      };
    }
  }, [isListening]);

  // Process voice commands
  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Add to cart command
    if (lowerText.includes('add') && lowerText.includes('to cart')) {
      const productName = extractProductName(lowerText, 'add');
      if (productName) {
        speak(`Adding ${productName} to your cart`);
        // Trigger add to cart action
        // This would be connected to the cart store
      }
    }
    
    // Search command
    else if (lowerText.includes('search for') || lowerText.includes('find')) {
      const query = extractSearchQuery(lowerText);
      if (query) {
        speak(`Searching for ${query}`);
        // Trigger search action
        // This would be connected to the search functionality
      }
    }
    
    // Navigate commands
    else if (lowerText.includes('go to cart')) {
      speak('Opening your shopping cart');
      // Navigate to cart page
    }
    else if (lowerText.includes('go to checkout')) {
      speak('Taking you to checkout');
      // Navigate to checkout page
    }
    else if (lowerText.includes('go home') || lowerText.includes('main page')) {
      speak('Taking you to the home page');
      // Navigate to home page
    }
    
    // Help command
    else if (lowerText.includes('help') || lowerText.includes('what can i say')) {
      const helpText = "You can say: 'Add [product name] to cart', 'Search for [query]', 'Go to cart', 'Go to checkout', or 'Help' for this list.";
      speak(helpText);
    }
    
    // Clear transcript after processing
    setTranscript('');
  };

  // Extract product name from command
  const extractProductName = (text: string, command: string): string | null => {
    const regex = new RegExp(`${command}\\s+(.+)\\s+to\\s+cart`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  // Extract search query from command
  const extractSearchQuery = (text: string): string | null => {
    let query = '';
    if (text.includes('search for')) {
      query = text.split('search for')[1];
    } else if (text.includes('find')) {
      query = text.split('find')[1];
    }
    
    return query ? query.trim() : null;
  };

  // Start/stop listening
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      startListening();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  // Speak text
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleListening}
            className={isListening ? 'text-accent' : ''}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={isMuted ? 'text-destructive' : ''}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            disabled={!transcript || isMuted}
            className={isSpeaking ? 'text-accent' : ''}
            aria-label="Speak transcript"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
        
        {transcript && (
          <div className="text-sm text-text p-2 bg-muted rounded">
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControl;
```

```typescript