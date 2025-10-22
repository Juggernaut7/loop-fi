import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Coins,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import walletService from '../services/walletService';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    fetchPortfolioData();
  }, []);

  const checkConnection = () => {
    const status = walletService.getConnectionStatus();
    setIsConnected(status.isConnected);
  };

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Mock data for hackathon - replace with actual API calls
      const mockPortfolio = {
        totalValue: 5250,
        totalValueUSD: 12862.50,
        dayChange: 125.50,
        dayChangePercent: 2.45,
        assets: [
          {
            symbol: 'STX',
            name: 'Stacks',
            amount: 2500,
            value: 2500,
            valueUSD: 6125.00,
            change24h: 2.5,
            allocation: 47.6,
            color: 'emerald'
          },
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            amount: 0.15,
            value: 2250,
            valueUSD: 5512.50,
            change24h: 1.8,
            allocation: 42.9,
            color: 'coral'
          },
          {
            symbol: 'sBTC',
            name: 'Synthetic Bitcoin',
            amount: 0.05,
            value: 500,
            valueUSD: 1225.00,
            change24h: -0.5,
            allocation: 9.5,
            color: 'gold'
          }
        ],
        performance: {
          '1D': 2.45,
          '7D': 8.2,
          '30D': 15.6,
          '1Y': 125.4
        }
      };

      const mockTransactions = [
        {
          id: 1,
          type: 'deposit',
          asset: 'STX',
          amount: 500,
          value: 500,
          timestamp: '2024-01-15T10:30:00Z',
          status: 'completed'
        },
        {
          id: 2,
          type: 'stake',
          asset: 'STX',
          amount: 1000,
          value: 1000,
          timestamp: '2024-01-14T14:20:00Z',
          status: 'completed'
        },
        {
          id: 3,
          type: 'reward',
          asset: 'STX',
          amount: 25.5,
          value: 25.5,
          timestamp: '2024-01-13T09:15:00Z',
          status: 'completed'
        }
      ];

      setPortfolioData(mockPortfolio);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (amount) => {
    return (amount / 1000000).toFixed(2);
  };

  const formatBTC = (amount) => {
    return amount.toFixed(8);
  };

  const getChangeColor = (change) => {
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? ArrowUpRight : ArrowDownRight;
  };

  const getAssetColor = (color) => {
    const colors = {
      emerald: 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400',
      coral: 'text-loopfund-coral-600 dark:text-loopfund-coral-400',
      gold: 'text-loopfund-gold-600 dark:text-loopfund-gold-400'
    };
    return colors[color] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 pt-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Portfolio Overview
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Track your DeFi assets and performance across all protocols
          </p>
        </div>
        <div className="flex space-x-3">
          <LoopFundButton
            variant="secondary"
            size="lg"
            onClick={fetchPortfolioData}
            className="group"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </LoopFundButton>
          <LoopFundButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/analytics')}
            className="group"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Analytics
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </LoopFundButton>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <LoopFundCard className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center space-x-3">
            <Wallet className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Connect Your Wallet
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect your Stacks wallet to view your portfolio and track performance.
              </p>
            </div>
            <LoopFundButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/defi')}
            >
              Connect Wallet
            </LoopFundButton>
          </div>
        </LoopFundCard>
      )}

      {/* Portfolio Summary */}
      {portfolioData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Value</p>
                <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  ${portfolioData.totalValueUSD.toLocaleString()}
                </p>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {formatSTX(portfolioData.totalValue)} STX
                </p>
              </div>
              <Wallet className="w-8 h-8 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">24h Change</p>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const Icon = getChangeIcon(portfolioData.dayChangePercent);
                    return <Icon className={`w-4 h-4 ${getChangeColor(portfolioData.dayChangePercent)}`} />;
                  })()}
                  <p className={`text-2xl font-bold ${getChangeColor(portfolioData.dayChangePercent)}`}>
                    ${Math.abs(portfolioData.dayChange).toFixed(2)}
                  </p>
                </div>
                <p className={`text-sm ${getChangeColor(portfolioData.dayChangePercent)}`}>
                  {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">7D Performance</p>
                <p className={`text-2xl font-bold ${getChangeColor(portfolioData.performance['7D'])}`}>
                  {portfolioData.performance['7D'] >= 0 ? '+' : ''}{portfolioData.performance['7D'].toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">30D Performance</p>
                <p className={`text-2xl font-bold ${getChangeColor(portfolioData.performance['30D'])}`}>
                  {portfolioData.performance['30D'] >= 0 ? '+' : ''}{portfolioData.performance['30D'].toFixed(1)}%
                </p>
              </div>
              <PieChart className="w-8 h-8 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
            </div>
          </LoopFundCard>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Allocation */}
        <div className="lg:col-span-2">
          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Asset Allocation
              </h2>
              <LoopFundButton
                variant="secondary"
                size="sm"
                onClick={() => navigate('/analytics')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </LoopFundButton>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {portfolioData?.assets.map((asset) => (
                  <div key={asset.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${asset.color}-500`}></div>
                        <div>
                          <p className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                            {asset.symbol}
                          </p>
                          <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                            {asset.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          ${asset.valueUSD.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-1">
                          {(() => {
                            const Icon = getChangeIcon(asset.change24h);
                            return <Icon className={`w-3 h-3 ${getChangeColor(asset.change24h)}`} />;
                          })()}
                          <p className={`text-sm ${getChangeColor(asset.change24h)}`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                      <div 
                        className={`bg-${asset.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${asset.allocation}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      <span>{asset.allocation.toFixed(1)}% allocation</span>
                      <span>
                        {asset.symbol === 'BTC' || asset.symbol === 'sBTC' 
                          ? formatBTC(asset.amount) 
                          : formatSTX(asset.amount)
                        } {asset.symbol}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </LoopFundCard>
        </div>

        {/* Recent Transactions */}
        <div>
          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Recent Activity
              </h2>
              <LoopFundButton
                variant="secondary"
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                View All
              </LoopFundButton>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-loopfund-neutral-50 dark:bg-loopfund-neutral-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                        tx.type === 'stake' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        {tx.type === 'deposit' ? <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                         tx.type === 'stake' ? <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" /> :
                         <Wallet className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text capitalize">
                          {tx.type}
                        </p>
                        <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        +{formatSTX(tx.amount)} {tx.asset}
                      </p>
                      <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400 capitalize">
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </LoopFundCard>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioPage;
