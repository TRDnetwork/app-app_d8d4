'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Play, StopCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { voiceAgent } from '@/lib/voice';

export function VoiceControls() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);

  // Initialize voice agent and get available voices
  useEffect(() => {
    if (voiceAgent.isTextToSpeechAvailable()) {
      const voices = voiceAgent.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice (first English voice or first available)
      const defaultVoice = voices.find(v => v.lang.includes('en')) || voices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice);
      }
    }
  }, []);

  // Update listening state
  useEffect(() => {
    const interval = setInterval(() => {
      setIsListening(voiceAgent.isListening());
      setIsSpeaking(voiceAgent.isSpeaking());
      setIsRecording(voiceAgent.isRecording());
      
      // Update transcript
      const { interim, final } = voiceAgent.getTranscript();
      const allText = [...final, ...interim].join(' ');
      if (allText !== transcript) {
        setTranscript(allText);
        
        // Process commands for final results
        if (final.length > 0) {
          final.forEach(text => {
            if (voiceAgent.processCommand(text)) {
              // Command was recognized and processed
              console.log('Command processed:', text);
            }
          });
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [transcript]);

  // Cleanup recording URL when component unmounts
  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl]);

  const toggleListening = async () => {
    if (isListening) {
      voiceAgent.stopListening();
    } else {
      try {
        await voiceAgent.startListening();
      } catch (error) {
        console.error('Failed to start listening:', error);
      }
    }
  };

  const speakText = async () => {
    if (!transcript.trim()) {
      toast({
        variant: 'destructive',
        title: 'No Text to Speak',
        description: 'Please enter some text to speak',
      });
      return;
    }

    try {
      await voiceAgent.speak(transcript, {
        voice: selectedVoice || undefined,
        rate: speechRate,
        pitch: speechPitch,
      });
    } catch (error) {
      console.error('Failed to speak text:', error);
    }
  };

  const stopSpeaking = () => {
    voiceAgent.stopSpeaking();
  };

  const toggleRecording = async () => {
    if (isRecording) {
      voiceAgent.stopRecording();
      setRecordingUrl(voiceAgent.getRecordingUrl());
    } else {
      try {
        await voiceAgent.startRecording();
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  };

  const clearRecording = () => {
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
      setRecordingUrl(null);
    }
    voiceAgent.clearRecording();
  };

  const playRecording = () => {
    if (recordingUrl) {
      const audio = new Audio(recordingUrl);
      audio.play();
    }
  };

  const downloadRecording = () => {
    if (!recordingUrl) return;
    
    const blob = voiceAgent.getRecordingBlob();
    if (!blob) return;
    
    const a = document.createElement('a');
    a.href = recordingUrl;
    a.download = `recording-${new Date().toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold">Voice Controls</h3>
      
      {/* Speech-to-Text Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Speech Recognition</h4>
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={toggleListening}
            disabled={!voiceAgent.isSpeechToTextAvailable()}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
        </div>
        
        {!voiceAgent.isSpeechToTextAvailable() && (
          <p className="text-sm text-red-500">
            Speech recognition is not supported in your browser
          </p>
        )}
        
        {transcript && (
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Transcript:</p>
            <p className="text-gray-900">{transcript}</p>
          </div>
        )}
      </div>
      
      {/* Text-to-Speech Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Text-to-Speech</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={speakText}
              disabled={!transcript.trim() || !voiceAgent.isTextToSpeechAvailable()}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Speak
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
            >
              <VolumeX className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>
        
        {!voiceAgent.isTextToSpeechAvailable() && (
          <p className="text-sm text-red-500">
            Text-to-speech is not supported in your browser
          </p>
        )}
        
        {voiceAgent.isTextToSpeechAvailable() && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value) || null;
                  setSelectedVoice(voice);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate: {speechRate.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pitch: {speechPitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Audio Recording Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Audio Recording</h4>
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            onClick={toggleRecording}
            disabled={!voiceAgent.isAudioRecordingAvailable()}
          >
            {isRecording ? (
              <>
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>
        </div>
        
        {!voiceAgent.isAudioRecordingAvailable() && (
          <p className="text-sm text-red-500">
            Audio recording is not supported in your browser
          </p>
        )}
        
        {recordingUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={playRecording}
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadRecording}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearRecording}
              >
                Clear
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Recording saved. You can play, download, or clear it.
            </p>
          </div>
        )}
      </div>
      
      {/* Available Commands */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Available Voice Commands</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {voiceAgent.getAvailableCommands().map((command) => (
            <div key={command} className="flex items-center">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono">
                {command}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Speak one of these commands while listening to trigger actions.
        </p>
      </div>
    </div>
  );
}
```

```typescript