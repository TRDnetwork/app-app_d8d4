/**
 * Breakpoint tokens for the TRD Network design system
 * Mobile-first approach as specified
 */
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Type for breakpoint tokens
export type Breakpoint = keyof typeof breakpoints;
```

```typescript