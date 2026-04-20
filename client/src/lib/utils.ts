/**
 * Utility functions for the TRD Network design system
 * Includes class name composition and other helpers
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind Merge for conflict resolution
 * @param inputs - Class values to combine
 * @returns Combined class names with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a responsive class based on breakpoints
 * @param baseClass - Base class for mobile
 * @param classes - Object with breakpoint-specific classes
 * @returns Combined responsive classes
 */
export function responsiveClass(baseClass: string, classes: Record<keyof typeof breakpoints, string>): string {
  return Object.entries(classes)
    .map(([breakpoint, className]) => `${breakpoint}:${className}`)
    .join(' ') + ' ' + baseClass;
}

/**
 * Creates a CSS custom property from a token value
 * @param name - Property name
 * @param value - Property value
 * @returns CSS custom property string
 */
export function cssVar(name: string, value: string): string {
  return `var(--${name}, ${value})`;
}
```

```typescript