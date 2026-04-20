import { cn } from '@/lib/utils';

// Heading components with Playfair Display font
export function H1({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn('text-5xl md:text-6xl font-bold tracking-tight text-text', className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-3xl md:text-4xl font-bold tracking-tight text-text', className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-2xl font-semibold text-text', className)}>
      {children}
    </h3>
  );
}

export function H4({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h4 className={cn('text-xl font-medium text-text', className)}>
      {children}
    </h4>
  );
}

// Body text components with Source Sans Pro font
export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-base text-text leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function Small({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <small className={cn('text-sm text-textDim', className)}>
      {children}
    </small>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xl text-text leading-relaxed', className)}>
      {children}
    </p>
  );
}
```

```typescript