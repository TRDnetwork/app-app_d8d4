import { Schema, model, models } from 'mongoose';

const InvoiceSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  stripe_invoice_id: { 
    type: String, 
    required: true,
    unique: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'open', 'paid', 'void', 'uncollectible'], 
    default: 'open' 
  },
  pdf_url: { 
    type: String 
  }
}, {
  timestamps: true,
  collection: 'invoices'
});

// Create index for efficient querying by user and status
InvoiceSchema.index({ user_id: 1, status: 1, createdAt: -1 });

export const Invoice = models.Invoice || model('Invoice', InvoiceSchema);
```

```typescript