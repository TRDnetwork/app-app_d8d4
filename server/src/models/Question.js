const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    default: Date.now
  }
}, {
  collection: 'app_d8d4_questions'
});

questionSchema.index({ product_id: 1 });
questionSchema.index({ user_id: 1 });
questionSchema.index({ created_at: -1 });

module.exports = mongoose.model('Question', questionSchema);