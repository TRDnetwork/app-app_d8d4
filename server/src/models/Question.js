const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: null
  },
  answered_at: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false,
  collection: 'app_d8d4_questions'
});

QuestionSchema.index({ product_id: 1, created_at: -1 });
QuestionSchema.index({ user_id: 1, product_id: 1 });

module.exports = mongoose.model('Question', QuestionSchema);