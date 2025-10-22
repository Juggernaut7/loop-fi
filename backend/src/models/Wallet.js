const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  network: {
    type: String,
    enum: ['mainnet', 'testnet'],
    default: 'testnet'
  },
  // Store last fetched on-chain balance
  onChainBalance: {
    type: Number,
    default: 0
  },
  lastSynced: {
    type: Date,
    default: null
  },
  // Wallet metadata
  metadata: {
    walletType: {
      type: String,
      enum: ['hiro', 'xverse', 'leather', 'other'],
      default: 'other'
    },
    publicKey: String
  }
}, {
  timestamps: true
});

// Index for faster queries
walletSchema.index({ address: 1, network: 1 });

// Methods
walletSchema.methods.updateBalance = async function(newBalance) {
  this.balance = newBalance;
  this.onChainBalance = newBalance;
  this.lastSynced = new Date();
  return this.save();
};

walletSchema.methods.getDisplayAddress = function() {
  return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
};

// Statics
walletSchema.statics.findOrCreate = async function(address, network = 'testnet') {
  let wallet = await this.findOne({ address, network });
  
  if (!wallet) {
    wallet = await this.create({
      address,
      network,
      balance: 0
    });
  }
  
  return wallet;
};

walletSchema.statics.syncBalance = async function(address, onChainBalance) {
  const wallet = await this.findOne({ address });
  
  if (wallet) {
    wallet.onChainBalance = onChainBalance;
    wallet.lastSynced = new Date();
    await wallet.save();
    return wallet;
  }
  
  return null;
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;


