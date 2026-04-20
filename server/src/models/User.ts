import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define user roles
export type UserRole = 'customer' | 'seller' | 'admin';

// Define user interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  profilePictureUrl?: string;
  phone?: string;
  emailVerified: boolean;
  oauthProvider?: 'google' | 'facebook';
  oauthId?: string;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    profilePictureUrl: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    oauthProvider: {
      type: String,
      enum: ['google', 'facebook'],
      default: null,
    },
    oauthId: {
      type: String,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiresAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordTokenExpiresAt;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create compound index for OAuth provider and ID
userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });

// Create index for email
userSchema.index({ email: 1 }, { unique: true });

// Create index for verification token
userSchema.index({ verificationToken: 1 });

// Create index for reset password token
userSchema.index({ resetPasswordToken: 1 });

// Create index for email verification status
userSchema.index({ emailVerified: 1, createdAt: 1 });

// Create index for role
userSchema.index({ role: 1 });

// Export User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
```

```typescript