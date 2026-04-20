// Typography tokens for TRD Network
export const typography = {
  // Font families
  font: {
    display: 'Playfair Display, serif',
    body: 'Source Sans Pro, sans-serif',
  },
  
  // Font sizes (rem)
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  
  // Font weights
  weight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text styles
  style: {
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '3.75rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '2.25rem',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.015em',
    },
    h4: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '-0.005em',
    },
    h6: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    body: {
      fontFamily: 'Source Sans Pro, sans-serif',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    caption: {
      fontFamily: 'Source Sans Pro, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
  },
} as const;
```

```typescript