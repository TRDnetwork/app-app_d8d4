import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceState {
  isListening: boolean;
  isMuted: boolean;
  voices: SpeechSynthesisVoice[];
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  startListening: () => void;
  stopListening: () => void;
  toggleMute: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  speak: (text: string) => void;
}

export const useVoice = create<VoiceState>()(
  persist(
    (set, get) => ({
      isListening: false,
      isMuted: false,
      voices: [],
      voice: null,
      rate: 1,
      pitch: 0.5,
      
      startListening: () => set({ isListening: true }),
      
      stopListening: () => set({ isListening: false }),
      
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      setVoice: (voice) => set({ voice }),
      
      setRate: (rate) => set({ rate }),
      
      setPitch: (pitch) => set({ pitch }),
      
      speak: (text) => {
        const { isMuted, voice, rate, pitch } = get();
        
        if (isMuted) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if available
        if (voice) {
          utterance.voice = voice;
        }
        
        // Set rate and pitch
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
      },
    }),
    {
      name: 'voice-storage',
      partialize: (state) => ({
        isMuted: state.isMuted,
        rate: state.rate,
        pitch: state.pitch,
      }),
    }
  )
);

// Initialize voices when the store is created
const initializeVoices = () => {
  const { set } = useVoice;
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Set default voice (prefer English)
  let defaultVoice = voices.find(v => v.lang.includes('en')) || voices[0];
  
  set({ voices, voice: defaultVoice });
  
  // Update voices when they load (sometimes they load asynchronously)
  window.speechSynthesis.onvoiceschanged = () => {
    const updatedVoices = window.speechSynthesis.getVoices();
    const currentVoice = useVoice.getState().voice;
    
    // Find the current voice in the updated list
    const updatedVoice = updatedVoices.find(v => v.name === currentVoice?.name) || 
                        updatedVoices.find(v => v.lang.includes('en')) || 
                        updatedVoices[0];
    
    set({ voices: updatedVoices, voice: updatedVoice });
  };
};

// Initialize voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initializeVoices();
}
```

```typescript