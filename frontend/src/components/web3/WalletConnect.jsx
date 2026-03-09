import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Loader, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundCard from '../ui/LoopFundCard';
import { useToast } from '../../context/ToastContext';
import walletService from '../../services/walletService';

const WalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false, address: null });
  const [balance, setBalance] = useState(0);
  const [isSolanaWalletInstalled, setIsSolanaWalletInstalled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Solana wallet is installed
    const solanaWalletInstalled = walletService.isSolanaWalletInstalled();
    setIsSolanaWalletInstalled(solanaWalletInstalled);

    // Initialize wallet service
    const initializeWallet = async () => {
      const status = await walletService.initialize();
      setConnectionStatus(status);
      
      if (status.isConnected) {
        await loadBalances();
      }
    };

    initializeWallet();

    // Add listener for connection changes
    const handleConnectionChange = (status) => {
      setConnectionStatus(status);
      if (status.isConnected) {
        loadBalances();
      } else {
        setBalance(0);
      }
    };

    walletService.addListener(handleConnectionChange);

    return () => {
      walletService.removeListener(handleConnectionChange);
    };
  }, []);

  const loadBalances = async () => {
    try {
      const solBalance = await walletService.getBalance();
      setBalance(solBalance);
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const result = await walletService.connectWallet();
      
      if (result.isConnected) {
        toast.success('🎉 Wallet connected! Redirecting to dashboard...');
        setConnectionStatus(result);
        await loadBalances();
        
        // Navigate to dashboard after successful connection
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      // Only show error if it's not a cancellation
      if (error.message !== 'Wallet connection cancelled' && !error.message?.includes('cancelled')) {
        toast.error(error.message || 'Wallet connection failed. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnectWallet();
    setConnectionStatus({ isConnected: false, address: null });
    setBalance(0);
    setCusdBalance(0);
    toast.info('Wallet disconnected');
  };

  const handleCopyAddress = async () => {
    const success = await walletService.copyAddressToClipboard();
    if (success) {
      toast.success('Address copied to clipboard!');
    } else {
      toast.error('Failed to copy address');
    }
  };

  const handleOpenExplorer = () => {
    walletService.openInExplorer();
  };

  if (!isSolanaWalletInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoopFundCard className="p-8 text-center">
          <div className="w-16 h-16 bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
          </div>
          
          <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
            Solana Wallet Required
          </h3>
          
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8">
            Please install Phantom, Backpack, or Solflare to connect your Solana wallet and secure your savings.
          </p>
          
          <div className="flex flex-col gap-3">
            <LoopFundButton
              variant="primary"
              size="lg"
              onClick={() => window.open('https://phantom.app/', '_blank')}
              className="w-full"
            >
              Install Phantom
            </LoopFundButton>
            <LoopFundButton
              variant="secondary"
              size="lg"
              onClick={() => window.open('https://backpack.app/', '_blank')}
              className="w-full"
            >
              Install Backpack
            </LoopFundButton>
          </div>
          
          <div className="mt-6 text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
            <p>Phantom, Backpack, or Solflare required to interact with Solana</p>
          </div>
        </LoopFundCard>
      </motion.div>
    );
  }

  if (connectionStatus.isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoopFundCard className="p-6 bg-gradient-to-r from-loopfund-emerald-50 to-loopfund-mint-50 dark:from-loopfund-emerald-900/20 dark:to-loopfund-mint-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40 rounded-xl">
              <CheckCircle className="w-6 h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
            </div>
            <div>
              <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Wallet Connected
              </h3>
              <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Ready to start earning yield
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Address:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {walletService.formatAddress(connectionStatus.address)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-neutral-700 rounded"
                >
                  <Copy className="w-4 h-4 text-loopfund-neutral-500" />
                </button>
                <button
                  onClick={handleOpenExplorer}
                  className="p-1 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-neutral-700 rounded"
                >
                  <ExternalLink className="w-4 h-4 text-loopfund-neutral-500" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Network:</span>
              <span className="text-loopfund-neutral-900 dark:text-loopfund-dark-text">Solana Devnet</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">SOL Balance:</span>
              <span className="text-loopfund-neutral-900 dark:text-loopfund-dark-text font-semibold">
                {balance.toFixed(4)} SOL
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-600">
            <LoopFundButton
              variant="secondary"
              size="sm"
              onClick={handleDisconnect}
              className="w-full"
            >
              Disconnect Wallet
            </LoopFundButton>
          </div>
        </LoopFundCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoopFundCard className="p-8 text-center">
        <div className="w-16 h-16 bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
        </div>
        
        <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
          Connect Your Solana Wallet
        </h3>
        
        <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8">
          Connect your Solana wallet to create secure vaults and lock in savings with time-based unlocking.
        </p>
        
        <LoopFundButton
          variant="primary"
          size="lg"
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </>
          )}
        </LoopFundButton>
        
        <div className="mt-6 text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
          <p>Supported wallets: Phantom, Backpack, Solflare</p>
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default WalletConnect;
