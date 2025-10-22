const Stake = require('../models/Stake');
const Pool = require('../models/Pool');

class StakingService {
  // ==================== Pool Management ====================

  /**
   * Create a new staking pool
   * @param {Object} poolData - Pool data
   * @returns {Promise<Object>} Created pool
   */
  async createPool(poolData) {
    try {
      // Get next pool ID
      const lastPool = await Pool.findOne().sort({ poolId: -1 });
      const nextPoolId = lastPool ? lastPool.poolId + 1 : 1;

      const pool = new Pool({
        ...poolData,
        poolId: nextPoolId
      });

      await pool.save();
      return pool;
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  }

  /**
   * Get all active staking pools
   * @returns {Promise<Array>} Array of pools
   */
  async getPools() {
    try {
      const pools = await Pool.find({ isActive: true }).sort({ createdAt: -1 });
      return pools;
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  }

  /**
   * Get pool by ID
   * @param {number} poolId - Pool ID
   * @returns {Promise<Object>} Pool details
   */
  async getPoolById(poolId) {
    try {
      const pool = await Pool.findOne({ poolId });
      if (!pool) {
        throw new Error('Pool not found');
      }
      return pool;
    } catch (error) {
      console.error('Error fetching pool:', error);
      throw error;
    }
  }

  // ==================== Stake Management ====================

  /**
   * Create a new stake
   * @param {Object} stakeData - Stake data
   * @returns {Promise<Object>} Created stake
   */
  async createStake(stakeData) {
    try {
      // Get next stake ID
      const lastStake = await Stake.findOne().sort({ _id: -1 });
      const nextStakeId = lastStake ? lastStake._id + 1 : 1;

      const stake = new Stake({
        ...stakeData,
        _id: nextStakeId
      });

      await stake.save();

      // Update pool statistics
      await this.updatePoolStats(stakeData.poolId);

      return stake;
    } catch (error) {
      console.error('Error creating stake:', error);
      throw error;
    }
  }

  /**
   * Get user's active stakes
   * @param {string} staker - Staker address
   * @returns {Promise<Array>} Array of stakes
   */
  async getUserStakes(staker) {
    try {
      const stakes = await Stake.find({ 
        staker, 
        isActive: true 
      }).sort({ createdAt: -1 });
      return stakes;
    } catch (error) {
      console.error('Error fetching user stakes:', error);
      throw error;
    }
  }

  /**
   * Get stake by ID
   * @param {string} stakeId - Stake ID
   * @returns {Promise<Object>} Stake details
   */
  async getStakeById(stakeId) {
    try {
      const stake = await Stake.findById(stakeId);
      if (!stake) {
        throw new Error('Stake not found');
      }
      return stake;
    } catch (error) {
      console.error('Error fetching stake:', error);
      throw error;
    }
  }

  /**
   * Update stake (for unstaking or claiming rewards)
   * @param {string} stakeId - Stake ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated stake
   */
  async updateStake(stakeId, updateData) {
    try {
      const stake = await Stake.findByIdAndUpdate(
        stakeId,
        updateData,
        { new: true }
      );

      if (!stake) {
        throw new Error('Stake not found');
      }

      // Update pool statistics if stake was deactivated
      if (updateData.isActive === false) {
        await this.updatePoolStats(stake.poolId);
      }

      return stake;
    } catch (error) {
      console.error('Error updating stake:', error);
      throw error;
    }
  }

  // ==================== Analytics ====================

  /**
   * Get staking analytics for a user
   * @param {string} staker - Staker address
   * @returns {Promise<Object>} Analytics data
   */
  async getStakingAnalytics(staker) {
    try {
      const stakes = await Stake.find({ staker, isActive: true });
      
      const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
      const totalEarned = stakes.reduce((sum, stake) => sum + stake.claimedRewards, 0);
      const activeStakes = stakes.length;

      // Calculate average APY from pools
      const poolIds = [...new Set(stakes.map(stake => stake.poolId))];
      const pools = await Pool.find({ poolId: { $in: poolIds } });
      const averageAPY = pools.length > 0 
        ? pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length 
        : 0;

      return {
        totalStaked,
        totalEarned,
        averageAPY,
        activeStakes
      };
    } catch (error) {
      console.error('Error fetching staking analytics:', error);
      throw error;
    }
  }

  /**
   * Get platform-wide staking statistics
   * @returns {Promise<Object>} Platform statistics
   */
  async getPlatformStats() {
    try {
      const totalPools = await Pool.countDocuments({ isActive: true });
      const totalStakes = await Stake.countDocuments({ isActive: true });
      const totalStaked = await Stake.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        totalPools,
        totalStakes,
        totalStaked: totalStaked[0]?.total || 0
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Update pool statistics
   * @param {number} poolId - Pool ID
   */
  async updatePoolStats(poolId) {
    try {
      const stakes = await Stake.find({ poolId, isActive: true });
      
      const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
      const participants = stakes.length;

      await Pool.findOneAndUpdate(
        { poolId },
        { 
          totalStaked,
          participants
        }
      );
    } catch (error) {
      console.error('Error updating pool stats:', error);
    }
  }
}

module.exports = new StakingService();
