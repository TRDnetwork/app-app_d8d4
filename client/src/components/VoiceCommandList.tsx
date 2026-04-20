import React from 'react';

const VoiceCommandList: React.FC = () => {
  const commands = [
    {
      category: 'Navigation',
      items: [
        'Go to Home',
        'Go to Products',
        'Go to Cart',
        'Go to Profile',
        'Open Wishlist'
      ]
    },
    {
      category: 'Search',
      items: [
        'Search for [product name]',
        'Find [product name]',
        'Look for [product name]'
      ]
    },
    {
      category: 'Shopping',
      items: [
        'Add [product name] to cart',
        'Add [product name] to wishlist',
        'Remove [product name] from cart',
        'Proceed to checkout'
      ]
    },
    {
      category: 'Information',
      items: [
        'What time is it?',
        'What day is it?',
        'What is the weather?',
        'Help'
      ]
    },
    {
      category: 'Media',
      items: [
        'Play',
        'Pause',
        'Stop',
        'Volume up',
        'Volume down',
        'Mute',
        'Unmute'
      ]
    }
  ];

  return (
    <div className="bg-surface rounded-lg p-4 border border-border">
      <h3 className="text-lg font-semibold mb-4 text-text">Voice Commands</h3>
      
      {commands.map((category) => (
        <div key={category.category} className="mb-4">
          <h4 className="font-medium text-text mb-2">{category.category}</h4>
          <ul className="space-y-1">
            {category.items.map((command) => (
              <li key={command} className="text-text-dim text-sm">
                • {command}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="mt-4 p-3 bg-muted rounded">
        <p className="text-xs text-text-dim">
          <strong>Tip:</strong> Say "Computer" or "Hey ShopSphere" to activate listening mode.
        </p>
      </div>
    </div>
  );
};

export default VoiceCommandList;
```

```typescript