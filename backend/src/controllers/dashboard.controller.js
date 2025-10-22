// Simplified dashboard controller - removed contribution dependencies
const Goal = require('../models/Goal');
// User model removed - using Web3 wallet authentication

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.query.walletAddress || req.params.walletAddress || req.body.walletAddress;

    // Get user's goals
    const goals = await Goal.find({ user: userId });
    const activeGoals = goals.filter(goal => !goal.isCompleted).length;
    
    // Calculate overall progress
    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const completionRate = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;

    // For Web3, return mock profile data
    const user = {
      firstName: 'User',
      lastName: 'Web3',
      name: 'Web3 User'
    };

    res.json({
      success: true,
      data: {
        stats: {
          totalSaved: totalCurrentAmount,
          activeGoals,
          completionRate: Math.round(completionRate * 100) / 100,
          totalGoalAmount,
          totalCurrentAmount
        },
        profile: user,
        goals: goals.slice(0, 4) // Recent goals
      }
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};