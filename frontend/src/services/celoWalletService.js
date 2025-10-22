// Celo Wallet Service - Real wallet integration for Celo blockchain
import { ethers } from 'ethers';

class CeloWalletService {
  constructor() {
    this.isConnected = false;
    this.address = null;
    this.provider = null;
    this.signer = null;
    this.network = 'celo-alfajores'; // Celo Alfajores testnet
    this.listeners = [];
    this.chainId = 44787; // Celo Alfajores chain ID
    this.isConnecting = false; // Prevent multiple simultaneous connections
    
    // Celo Alfajores network configuration
    this.networkConfig = {
      chainId: '0xaef3', // 44787 in hex
      chainName: 'Celo Alfajores Testnet',
      nativeCurrency: {
        name: 'CELO',
        symbol: 'CELO',
        decimals: 18,
      },
      rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
      blockExplorerUrls: ['https://alfajores.celoscan.io'],
    };
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    const isMetaMask = hasEthereum && window.ethereum.isMetaMask;
    return isMetaMask;
  }

  // Initialize wallet connection
  async initialize() {
    try {
      console.log('🔍 Initializing Celo wallet service...');
      
      if (!this.isMetaMaskInstalled()) {
        console.log('❌ MetaMask not installed');
        return { isConnected: false, address: null, error: 'MetaMask not installed' };
      }

      // Setup event listeners
      this.setupEventListeners();
      
      // Check if wallet was previously connected (from localStorage)
      const savedAddress = localStorage.getItem('loopfi_wallet_address');
      const savedNetwork = localStorage.getItem('loopfi_wallet_network');
      
      if (savedAddress && savedNetwork === 'celo-alfajores') {
        console.log('🔄 Found saved wallet connection, checking accounts...');
        try {
          // Check if account is still available without prompting user
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' // Use eth_accounts (no prompt) instead of eth_requestAccounts
          });
          
          if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            // Wallet is still connected
            this.address = accounts[0];
            this.isConnected = true;
            await this.switchToCeloNetwork();
            this.setupProvider();
            
            console.log('✅ Wallet automatically reconnected:', this.address);
            this.notifyListeners();
            return { isConnected: true, address: this.address };
          } else {
            // Clear saved data if account changed
            localStorage.removeItem('loopfi_wallet_address');
            localStorage.removeItem('loopfi_wallet_network');
          }
        } catch (error) {
          console.log('⚠️ Could not auto-reconnect wallet:', error.message);
          localStorage.removeItem('loopfi_wallet_address');
          localStorage.removeItem('loopfi_wallet_network');
        }
      }
      
      console.log('ℹ️ Wallet service initialized. User must manually connect.');
      return { isConnected: false, address: null };
    } catch (error) {
      console.error('❌ Error initializing wallet:', error);
      return { isConnected: false, address: null, error: error.message };
    }
  }

  // Connect wallet
  async connectWallet() {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log('⚠️ Connection already in progress, please wait...');
      throw new Error('Connection already in progress');
    }

    try {
      this.isConnecting = true;
      console.log('🔌 Connecting to Celo wallet...');
      
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask not installed. Please install MetaMask to continue.');
      }

      console.log('📞 Requesting account access from MetaMask...');
      
      // Request account access with timeout
      const accountsPromise = window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection request timed out. Please try again.')), 60000)
      );
      
      const accounts = await Promise.race([accountsPromise, timeoutPromise]);

      console.log('📋 Received accounts:', accounts);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.address = accounts[0];
      this.isConnected = true;

      console.log('🔄 Checking network...');
      
      // Check and switch to Celo network
      await this.switchToCeloNetwork();
      
      // Setup provider and signer
      this.setupProvider();
      
      // Save to localStorage for persistence
      localStorage.setItem('loopfi_wallet_address', this.address);
      localStorage.setItem('loopfi_wallet_network', this.network);
      
      this.notifyListeners();
      
      console.log('✅ Wallet connected successfully:', {
        address: this.address,
        network: this.network
      });

      return { 
        isConnected: true, 
        address: this.address,
        network: this.network 
      };
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      
      // Handle user rejection
      if (error.code === 4001) {
        throw new Error('Wallet connection cancelled');
      }
      
      throw new Error(error.message || 'Failed to connect wallet');
    } finally {
      this.isConnecting = false;
    }
  }

  // Switch to Celo Alfajores network
  async switchToCeloNetwork() {
    try {
      console.log('🔄 Switching to Celo Alfajores network...');
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.networkConfig.chainId }],
      });
      
      console.log('✅ Switched to Celo Alfajores');
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [this.networkConfig],
          });
          console.log('✅ Added Celo Alfajores network');
        } catch (addError) {
          console.error('❌ Failed to add Celo Alfajores network:', addError);
          throw new Error('Failed to add Celo Alfajores network');
        }
      } else {
        console.error('❌ Failed to switch to Celo Alfajores:', switchError);
        throw new Error('Failed to switch to Celo Alfajores network');
      }
    }
  }

  // Setup provider and signer
  setupProvider() {
    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      console.log('✅ Provider and signer setup complete');
    } catch (error) {
      console.error('❌ Failed to setup provider:', error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    if (!window.ethereum) return;

    // Remove existing listeners to prevent duplicates
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('🔄 Accounts changed:', accounts);
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.address = accounts[0];
        // Update localStorage with new address
        localStorage.setItem('loopfi_wallet_address', this.address);
        this.notifyListeners();
      }
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('🔄 Chain changed:', chainId);
      // Just reload the page on network change (MetaMask recommendation)
      window.location.reload();
    });
  }

  // Disconnect wallet
  disconnectWallet() {
    console.log('🔌 Disconnecting wallet...');
    this.isConnected = false;
    this.address = null;
    this.provider = null;
    this.signer = null;
    
    // Clear localStorage
    localStorage.removeItem('loopfi_wallet_address');
    localStorage.removeItem('loopfi_wallet_network');
    
    this.notifyListeners();
  }

  // Get wallet balance
  async getBalance() {
    try {
      if (!this.isConnected || !this.provider || !this.address) {
        return 0;
      }

      const balance = await this.provider.getBalance(this.address);
      const balanceInCELO = ethers.utils.formatEther(balance);
      
      console.log('💰 Wallet balance:', balanceInCELO, 'CELO');
      return parseFloat(balanceInCELO);
    } catch (error) {
      console.error('❌ Error getting wallet balance:', error);
      return 0;
    }
  }

  // Get cUSD balance (if available)
  async getCUSDBalance() {
    try {
      if (!this.isConnected || !this.provider || !this.address) {
        return 0;
      }

      // cUSD contract address on Celo Alfajores testnet
      const cUSDAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
      
      // ERC20 ABI for balanceOf
      const erc20Abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ];
      
      const contract = new ethers.Contract(
        ethers.utils.getAddress(cUSDAddress), // Ensure proper checksum
        erc20Abi, 
        this.provider
      );
      
      const balance = await contract.balanceOf(this.address);
      const decimals = await contract.decimals();
      
      const balanceInCUSD = ethers.utils.formatUnits(balance, decimals);
      
      console.log('💰 cUSD balance:', balanceInCUSD);
      return parseFloat(balanceInCUSD);
    } catch (error) {
      // Silently return 0 if cUSD contract not available or error
      console.log('ℹ️ cUSD balance not available (using mock for demo)');
      return 0; // Return 0 for demo purposes
    }
  }

  // Send transaction
  async sendTransaction(to, value, data = null) {
    try {
      if (!this.isConnected || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = {
        to,
        value: ethers.utils.parseEther(value.toString()),
        ...(data && { data })
      };

      console.log('📤 Sending transaction:', tx);
      
      const txResponse = await this.signer.sendTransaction(tx);
      console.log('✅ Transaction sent:', txResponse.hash);
      
      // Wait for confirmation
      const receipt = await txResponse.wait();
      console.log('✅ Transaction confirmed:', receipt);
      
      return {
        hash: txResponse.hash,
        receipt: receipt
      };
    } catch (error) {
      console.error('❌ Transaction failed:', error);
      throw error;
    }
  }

  // Sign message
  async signMessage(message) {
    try {
      if (!this.isConnected || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const signature = await this.signer.signMessage(message);
      console.log('✍️ Message signed:', signature);
      
      return signature;
    } catch (error) {
      console.error('❌ Message signing failed:', error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      address: this.address,
      network: this.network,
      chainId: this.chainId
    };
  }

  // Add listener for connection changes
  addListener(callback) {
    this.listeners.push(callback);
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
        network: this.network,
        chainId: this.chainId
      });
    });
  }

  // Check if wallet is connected
  async checkConnection() {
    // Just return the current state, don't auto-connect
    return {
      isConnected: this.isConnected,
      address: this.address
    };
  }

  // Get network info
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        return null;
      }

      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: network.chainId,
        ensAddress: network.ensAddress
      };
    } catch (error) {
      console.error('❌ Error getting network info:', error);
      return null;
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
      await navigator.clipboard.writeText(this.address);
      console.log('📋 Address copied to clipboard');
      return true;
    } catch (error) {
      console.error('❌ Failed to copy address:', error);
      return false;
    }
  }

  // Open address in block explorer
  openInExplorer() {
    if (!this.address) return;
    
    const explorerUrl = `https://alfajores.celoscan.io/address/${this.address}`;
    window.open(explorerUrl, '_blank');
  }
}

// Create singleton instance
const celoWalletService = new CeloWalletService();

export default celoWalletService;

