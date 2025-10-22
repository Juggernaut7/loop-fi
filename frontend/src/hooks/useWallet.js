// useWallet Hook - React hook for wallet connection
import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/walletService';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [cusdBalance, setCusdBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize wallet connection (only checks status, doesn't re-initialize)
  const initializeWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Just check current connection status without re-initializing
      const status = walletService.getConnectionStatus();
      setIsConnected(status.isConnected);
      setAddress(status.address);
      
      if (status.isConnected) {
        await loadBalances();
      }
    } catch (err) {
      console.error('Wallet initialization error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load wallet balances
  const loadBalances = useCallback(async () => {
    try {
      const celoBalance = await walletService.getBalance();
      const cusdBal = await walletService.getCUSDBalance();
      setBalance(celoBalance);
      setCusdBalance(cusdBal);
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await walletService.connectWallet();
      setIsConnected(result.isConnected);
      setAddress(result.address);
      
      if (result.isConnected) {
        await loadBalances();
      }
      
      return result;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadBalances]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    walletService.disconnectWallet();
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
    setCusdBalance(0);
    setError(null);
  }, []);

  // Send transaction
  const sendTransaction = useCallback(async (to, value, data = null) => {
    try {
      setError(null);
      const result = await walletService.sendTransaction(to, value, data);
      await loadBalances(); // Refresh balances after transaction
      return result;
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message);
      throw err;
    }
  }, [loadBalances]);

  // Sign message
  const signMessage = useCallback(async (message) => {
    try {
      setError(null);
      return await walletService.signMessage(message);
    } catch (err) {
      console.error('Message signing error:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Format address for display
  const formatAddress = useCallback((addr = address) => {
    return walletService.formatAddress(addr);
  }, [address]);

  // Copy address to clipboard
  const copyAddressToClipboard = useCallback(async () => {
    try {
      return await walletService.copyAddressToClipboard();
    } catch (err) {
      console.error('Copy address error:', err);
      return false;
    }
  }, []);

  // Open address in block explorer
  const openInExplorer = useCallback(() => {
    walletService.openInExplorer();
  }, []);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return walletService.isMetaMaskInstalled();
  }, []);

  // Get network info
  const getNetworkInfo = useCallback(async () => {
    try {
      return await walletService.getNetworkInfo();
    } catch (err) {
      console.error('Network info error:', err);
      return null;
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    const handleConnectionChange = (status) => {
      setIsConnected(status.isConnected);
      setAddress(status.address);
      
      if (status.isConnected) {
        loadBalances();
      } else {
        setBalance(0);
        setCusdBalance(0);
      }
    };

    walletService.addListener(handleConnectionChange);

    return () => {
      walletService.removeListener(handleConnectionChange);
    };
  }, [loadBalances]);

  // Initialize on mount
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  return {
    // State
    isConnected,
    address,
    balance,
    cusdBalance,
    isLoading,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    sendTransaction,
    signMessage,
    loadBalances,
    
    // Utilities
    formatAddress,
    copyAddressToClipboard,
    openInExplorer,
    isMetaMaskInstalled,
    getNetworkInfo,
    
    // Connection status
    connectionStatus: {
      isConnected,
      address,
      network: 'celo-alfajores',
      chainId: 44787
    }
  };
};

export default useWallet;