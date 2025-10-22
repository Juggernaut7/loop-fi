const Goal = require('../models/Goal');
const Group = require('../models/Group');
const Wallet = require('../models/Wallet');

/**
 * Get comprehensive DeFi dashboard data
 * @route GET /api/defi/dashboard
 * @param {string} walletAddress - User's wallet address
 */
const getDeFiDashboard = async (req, res, next) => {
  try {
    const walletAddress = req.query.walletAddress || req.body.walletAddress;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Get user's wallet data (both off-chain and on-chain)
    let wallet = await Wallet.findOne({ address: walletAddress });
    
    // Create wallet if doesn't exist (first time user)
    if (!wallet) {
      wallet = await Wallet.create({
        address: walletAddress,
        balance: 0,
        network: 'celo'
      });
    }

    // Mock on-chain balance for development
    wallet.onChainBalance = wallet.balance || 0;
    wallet.lastSynced = new Date();
    await wallet.save();

    // Get user's vaults (goals)
    const vaults = await Goal.find({ user: walletAddress });
    const activeVaults = vaults.filter(goal => !goal.isCompleted);
    const completedVaults = vaults.filter(goal => goal.isCompleted);

    // Get user's group vaults
    const groupVaults = await Group.find({ 
      'members.user': walletAddress 
    });

    // Calculate total values
    const totalDeposited = vaults.reduce((sum, vault) => sum + (vault.currentAmount || 0), 0);
    const totalTarget = vaults.reduce((sum, vault) => sum + (vault.targetAmount || 0), 0);
    const totalYieldEarned = vaults.reduce((sum, vault) => sum + (vault.yieldEarned || 0), 0);

    // Calculate average APY (mock for now, will be real on-chain data)
    const averageAPY = vaults.length > 0 
      ? vaults.reduce((sum, vault) => sum + (vault.apy || 0), 0) / vaults.length 
      : 0;

    // Get recent activity (last 10 transactions)
    const recentActivity = await getRecentActivity(walletAddress);

    // Calculate portfolio health score
    const portfolioHealth = calculatePortfolioHealth(vaults, groupVaults);

    // Prepare response
    const dashboardData = {
      wallet: {
        address: walletAddress,
        balance: wallet.balance || 0,
        network: wallet.network || 'celo',
        totalDeposited,
        totalYieldEarned
      },
      stats: {
        activeVaults: activeVaults.length,
        completedVaults: completedVaults.length,
        totalVaults: vaults.length,
        groupVaults: groupVaults.length,
        averageAPY: parseFloat(averageAPY.toFixed(2)),
        portfolioHealth: parseFloat(portfolioHealth.toFixed(1))
      },
      vaults: {
        individual: activeVaults.slice(0, 5).map(vault => ({
          id: vault._id,
          name: vault.name,
          currentAmount: vault.currentAmount || 0,
          targetAmount: vault.targetAmount || 0,
          progress: vault.targetAmount > 0 
            ? ((vault.currentAmount || 0) / vault.targetAmount * 100).toFixed(1)
            : 0,
          category: vault.category || 'General',
          apy: vault.apy || 0,
          yieldEarned: vault.yieldEarned || 0,
          createdAt: vault.createdAt
        })),
        group: groupVaults.slice(0, 3).map(group => ({
          id: group._id,
          name: group.name,
          currentAmount: group.currentAmount || 0,
          targetAmount: group.targetAmount || 0,
          progress: group.targetAmount > 0 
            ? ((group.currentAmount || 0) / group.targetAmount * 100).toFixed(1)
            : 0,
          members: group.members.length,
          yourContribution: getUserContribution(group, walletAddress)
        }))
      },
      recentActivity: recentActivity.slice(0, 10),
      insights: {
        totalProgress: totalTarget > 0 
          ? ((totalDeposited / totalTarget) * 100).toFixed(1)
          : 0,
        estimatedMonthlyYield: calculateEstimatedMonthlyYield(vaults),
        nextMilestone: getNextMilestone(vaults)
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('❌ DeFi Dashboard Error:', error);
    next(error);
  }
};

/**
 * Get wallet balance and details
 * @route GET /api/defi/wallet/:walletAddress
 */
const getWalletData = async (req, res, next) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    let wallet = await Wallet.findOne({ address: walletAddress });

    if (!wallet) {
      wallet = await Wallet.create({
        address: walletAddress,
        balance: 0,
        network: 'celo'
      });
    }

    res.json({
      success: true,
      data: {
        address: wallet.address,
        balance: wallet.balance || 0,
        network: wallet.network || 'celo',
        createdAt: wallet.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Get Wallet Data Error:', error);
    next(error);
  }
};

/**
 * Get user's vaults (goals)
 * @route GET /api/defi/vaults
 */
const getVaults = async (req, res, next) => {
  try {
    const walletAddress = req.query.walletAddress;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const vaults = await Goal.find({ user: walletAddress }).sort({ createdAt: -1 });

    const formattedVaults = vaults.map(vault => ({
      id: vault._id,
      name: vault.name,
      description: vault.description,
      currentAmount: vault.currentAmount || 0,
      targetAmount: vault.targetAmount || 0,
      progress: vault.targetAmount > 0 
        ? ((vault.currentAmount || 0) / vault.targetAmount * 100).toFixed(1)
        : 0,
      category: vault.category || 'General',
      deadline: vault.deadline,
      isCompleted: vault.isCompleted || false,
      apy: vault.apy || 0,
      yieldEarned: vault.yieldEarned || 0,
      contractAddress: vault.contractAddress || null,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt
    }));

    res.json({
      success: true,
      data: {
        vaults: formattedVaults,
        total: formattedVaults.length,
        active: formattedVaults.filter(v => !v.isCompleted).length,
        completed: formattedVaults.filter(v => v.isCompleted).length
      }
    });

  } catch (error) {
    console.error('❌ Get Vaults Error:', error);
    next(error);
  }
};

/**
 * Create a new vault (goal)
 * @route POST /api/defi/vaults
 */
const createVault = async (req, res, next) => {
  try {
    const { walletAddress, name, description, targetAmount, category, deadline, apy } = req.body;

    if (!walletAddress || !name || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, name, and target amount are required'
      });
    }

    const vault = await Goal.create({
      user: walletAddress,
      name,
      description: description || '',
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      category: category || 'General',
      deadline: deadline ? new Date(deadline) : null,
      apy: apy || 8.5, // Default APY
      yieldEarned: 0,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Vault created successfully',
      data: {
        id: vault._id,
        name: vault.name,
        targetAmount: vault.targetAmount,
        currentAmount: vault.currentAmount,
        apy: vault.apy
      }
    });

  } catch (error) {
    console.error('❌ Create Vault Error:', error);
    next(error);
  }
};

/**
 * Get recent activity for a wallet
 * @route GET /api/defi/activity
 */
const getActivity = async (req, res, next) => {
  try {
    const walletAddress = req.query.walletAddress;
    const limit = parseInt(req.query.limit) || 20;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const activity = await getRecentActivity(walletAddress, limit);

    res.json({
      success: true,
      data: {
        activity,
        total: activity.length
      }
    });

  } catch (error) {
    console.error('❌ Get Activity Error:', error);
    next(error);
  }
};

// Helper Functions

/**
 * Get recent activity for a wallet
 */
async function getRecentActivity(walletAddress, limit = 10) {
  try {
    // Get recent vaults
    const recentVaults = await Goal.find({ user: walletAddress })
      .sort({ createdAt: -1 })
      .limit(limit);

    const activity = recentVaults.map(vault => ({
      id: vault._id,
      type: 'vault_created',
      title: `Created ${vault.name}`,
      description: `Started saving towards ${vault.name} with target of ${vault.targetAmount.toFixed(4)} CELO`,
      amount: vault.currentAmount,
      targetAmount: vault.targetAmount,
      date: vault.createdAt,
      icon: 'Target',
      status: 'success'
    }));

    // Sort by date
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    return activity.slice(0, limit);

  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
}

/**
 * Calculate portfolio health score (0-100)
 */
function calculatePortfolioHealth(vaults, groupVaults) {
  if (vaults.length === 0 && groupVaults.length === 0) {
    return 0;
  }

  // Factors: diversification, progress, yield performance
  const diversificationScore = Math.min((vaults.length + groupVaults.length) * 10, 40);
  
  const totalProgress = vaults.reduce((sum, vault) => {
    return sum + (vault.targetAmount > 0 ? (vault.currentAmount / vault.targetAmount) : 0);
  }, 0);
  const avgProgress = vaults.length > 0 ? (totalProgress / vaults.length) : 0;
  const progressScore = avgProgress * 40;

  const avgAPY = vaults.reduce((sum, vault) => sum + (vault.apy || 0), 0) / (vaults.length || 1);
  const yieldScore = Math.min(avgAPY * 2, 20);

  return diversificationScore + progressScore + yieldScore;
}

/**
 * Calculate estimated monthly yield
 */
function calculateEstimatedMonthlyYield(vaults) {
  const totalDeposited = vaults.reduce((sum, vault) => sum + (vault.currentAmount || 0), 0);
  const avgAPY = vaults.reduce((sum, vault) => sum + (vault.apy || 0), 0) / (vaults.length || 1);
  
  return (totalDeposited * (avgAPY / 100) / 12).toFixed(3);
}

/**
 * Get next milestone
 */
function getNextMilestone(vaults) {
  const activeVaults = vaults.filter(v => !v.isCompleted && v.targetAmount > 0);
  
  if (activeVaults.length === 0) {
    return null;
  }

  // Find the vault closest to completion
  const sorted = activeVaults.sort((a, b) => {
    const aProgress = a.currentAmount / a.targetAmount;
    const bProgress = b.currentAmount / b.targetAmount;
    return bProgress - aProgress;
  });

  const nextVault = sorted[0];
  const remaining = nextVault.targetAmount - nextVault.currentAmount;

  return {
    vaultName: nextVault.name,
    remaining: remaining.toFixed(2),
    progress: ((nextVault.currentAmount / nextVault.targetAmount) * 100).toFixed(1)
  };
}

/**
 * Get user's contribution to a group vault
 */
function getUserContribution(group, walletAddress) {
  const member = group.members.find(m => m.user === walletAddress);
  return member ? member.totalContributed : 0;
}

module.exports = {
  getDeFiDashboard,
  getWalletData,
  getVaults,
  createVault,
  getActivity
};
