import { Schema, model, models } from 'mongoose';

const sellerApplicationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    business_name: {
      type: String,
      required: true,
    },
    tax_id: {
      type: String,
      required: true,
    },
    documents: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewed_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_seller_applications',
  }
);

sellerApplicationSchema.index({ user_id: 1 }, { unique: true });
sellerApplicationSchema.index({ status: 1 });

export default models.SellerApplication || model('SellerApplication', sellerApplicationSchema);