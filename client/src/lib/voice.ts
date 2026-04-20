import { toast } from '@/components/ui/use-toast';

// Speech-to-Text using Web Speech API
class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private interimResults: string[] = [];
  private finalResults: string[] = [];
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        this.interimResults = [];
        this.finalResults = [];

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.finalResults.push(transcript);
          } else {
            this.interimResults.push(transcript);
          }
        }

        if (this.onResultCallback) {
          const finalText = this.finalResults.join(' ');
          const interimText = this.interimResults.join(' ');
          this.onResultCallback(finalText + ' ' + interimText);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.isListening = true;
    this.interimResults = [];
    this.finalResults = [];

    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isAvailable() {
    return !!this.recognition;
  }

  isCurrentlyListening() {
    return this.isListening;
  }
}

// Text-to-Speech using Web Speech API
class SpeechSynthesisService {
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor() {
    if ('speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
      
      // Listen for voices changed event
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  speak(text: string, voiceName?: string, rate = 1, pitch = 1) {
    if (!('speechSynthesis' in window)) {
      toast({
        title: 'Text-to-Speech not supported',
        description: 'Your browser does not support text-to-speech.',
        variant: 'destructive',
      });
      return;
    }

    if (this.isSpeaking) {
      this.stop();
    }

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (voiceName) {
      const voice = this.voices.find(v => v.name === voiceName);
      if (voice) {
        this.currentUtterance.voice = voice;
      }
    }
    
    // Set rate and pitch
    this.currentUtterance.rate = rate;
    this.currentUtterance.pitch = pitch;
    
    // Event handlers
    this.currentUtterance.onstart = () => {
      this.isSpeaking = true;
    };
    
    this.currentUtterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };
    
    this.currentUtterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      toast({
        title: 'Speech error',
        description: 'There was an error with speech synthesis.',
        variant: 'destructive',
      });
    };

    window.speechSynthesis.speak(this.currentUtterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  isSpeaking() {
    return this.isSpeaking;
  }

  getVoices() {
    return this.voices;
  }

  isAvailable() {
    return 'speechSynthesis' in window;
  }
}

// Voice command processor
class VoiceCommandProcessor {
  private commands: Map<string, () => void> = new Map();
  private isProcessing = false;

  constructor() {
    this.setupCommands();
  }

  private setupCommands() {
    // Add task command
    this.commands.set('add task', (command: string) => {
      const taskName = command.replace('add task', '').trim();
      if (taskName) {
        // In a real app, this would dispatch an action to add a task
        toast({
          title: 'Task created',
          description: `Task "${taskName}" has been created.`,
        });
      }
    });

    // Search command
    this.commands.set('search for', (command: string) => {
      const query = command.replace('search for', '').trim();
      if (query) {
        // In a real app, this would navigate to search results
        toast({
          title: 'Searching',
          description: `Searching for "${query}"...`,
        });
      }
    });

    // Navigate commands
    this.commands.set('go to home', () => {
      // In a real app, this would navigate to home
      toast({
        title: 'Navigation',
        description: 'Going to home page...',
      });
    });

    this.commands.set('go to profile', () => {
      // In a real app, this would navigate to profile
      toast({
        title: 'Navigation',
        description: 'Going to profile page...',
      });
    });

    this.commands.set('go to cart', () => {
      // In a real app, this would navigate to cart
      toast({
        title: 'Navigation',
        description: 'Going to cart page...',
      });
    });

    // Order commands
    this.commands.set('track my order', () => {
      // In a real app, this would navigate to order tracking
      toast({
        title: 'Order Tracking',
        description: 'Checking your order status...',
      });
    });

    this.commands.set('check order status', () => {
      // In a real app, this would check order status
      toast({
        title: 'Order Status',
        description: 'Your order is on the way and will arrive tomorrow.',
      });
    });
  }

  processCommand(text: string) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Convert to lowercase for matching
    const lowerText = text.toLowerCase().trim();

    // Check for exact matches first
    for (const [command, action] of this.commands.entries()) {
      if (lowerText === command) {
        action();
        this.isProcessing = false;
        return;
      }
    }

    // Check for partial matches
    for (const [command, action] of this.commands.entries()) {
      if (lowerText.includes(command)) {
        action(lowerText);
        this.isProcessing = false;
        return;
      }
    }

    // No command matched
    this.isProcessing = false;
  }

  getAvailableCommands() {
    return Array.from(this.commands.keys());
  }
}

// Audio recording using MediaRecorder API
class AudioRecorder {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private onRecordingComplete: ((blob: Blob) => void) | null = null;

  async startRecording(onRecordingComplete: (blob: Blob) => void) {
    if (this.isRecording) {
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.onRecordingComplete = onRecordingComplete;
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        if (this.onRecordingComplete) {
          this.onRecordingComplete(audioBlob);
        }
        this.isRecording = false;
      };

      this.mediaRecorder.start();
    } catch (error) {
      this.isRecording = false;
      toast({
        title: 'Recording error',
        description: 'Could not access microphone. Please check your permissions.',
        variant: 'destructive',
      });
      throw error;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      
      // Stop all tracks on the stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    }
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }

  isAvailable() {
    return 'MediaRecorder' in window && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }
}

// Export singleton instances
export const speechRecognition = new SpeechRecognitionService();
export const speechSynthesisService = new SpeechSynthesisService();
export const voiceCommandProcessor = new VoiceCommandProcessor();
export const audioRecorder = new AudioRecorder();

// Export types
export type { SpeechRecognitionService, SpeechSynthesisService, VoiceCommandProcessor, AudioRecorder };
```

```typescript