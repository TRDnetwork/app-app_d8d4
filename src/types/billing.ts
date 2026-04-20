// Billing types for the SaaS application

export interface Subscription {
  id: string;
  userId: string;
  stripeSubId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageEvent {
  id: string;
  userId: string;
  eventType: UsageEventType;
  quantity: number;
  timestamp: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: InvoiceStatus;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerPortalSession {
  url: string;
}

// Enum types
export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid'
}

export enum UsageEventType {
  API_CALL = 'api_call',
  STORAGE_GB = 'storage_gb',
  ACTIVE_USER = 'active_user',
  WORKOUT_GENERATED = 'workout_generated',
  MEAL_PLAN_CREATED = 'meal_plan_created'
}

export enum InvoiceStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  VOID = 'void',
  DRAFT = 'draft',
  OPEN = 'open'
}

// Pricing configuration
export interface PlanConfig {
  type: PlanType;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isMetered: boolean;
  usageLimit?: number; // For metered billing
}

// Customer portal configuration
export interface CustomerPortalConfig {
  returnUrl: string;
  configuration?: string;
}
```

```typescript