import { Schema, model, models } from 'mongoose';

const invoiceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripe_invoice_id: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
      default: 'open',
    },
    pdf_url: {
      type: String,
    },
    period_start: {
      type: Date,
      required: true,
    },
    period_end: {
      type: Date,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_invoices',
  }
);

// Create indexes for frequently queried fields
invoiceSchema.index({ user_id: 1 });
invoiceSchema.index({ stripe_invoice_id: 1 }, { unique: true });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ created_at: 1 });

export default models.Invoice || model('Invoice', invoiceSchema);
```

```typescript