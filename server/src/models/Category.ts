import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentId?: mongoose.Types.ObjectId;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, and hyphen-separated'],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for parent-child lookups and slug lookup
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ slug: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);