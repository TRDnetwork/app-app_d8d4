const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  address_line1: {
    type: String,
    required: true,
    trim: true
  },
  address_line2: {
    type: String,
    default: null,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zip: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  is_default: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'app_d8d4_addresses'
});

AddressSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  if (this.is_default) {
    Address.updateMany(
      { user_id: this.user_id, _id: { $ne: this._id } },
      { $set: { is_default: false } }
    ).exec();
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema);