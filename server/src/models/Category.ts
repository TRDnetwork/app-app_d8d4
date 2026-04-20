import { Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    image_url: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_categories',
  }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent_id: 1 });

export default models.Category || model('Category', categorySchema);