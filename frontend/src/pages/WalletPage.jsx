import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import WalletConnect from '../components/web3/WalletConnect';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import { useToast } from '../context/ToastContext';

const WalletPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isConnected,
    address,
    balance,
    cusdBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    loadBalances,
    formatAddress,
    copyAddressToClipboard,
    openInExplorer,
    isMetaMaskInstalled
  } = useWallet();

  const handleRefreshBalances = async () => {
    try {
      await loadBalances();
      toast.success('Balances refreshed!');
    } catch (error) {
      toast.error('Failed to refresh balances');
    }
  };

  const handleCopyAddress = async () => {
    const success = await copyAddressToClipboard();
    if (success) {
      toast.success('Address copied to clipboard!');
    } else {
      toast.error('Failed to copy address');
    }
  };

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <LoopFundButton
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </LoopFundButton>
            <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Wallet
            </h1>
          </div>
        </motion.div>

        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <WalletConnect />
        </motion.div>

        {/* Wallet Info (if connected) */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Balance Card */}
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Balances
                </h3>
                <LoopFundButton
                  variant="secondary"
                  size="sm"
                  onClick={handleRefreshBalances}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </LoopFundButton>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">CELO</p>
                    <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {balance.toFixed(4)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-loopfund-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">cUSD</p>
                    <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {cusdBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-loopfund-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                </div>
              </div>
            </LoopFundCard>

            {/* Address Card */}
            <LoopFundCard className="p-6">
              <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                Wallet Address
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 rounded-lg">
                  <p className="font-mono text-sm text-loopfund-neutral-900 dark:text-loopfund-dark-text break-all">
                    {address}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <LoopFundButton
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="flex-1"
                  >
                    Copy Address
                  </LoopFundButton>
                  <LoopFundButton
                    variant="secondary"
                    size="sm"
                    onClick={openInExplorer}
                    className="flex-1"
                  >
                    View on Explorer
                  </LoopFundButton>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <LoopFundCard className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <h3 className="font-display text-h4 text-red-900 dark:text-red-100 mb-2">
                Error
              </h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </LoopFundCard>
          </motion.div>
        )}

        {/* MetaMask Installation Guide */}
        {!isMetaMaskInstalled() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <LoopFundCard className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-display text-h4 text-blue-900 dark:text-blue-100 mb-4">
                Install MetaMask
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                To connect your Celo wallet, you need to install MetaMask browser extension.
              </p>
              <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <p>1. Visit <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="underline">metamask.io</a></p>
                <p>2. Install the browser extension</p>
                <p>3. Create a new wallet or import existing one</p>
                <p>4. Add Celo Sepolia network (will be added automatically)</p>
                <p>5. Get test CELO from the <a href="https://faucet.celo.org/" target="_blank" rel="noopener noreferrer" className="underline">faucet</a></p>
              </div>
            </LoopFundCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;

