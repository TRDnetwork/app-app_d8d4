import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Command } from 'lucide-react';
import { voiceCommandProcessor } from '../../lib/voice';

export function VoiceCommandList() {
  const commands = voiceCommandProcessor.getAvailableCommands();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Command className="h-5 w-5" />
          <CardTitle>Voice Commands</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {commands.map((command) => (
            <li key={command} className="flex items-center space-x-2">
              <span className="text-sm font-medium">"{command}"</span>
              <span className="text-xs text-muted-foreground">
                {command === 'add task' && 'Add a new task with a name'}
                {command === 'search for' && 'Search for products or content'}
                {command === 'go to home' && 'Navigate to the home page'}
                {command === 'go to profile' && 'Navigate to your profile'}
                {command === 'go to cart' && 'Navigate to your shopping cart'}
                {command === 'track my order' && 'Check the status of your order'}
                {command === 'check order status' && 'Get information about your order'}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

```typescript