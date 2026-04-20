import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  emailVerified: boolean;
  oauthProvider?: 'google' | 'facebook';
  oauthId?: string;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    profilePictureUrl: {
      type: String,
    },
    phone: {
      type: String,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        'Please add a valid phone number',
      ],
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    oauthProvider: {
      type: String,
      enum: ['google', 'facebook'],
    },
    oauthId: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
    return;
  }

  // Generate a salt
  const salt = await bcrypt.genSalt(12);

  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent password from being returned in queries
UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

// Create compound index for OAuth
UserSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IUser>('User', UserSchema);
```

```typescript