import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Banknote,
  Percent,
  Trophy,
  Zap,
  Star,
  User,
  Award,
  Loader,
  Bell,
  Brain, 
  MessageCircle, 
  Lightbulb, 
  Sparkles,
  Heart,
  Gamepad2,
  PiggyBank,
  Building2,
  CreditCard,
  PieChart,
  TrendingDown,
  UserPlus,
  Share2,
  Gift,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../components/ui/StatsCard';
import ProgressRing from '../components/ui/ProgressRing';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import WeatherWidget from '../components/ui/WeatherWidget';
import LoopFundCard from '../components/ui/LoopFundCard';
import dashboardService from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import QuickActions from '../components/dashboard/QuickActions';
import FinancialAdvisor from '../components/ai/FinancialAdvisor';
import AIFinancialAdvisor from '../components/ai/AIFinancialAdvisor';
import { formatCurrencySimple } from '../utils/currency';
// Removed old Web2 wallet imports - using Web3 wallet now
import WalletConnect from '../components/web3/WalletConnect';
import walletService from '../services/walletService';
import defiService from '../services/defiService';
import { useWallet } from '../hooks/useWallet';

const DashboardPage = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Removed modal states - Web3 doesn't need these
  const [error, setError] = useState(null);
  const [realAchievements, setRealAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get real wallet data from useWallet hook
  const { isConnected: isWalletConnected, address, balance, cusdBalance, loadBalances } = useWallet();

  // Web3 wallet handlers - no backend API calls needed
  const handleAddMoney = () => {
    // For Web3, this would open a wallet transfer interface
    toast.info('Use your wallet to deposit CELO/cUSD directly');
  };

  const handleViewTransactions = () => {
    // For Web3, this would open the blockchain explorer
    const connectionStatus = walletService.getConnectionStatus();
    if (connectionStatus.isConnected) {
      window.open(`https://explorer.celo.org/address/${connectionStatus.address}`, '_blank');
    }
  };

  const handleWithdraw = () => {
    // For Web3, this would open a wallet transfer interface
    toast.info('Use your wallet to withdraw CELO/cUSD directly');
  };

  // Fetch dashboard data ONLY after wallet is connected
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch any data if wallet is not connected
      if (!isWalletConnected) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get wallet address
        const connectionStatus = await walletService.checkConnection();
        const walletAddress = connectionStatus.address;

        if (!walletAddress) {
          throw new Error('Wallet address not found');
        }

        console.log('📡 Fetching dashboard data for:', walletAddress);
        
        // Fetch real dashboard data from backend
        const response = await defiService.getDashboard(walletAddress);
        
        if (response && response.success) {
          setDashboardData(response.data);
          console.log('✅ Dashboard data loaded:', response.data);
        } else {
          // Use mock data if API call fails (for development)
          console.log('⚠️ Using mock dashboard data');
          setDashboardData({
            wallet: {
              address: walletAddress,
              balance: 0,
              network: 'celo-alfajores',
              totalDeposited: 0,
              totalYieldEarned: 0
            },
            stats: {
              activeVaults: 0,
              completedVaults: 0,
              totalVaults: 0,
              groupVaults: 0,
              averageAPY: 8.5,
              portfolioHealth: 0
            },
            vaults: {
              individual: [],
              group: []
            },
            recentActivity: [],
            insights: {
              totalProgress: 0,
              estimatedMonthlyYield: 0,
              nextMilestone: null
            }
          });
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        // Use mock data instead of showing error for better UX
        setDashboardData({
          wallet: {
            address: walletAddress || 'Unknown',
            balance: 0,
            network: 'celo-alfajores',
            totalDeposited: 0,
            totalYieldEarned: 0
          },
          stats: {
            activeVaults: 0,
            completedVaults: 0,
            totalVaults: 0,
            groupVaults: 0,
            averageAPY: 8.5,
            portfolioHealth: 0
          },
          vaults: {
            individual: [],
            group: []
          },
          recentActivity: [],
          insights: {
            totalProgress: 0,
            estimatedMonthlyYield: 0,
            nextMilestone: null
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if wallet is connected
    if (isWalletConnected) {
    fetchDashboardData();
    }
  }, [toast, isWalletConnected]);

  // Use mock Web3 achievements instead of fetching Web2 data
  useEffect(() => {
    if (isWalletConnected) {
      // Mock Web3 achievements for hackathon
      const mockWeb3Achievements = [
        {
          id: 1,
          title: 'First Vault',
          description: 'Created your first smart contract vault',
          icon: Target,
          color: 'bg-loopfund-emerald-500',
          type: 'individual'
        },
        {
          id: 2,
          title: 'Yield Farmer',
          description: 'Earned your first DeFi yield',
          icon: TrendingUp,
          color: 'bg-loopfund-coral-500',
          type: 'individual'
        },
        {
          id: 3,
          title: 'Group Vault Master',
          description: 'Created a successful group vault',
          icon: Users,
          color: 'bg-loopfund-gold-500',
          type: 'group'
        },
        {
          id: 4,
          title: 'DeFi Expert',
          description: 'Reached 10% APY on your vaults',
          icon: Award,
          color: 'bg-loopfund-electric-500',
          type: 'both'
        }
      ];
      
      setRealAchievements(mockWeb3Achievements);
      setAchievementsLoading(false);
    } else {
        setAchievementsLoading(false);
      }
  }, [isWalletConnected]);

  // No need for separate wallet connection check - using useWallet hook

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-emerald-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading your revolutionary dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-coral-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-8 h-8 text-white" />
          </motion.div>
          <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">Failed to load dashboard</p>
          <motion.button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 hover:from-loopfund-emerald-600 hover:to-loopfund-mint-600 text-white px-6 py-3 rounded-xl font-body text-body font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  // Web3 wallet stats - use REAL wallet balance with user-friendly language
  const stats = isWalletConnected ? [
    {
      title: 'My Wallet Balance',
      value: `${balance?.toFixed(4) || 0} CELO`,
      change: cusdBalance > 0 ? `+ ${cusdBalance?.toFixed(2) || 0} cUSD` : 'Available to use',
      changeType: 'positive',
      icon: Wallet,
      color: 'loopfund-emerald',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500'
    },
    {
      title: 'Total Earnings',
      value: `${dashboardData?.wallet?.totalYieldEarned?.toFixed(3) || 0} CELO`,
      change: `Est. this month: ${dashboardData?.insights?.estimatedMonthlyYield || 0} CELO`,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'loopfund-coral',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500'
    },
    {
      title: 'Savings Goals',
      value: `${dashboardData?.stats?.activeVaults || 0}`,
      change: `${dashboardData?.stats?.groupVaults || 0} with friends`,
      changeType: 'positive',
      icon: Target,
      color: 'loopfund-gold',
      gradient: 'from-loopfund-gold-500 to-loopfund-electric-500'
    },
    {
      title: 'Yearly Growth',
      value: `${dashboardData?.stats?.averageAPY?.toFixed(1) || 8.5}%`,
      change: `Your money is growing`,
      changeType: 'positive',
      icon: Percent,
      color: 'loopfund-electric',
      gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500'
    }
  ] : [];

  // Use real vaults data from API
  const recentGoals = (isWalletConnected && dashboardData?.vaults?.individual) 
    ? dashboardData.vaults.individual.map(vault => ({
        _id: vault.id,
        id: vault.id,
        name: vault.name,
        currentAmount: vault.currentAmount || 0,
        targetAmount: vault.targetAmount || 0,
        isGroupGoal: false,
        category: vault.category || 'General'
      }))
    : [];

  // Use real activity data from API
  const recentActivity = (isWalletConnected && dashboardData?.recentActivity) 
    ? dashboardData.recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        amount: activity.amount,
        date: new Date(activity.date).toLocaleDateString(),
        icon: activity.icon === 'Target' ? Target : activity.icon === 'TrendingUp' ? TrendingUp : Users,
        color: activity.type === 'vault_created' ? 'text-loopfund-emerald-500' : 'text-loopfund-coral-500',
        status: activity.status || 'success'
      }))
    : [];

  // Mock Web3 upcoming payments data will be defined later

  // Use Web3 achievements only
  const achievements = realAchievements;

  // Upcoming payments - calculated from vaults
  const upcomingPayments = (isWalletConnected && dashboardData?.vaults?.individual) 
    ? dashboardData.vaults.individual
        .filter(vault => vault.targetAmount > vault.currentAmount)
        .slice(0, 2)
        .map((vault, index) => ({
          id: vault.id,
          title: `${vault.name} Contribution`,
          amount: Math.min(0.5, vault.targetAmount - vault.currentAmount),
          date: new Date(Date.now() + ((index + 1) * 7 * 24 * 60 * 60 * 1000))
        }))
    : [];

  // Sort recent activity by date (newest first)
  const sortedRecentActivity = recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-loopfund-emerald-600 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20';
      case 'warning':
        return 'text-loopfund-gold-600 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20';
      case 'info':
        return 'text-loopfund-electric-600 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/20';
      default:
        return 'text-loopfund-neutral-600 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'info':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel':
        return 'bg-loopfund-emerald-500';
      case 'technology':
        return 'bg-loopfund-electric-500';
      case 'emergency':
        return 'bg-loopfund-coral-500';
      default:
        return 'bg-loopfund-neutral-500';
    }
  };

  // Dashboard content - wallet connection is handled by AppLayout

  return (
    <div className="space-y-8">
        {/* Welcome Section with Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <LoopFundCard className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-loopfund-emerald-100 rounded-full">
                    <User className="w-8 h-8 text-loopfund-emerald-600" />
                  </div>
                  <div>
                    <h1 className="font-display text-display-lg text-loopfund-neutral-900 mb-2">
                      Welcome back! 👋
                    </h1>
                    <p className="font-body text-body-lg text-loopfund-neutral-600">
                      Your wallet is connected. Start saving and growing your money with automated savings goals and personalized advice.
                    </p>
                  </div>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
          
          <WeatherWidget />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              gradient={stat.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>


        {/* Quick Actions */}
        <QuickActions />

        {/* Savings Options Section */}
        <div className="mb-8">
          <motion.div 
            className="bg-gradient-to-r from-loopfund-emerald-50 to-loopfund-coral-50 dark:from-loopfund-emerald-900/20 dark:to-loopfund-coral-900/20 rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  💰 Your Savings Options
                </h3>
                <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Grow your money safely with automated savings accounts
                </p>
              </div>
              <Link
                to="/goals"
                className="inline-flex items-center px-4 py-2 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 text-white rounded-lg transition-colors duration-200"
              >
                <Target className="w-4 h-4 mr-2" />
                Create Savings Goal
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-loopfund-dark-surface rounded-lg p-4 border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      CELO Savings
                    </p>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      8.5% yearly returns • Safe
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-loopfund-dark-surface rounded-lg p-4 border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 rounded-lg">
                    <Zap className="w-5 h-5 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Boosted Returns
                    </p>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      12.3% yearly returns • Balanced
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-loopfund-dark-surface rounded-lg p-4 border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 rounded-lg">
                    <Brain className="w-5 h-5 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
                  </div>
                  <div>
                    <p className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Smart Recommendations
                    </p>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      Personalized savings advice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Goals */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  My Savings Goals
                </h3>
                <Link
                  to="/goals"
                  className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-body text-body-sm font-medium transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentGoals.map((goal, index) => (
                  <motion.div
                    key={goal._id || goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-midnight-800/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-xl ${
                          goal.isGroupGoal ? 'bg-loopfund-coral-500' : 'bg-loopfund-emerald-500'
                        } flex items-center justify-center shadow-lg`}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Target className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {goal.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            goal.isGroupGoal 
                              ? 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300' 
                              : 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300'
                          }`}>
                            {goal.isGroupGoal ? 'Group' : 'Individual'}
                          </span>
                          <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {goal.category || 'Personal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatCurrencySimple(goal.currentAmount || 0)} / {formatCurrencySimple(goal.targetAmount || 0)}
                      </div>
                      <div className="w-32 h-3 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full mt-3 overflow-hidden">
                        <motion.div
                          className={`h-3 rounded-full ${
                            goal.isGroupGoal ? 'bg-loopfund-coral-500' : 'bg-loopfund-emerald-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0}%` 
                          }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Recent Activity
              </h2>
              <button className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {sortedRecentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className={`p-3 rounded-xl ${getStatusColor(activity.status)}`}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {getStatusIcon(activity.status)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {activity.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {activity.date}
                      </p>
                      {activity.amount && (
                        <p className="font-body text-body-xs font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          ${activity.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Upcoming Payments
              </h2>
              <button className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors">
                View calendar
              </button>
            </div>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-600/30 rounded-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {payment.title}
                    </h3>
                    <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {formatCurrencySimple(payment.amount)}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-loopfund-coral-700 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 dark:text-loopfund-coral-300 rounded-full">
                      Due Soon
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Achievements
              </h2>
              <Link
                to="/achievements"
                className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 hover:text-loopfund-emerald-700 dark:hover:text-loopfund-emerald-300 font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievementsLoading ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mr-3"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading achievements...</span>
                </div>
              ) : realAchievements.length > 0 ? (
                realAchievements.map((achievementData, index) => {
                  const { achievement, progress, unlocked } = achievementData;
                  if (!achievement) return null;
                  
                  return (
                    <motion.div
                      key={achievement._id || `achievement-${index}`}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        unlocked 
                          ? 'border-loopfund-emerald-200 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800' 
                          : 'border-loopfund-neutral-200 bg-loopfund-neutral-50 dark:bg-loopfund-midnight-800/50 dark:border-loopfund-neutral-600/30'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`p-2 rounded-lg ${
                            unlocked 
                              ? 'bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40' 
                              : 'bg-loopfund-neutral-100 dark:bg-loopfund-midnight-900/40'
                          }`}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <span className="text-lg">{achievement.icon}</span>
                        </motion.div>
                        <div>
                          <p className={`font-body text-body-sm font-medium ${
                            unlocked ? 'text-loopfund-emerald-800 dark:text-loopfund-emerald-200' : 'text-loopfund-neutral-500 dark:text-loopfund-neutral-400'
                          }`}>
                            {achievement.name}
                          </p>
                          <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {achievement.description}
                          </p>
                          {unlocked && (
                            <div className="flex items-center mt-1">
                              <CheckCircle className="w-3 h-3 text-loopfund-emerald-500 mr-1" />
                              <span className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">Unlocked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="p-4 rounded-xl border-2 border-loopfund-emerald-200 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="p-2 rounded-lg bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <achievement.icon 
                          size={20} 
                          className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400" 
                        />
                      </motion.div>
                      <div>
                        <p className="font-body text-body-sm font-medium text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                          {achievement.title}
                        </p>
                        <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Overall Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 text-center"
        >
          <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
            Overall Progress
          </h2>
          <div className="flex justify-center">
            <ProgressRing 
              progress={dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0} 
              size={150} 
              strokeWidth={12} 
              color="#10B981" 
            />
          </div>
          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-6">
            You're {dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0}% of the way to reaching all your savings goals! Keep it up! 🎉
          </p>
        </motion.div>

        {/* AI Financial Advisor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="p-3 bg-loopfund-electric-500 rounded-xl shadow-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Your Personal Savings Coach
                </h2>
              </div>
              <Link 
                to="/ai-advisor" 
                className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 hover:text-loopfund-emerald-700 dark:hover:text-loopfund-emerald-300 font-medium transition-colors"
              >
                View Full Page →
              </Link>
            </div>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Get personalized tips and helpful strategies to save smarter and reach your goals faster.
            </p>
            <AIFinancialAdvisor />
          </div>
        </motion.div>

      {/* Floating Action Button */}
      <FloatingActionButton />

        {/* Web3 doesn't need these modals - wallet handles transfers directly */}
    </div>
  );
};

export default DashboardPage;