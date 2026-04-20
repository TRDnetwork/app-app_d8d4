import React from 'react';

interface VoiceActivationIndicatorProps {
  isActive: boolean;
  className?: string;
}

export function VoiceActivationIndicator({ isActive, className = '' }: VoiceActivationIndicatorProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted'} transition-colors duration-200`} />
      {isActive && (
        <span className="ml-2 text-sm text-primary">Listening...</span>
      )}
    </div>
  );
}
```

```typescript