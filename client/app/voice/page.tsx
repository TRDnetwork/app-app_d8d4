import { VoiceControls } from '@/components/VoiceControls';

export default function VoicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Voice Assistant</h1>
      <p className="text-gray-600 mb-8">
        Use your voice to interact with ShopSphere. Control navigation, search for products, 
        and manage your shopping experience hands-free.
      </p>
      
      <VoiceControls />
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use Voice Commands</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Click "Start Listening" to activate voice recognition</li>
          <li>• Speak clearly into your microphone</li>
          <li>• Use commands like "search for headphones" or "go to cart"</li>
          <li>• Click "Stop Listening" when finished</li>
        </ul>
      </div>
    </div>
  );
}
```

```typescript