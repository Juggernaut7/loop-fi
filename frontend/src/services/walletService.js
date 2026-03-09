// Wallet Service - Solana wallet integration
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_NETWORK = 'https://api.devnet.solana.com';
const SUPPORTED_WALLETS = ['phantom', 'backpack', 'solflare'];

class SolanaWalletService {
  constructor() {
    this.isConnected = false;
    this.address = null;
    this.network = 'devnet';
    this.connection = new Connection(SOLANA_NETWORK, 'confirmed');
    this.listeners = [];
    this.provider = null;
  }

  // Get Solana provider (Phantom, Backpack, Solflare, etc.)
  getProvider() {
    if (this.provider) return this.provider;
    
    // Try to find a Solana wallet
    if (window.solana && window.solana.isPhantom) {
      this.provider = window.solana;
      console.log('✅ Phantom wallet detected');
    } else if (window.backpack) {
      this.provider = window.backpack;
      console.log('✅ Backpack wallet detected');
    } else if (window.solflare) {
      this.provider = window.solflare;
      console.log('✅ Solflare wallet detected');
    }
    
    return this.provider;
  }

  // Initialize wallet connection
  async initialize() {
    try {
      console.log('🔍 Initializing Solana wallet service...');
      
      const provider = this.getProvider();
      
      if (!provider) {
        console.log('⚠️ No Solana wallet found');
        return { isConnected: false, address: null };
      }

      // Check if already connected
      if (provider.isConnected) {
        const publicKey = provider.publicKey;
        this.isConnected = true;
        this.address = publicKey.toString();
        console.log('✅ Wallet already connected:', this.address);
        return { isConnected: true, address: this.address };
      }

      return { isConnected: false, address: null };
    } catch (error) {
      console.error('❌ Error initializing wallet:', error);
      return { isConnected: false, address: null };
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      console.log('🔌 Connecting Solana wallet...');
      
      const provider = this.getProvider();
      
      if (!provider) {
        throw new Error('No Solana wallet found. Please install Phantom, Backpack, or Solflare.');
      }

      const response = await provider.connect();
      this.isConnected = true;
      this.address = response.publicKey.toString();
      
      console.log('✅ Wallet connected:', this.address);
      this.notifyListeners();
      
      return { isConnected: true, address: this.address };
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    try {
      console.log('🔌 Disconnecting wallet...');
      
      const provider = this.getProvider();
      if (provider && provider.disconnect) {
        provider.disconnect();
      }
      
      this.isConnected = false;
      this.address = null;
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
    }
  }

  // Get wallet address
  getAddress() {
    return this.address;
  }

  // Get SOL balance
  async getBalance() {
    try {
      if (!this.isConnected || !this.address) {
        return 0;
      }

      const publicKey = new PublicKey(this.address);
      const balanceInLamports = await this.connection.getBalance(publicKey);
      return balanceInLamports / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      return 0;
    }
  }

  // Send transaction
  async sendTransaction(instruction, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      const provider = this.getProvider();
      if (!provider || !provider.signAndSendTransaction) {
        throw new Error('Wallet does not support signAndSendTransaction');
      }

      const signature = await provider.signAndSendTransaction(instruction);
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      console.log('✅ Transaction confirmed:', signature);
      return { signature, confirmed: true };
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

      const provider = this.getProvider();
      if (!provider || !provider.signMessage) {
        throw new Error('Wallet does not support message signing');
      }

      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage);
      
      return signedMessage.signature;
    } catch (error) {
      console.error('❌ Message signing failed:', error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus() {
    const provider = this.getProvider();
    return {
      isConnected: provider?.isConnected || this.isConnected,
      address: provider?.publicKey?.toString() || this.address,
      network: this.network,
      chainId: 'solana-devnet'
    };
  }

  // Add listener for connection changes
  addListener(callback) {
    this.listeners.push(callback);
    
    const provider = this.getProvider();
    if (provider) {
      provider.on('connect', () => {
        this.isConnected = true;
        this.address = provider.publicKey.toString();
        this.notifyListeners();
      });

      provider.on('disconnect', () => {
        this.isConnected = false;
        this.address = null;
        this.notifyListeners();
      });

      provider.on('accountChanged', (publicKey) => {
        if (publicKey) {
          this.isConnected = true;
          this.address = publicKey.toString();
        } else {
          this.isConnected = false;
          this.address = null;
        }
        this.notifyListeners();
      });
    }
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
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
      const provider = this.getProvider();
      
      if (provider && provider.isConnected) {
        this.isConnected = true;
        this.address = provider.publicKey.toString();
      }
      
      return { isConnected: this.isConnected, address: this.address };
    } catch (error) {
      console.error('❌ Error checking connection:', error);
      return { isConnected: false, address: null };
    }
  }

  // Format address for display
  formatAddress(address = this.address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Copy address to clipboard
  async copyAddressToClipboard() {
    try {
      if (!this.address) return false;
      await navigator.clipboard.writeText(this.address);
      return true;
    } catch (error) {
      console.error('❌ Error copying address:', error);
      return false;
    }
  }

  // Open address in block explorer
  openInExplorer() {
    if (!this.address) return;
    const explorerUrl = `https://explorer.solana.com/address/${this.address}?cluster=devnet`;
    window.open(explorerUrl, '_blank');
  }

  // Check if Solana wallet is installed
  isSolanaWalletInstalled() {
    return !!(window.solana || window.backpack || window.solflare);
  }

  // Get network info
  async getNetworkInfo() {
    try {
      const version = await this.connection.getVersion();
      return {
        network: this.network,
        rpcUrl: SOLANA_NETWORK,
        version: version['solana-core']
      };
    } catch (error) {
      console.error('❌ Error getting network info:', error);
      return null;
    }
  }

  // Legacy mock methods for compatibility
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

  async getTransactions(page = 1, limit = 20) {
    return {
      data: {
        transactions: []
      }
    };
  }
}

// Create singleton instance
const walletService = new SolanaWalletService();

export default walletService;
