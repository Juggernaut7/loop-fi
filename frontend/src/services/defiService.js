import api from './api';

/**
 * DeFi Service - Handles all DeFi-related API calls
 */
const defiService = {
  /**
   * Get comprehensive DeFi dashboard data
   * @param {string} walletAddress - User's Stacks wallet address
   * @returns {Promise} Dashboard data
   */
  async getDashboard(walletAddress) {
    try {
      const response = await api.get('/defi/dashboard', {
        params: { walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching DeFi dashboard:', error);
      throw error;
    }
  },

  /**
   * Get wallet data
   * @param {string} walletAddress - User's Stacks wallet address
   * @returns {Promise} Wallet data
   */
  async getWallet(walletAddress) {
    try {
      const response = await api.get(`/defi/wallet/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw error;
    }
  },

  /**
   * Get user's vaults (savings goals)
   * @param {string} walletAddress - User's Stacks wallet address
   * @returns {Promise} List of vaults
   */
  async getVaults(walletAddress) {
    try {
      const response = await api.get('/defi/vaults', {
        params: { walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vaults:', error);
      throw error;
    }
  },

  /**
   * Create a new vault
   * @param {Object} vaultData - Vault creation data
   * @param {string} vaultData.walletAddress - User's wallet address
   * @param {string} vaultData.name - Vault name
   * @param {string} vaultData.description - Vault description
   * @param {number} vaultData.targetAmount - Target amount in STX
   * @param {string} vaultData.category - Vault category
   * @param {string} vaultData.deadline - Optional deadline
   * @param {number} vaultData.apy - Expected APY
   * @returns {Promise} Created vault data
   */
  async createVault(vaultData) {
    try {
      const response = await api.post('/defi/vaults', vaultData);
      return response.data;
    } catch (error) {
      console.error('Error creating vault:', error);
      throw error;
    }
  },

  /**
   * Get recent activity
   * @param {string} walletAddress - User's Stacks wallet address
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} Recent activity data
   */
  async getActivity(walletAddress, limit = 20) {
    try {
      const response = await api.get('/defi/activity', {
        params: { walletAddress, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  /**
   * Get DeFi pools for staking
   * @returns {Promise} Available DeFi pools
   */
  async getPools() {
    try {
      // This will be implemented when we add pool data
      // For now, return mock data
      return {
        success: true,
        data: {
          pools: [
            {
              id: 'stx-staking',
              name: 'STX Staking',
              apy: 8.5,
              risk: 'Low',
              tvl: 125000000,
              description: 'Stake STX to earn native yield'
            },
            {
              id: 'btc-yield',
              name: 'Bitcoin Yield Pool',
              apy: 12.3,
              risk: 'Medium',
              tvl: 85000000,
              description: 'Earn yield on Bitcoin through sBTC'
            },
            {
              id: 'defi-lp',
              name: 'DeFi LP Farming',
              apy: 15.7,
              risk: 'High',
              tvl: 45000000,
              description: 'Provide liquidity to earn high rewards'
            }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  },

  /**
   * Stake in a pool
   * @param {string} walletAddress - User's wallet address
   * @param {string} poolId - Pool ID
   * @param {number} amount - Amount to stake
   * @returns {Promise} Staking transaction result
   */
  async stakeInPool(walletAddress, poolId, amount) {
    try {
      // This will be implemented with smart contract integration
      // For now, return success response
      return {
        success: true,
        message: 'Staking transaction submitted',
        data: {
          txId: 'mock-tx-id',
          amount,
          poolId
        }
      };
    } catch (error) {
      console.error('Error staking in pool:', error);
      throw error;
    }
  }
};

export default defiService;

