import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Coins, Zap, TrendingDown } from 'lucide-react';
import walletService from '../../services/walletService';

const SavingsOverview = () => {
  const [defiData, setDefiData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [yieldRates, setYieldRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeFiData();
  }, []);

  const fetchDeFiData = async () => {
    try {
      setLoading(true);
      
      // Check if wallet is connected
      const connectionStatus = walletService.getConnectionStatus();
      
      if (connectionStatus.isConnected) {
        // Fetch wallet balance
        const balanceResult = await walletService.getWalletBalance();
        if (balanceResult.success) {
          setWalletBalance(balanceResult.balance);
        }

        // Fetch yield rates
        const yieldResult = await walletService.getYieldRates();
        if (yieldResult.success) {
          setYieldRates(yieldResult.yieldRates);
        }

        // Fetch portfolio data
        const portfolioResult = await walletService.getPortfolio();
        if (portfolioResult.success) {
          setDefiData(portfolioResult.portfolio);
        }
      }
    } catch (error) {
      console.error('Error fetching DeFi data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (amount) => {
    return (amount / 1000000).toFixed(2);
  };

  const calculatePotentialYield = () => {
    if (!walletBalance || !yieldRates) return 0;
    const avgYield = (yieldRates.stx_staking.apy + yieldRates.btc_yield.apy + yieldRates.defi_pools.apy) / 3;
    return (walletBalance * avgYield / 100) / 1000000;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Savings Overview
        </h3>
        {walletService.getConnectionStatus().isConnected && (
          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Web3 Connected
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Wallet Balance (DeFi) */}
        {walletService.getConnectionStatus().isConnected && walletBalance && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Wallet Balance</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatSTX(walletBalance)} STX
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                ${(formatSTX(walletBalance) * 2.45).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">USD value</p>
            </div>
          </div>
        )}

        {/* DeFi Yield Potential */}
        {yieldRates && (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">DeFi Yield Potential</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {calculatePotentialYield().toFixed(2)} STX/year
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 dark:text-green-400">
                {((yieldRates.stx_staking.apy + yieldRates.btc_yield.apy + yieldRates.defi_pools.apy) / 3).toFixed(1)}% APY
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Average yield</p>
            </div>
          </div>
        )}

        {/* Traditional Savings (Fallback) */}
        {!walletService.getConnectionStatus().isConnected && (
          <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">This Month</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">$320</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-success-600 dark:text-success-400">+12%</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">vs last month</p>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Goal Progress</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">68%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">$2,450</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">of $3,600</p>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-success-600 dark:text-success-400 mr-3" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Next Milestone</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">$3,000</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">$550 to go</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">~2 months</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">3</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Active Groups</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">12</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsOverview; 
