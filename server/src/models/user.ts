import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password_hash?: string;
  name: string;
  phone?: string;
  profile_picture_url?: string;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  role: string;
  oauth_provider?: string;
  oauth_id?: string;
  loyalty_points: number;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String },
  name: { type: String, required: true },
  phone: { type: String },
  profile_picture_url: { type: String },
  email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String },
  password_reset_token: { type: String },
  password_reset_expires: { type: Date },
  role: { 
    type: String, 
    enum: ['customer', 'seller', 'admin'], 
    default: 'customer' 
  },
  oauth_provider: { type: String, enum: ['google', 'facebook'] },
  oauth_id: { type: String },
  loyalty_points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ oauth_provider: 1, oauth_id: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash!, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash!);
};

// Update updated_at timestamp on save
UserSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
```

```typescript