/**
 * Color tokens for the TRD Network design system
 * Based on Designer Agent's palette with warm, trustworthy accents
 */
export const colors = {
  // Core palette
  bg: '#0F172A',           // Deep navy background
  surface: '#1E293B',      // Dark slate surface
  text: '#F8FAFC',         // Near-white text
  text_dim: '#94A3B8',     // Muted text
  accent: '#FF9900',       // Warm orange accent
  accent_alt: '#1E40AF',   // Deep blue alternative accent
  border: '#334155',       // Border color
  success: '#10B981',      // Green for success states
  warning: '#F59E0B',      // Amber for warnings
  error: '#EF4444',        // Red for errors
  
  // Semantic colors
  primary: '#FF9900',
  primary_foreground: '#0F172A',
  secondary: '#1E40AF',
  secondary_foreground: '#F8FAFC',
  muted: '#334155',
  muted_foreground: '#94A3B8',
  destructive: '#EF4444',
  destructive_foreground: '#F8FAFC',
  popover: '#1E293B',
  popover_foreground: '#F8FAFC',
  card: '#1E293B',
  card_foreground: '#F8FAFC',
  border: '#334155',
  input: '#334155',
  ring: '#FF9900',
} as const;

// Type for color tokens
export type Color = keyof typeof colors;
```

```typescript