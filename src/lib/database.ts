// Mock database implementation for demonstration
// In production, this would connect to MongoDB, PostgreSQL, etc.

interface Database {
  users: {
    findById: (id: string) => Promise<User | null>;
  };
  subscriptions: {
    findByUserId: (userId: string) => Promise<Subscription | null>;
    create: (subscription: Subscription) => Promise<void>;
    update: (id: string, updates: Partial<Subscription>) => Promise<void>;
  };
  usageEvents: {
    create: (usageEvent: UsageEvent) => Promise<void>;
    findByUser: (
      userId: string,
      eventType?: UsageEventType,
      startDate?: Date,
      endDate?: Date
    ) => Promise<UsageEvent[]>;
  };
  invoices: {
    create: (invoice: Invoice) => Promise<void>;
    update: (id: string, updates: Partial<Invoice>) => Promise<void>;
    findByUser: (userId: string) => Promise<Invoice[]>;
    findByStripeId: (stripeId: string) => Promise<Invoice | null>;
  };
  subscriptionCancellations: {
    create: (cancellation: any) => Promise<void>;
  };
}

interface User {
  id: string;
  email: string;
}

// In-memory storage for demonstration
const storage = {
  users: new Map<string, User>(),
  subscriptions: new Map<string, any>(),
  usageEvents: new Map<string, any>(),
  invoices: new Map<string, any>(),
  subscriptionCancellations: new Map<string, any>(),
};

// Initialize with some mock data
storage.users.set('user_123', { id: 'user_123', email: 'user@example.com' });

export const db: Database = {
  users: {
    findById: async (id: string) => {
      return storage.users.get(id) || null;
    },
  },
  subscriptions: {
    findByUserId: async (userId: string) => {
      for (const subscription of storage.subscriptions.values()) {
        if (subscription.userId === userId) {
          return subscription;
        }
      }
      return null;
    },
    create: async (subscription: any) => {
      storage.subscriptions.set(subscription.id, subscription);
    },
    update: async (id: string, updates: any) => {
      const subscription = storage.subscriptions.get(id);
      if (subscription) {
        storage.subscriptions.set(id, { ...subscription, ...updates });
      }
    },
  },
  usageEvents: {
    create: async (usageEvent: any) => {
      storage.usageEvents.set(usageEvent.id, usageEvent);
    },
    findByUser: async (
      userId: string,
      eventType?: UsageEventType,
      startDate?: Date,
      endDate?: Date
    ) => {
      const events: UsageEvent[] = [];
      for (const event of storage.usageEvents.values()) {
        if (event.userId === userId) {
          if (eventType && event.eventType !== eventType) continue;
          if (startDate && event.timestamp < startDate) continue;
          if (endDate && event.timestamp > endDate) continue;
          events.push(event);
        }
      }
      return events;
    },
  },
  invoices: {
    create: async (invoice: any) => {
      storage.invoices.set(invoice.id, invoice);
    },
    update: async (id: string, updates: any) => {
      const invoice = storage.invoices.get(id);
      if (invoice) {
        storage.invoices.set(id, { ...invoice, ...updates });
      }
    },
    findByUser: async (userId: string) => {
      const invoices: Invoice[] = [];
      for (const invoice of storage.invoices.values()) {
        if (invoice.userId === userId) {
          invoices.push(invoice);
        }
      }
      return invoices;
    },
    findByStripeId: async (stripeId: string) => {
      for (const invoice of storage.invoices.values()) {
        if (invoice.stripeInvoiceId === stripeId) {
          return invoice;
        }
      }
      return null;
    },
  },
  subscriptionCancellations: {
    create: async (cancellation: any) => {
      storage.subscriptionCancellations.set(cancellation.id, cancellation);
    },
  },
};
```

```typescript