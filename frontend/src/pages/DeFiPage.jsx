import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap, 
  Wallet,
  Brain,
  Target,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import WalletConnect from '../components/web3/WalletConnect';
import walletService from '../services/walletService';

const DeFiPage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [yieldRates, setYieldRates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConnection();
    
    // Add a periodic check for connection status
    const interval = setInterval(() => {
      const status = walletService.getConnectionStatus();
      if (status.isConnected !== isConnected) {
        console.log('🔄 DeFiPage connection status changed:', status);
        setIsConnected(status.isConnected);
        if (status.isConnected) {
          fetchWalletData();
          // Redirect to dashboard after successful wallet connection
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000); // Give user 2 seconds to see the connection success
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, navigate]);

  const checkConnection = () => {
    const status = walletService.getConnectionStatus();
    setIsConnected(status.isConnected);
    
    if (status.isConnected) {
      fetchWalletData();
    }
  };

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [balanceResult, yieldResult] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getYieldRates()
      ]);

      if (balanceResult.success) {
        setWalletData(balanceResult);
      }

      if (yieldResult.success) {
        setYieldRates(yieldResult.yieldRates);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (amount) => {
    return (amount / 1000000).toFixed(2);
  };

  const calculatePotentialYield = () => {
    if (!walletData?.balance || !yieldRates) return 0;
    const avgYield = (yieldRates.stx_staking.apy + yieldRates.btc_yield.apy + yieldRates.defi_pools.apy) / 3;
    return (walletData.balance * avgYield / 100) / 1000000;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
            DeFi Dashboard
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
            AI-powered DeFi advisor on Bitcoin via Stacks
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isConnected && (
            <LoopFundButton
              variant="secondary"
              onClick={fetchWalletData}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </LoopFundButton>
          )}
        </div>
      </div>

      {/* Wallet Connection Section */}
      <WalletConnect />

      {/* Main Dashboard Content */}
      {isConnected ? (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Wallet Balance
                  </p>
                  <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {walletData ? formatSTX(walletData.balance) : '0.00'} STX
                  </p>
                  <p className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    ≈ ${walletData ? (formatSTX(walletData.balance) * 2.45).toFixed(2) : '0.00'} USD
                  </p>
                </div>
                <div className="p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full">
                  <Coins className="w-6 h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Potential Yield
                  </p>
                  <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {calculatePotentialYield().toFixed(2)} STX/year
                  </p>
                  <p className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    Average {yieldRates ? ((yieldRates.stx_staking.apy + yieldRates.btc_yield.apy + yieldRates.defi_pools.apy) / 3).toFixed(1) : '0'}% APY
                  </p>
                </div>
                <div className="p-3 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 rounded-full">
                  <TrendingUp className="w-6 h-6 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Active Vaults
                  </p>
                  <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    2
                  </p>
                  <p className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    Smart contracts
                  </p>
                </div>
                <div className="p-3 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 rounded-full">
                  <Target className="w-6 h-6 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Network Health
                  </p>
                  <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    98.5%
                  </p>
                  <p className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    Stacks Testnet
                  </p>
                </div>
                <div className="p-3 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/30 rounded-full">
                  <Shield className="w-6 h-6 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
                </div>
              </div>
            </LoopFundCard>
          </div>

          {/* DeFi Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  DeFi Opportunities
                </h3>
                <Zap className="w-5 h-5 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
              </div>
              
              <div className="space-y-4">
                {yieldRates && Object.entries(yieldRates).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-neutral-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-lg">
                        <Coins className="w-4 h-4 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {value.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                        {value.apy}% APY
                      </p>
                      <LoopFundButton
                        variant="secondary"
                        size="sm"
                        className="mt-1"
                      >
                        Stake Now
                      </LoopFundButton>
                    </div>
                  </div>
                ))}
              </div>
            </LoopFundCard>

            {/* AI DeFi Advisor */}
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  AI DeFi Advisor
                </h3>
                <Brain className="w-5 h-5 text-loopfund-lavender-600 dark:text-loopfund-lavender-400" />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-loopfund-lavender-50 dark:bg-loopfund-lavender-900/20 rounded-lg">
                  <p className="text-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                    <strong>AI Recommendation:</strong> Based on your current balance and risk profile, we recommend starting with STX staking for stable returns, then gradually diversifying into higher-yield DeFi pools as you become more comfortable.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <LoopFundButton
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Get AI Advice
                  </LoopFundButton>
                  <LoopFundButton
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </LoopFundButton>
                </div>
              </div>
            </LoopFundCard>
          </div>

          {/* Quick Actions */}
          <LoopFundCard className="p-6">
            <h3 className="text-lg font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LoopFundButton
                variant="primary"
                className="w-full justify-center"
                onClick={() => navigate('/defi/stake')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Stake STX
              </LoopFundButton>
              
              <LoopFundButton
                variant="secondary"
                className="w-full justify-center"
                onClick={() => navigate('/defi/yield')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Yield Farm
              </LoopFundButton>
              
              <LoopFundButton
                variant="secondary"
                className="w-full justify-center"
                onClick={() => navigate('/defi/portfolio')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Portfolio
              </LoopFundButton>
            </div>
          </LoopFundCard>
        </div>
      ) : (
        <LoopFundCard className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Connect your Stacks wallet to access DeFi features and start earning yield on your savings.
            </p>
            <p className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
              Use the wallet connection component above to get started.
            </p>
          </div>
        </LoopFundCard>
      )}
    </div>
  );
};

export default DeFiPage;