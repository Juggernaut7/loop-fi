const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
  poolId: {
    type: Number,
    required: true,
    index: true
  },
  staker: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  claimedRewards: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created: {
    type: Number,
    default: Date.now
  },
  contractTxId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
stakeSchema.index({ staker: 1, isActive: 1 });
stakeSchema.index({ poolId: 1, isActive: 1 });

module.exports = mongoose.model('Stake', stakeSchema);
