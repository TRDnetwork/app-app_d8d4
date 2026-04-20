import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Mic, StopCircle, Play, Download } from 'lucide-react';
import { toast } from '../../lib/hooks/use-toast';
import { audioRecorder } from '../../lib/voice';

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  className?: string;
}

export function AudioRecorder({ onRecordingComplete, className = '' }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef(audioRecorder);

  const startRecording = async () => {
    try {
      await recorderRef.current.startRecording((blob) => {
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
        
        toast({
          title: 'Recording complete',
          description: 'Your audio has been recorded successfully.',
        });
      });
      
      setIsRecording(true);
    } catch (error) {
      // Error is handled by the audioRecorder
    }
  };

  const stopRecording = () => {
    recorderRef.current.stopRecording();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `recording-${new Date().toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          onClick={toggleRecording}
        >
          {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {isRecording ? 'Recording...' : 'Record audio'}
        </span>
      </div>
      
      {isRecording && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      )}
      
      {audioUrl && (
        <div className="space-y-2">
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
          
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
            >
              {isPlaying ? <StopCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={downloadAudio}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

```typescript