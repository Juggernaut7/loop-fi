const stakingService = require('../services/staking.service');
const { validationResult } = require('express-validator');

class StakingController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.createPool = this.createPool.bind(this);
    this.getPools = this.getPools.bind(this);
    this.getPoolById = this.getPoolById.bind(this);
    this.createStake = this.createStake.bind(this);
    this.getUserStakes = this.getUserStakes.bind(this);
    this.getStakeById = this.getStakeById.bind(this);
    this.updateStake = this.updateStake.bind(this);
    this.getStakingAnalytics = this.getStakingAnalytics.bind(this);
    this.getPlatformStats = this.getPlatformStats.bind(this);
  }

  // ==================== Pool Management ====================

  /**
   * Create a new staking pool
   */
  async createPool(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, apy, minStake, maxStake, walletAddress, contractTxId } = req.body;

      const poolData = {
        creator: walletAddress,
        name,
        apy,
        minStake,
        maxStake,
        contractTxId
      };

      const pool = await stakingService.createPool(poolData);

      res.status(201).json({
        success: true,
        message: 'Pool created successfully',
        data: pool
      });
    } catch (error) {
      console.error('Error creating pool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create pool',
        error: error.message
      });
    }
  }

  /**
   * Get all staking pools
   */
  async getPools(req, res) {
    try {
      const pools = await stakingService.getPools();

      res.status(200).json({
        success: true,
        message: 'Pools fetched successfully',
        data: pools
      });
    } catch (error) {
      console.error('Error fetching pools:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pools',
        error: error.message
      });
    }
  }

  /**
   * Get pool by ID
   */
  async getPoolById(req, res) {
    try {
      const { poolId } = req.params;
      const pool = await stakingService.getPoolById(parseInt(poolId));

      res.status(200).json({
        success: true,
        message: 'Pool fetched successfully',
        data: pool
      });
    } catch (error) {
      console.error('Error fetching pool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pool',
        error: error.message
      });
    }
  }

  // ==================== Stake Management ====================

  /**
   * Create a new stake
   */
  async createStake(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { poolId, amount, walletAddress, contractTxId } = req.body;

      const stakeData = {
        poolId: parseInt(poolId),
        staker: walletAddress,
        amount,
        contractTxId
      };

      const stake = await stakingService.createStake(stakeData);

      res.status(201).json({
        success: true,
        message: 'Stake created successfully',
        data: stake
      });
    } catch (error) {
      console.error('Error creating stake:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create stake',
        error: error.message
      });
    }
  }

  /**
   * Get user's stakes
   */
  async getUserStakes(req, res) {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required'
        });
      }

      const stakes = await stakingService.getUserStakes(walletAddress);

      res.status(200).json({
        success: true,
        message: 'Stakes fetched successfully',
        data: stakes
      });
    } catch (error) {
      console.error('Error fetching user stakes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stakes',
        error: error.message
      });
    }
  }

  /**
   * Get stake by ID
   */
  async getStakeById(req, res) {
    try {
      const { stakeId } = req.params;
      const stake = await stakingService.getStakeById(stakeId);

      res.status(200).json({
        success: true,
        message: 'Stake fetched successfully',
        data: stake
      });
    } catch (error) {
      console.error('Error fetching stake:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stake',
        error: error.message
      });
    }
  }

  /**
   * Update stake (unstake or claim rewards)
   */
  async updateStake(req, res) {
    try {
      const { stakeId } = req.params;
      const { walletAddress, contractTxId, ...updateData } = req.body;

      // Verify ownership
      const stake = await stakingService.getStakeById(stakeId);
      if (stake.staker !== walletAddress) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this stake'
        });
      }

      const updatedStake = await stakingService.updateStake(stakeId, updateData);

      res.status(200).json({
        success: true,
        message: 'Stake updated successfully',
        data: updatedStake
      });
    } catch (error) {
      console.error('Error updating stake:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update stake',
        error: error.message
      });
    }
  }

  // ==================== Analytics ====================

  /**
   * Get staking analytics
   */
  async getStakingAnalytics(req, res) {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required'
        });
      }

      const analytics = await stakingService.getStakingAnalytics(walletAddress);

      res.status(200).json({
        success: true,
        message: 'Analytics fetched successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message
      });
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(req, res) {
    try {
      const stats = await stakingService.getPlatformStats();

      res.status(200).json({
        success: true,
        message: 'Platform stats fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform stats',
        error: error.message
      });
    }
  }
}

module.exports = new StakingController();
