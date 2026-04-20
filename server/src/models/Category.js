const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image_url: {
    type: String,
    default: null
  }
}, {
  collection: 'app_d8d4_categories'
});

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parent_id: 1 });

module.exports = mongoose.model('Category', categorySchema);