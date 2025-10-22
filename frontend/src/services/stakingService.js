// Staking service for handling staking operations
// Integrates with backend API

import api from './api';
import walletService from './walletService';

class StakingService {
  constructor() {
    console.log('🎯 Staking Service initialized');
  }

  // ==================== Staking Pools ====================

  /**
   * Get all available staking pools
   * @returns {Promise<Array>} Array of staking pools
   */
  async getStakingPools() {
    try {
      const response = await api.get('/staking/pools');
      const pools = response.data.data || [];
      
      // If no pools exist, create some default pools
      if (pools.length === 0) {
        return this.getDefaultPools();
      }
      
      return pools;
    } catch (error) {
      console.error('Error fetching staking pools:', error);
      // Return default pools if API fails
      return this.getDefaultPools();
    }
  }

  /**
   * Get staking pool details
   * @param {string} poolId - Pool ID
   * @returns {Promise<Object>} Pool details
   */
  async getPoolDetails(poolId) {
    try {
      const response = await api.get(`/staking/pools/${poolId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching pool details:', error);
      throw error;
    }
  }

  // ==================== User Stakes ====================

  /**
   * Get user's active stakes
   * @returns {Promise<Array>} Array of user stakes
   */
  async getUserStakes() {
    try {
      const walletAddress = await walletService.getAddress();
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      const response = await api.get(`/staking/stakes?walletAddress=${walletAddress}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user stakes:', error);
      // Return mock data if API fails
      return this.getMockStakes();
    }
  }

  /**
   * Get stake details
   * @param {string} stakeId - Stake ID
   * @returns {Promise<Object>} Stake details
   */
  async getStakeDetails(stakeId) {
    try {
      const response = await api.get(`/staking/stakes/${stakeId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stake details:', error);
      throw error;
    }
  }

  // ==================== Staking Operations ====================

  /**
   * Stake STX in a pool (mock implementation)
   * @param {string} poolId - Pool ID
   * @param {number} amount - Amount to stake
   * @param {number} lockPeriod - Lock period in days
   * @returns {Promise<Object>} Staking result
   */
  async stakeSTX(poolId, amount, lockPeriod) {
    try {
      const walletAddress = await walletService.getAddress();
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      // Check wallet balance
      const balance = await walletService.getBalance();
      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      console.log('🎯 Staking:', {
        poolId,
        amount,
        lockPeriod,
        walletAddress
      });

      // Mock transaction result
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64);

      // Save to backend
      const stakeData = {
        poolId,
        amount: amount,
        lockPeriod: lockPeriod,
        txId: mockTxId,
        walletAddress: walletAddress,
        status: 'active'
      };

      const response = await api.post('/staking/stakes', stakeData);

      return {
        success: true,
        txId: mockTxId,
        stake: response.data.data
      };
    } catch (error) {
      console.error('Error staking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Unstake STX from a pool (mock implementation)
   * @param {string} stakeId - Stake ID
   * @returns {Promise<Object>} Unstaking result
   */
  async unstakeSTX(stakeId) {
    try {
      const walletAddress = await walletService.getAddress();
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      console.log('🎯 Unstaking:', { stakeId, walletAddress });

      // Mock transaction result
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64);

      // Update backend
      const response = await api.put(`/staking/stakes/${stakeId}`, {
        status: 'unstaking',
        unstakeTxId: mockTxId,
        unstakeDate: new Date().toISOString()
      });

      return {
        success: true,
        txId: mockTxId,
        stake: response.data.data
      };
    } catch (error) {
      console.error('Error unstaking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Claim staking rewards (mock implementation)
   * @param {string} stakeId - Stake ID
   * @returns {Promise<Object>} Claim result
   */
  async claimRewards(stakeId) {
    try {
      const walletAddress = await walletService.getAddress();
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      console.log('🎯 Claiming rewards:', { stakeId, walletAddress });

      // Mock transaction result
      const mockTxId = '0x' + Math.random().toString(16).substr(2, 64);

      // Update backend
      const response = await api.put(`/staking/stakes/${stakeId}/claim`, {
        claimTxId: mockTxId,
        claimDate: new Date().toISOString()
      });

      return {
        success: true,
        txId: mockTxId,
        stake: response.data.data
      };
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== Analytics ====================

  /**
   * Get staking analytics for user
   * @returns {Promise<Object>} Analytics data
   */
  async getStakingAnalytics() {
    try {
      const walletAddress = await walletService.getAddress();
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      const response = await api.get(`/staking/analytics?walletAddress=${walletAddress}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching staking analytics:', error);
      // Return mock analytics
      return this.getMockAnalytics();
    }
  }

  // ==================== Mock Data ====================

  /**
   * Get mock staking pools
   * @returns {Array} Mock pools data
   */
  getMockPools() {
    return [
      {
        id: 'stx-staking-pool',
        name: 'STX Staking Pool',
        apy: 8.5,
        risk: 'Low',
        tvl: 125000000,
        participants: 15420,
        description: 'Stake STX to earn native yield with low risk',
        icon: 'Shield',
        color: 'loopfund-emerald',
        minStake: 0.1,
        maxStake: 1000,
        lockPeriod: '30 days',
        rewards: 'STX + sBTC',
        status: 'active'
      },
      {
        id: 'btc-yield-pool',
        name: 'Bitcoin Yield Pool',
        apy: 12.3,
        risk: 'Medium',
        tvl: 85000000,
        participants: 8930,
        description: 'Earn yield on Bitcoin through sBTC integration',
        icon: 'Coins',
        color: 'loopfund-coral',
        minStake: 0.05,
        maxStake: 500,
        lockPeriod: '60 days',
        rewards: 'sBTC + STX',
        status: 'active'
      },
      {
        id: 'defi-lp-pool',
        name: 'DeFi LP Pool',
        apy: 15.7,
        risk: 'High',
        tvl: 45000000,
        participants: 3240,
        description: 'Provide liquidity to earn high rewards',
        icon: 'TrendingUp',
        color: 'loopfund-gold',
        minStake: 0.2,
        maxStake: 2000,
        lockPeriod: '90 days',
        rewards: 'LP Tokens + STX',
        status: 'active'
      }
    ];
  }

  /**
   * Get default staking pools (when no pools exist)
   * @returns {Array} Default pools data
   */
  getDefaultPools() {
    return [
      {
        poolId: 1,
        name: 'STX Staking Pool',
        apy: 850, // 8.5% in basis points
        minStake: 100000, // 0.1 STX in microSTX (matches deployed contract)
        maxStake: 1000000000, // 1000 STX in microSTX
        totalStaked: 0,
        participants: 0,
        isActive: true,
        creator: 'ST781EDA6M5Z97NN7RF5Y1NMWTKD5SWWSB6EZ1KW',
        contractTxId: 'default',
        // UI properties
        id: 'stx-staking-pool',
        description: 'Stake STX to earn native yield with low risk',
        risk: 'Low',
        tvl: 125000000,
        icon: 'Shield',
        color: 'loopfund-emerald',
        lockPeriod: '30 days',
        rewards: 'STX + sBTC',
        status: 'active'
      },
      {
        poolId: 2,
        name: 'Bitcoin Yield Pool',
        apy: 1230, // 12.3% in basis points
        minStake: 100000, // 0.1 STX in microSTX (matches deployed contract)
        maxStake: 500000000, // 500 STX in microSTX
        totalStaked: 0,
        participants: 0,
        isActive: true,
        creator: 'ST781EDA6M5Z97NN7RF5Y1NMWTKD5SWWSB6EZ1KW',
        contractTxId: 'default',
        // UI properties
        id: 'btc-yield-pool',
        description: 'Earn yield on Bitcoin through sBTC integration',
        risk: 'Medium',
        tvl: 85000000,
        icon: 'Coins',
        color: 'loopfund-coral',
        lockPeriod: '60 days',
        rewards: 'sBTC + STX',
        status: 'active'
      },
      {
        poolId: 3,
        name: 'DeFi LP Pool',
        apy: 1570, // 15.7% in basis points
        minStake: 100000, // 0.1 STX in microSTX (matches deployed contract)
        maxStake: 2000000000, // 2000 STX in microSTX
        totalStaked: 0,
        participants: 0,
        isActive: true,
        creator: 'ST781EDA6M5Z97NN7RF5Y1NMWTKD5SWWSB6EZ1KW',
        contractTxId: 'default',
        // UI properties
        id: 'defi-lp-pool',
        description: 'Provide liquidity to earn high rewards',
        risk: 'High',
        tvl: 45000000,
        icon: 'TrendingUp',
        color: 'loopfund-gold',
        lockPeriod: '90 days',
        rewards: 'LP Tokens + STX',
        status: 'active'
      }
    ];
  }

  /**
   * Get mock user stakes
   * @returns {Array} Mock stakes data
   */
  getMockStakes() {
    return [
      {
        id: 'stake-1',
        poolId: 'stx-staking-pool',
        poolName: 'STX Staking Pool',
        amount: 2.5,
        apy: 8.5,
        earned: 0.12,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        lockPeriod: 30,
        rewards: 'STX + sBTC'
      },
      {
        id: 'stake-2',
        poolId: 'btc-yield-pool',
        poolName: 'Bitcoin Yield Pool',
        amount: 1.0,
        apy: 12.3,
        earned: 0.08,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
        lockPeriod: 60,
        rewards: 'sBTC + STX'
      }
    ];
  }

  /**
   * Get mock analytics
   * @returns {Object} Mock analytics data
   */
  getMockAnalytics() {
    return {
      totalStaked: 3.5,
      totalEarned: 0.20,
      averageAPY: 10.4,
      activeStakes: 2,
      totalRewards: 0.20,
      monthlyEarnings: 0.05,
      topPerformingPool: 'STX Staking Pool'
    };
  }
}

export default new StakingService();
