import { useState, useRef, useEffect } from 'react';

// Type definitions
interface SpeechRecognitionError {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[][];
  resultIndex: number;
}

interface SpeechSynthesisUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
}

// Voice Agent for TRD Network
export class VoiceAgent {
  private recognition: SpeechRecognition | null = null;
  private synth: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private interimTranscript: string = '';
  private finalTranscript: string = '';
  private onTranscriptChange: ((transcript: string) => void) | null = null;
  private onFinalTranscript: ((transcript: string) => void) | null = null;
  private onError: ((error: SpeechRecognitionError) => void) | null = null;
  private onCommand: ((command: string) => void) | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // Initialize browser APIs
    this.synth = window.speechSynthesis;
    this.recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Set up event listeners
    this.setupRecognition();
    this.loadVoices();
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Default language

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.interimTranscript = '';
      this.finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
          if (this.onFinalTranscript) {
            this.onFinalTranscript(this.finalTranscript);
          }
          
          // Process voice commands
          this.processCommand(this.finalTranscript);
        } else {
          this.interimTranscript += transcript;
          if (this.onTranscriptChange) {
            this.onTranscriptChange(this.interimTranscript);
          }
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      const error: SpeechRecognitionError = {
        error: event.error,
        message: event.message || 'Speech recognition error'
      };
      
      if (this.onError) {
        this.onError(error);
      }
      
      this.stopListening();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      
      // Restart recognition if it was stopped unexpectedly
      if (this.isListening) {
        this.startListening();
      }
    };
  }

  private loadVoices(): void {
    if (!this.synth) return;
    
    // Get voices immediately if available
    this.voices = this.synth.getVoices();
    
    // Add event listener for when voices are loaded
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth?.getVoices() || [];
    };
  }

  private processCommand(transcript: string): void {
    // Convert to lowercase for easier matching
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Define command patterns
    const commands = [
      { pattern: /^add task (.+)/i, action: 'addTask' },
      { pattern: /^search for (.+)/i, action: 'search' },
      { pattern: /^go to (.+)/i, action: 'navigate' },
      { pattern: /^open (.+)/i, action: 'navigate' },
      { pattern: /^play (.+)/i, action: 'play' },
      { pattern: /^pause/i, action: 'pause' },
      { pattern: /^stop/i, action: 'stop' },
      { pattern: /^volume up/i, action: 'volumeUp' },
      { pattern: /^volume down/i, action: 'volumeDown' },
      { pattern: /^mute/i, action: 'mute' },
      { pattern: /^unmute/i, action: 'unmute' },
      { pattern: /^what time is it/i, action: 'time' },
      { pattern: /^what day is it/i, action: 'date' },
      { pattern: /^weather/i, action: 'weather' },
      { pattern: /^help/i, action: 'help' }
    ];

    // Check for matching commands
    for (const command of commands) {
      const match = lowerTranscript.match(command.pattern);
      if (match) {
        const action = command.action;
        const value = match[1] || '';
        
        if (this.onCommand) {
          this.onCommand(action + (value ? `:${value}` : ''));
        }
        
        // Speak confirmation
        this.speak(`Executing ${action} command`);
        return;
      }
    }
  }

  // Speech-to-Text methods
  startListening(): void {
    if (!this.recognition) {
      this.fallbackToWhisper();
      return;
    }

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.fallbackToWhisper();
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  isListeningActive(): boolean {
    return this.isListening;
  }

  // Text-to-Speech methods
  speak(text: string, options?: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number }): void {
    if (!this.synth) {
      console.error('Speech synthesis not supported');
      return;
    }

    if (this.isSpeaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (options?.voice) {
      utterance.voice = options.voice;
    }
    
    // Set rate if specified (0.1 to 10)
    if (options?.rate) {
      utterance.rate = Math.max(0.1, Math.min(10, options.rate));
    }
    
    // Set pitch if specified (0 to 2)
    if (options?.pitch) {
      utterance.pitch = Math.max(0, Math.min(2, options.pitch));
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  isSpeakingActive(): boolean {
    return this.isSpeaking;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Audio recording methods
  async startRecording(): Promise<MediaRecorder | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      return mediaRecorder;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      return null;
    }
  }

  // Fallback methods
  private async fallbackToWhisper(): Promise<void> {
    // Implement Whisper API fallback
    console.warn('Using Whisper API fallback for speech recognition');
    
    // This would make a request to the Whisper API
    // Implementation depends on your backend setup
  }

  // Event handlers
  setOnTranscriptChange(callback: (transcript: string) => void): void {
    this.onTranscriptChange = callback;
  }

  setOnFinalTranscript(callback: (transcript: string) => void): void {
    this.onFinalTranscript = callback;
  }

  setOnError(callback: (error: SpeechRecognitionError) => void): void {
    this.onError = callback;
  }

  setOnCommand(callback: (command: string) => void): void {
    this.onCommand = callback;
  }

  // Cleanup
  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
    }
    
    if (this.synth) {
      this.synth.onvoiceschanged = null;
    }
  }
}

// Hook for using voice features in React components
export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<SpeechRecognitionError | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);

  const voiceAgent = useRef<VoiceAgent | null>(null);

  useEffect(() => {
    // Initialize voice agent
    voiceAgent.current = new VoiceAgent();
    
    // Set up event handlers
    voiceAgent.current.setOnTranscriptChange((transcript) => {
      setTranscript(transcript);
    });
    
    voiceAgent.current.setOnFinalTranscript((transcript) => {
      setFinalTranscript(transcript);
    });
    
    voiceAgent.current.setOnError((error) => {
      setError(error);
    });
    
    voiceAgent.current.setOnCommand((command) => {
      console.log('Voice command:', command);
      // Handle commands here
    });
    
    // Load voices
    setVoices(voiceAgent.current.getVoices());
    
    // Set default voice
    const defaultVoice = voiceAgent.current.getVoices().find(voice => 
      voice.name.includes('Google') || voice.name.includes('US')
    ) || voiceAgent.current.getVoices()[0] || null;
    
    setCurrentVoice(defaultVoice);

    // Cleanup
    return () => {
      if (voiceAgent.current) {
        voiceAgent.current.destroy();
      }
    };
  }, []);

  const startListening = () => {
    if (voiceAgent.current) {
      voiceAgent.current.startListening();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (voiceAgent.current) {
      voiceAgent.current.stopListening();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speak = (text: string) => {
    if (voiceAgent.current && currentVoice) {
      voiceAgent.current.speak(text, {
        voice: currentVoice,
        rate: speechRate,
        pitch: speechPitch
      });
      setIsSpeaking(true);
    }
  };

  const stopSpeaking = () => {
    if (voiceAgent.current) {
      voiceAgent.current.stopSpeaking();
      setIsSpeaking(false);
    }
  };

  const selectVoice = (voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  };

  const setRate = (rate: number) => {
    setSpeechRate(rate);
  };

  const setPitch = (pitch: number) => {
    setSpeechPitch(pitch);
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    finalTranscript,
    error,
    voices,
    currentVoice,
    speechRate,
    speechPitch,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    selectVoice,
    setRate,
    setPitch
  };
}

// Initialize voice agent
const voiceAgent = new VoiceAgent();

export default voiceAgent;
```

```typescript