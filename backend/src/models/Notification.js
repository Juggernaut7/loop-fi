const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  message: { 
    type: String, 
    required: true, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['success', 'warning', 'error', 'info', 'achievement'], 
    default: 'info' 
  },
  category: { 
    type: String, 
    enum: ['goal', 'group', 'achievement', 'system', 'reminder', 'payment'], 
    default: 'system' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  },
  metadata: {
    goalId: { type: String, trim: true },
    groupId: { type: String, trim: true },
    achievementId: { type: String, trim: true },
    contributionId: { type: String, trim: true },
    amount: { type: Number },
    targetAmount: { type: Number },
    progress: { type: Number }
  },
  expiresAt: { 
    type: Date 
  },
  readAt: { 
    type: Date 
  },
  archivedAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ user: 1, isArchived: 1 });
NotificationSchema.index({ user: 1, type: 1 });
NotificationSchema.index({ user: 1, category: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
NotificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for isExpired
NotificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && Date.now() > this.expiresAt;
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification; 