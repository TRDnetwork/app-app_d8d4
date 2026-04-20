import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { toast } from '../../lib/hooks/use-toast';
import { speechSynthesisService } from '../../lib/voice';

interface VoiceOutputProps {
  text: string;
  className?: string;
  disabled?: boolean;
}

export function VoiceOutput({ text, className = '', disabled = false }: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const synthesisRef = useRef(speechSynthesisService);

  useEffect(() => {
    if (synthesisRef.current.isAvailable()) {
      setVoices(synthesisRef.current.getVoices());
      
      // Set default voice if available
      const defaultVoice = synthesisRef.current.getVoices().find(voice => 
        voice.name.includes('Google') || voice.name.includes('US')
      );
      
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    }
  }, []);

  const speak = () => {
    if (disabled) return;

    if (!synthesisRef.current.isAvailable()) {
      toast({
        title: 'Text-to-speech not supported',
        description: 'Your browser does not support text-to-speech.',
        variant: 'destructive',
      });
      return;
    }

    setIsSpeaking(true);
    synthesisRef.current.speak(text, selectedVoice, rate, pitch);
  };

  const stop = () => {
    synthesisRef.current.stop();
    setIsSpeaking(false);
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak();
    }
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(event.target.value));
  };

  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(event.target.value));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleSpeaking}
          disabled={disabled}
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4 text-destructive" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {isSpeaking ? 'Speaking...' : 'Read aloud'}
        </span>
      </div>
      
      {synthesisRef.current.isAvailable() && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="voice" className="text-xs text-muted-foreground">Voice</label>
              <select
                id="voice"
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="w-full px-2 py-1 text-xs border border-input rounded"
                disabled={disabled}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="rate" className="text-xs text-muted-foreground">Rate: {rate.toFixed(1)}x</label>
              <input
                id="rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="w-full"
                disabled={disabled}
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="pitch" className="text-xs text-muted-foreground">Pitch: {pitch.toFixed(1)}</label>
              <input
                id="pitch"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={handlePitchChange}
                className="w-full"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

```typescript