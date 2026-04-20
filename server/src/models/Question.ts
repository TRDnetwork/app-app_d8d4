import { Schema, model, models } from 'mongoose';

const questionSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    answered_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    answered_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'app_d8d4_questions',
  }
);

questionSchema.index({ product_id: 1, created_at: -1 });

export default models.Question || model('Question', questionSchema);