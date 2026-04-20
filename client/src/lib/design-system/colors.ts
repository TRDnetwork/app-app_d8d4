// Semantic color tokens for TRD Network
export const colors = {
  // Brand colors
  brand: {
    primary: '#FF9900',
    secondary: '#1E40AF',
  },
  
  // Surface colors
  surface: {
    bg: '#0F172A',
    surface: '#1E293B',
    muted: '#334155',
    border: '#334155',
  },
  
  // Text colors
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    destructive: '#EF4444',
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Interactive states
  interactive: {
    hover: {
      primary: '#FF9900',
      secondary: '#1E40AF',
      muted: '#475569',
    },
    focus: {
      ring: '#FF9900',
    },
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;
```

```typescript