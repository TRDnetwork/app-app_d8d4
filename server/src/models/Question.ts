// This file is generated as part of the backend implementation
// It defines the Mongoose schema for app_d8d4_questions collection

import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  product_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  answered_by?: mongoose.Types.ObjectId;
  created_at: Date;
  answered_at?: Date;
}

const QuestionSchema: Schema = new Schema(
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
    timestamps: { createdAt: 'created_at' },
  }
);

// Indexes
QuestionSchema.index({ product_id: 1, created_at: -1 });
QuestionSchema.index({ user_id: 1 });
QuestionSchema.index({ answered_at: 1 });

export default mongoose.model<IQuestion>('Question', QuestionSchema, 'app_d8d4_questions');