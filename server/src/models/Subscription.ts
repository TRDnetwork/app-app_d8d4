import { Schema, model, models } from 'mongoose';

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  stripeSubId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ['free', 'pro', '