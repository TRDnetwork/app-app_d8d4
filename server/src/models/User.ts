import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define user roles enum
export type UserRole = 'customer' | 'seller' | 'admin';

// Define user document interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  profilePictureUrl?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: UserRole;
  oauthProvider?: 'google' | 'facebook';
  oauthId?: string;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
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
    phone: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    oauthProvider: {
      type: String,
      enum: ['google', 'facebook'],
      select: false,
    },
    oauthId: {
      type: String,
      select: false,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        // Remove sensitive fields when converting to JSON
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.oauthProvider;
        delete ret.oauthId;
        return ret;
      }
    }
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function(): string {
  // Generate 6-digit verification code
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationToken = token;
  this.emailVerified = false;
  return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function(): string {
  // Generate 6-digit reset code
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Create and export User model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
```

```typescript