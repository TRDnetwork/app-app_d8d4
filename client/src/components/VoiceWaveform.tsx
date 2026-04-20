import React, { useRef, useEffect } from 'react';

interface VoiceWaveformProps {
  isListening: boolean;
  amplitude: number;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening, amplitude }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dataArrayRef = useRef<number[]>(Array(128).fill(0));
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      // Update amplitude data
      dataArrayRef.current.shift();
      dataArrayRef.current.push(amplitude);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF9900';
      
      const sliceWidth = canvas.width / dataArrayRef.current.length;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] * canvas.height;
        const y = canvas.height / 2 - v / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = '#FF9900';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animate
      timeRef.current += 0.05;
      animationRef.current = requestAnimationFrame(draw);
    };

    if (isListening) {
      draw();
    } else {
      // Clear the canvas when not listening
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Reset data
      dataArrayRef.current = Array(128).fill(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, amplitude]);

  return (
    <div className="relative h-16 w-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Visual feedback when listening */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default VoiceWaveform;
```

```typescript