export const typography = {
  // Font families
  fontDisplay: "'Playfair Display', serif",
  fontBody: "'Source Sans Pro', sans-serif",
  
  // Font sizes
  fontSizeXs: "0.75rem",
  fontSizeSm: "0.875rem",
  fontSizeBase: "1rem",
  fontSizeLg: "1.125rem",
  fontSizeXl: "1.25rem",
  fontSize2Xl: "1.5rem",
  fontSize3Xl: "1.875rem",
  fontSize4Xl: "2.25rem",
  fontSize5Xl: "3rem",
  fontSize6Xl: "3.75rem",
  fontSize7Xl: "4.5rem",
  fontSize8Xl: "6rem",
  fontSize9Xl: "8rem",
  
  // Font weights
  fontWeightThin: 100,
  fontWeightExtraLight: 200,
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  fontWeightBlack: 900,
  
  // Line heights
  lineHeightNone: 1,
  lineHeightTight: 1.25,
  lineHeightSnug: 1.375,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.625,
  lineHeightLoose: 2,
  
  // Letter spacing
  letterSpacingTighter: "-0.05em",
  letterSpacingTight: "-0.025em",
  letterSpacingNormal: "0",
  letterSpacingWide: "0.025em",
  letterSpacingWider: "0.05em",
  letterSpacingWidest: "0.1em",
};

export type TypographyKeys = keyof typeof typography;
```

```typescript