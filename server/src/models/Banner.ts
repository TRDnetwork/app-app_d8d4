import { Schema, model, models } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    link_url: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ['hero', 'sidebar', 'footer'],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_banners',
  }
);

bannerSchema.index({ position: 1, order: 1 });
bannerSchema.index({ active: 1, start_date: 1, end_date: 1 });

export default models.Banner || model('Banner', bannerSchema);