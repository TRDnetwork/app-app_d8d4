import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const VoiceCommandList: React.FC = () => {
  const commands = [
    {
      category: 'Shopping',
      items: [
        'Add [product name] to cart',
        'Search for [product]',
        'Go to cart',
        'Go to checkout',
        'What\'s in my cart?'
      ]
    },
    {
      category: 'Navigation',
      items: [
        'Go home',
        'Go to products',
        'Go to orders',
        'Go to profile',
        'Go to wishlist'
      ]
    },
    {
      category: 'Information',
      items: [
        'What\'s my order status?',
        'How much is [product]?',
        'What are the deals today?',
        'What\'s my loyalty points?'
      ]
    },
    {
      category: 'Help',
      items: [
        'Help',
        'What can I say?',
        'Show voice commands'
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {commands.map((category) => (
            <div key={category.category} className="space-y-2">
              <h3 className="font-medium text-text">{category.category}</h3>
              <ul className="space-y-1">
                {category.items.map((command, index) => (
                  <li key={index} className="text-sm text-text-dim pl-2 border-l-2 border-border">
                    {command}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommandList;
```

```typescript