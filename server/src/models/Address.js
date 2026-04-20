const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address_line1: {
    type: String,
    required: true
  },
  address_line2: {
    type: String,
    default: null
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  is_default: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'app_d8d4_addresses'
});

addressSchema.index({ user_id: 1 });
addressSchema.index({ user_id: 1, is_default: 1 });

module.exports = mongoose.model('Address', addressSchema);