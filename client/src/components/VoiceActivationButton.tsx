import React, { useState } from 'react';
import { useVoice } from '../lib/voice';
import { Mic, MicOff } from 'lucide-react';

interface VoiceActivationButtonProps {
  onCommand?: (command: string) => void;
}

const VoiceActivationButton: React.FC<VoiceActivationButtonProps> = ({ onCommand }) => {
  const {
    isListening,
    toggleListening,
    setOnCommand
  } = useVoice();

  const [isHovered, setIsHovered] = useState(false);

  // Set up command handler
  useEffect(() => {
    if (onCommand) {
      setOnCommand(onCommand);
    }
  }, [onCommand, setOnCommand]);

  const handleClick = () => {
    toggleListening();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative p-3 rounded-full transition-all duration-200
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-accent hover:bg-orange-600 text-white'
        }
        ${isHovered ? 'scale-110' : 'scale-100'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
        shadow-lg
      `}
      aria-label={isListening ? "Stop listening" : "Start listening"}
      aria-pressed={isListening}
    >
      {isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
      
      {/* Pulse animation when listening */}
      {isListening && (
        <span className="absolute inset-0 rounded-full animate-ping" style={{ boxShadow: '0 0 0 8px rgba(239, 68, 68, 0.3)' }}></span>
      )}
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {isListening ? "Listening..." : "Voice Control"}
        </div>
      )}
    </button>
  );
};

export default VoiceActivationButton;
```

```typescript