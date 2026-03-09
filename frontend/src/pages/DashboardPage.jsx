import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Plus, DollarSign, Clock, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import WalletConnect from '../components/web3/WalletConnect';
import walletService from '../services/walletService';
import { useWallet } from '../hooks/useWallet';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isConnected, address, balance } = useWallet();
  const [vaults, setVaults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format SOL balance
  const formattedBalance = balance ? parseFloat(balance).toFixed(2) : '0.00';

  // Mock vaults data - will be replaced with Solana program calls
  useEffect(() => {
    if (isConnected && address) {
      // TODO: Fetch vaults from Solana program
      setVaults([
        {
          id: 'vault-1',
          name: 'Emergency Fund',
          type: 'solo',
          balance: 5.5,
          unlockTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isUnlocked: false,
          description: '30 days until unlock'
        },
        {
          id: 'vault-2',
          name: 'Vacation Fund',
          type: 'group',
          balance: 12.25,
          unlockTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          isUnlocked: false,
          members: 3,
          description: '60 days until unlock'
        }
      ]);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const calculateDaysRemaining = (unlockTime) => {
    const now = new Date();
    const diff = unlockTime - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateProgress = (unlockTime) => {
    const totalDays = 30; // Placeholder
    const daysRemaining = calculateDaysRemaining(unlockTime);
    return Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100);
  };

  if (!isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Connect Wallet
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8">
            Connect your Solana wallet to start creating secure vaults
          </p>
          <WalletConnect />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Your Vaults
            </h1>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
              {walletService.formatAddress(address)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
              {formattedBalance} SOL
            </p>
          </div>
        </div>
      </motion.div>

      {/* Create New Vault Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <LoopFundButton
          variant="primary"
          size="lg"
          onClick={() => navigate('/app/goals')}
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Vault
        </LoopFundButton>
      </motion.div>

      {/* Vaults List */}
      <div className="space-y-4">
        {vaults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LoopFundCard className="p-8 text-center border-2 border-dashed border-loopfund-neutral-300 dark:border-loopfund-neutral-600">
              <Lock className="w-12 h-12 text-loopfund-neutral-400 dark:text-loopfund-neutral-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                No Vaults Yet
              </h3>
              <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Create your first vault to start securing your savings
              </p>
            </LoopFundCard>
          </motion.div>
        ) : (
          vaults.map((vault, index) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => navigate(`/app/vaults/${vault.id}`)}
              className="cursor-pointer"
            >
              <LoopFundCard className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Vault Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {vault.name}
                        </h3>
                        {vault.isUnlocked ? (
                          <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-loopfund-emerald-500" />
                        ) : (
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-loopfund-coral-500" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {vault.type === 'solo' ? 'Solo Vault' : `Group Vault • ${vault.members} members`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {vault.balance.toFixed(2)}
                      </p>
                      <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">SOL</p>
                    </div>
                  </div>

                  {/* Progress Bar and Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {calculateDaysRemaining(vault.unlockTime)} days remaining
                      </span>
                      {vault.isUnlocked && (
                        <span className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-semibold">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    {!vault.isUnlocked && (
                      <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(vault.unlockTime)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {!vault.isUnlocked && (
                      <button className="flex-1 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 text-loopfund-neutral-700 dark:text-loopfund-neutral-300 py-2 px-3 rounded-lg font-medium text-sm transition-all">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Deposit
                      </button>
                    )}
                    {vault.isUnlocked && (
                      <button className="flex-1 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40 text-loopfund-emerald-700 dark:text-loopfund-emerald-400 py-2 px-3 rounded-lg font-medium text-sm transition-all">
                        <Unlock className="w-4 h-4 inline mr-1" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {vaults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <LoopFundCard className="p-4 text-center">
            <Lock className="w-6 h-6 text-loopfund-coral-500 mx-auto mb-2" />
            <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Locked</p>
            <p className="text-lg font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {vaults.filter(v => !v.isUnlocked).length}
            </p>
          </LoopFundCard>
          <LoopFundCard className="p-4 text-center">
            <Unlock className="w-6 h-6 text-loopfund-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Ready</p>
            <p className="text-lg font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {vaults.filter(v => v.isUnlocked).length}
            </p>
          </LoopFundCard>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <LoopFundCard className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-neutral-800/50 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
              <p className="font-semibold mb-1">How it works</p>
              <p className="text-xs">Create a vault, lock your SOL, and set an unlock date. Your funds are secured on the Solana blockchain.</p>
            </div>
          </div>
        </LoopFundCard>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
