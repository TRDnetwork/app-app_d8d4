import { toast } from '@/components/ui/use-toast';

// Speech-to-Text using Web Speech API
class SpeechToText {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private interimResults: string[] = [];
  private finalResults: string[] = [];

  constructor() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Default language

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
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description: `Error: ${event.error}`,
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.isListening) {
        // Restart if continuous listening is enabled
        this.start();
      }
    };
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Not Supported',
        description: 'Your browser does not support speech recognition',
      });
      return;
    }

    try {
      await this.recognition.start();
      this.isListening = true;
      toast({
        title: 'Listening...',
        description: 'Speak now. Click the microphone again to stop.',
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        variant: 'destructive',
        title: 'Could Not Start Listening',
        description: 'Please check your microphone permissions',
      });
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getInterimResults(): string[] {
    return [...this.interimResults];
  }

  getFinalResults(): string[] {
    return [...this.finalResults];
  }

  clearResults(): void {
    this.interimResults = [];
    this.finalResults = [];
  }

  isAvailable(): boolean {
    return !!this.recognition;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

// Text-to-Speech using Web Speech API
class TextToSpeech {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking = false;

  constructor() {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported in this browser');
      return;
    }

    // Load available voices
    this.loadVoices();
    
    // Listen for voice changes
    window.speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  private loadVoices(): void {
    this.voices = window.speechSynthesis.getVoices();
  }

  async speak(text: string, options?: {
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    if (!window.speechSynthesis) {
      toast({
        variant: 'destructive',
        title: 'Text-to-Speech Not Supported',
        description: 'Your browser does not support text-to-speech',
      });
      return;
    }

    if (this.isSpeaking) {
      this.stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (options?.voice) {
      utterance.voice = options.voice;
    } else if (this.voices.length > 0) {
      // Default to first English voice
      const englishVoice = this.voices.find(v => v.lang.includes('en'));
      utterance.voice = englishVoice || this.voices[0];
    }

    // Set rate (0.1 to 10, default 1)
    utterance.rate = options?.rate || 1;
    
    // Set pitch (0 to 2, default 1)
    utterance.pitch = options?.pitch || 1;
    
    // Set volume (0 to 1, default 1)
    utterance.volume = options?.volume || 1;

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Could not speak the text',
      });
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  isAvailable(): boolean {
    return !!window.speechSynthesis;
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}

// Voice Command Processor
class VoiceCommandProcessor {
  private commands: Map<string, () => void> = new Map();
  private stt: SpeechToText;
  private tts: TextToSpeech;

  constructor(stt: SpeechToText, tts: TextToSpeech) {
    this.stt = stt;
    this.tts = tts;
    this.initializeCommands();
  }

  private initializeCommands(): void {
    // Add navigation commands
    this.commands.set('add task', () => {
      this.tts.speak('Creating a new task');
      // In a real app, this would trigger a navigation or action
      console.log('Creating a new task');
    });

    this.commands.set('search for', (query: string) => {
      this.tts.speak(`Searching for ${query}`);
      // In a real app, this would trigger a search
      console.log(`Searching for: ${query}`);
    });

    this.commands.set('go to cart', () => {
      this.tts.speak('Opening your shopping cart');
      // In a real app, this would navigate to the cart
      console.log('Navigating to cart');
    });

    this.commands.set('go to checkout', () => {
      this.tts.speak('Proceeding to checkout');
      // In a real app, this would navigate to checkout
      console.log('Navigating to checkout');
    });

    this.commands.set('go to profile', () => {
      this.tts.speak('Opening your profile');
      // In a real app, this would navigate to profile
      console.log('Navigating to profile');
    });

    this.commands.set('go to orders', () => {
      this.tts.speak('Opening your order history');
      // In a real app, this would navigate to orders
      console.log('Navigating to orders');
    });

    this.commands.set('go to home', () => {
      this.tts.speak('Returning to home page');
      // In a real app, this would navigate to home
      console.log('Navigating to home');
    });
  }

  processCommand(text: string): boolean {
    const lowerText = text.toLowerCase().trim();
    
    // Check for exact matches first
    if (this.commands.has(lowerText)) {
      this.commands.get(lowerText)?.();
      return true;
    }

    // Check for commands with parameters
    for (const [command, action] of this.commands.entries()) {
      if (lowerText.startsWith(command)) {
        const param = lowerText.substring(command.length).trim();
        if (param) {
          action(param);
          return true;
        }
      }
    }

    return false;
  }

  getAvailableCommands(): string[] {
    return Array.from(this.commands.keys());
  }
}

// Audio Recorder using MediaRecorder API
class AudioRecorder {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private audioUrl: string | null = null;

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(audioBlob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      
      toast({
        title: 'Recording Started',
        description: 'Recording audio...',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to record audio',
      });
      throw error;
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Stop all tracks to release the microphone
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: 'Recording Stopped',
        description: 'Audio recording complete',
      });
    }
  }

  getAudioUrl(): string | null {
    return this.audioUrl;
  }

  getAudioBlob(): Blob | null {
    if (this.audioChunks.length === 0) return null;
    return new Blob(this.audioChunks, { type: 'audio/webm' });
  }

  clear(): void {
    this.audioChunks = [];
    this.audioUrl = null;
  }

  isAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

// Main Voice Agent class that combines all functionality
export class VoiceAgent {
  private stt: SpeechToText;
  private tts: TextToSpeech;
  private commandProcessor: VoiceCommandProcessor;
  private recorder: AudioRecorder;

  constructor() {
    this.stt = new SpeechToText();
    this.tts = new TextToSpeech();
    this.commandProcessor = new VoiceCommandProcessor(this.stt, this.tts);
    this.recorder = new AudioRecorder();
  }

  // Speech-to-Text methods
  async startListening(): Promise<void> {
    await this.stt.start();
  }

  stopListening(): void {
    this.stt.stop();
  }

  getTranscript(): { interim: string[]; final: string[] } {
    return {
      interim: this.stt.getInterimResults(),
      final: this.stt.getFinalResults()
    };
  }

  clearTranscript(): void {
    this.stt.clearResults();
  }

  // Text-to-Speech methods
  async speak(text: string, options?: {
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    await this.tts.speak(text, options);
  }

  stopSpeaking(): void {
    this.tts.stop();
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.tts.getVoices();
  }

  // Voice Command methods
  processCommand(text: string): boolean {
    return this.commandProcessor.processCommand(text);
  }

  getAvailableCommands(): string[] {
    return this.commandProcessor.getAvailableCommands();
  }

  // Audio Recording methods
  async startRecording(): Promise<void> {
    await this.recorder.start();
  }

  stopRecording(): void {
    this.recorder.stop();
  }

  getRecordingUrl(): string | null {
    return this.recorder.getAudioUrl();
  }

  getRecordingBlob(): Blob | null {
    return this.recorder.getAudioBlob();
  }

  clearRecording(): void {
    this.recorder.clear();
  }

  // Status methods
  isSpeechToTextAvailable(): boolean {
    return this.stt.isAvailable();
  }

  isTextToSpeechAvailable(): boolean {
    return this.tts.isAvailable();
  }

  isAudioRecordingAvailable(): boolean {
    return this.recorder.isAvailable();
  }

  isListening(): boolean {
    return this.stt.isCurrentlyListening();
  }

  isSpeaking(): boolean {
    return this.tts.isCurrentlySpeaking();
  }

  isRecording(): boolean {
    return this.recorder.isCurrentlyRecording();
  }
}

// Export a singleton instance
export const voiceAgent = new VoiceAgent();
```

```typescript