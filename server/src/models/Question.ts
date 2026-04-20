import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  answeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      maxlength: [500, 'Answer cannot exceed 500 characters'],
    },
    answeredAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for product questions and user questions
QuestionSchema.index({ productId: 1, createdAt: -1 });
QuestionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IQuestion>('Question', QuestionSchema);