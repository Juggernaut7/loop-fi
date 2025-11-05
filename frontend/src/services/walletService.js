// Wallet Service - Wrapper for Celo wallet integration
import celoWalletService from './celoWalletService';

class WalletService {
  constructor() {
    this.celoService = celoWalletService;
    this.isConnected = false;
    this.address = null;
  this.network = 'celo-sepolia';
    this.listeners = [];
  }

  // Initialize wallet connection
  async initialize() {
    try {
      console.log('🔍 Initializing wallet service...');
      
      const result = await this.celoService.initialize();
      
      this.isConnected = result.isConnected;
      this.address = result.address;
      
      if (result.error) {
        console.log('⚠️ Wallet initialization warning:', result.error);
      }
      
      this.notifyListeners();
      return { isConnected: this.isConnected, address: this.address };
    } catch (error) {
      console.error('❌ Error initializing wallet:', error);
      return { isConnected: false, address: null };
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      console.log('🔌 Connecting wallet...');
      
      const result = await this.celoService.connectWallet();
      
      this.isConnected = result.isConnected;
      this.address = result.address;
      
      this.notifyListeners();
      return { isConnected: this.isConnected, address: this.address };
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    console.log('🔌 Disconnecting wallet...');
    this.celoService.disconnectWallet();
    
    this.isConnected = false;
    this.address = null;
    
    this.notifyListeners();
  }

  // Get wallet address
  getAddress() {
    return this.address;
  }

  // Get wallet balance
  async getBalance() {
    try {
      if (!this.isConnected || !this.address) {
        return 0;
      }

      const balance = await this.celoService.getBalance();
      return balance;
    } catch (error) {
      console.error('❌ Error getting wallet balance:', error);
      return 0;
    }
  }

  // Get cUSD balance
  async getCUSDBalance() {
    try {
      if (!this.isConnected || !this.address) {
        return 0;
      }

      const balance = await this.celoService.getCUSDBalance();
      return balance;
    } catch (error) {
      console.error('❌ Error getting cUSD balance:', error);
      return 0;
    }
  }

  // Send transaction
  async sendTransaction(to, value, data = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      return await this.celoService.sendTransaction(to, value, data);
    } catch (error) {
      console.error('❌ Transaction failed:', error);
      throw error;
    }
  }

  // Sign message
  async signMessage(message) {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      return await this.celoService.signMessage(message);
    } catch (error) {
      console.error('❌ Message signing failed:', error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus() {
    const status = this.celoService.getConnectionStatus();
    return {
      isConnected: status.isConnected,
      address: status.address,
      network: status.network,
      chainId: status.chainId
    };
  }

  // Add listener for connection changes
  addListener(callback) {
    this.listeners.push(callback);
    this.celoService.addListener((status) => {
      this.isConnected = status.isConnected;
      this.address = status.address;
      this.network = status.network;
      this.notifyListeners();
    });
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
    this.celoService.removeListener(callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        isConnected: this.isConnected,
        address: this.address,
        network: this.network
      });
    });
  }

  // Check if wallet is connected
  async checkConnection() {
    try {
      const result = await this.celoService.checkConnection();
      
      this.isConnected = result.isConnected;
      this.address = result.address;
      
      return { isConnected: this.isConnected, address: this.address };
    } catch (error) {
      console.error('❌ Error checking connection:', error);
      return { isConnected: false, address: null };
    }
  }

  // Format address for display
  formatAddress(address = this.address) {
    return this.celoService.formatAddress(address);
  }

  // Copy address to clipboard
  async copyAddressToClipboard() {
    return await this.celoService.copyAddressToClipboard();
  }

  // Open address in block explorer
  openInExplorer() {
    this.celoService.openInExplorer();
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return this.celoService.isMetaMaskInstalled();
  }

  // Get network info
  async getNetworkInfo() {
    return await this.celoService.getNetworkInfo();
  }

  // Legacy methods for compatibility (mock implementations)
  async getWallet() {
    const balance = await this.getBalance();
    return {
      data: {
        data: {
          balance: balance,
          address: this.address,
          isConnected: this.isConnected
        }
      }
    };
  }

  async getTransactions(page = 1, limit = 20, type = null) {
    // Mock transaction data for development
    return {
      data: {
        transactions: [
          {
            id: 1,
            type: 'deposit',
            amount: 1.0,
            description: 'Wallet deposit',
            date: new Date().toISOString()
          }
        ]
      }
    };
  }

  async addToWallet(amount, reference, description) {
    // Mock implementation - in real app this would make API call
    const balance = await this.getBalance();
    return {
      data: {
        balance: balance + amount,
        address: this.address
      }
    };
  }

  async contributeToGoal(goalId, amount, description) {
    // Mock implementation - in real app this would make API call
    const balance = await this.getBalance();
    return {
      data: {
        wallet: {
          balance: balance - amount,
          address: this.address
        }
      }
    };
  }

  async contributeToGroup(groupId, amount, description) {
    // Mock implementation - in real app this would make API call
    const balance = await this.getBalance();
    return {
      data: {
        wallet: {
          balance: balance - amount,
          address: this.address
        }
      }
    };
  }

  async releaseGoalFunds(goalId) {
    // Mock implementation - in real app this would make API call
    const balance = await this.getBalance();
    return {
      data: {
        wallet: {
          balance: balance,
          address: this.address
        }
      }
    };
  }
}

// Create singleton instance
const walletService = new WalletService();

export default walletService;
