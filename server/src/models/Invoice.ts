import mongoose, { Document, Schema } from 'mongoose';

// Interface for invoice document
export interface IInvoice extends Document {
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  status: string;
  pdfUrl: string;
}

// Schema definition
const invoiceSchema = new Schema<IInvoice>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  stripeInvoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'open', 'paid', 'uncollectible', 'void'],
  },
  pdfUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Create and export the model
const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;
```

```typescript