const Group = require('../models/Group');
// User model removed - using Web3 wallet authentication

async function createGroup({ name, description, targetAmount, maxMembers = 10, durationMonths = 1, endDate, userId, accountInfo = {}, blockchainPoolId, creationTxHash }) {
  // Generate unique invite code
  const inviteCode = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  
  // Create proper member objects that match the schema
  const members = [{
    user: userId,
    role: 'owner',
    joinedAt: new Date(),
    isActive: true,
    totalContributed: 0
  }];
  
  // Calculate end date based on duration or use provided endDate
  let finalEndDate;
  if (endDate) {
    finalEndDate = new Date(endDate);
  } else {
    finalEndDate = new Date();
    finalEndDate.setMonth(finalEndDate.getMonth() + durationMonths);
  }
  
  const group = await Group.create({ 
    name, 
    description, 
    targetAmount, 
    createdBy: userId, 
    members,
    inviteCode,
    inviteLink: inviteCode, // Set inviteLink for backward compatibility
    accountInfo,
    settings: {
      maxMembers: maxMembers
    },
    endDate: finalEndDate,
    blockchainPoolId, // Store blockchain pool ID
    creationTxHash // Store creation transaction hash
  });
  
  console.log('💾 Group created in database:', {
    id: group._id,
    blockchainPoolId: group.blockchainPoolId,
    creationTxHash: group.creationTxHash
  });
  
  return group;
}

async function joinGroup({ inviteCode, userId }) {
  // Try to find group by inviteCode first, then by inviteLink for backward compatibility
  let group = await Group.findOne({ inviteCode });
  if (!group) {
    group = await Group.findOne({ inviteLink: inviteCode });
  }
  if (!group) throw new Error('Invalid invite code');
  
  // Fix: Check if user is already a member using the nested structure
  const isAlreadyMember = group.members.some(member => member.user.toString() === userId);
  if (isAlreadyMember) throw new Error('Already a member');

  // Fix: Add new member with proper structure
  group.members.push({
    user: userId,
    role: 'member',
    joinedAt: new Date(),
    isActive: true,
    totalContributed: 0
  });
  
  await group.save();
  return group;
}

async function listGroups(userId) {
  // Fix: Query the nested user field in members array
  const groups = await Group.find({ 
    $or: [
      { createdBy: userId }, 
      { 'members.user': userId }  // Query nested user field
    ] 
  }).lean();

  // Calculate progress for each group
  return groups.map(group => {
    // Calculate progress
    const progress = group.targetAmount > 0 
      ? Math.min((group.currentAmount / group.targetAmount) * 100, 100)
      : 0;

    // Calculate days remaining
    const now = new Date();
    const endDate = group.endDate || new Date(now.getTime() + (group.durationMonths * 30 * 24 * 60 * 60 * 1000));
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // Add calculated progress to group
    return {
      ...group,
      progress: {
        percentage: Math.round(progress),
        daysRemaining: daysRemaining,
        activeMembers: group.members.filter(m => m.isActive).length,
        totalContributions: group.members.reduce((sum, m) => sum + (m.totalContributed || 0), 0)
      }
    };
  });
}

const deleteGroup = async (groupId, userId) => {
  try {
    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is the owner
    const isOwner = group.members.some(member => 
      member.user.toString() === userId.toString() && member.role === 'owner'
    );

    if (!isOwner) {
      throw new Error('Only group owner can delete the group');
    }

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    // Also delete related invitations
    const Invitation = require('../models/Invitation');
    if (Invitation) {
      await Invitation.deleteMany({ group: groupId });
    }

    return true;
  } catch (error) {
    throw error;
  }
};

async function getGroupDetails(groupId, userId) {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is a member of the group (Web3 wallet-based)
    const isMember = group.members.some(member => 
      member.user && member.user.toString() === userId
    ) || group.createdBy.toString() === userId;

    if (!isMember) {
      throw new Error('You are not a member of this group');
    }

    // Calculate progress
    const progress = group.targetAmount > 0 
      ? Math.min((group.currentAmount / group.targetAmount) * 100, 100)
      : 0;

    // Calculate days remaining
    const now = new Date();
    const endDate = group.endDate || new Date(now.getTime() + (group.durationMonths * 30 * 24 * 60 * 60 * 1000));
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // Update group with calculated values
    group.progress = {
      percentage: Math.round(progress),
      daysRemaining: daysRemaining,
      activeMembers: group.members.filter(m => m.isActive).length,
      totalContributions: group.members.reduce((sum, m) => sum + (m.totalContributed || 0), 0)
    };

    return group;
  } catch (error) {
    console.error('❌ Get group details error:', error);
    throw error;
  }
}

async function updateGroup(groupId, updateData, userId) {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user && member.user.toString() === userId
    ) || group.createdBy.toString() === userId;

    if (!isMember) {
      throw new Error('You are not a member of this group');
    }

    // Update the group with the provided data
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedGroup;
  } catch (error) {
    console.error('❌ Update group error:', error);
    throw error;
  }
}


module.exports = { 
  createGroup, 
  joinGroup, 
  listGroups, 
  deleteGroup,
  getGroupDetails,
  updateGroup
};