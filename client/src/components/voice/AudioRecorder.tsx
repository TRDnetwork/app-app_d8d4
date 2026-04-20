import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const { toast } = useToast();

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak into your microphone",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone",
      });
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Audio saved",
      });
    }
  };

  // Download audio
  const downloadAudio = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Audio file saved to your device",
    });
  };

  // Upload audio
  const uploadAudio = async () => {
    if (!audioBlob) return;
    
    // In a real app, this would upload to a server
    // For now, we'll just show a toast
    toast({
      title: "Uploading",
      description: "Uploading audio to server...",
    });
    
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "Uploaded",
        description: "Audio uploaded successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isRecording && !mediaRecorderRef.current}
        >
          {isRecording ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Record
            </>
          )}
        </Button>
        
        {audioBlob && (
          <>
            <Button variant="outline" onClick={downloadAudio}>
              Download
            </Button>
            <Button variant="outline" onClick={uploadAudio}>
              Upload
            </Button>
          </>
        )}
      </div>
      
      {audioUrl && (
        <div className="space-y-2">
          <audio controls src={audioUrl} className="w-full" />
          <p className="text-sm text-text-dim">
            {audioBlob ? `${(audioBlob.size / 1024).toFixed(1)} KB` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
```

```typescript