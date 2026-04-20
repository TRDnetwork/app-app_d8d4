import React, { useState } from 'react';
import { useVoice } from '../lib/voice';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const VoiceControl: React.FC = () => {
  const {
    isListening,
    isSpeaking,
    transcript,
    finalTranscript,
    error,
    voices,
    currentVoice,
    speechRate,
    speechPitch,
    toggleListening,
    speak,
    stopSpeaking,
    selectVoice,
    setRate,
    setPitch
  } = useVoice();

  const [inputText, setInputText] = useState('');

  const handleSpeak = () => {
    if (inputText.trim()) {
      speak(inputText);
      setInputText('');
    }
  };

  const handleStop = () => {
    stopSpeaking();
  };

  return (
    <div className="bg-surface rounded-lg p-4 border border-border">
      <h3 className="text-lg font-semibold mb-4 text-text">Voice Control</h3>
      
      {/* Listening controls */}
      <div className="flex items-center space-x-4 mb-4">
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          className="flex items-center space-x-2"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Start Listening</span>
            </>
          )}
        </Button>
        
        {isSpeaking && (
          <Button
            onClick={handleStop}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <VolumeX className="h-4 w-4" />
            <span>Stop Speaking</span>
          </Button>
        )}
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="bg-muted rounded-lg p-3 mb-4">
          <p className="text-text-dim text-sm">Listening...</p>
          <p className="text-text">{transcript}</p>
        </div>
      )}

      {finalTranscript && (
        <div className="bg-accent/10 rounded-lg p-3 mb-4">
          <p className="text-text-dim text-sm">Final transcript:</p>
          <p className="text-text font-medium">{finalTranscript}</p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-3 mb-4">
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Text-to-speech controls */}
      <div className="space-y-4">
        <h4 className="font-medium text-text">Text to Speech</h4>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to speak..."
            className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            onKeyPress={(e) => e.key === 'Enter' && handleSpeak()}
          />
          <Button
            onClick={handleSpeak}
            disabled={!inputText.trim()}
            className="bg-accent hover:bg-orange-600"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Voice selection */}
        {voices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-text-dim mb-1">
              Voice
            </label>
            <select
              value={currentVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value) || null;
                selectVoice(voice);
              }}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Speech rate control */}
        <div>
          <label className="block text-sm font-medium text-text-dim mb-1">
            Speech Rate: {speechRate.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Speech pitch control */}
        <div>
          <label className="block text-sm font-medium text-text-dim mb-1">
            Speech Pitch: {speechPitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={speechPitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;
```

```typescript