import { Schema, model, Document } from 'mongoose';

export interface IInvoice extends Document {
  user_id: string;
  stripe_invoice_id: string;
  amount: number;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  pdf_url: string;
  created_at: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  user_id: {
    type: String,
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
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
    default: 'open'
  },
  pdf_url: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default model<IInvoice>('Invoice', invoiceSchema);
```

```typescript