import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Activity,
  Target,
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  Download,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import walletService from '../services/walletService';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const checkConnection = () => {
    const status = walletService.getConnectionStatus();
    setIsConnected(status.isConnected);
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data for hackathon - replace with actual API calls
      const mockAnalytics = {
        totalEarnings: 450.25,
        totalEarningsUSD: 1103.11,
        averageAPY: 12.3,
        bestPerformingAsset: 'STX',
        worstPerformingAsset: 'sBTC',
        yieldBreakdown: [
          { asset: 'STX', amount: 250.5, percentage: 55.6, apy: 8.5 },
          { asset: 'BTC', amount: 150.25, percentage: 33.4, apy: 12.3 },
          { asset: 'sBTC', amount: 49.5, percentage: 11.0, apy: 15.7 }
        ],
        performance: {
          '1D': { value: 12.5, change: 2.1 },
          '7D': { value: 89.75, change: 8.2 },
          '30D': { value: 450.25, change: 15.6 },
          '90D': { value: 1250.75, change: 28.4 }
        },
        monthlyEarnings: [
          { month: 'Jan', earnings: 125.5 },
          { month: 'Feb', earnings: 142.3 },
          { month: 'Mar', earnings: 158.7 },
          { month: 'Apr', earnings: 175.2 },
          { month: 'May', earnings: 192.8 },
          { month: 'Jun', earnings: 210.5 }
        ],
        riskMetrics: {
          sharpeRatio: 1.85,
          maxDrawdown: -8.2,
          volatility: 12.5,
          beta: 0.75
        },
        predictions: {
          nextMonthEarnings: 185.5,
          confidence: 78,
          recommendation: 'Consider increasing STX allocation for stable returns'
        }
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (amount) => {
    return amount.toFixed(2);
  };

  const getChangeColor = (change) => {
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  const periods = [
    { label: '1D', value: '1D' },
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' },
    { label: '90D', value: '90D' }
  ];

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
            DeFi Analytics
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Deep insights into your DeFi performance and yield optimization
          </p>
        </div>
        <div className="flex space-x-3">
          <LoopFundButton
            variant="secondary"
            size="md"
            className="group"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </LoopFundButton>
          <LoopFundButton
            variant="secondary"
            size="md"
            className="group"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </LoopFundButton>
          <LoopFundButton
            variant="primary"
            size="md"
            onClick={() => navigate('/portfolio')}
            className="group"
          >
            <PieChart className="w-4 h-4 mr-2" />
            Portfolio
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </LoopFundButton>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4 mb-8">
        <span className="text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
          Time Period:
        </span>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === period.value
                  ? 'bg-loopfund-emerald-600 text-white'
                  : 'bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-neutral-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <LoopFundCard className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Connect Your Wallet
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect your Stacks wallet to view detailed analytics and performance insights.
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

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Earnings</p>
                <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {formatSTX(analyticsData.totalEarnings)} STX
                </p>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  ${analyticsData.totalEarningsUSD.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Average APY</p>
                <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData.averageAPY}%
                </p>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const Icon = getChangeIcon(analyticsData.performance[selectedPeriod].change);
                    return <Icon className={`w-4 h-4 ${getChangeColor(analyticsData.performance[selectedPeriod].change)}`} />;
                  })()}
                  <p className={`text-sm ${getChangeColor(analyticsData.performance[selectedPeriod].change)}`}>
                    {analyticsData.performance[selectedPeriod].change >= 0 ? '+' : ''}{analyticsData.performance[selectedPeriod].change.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Percent className="w-8 h-8 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Best Performer</p>
                <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData.bestPerformingAsset}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +{analyticsData.performance[selectedPeriod].change.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
            </div>
          </LoopFundCard>

          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData.riskMetrics.sharpeRatio}
                </p>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Risk-adjusted returns
                </p>
              </div>
              <Activity className="w-8 h-8 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
            </div>
          </LoopFundCard>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Yield Breakdown */}
        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Yield Breakdown
            </h2>
            <PieChart className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
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
              {analyticsData?.yieldBreakdown.map((asset, index) => (
                <div key={asset.asset} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-loopfund-emerald-500' :
                        index === 1 ? 'bg-loopfund-coral-500' :
                        'bg-loopfund-gold-500'
                      }`}></div>
                      <div>
                        <p className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {asset.asset}
                        </p>
                        <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {asset.apy}% APY
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatSTX(asset.amount)} STX
                      </p>
                      <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {asset.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'bg-loopfund-emerald-500' :
                        index === 1 ? 'bg-loopfund-coral-500' :
                        'bg-loopfund-gold-500'
                      }`}
                      style={{ width: `${asset.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </LoopFundCard>

        {/* Performance Chart */}
        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Performance Over Time
            </h2>
            <BarChart3 className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
          </div>

          {loading ? (
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ) : (
            <div className="space-y-4">
              {analyticsData?.monthlyEarnings.map((month, index) => (
                <div key={month.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {month.month}
                  </div>
                  <div className="flex-1 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3 relative">
                    <div 
                      className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(month.earnings / Math.max(...analyticsData.monthlyEarnings.map(m => m.earnings))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text text-right">
                    {formatSTX(month.earnings)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </LoopFundCard>
      </div>

      {/* Risk Metrics & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Metrics */}
        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Risk Metrics
            </h2>
            <Activity className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Sharpe Ratio</span>
                <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData?.riskMetrics.sharpeRatio}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Max Drawdown</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {analyticsData?.riskMetrics.maxDrawdown}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Volatility</span>
                <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData?.riskMetrics.volatility}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Beta</span>
                <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {analyticsData?.riskMetrics.beta}
                </span>
              </div>
            </div>
          )}
        </LoopFundCard>

        {/* AI Predictions */}
        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              AI Predictions
            </h2>
            <Target className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                    Next Month Earnings
                  </span>
                  <span className="text-sm font-semibold text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                    {analyticsData?.predictions.confidence}% confidence
                  </span>
                </div>
                <p className="text-2xl font-bold text-loopfund-emerald-900 dark:text-loopfund-emerald-100">
                  {formatSTX(analyticsData?.predictions.nextMonthEarnings)} STX
                </p>
              </div>
              
              <div className="bg-loopfund-neutral-50 dark:bg-loopfund-neutral-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                  AI Recommendation:
                </p>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {analyticsData?.predictions.recommendation}
                </p>
              </div>
            </div>
          )}
        </LoopFundCard>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
