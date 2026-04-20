import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      maxlength: [100, 'Address line 1 cannot exceed 100 characters'],
    },
    addressLine2: {
      type: String,
      maxlength: [100, 'Address line 2 cannot exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      maxlength: [50, 'City cannot exceed 50 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      maxlength: [50, 'State cannot exceed 50 characters'],
    },
    zip: {
      type: String,
      required: [true, 'ZIP code is required'],
      maxlength: [10, 'ZIP code too long'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      maxlength: [50, 'Country cannot exceed 50 characters'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user address lookups
AddressSchema.index({ userId: 1, isDefault: 1 });

export default mongoose.model<IAddress>('Address', AddressSchema);