const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
  poolId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  creator: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  apy: {
    type: Number,
    required: true
  },
  minStake: {
    type: Number,
    required: true
  },
  maxStake: {
    type: Number,
    required: true
  },
  totalStaked: {
    type: Number,
    default: 0
  },
  participants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contractTxId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
poolSchema.index({ isActive: 1 });
poolSchema.index({ creator: 1 });

module.exports = mongoose.model('Pool', poolSchema);
