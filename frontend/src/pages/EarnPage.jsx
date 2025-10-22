import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Award, 
  Shield, 
  Coins,
  ArrowUpRight,
  Clock,
  Target, 
  Users, 
  BarChart3,
  DollarSign,
  Plus,
  Sparkles,
  PiggyBank,
  Wallet,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const EarnPage = () => {
  const navigate = useNavigate();
  const [earnStats, setEarnStats] = useState(null);
  const [userGoals, setUserGoals] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use Celo wallet hook
  const { isConnected, address, balance, cusdBalance } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address) {
      fetchEarningsData();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching earnings data for wallet:', address);
      
      // Fetch user's goals
      try {
        const goalsResponse = await api.get('/goals', {
          params: { walletAddress: address }
        });
        
        if (goalsResponse.data.success) {
          const goals = goalsResponse.data.data || [];
          setUserGoals(goals);
          console.log('✅ Goals loaded:', goals.length);
        }
      } catch (error) {
        console.log('⚠️ Error fetching goals:', error);
      }

      // Fetch user's groups
      try {
        const groupsResponse = await api.get('/groups', {
          params: { walletAddress: address }
        });
        
        if (groupsResponse.data.success) {
          const groups = groupsResponse.data.data || [];
          setUserGroups(groups);
          console.log('✅ Groups loaded:', groups.length);
        }
      } catch (error) {
        console.log('⚠️ Error fetching groups:', error);
      }

    } catch (error) {
      console.error('❌ Error fetching earnings data:', error);
      toast.error('Unable to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate earnings stats whenever goals or groups change
  useEffect(() => {
    if (userGoals.length > 0 || userGroups.length > 0) {
      calculateEarnStats();
    }
  }, [userGoals, userGroups]);

  const calculateEarnStats = () => {
    // Calculate total staked from goals and groups
    const totalGoalsStaked = userGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    const totalGroupsStaked = userGroups.reduce((sum, group) => sum + (group.currentAmount || 0), 0);
    const totalStaked = totalGoalsStaked + totalGroupsStaked;

    // Calculate estimated earnings (8.5% for goals, 10% for groups)
    const goalsEarnings = totalGoalsStaked * 0.085;
    const groupsEarnings = totalGroupsStaked * 0.10;
    const totalEstimatedEarnings = goalsEarnings + groupsEarnings;

    // Calculate weighted average APY
    const weightedAPY = totalStaked > 0 
      ? ((goalsEarnings + groupsEarnings) / totalStaked) * 100 
      : 0;

    setEarnStats({
      totalStaked: totalStaked,
      estimatedYearlyEarnings: totalEstimatedEarnings,
      averageAPY: weightedAPY,
      activeGoals: userGoals.length,
      activeGroups: userGroups.length
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  // Available earning options
  const earningOptions = [
    {
      id: 'individual',
      name: 'Personal Savings Goals',
      description: 'Save for your dreams and earn consistent returns',
      apy: 8.5,
      risk: 'Low',
      minAmount: 0.01,
      maxAmount: 1000,
      duration: '7-365 days',
      color: 'emerald',
      icon: Target,
      features: ['✅ Flexible lock periods', '✅ Auto-compound interest', '✅ Withdraw anytime after lock'],
      cta: 'Create Savings Goal',
      action: () => navigate('/app/goals')
    },
    {
      id: 'group',
      name: 'Group Savings Pools',
      description: 'Save together with friends and family for higher returns',
      apy: 10.0,
      risk: 'Low',
      minAmount: 0.1,
      maxAmount: 10000,
      duration: '7-365 days',
      color: 'coral',
      icon: Users,
      features: ['✅ Higher returns (10% APY)', '✅ Save with 2-50 members', '✅ Creator bonus (2%)'],
      cta: 'Join or Create Pool',
      action: () => navigate('/app/goals')
    },
    {
      id: 'flexible',
      name: 'Flexible Savings',
      description: 'Earn on your idle CELO with no lock-up period',
      apy: 6.0,
      risk: 'Low',
      minAmount: 0.001,
      maxAmount: null,
      duration: 'No lock-up',
      color: 'gold',
      icon: Wallet,
      features: ['✅ No minimum lock period', '✅ Withdraw instantly', '✅ Perfect for beginners'],
      cta: 'Coming Soon',
      action: () => toast.info('Flexible savings coming soon!'),
      comingSoon: true
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500',
        text: 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400',
        badge: 'bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 text-loopfund-emerald-700 dark:text-loopfund-emerald-300',
        icon: 'bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 text-loopfund-emerald-600 dark:text-loopfund-emerald-400'
      },
      coral: {
        bg: 'bg-gradient-to-br from-loopfund-coral-500 to-loopfund-coral-600',
        text: 'text-loopfund-coral-600 dark:text-loopfund-coral-400',
        badge: 'bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 text-loopfund-coral-700 dark:text-loopfund-coral-300',
        icon: 'bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 text-loopfund-coral-600 dark:text-loopfund-coral-400'
      },
      gold: {
        bg: 'bg-gradient-to-br from-loopfund-gold-500 to-loopfund-gold-600',
        text: 'text-loopfund-gold-600 dark:text-loopfund-gold-400',
        badge: 'bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 text-loopfund-gold-700 dark:text-loopfund-gold-300',
        icon: 'bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 text-loopfund-gold-600 dark:text-loopfund-gold-400'
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-loopfund-emerald-500 via-loopfund-mint-500 to-loopfund-emerald-600 p-8 md:p-12"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-white/90 font-medium">Start Earning Today</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            Grow Your Money<br />While You Sleep
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Turn your CELO into earnings with secure, blockchain-powered savings. No hidden fees, no complicated terms.
          </p>

          {!isConnected ? (
            <LoopFundButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/')}
              className="bg-white text-loopfund-emerald-600 hover:bg-white/90"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Start
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </LoopFundButton>
          ) : (
            <div className="flex flex-wrap gap-4">
              <LoopFundButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/app/goals')}
                className="bg-white text-loopfund-emerald-600 hover:bg-white/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Savings Goal
              </LoopFundButton>
          <LoopFundButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/app/goals')}
                className="bg-white/20 text-white hover:bg-white/30 border-white/30"
              >
                <Users className="w-5 h-5 mr-2" />
                Join a Pool
          </LoopFundButton>
            </div>
        )}
        </div>
      </motion.div>

      {/* Connection Status */}
      {!isConnected && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <LoopFundCard className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Connect your Celo wallet to see your earnings and start saving.
                </p>
              </div>
              <LoopFundButton
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
              >
                Connect Now
              </LoopFundButton>
            </div>
          </LoopFundCard>
      </motion.div>
      )}

      {/* Stats Cards - Only show if connected */}
      {isConnected && earnStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <LoopFundCard className="p-6 bg-gradient-to-br from-loopfund-emerald-50 to-loopfund-mint-50 dark:from-loopfund-emerald-900/20 dark:to-loopfund-mint-900/20 border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
            <div className="flex items-center justify-between mb-3">
              <PiggyBank className="w-8 h-8 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
              <span className="text-xs font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 px-2 py-1 rounded-full">
                Active
                  </span>
                </div>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
              Total Saved
            </p>
            <p className="text-3xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {earnStats.totalStaked.toFixed(4)}
            </p>
            <p className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
              CELO
            </p>
          </LoopFundCard>

          <LoopFundCard className="p-6 bg-gradient-to-br from-loopfund-coral-50 to-loopfund-coral-100 dark:from-loopfund-coral-900/20 dark:to-loopfund-coral-800/20 border-loopfund-coral-200 dark:border-loopfund-coral-800">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
              <span className="text-xs font-medium text-loopfund-coral-700 dark:text-loopfund-coral-300 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 px-2 py-1 rounded-full">
                Yearly
                    </span>
                  </div>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
              Est. Earnings
            </p>
            <p className="text-3xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {earnStats.estimatedYearlyEarnings.toFixed(4)}
            </p>
            <p className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
              CELO per year
            </p>
          </LoopFundCard>

          <LoopFundCard className="p-6 bg-gradient-to-br from-loopfund-gold-50 to-loopfund-gold-100 dark:from-loopfund-gold-900/20 dark:to-loopfund-gold-800/20 border-loopfund-gold-200 dark:border-loopfund-gold-800">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
              <span className="text-xs font-medium text-loopfund-gold-700 dark:text-loopfund-gold-300 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 px-2 py-1 rounded-full">
                Average
                    </span>
                  </div>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
              Your Returns
            </p>
            <p className="text-3xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {earnStats.averageAPY.toFixed(2)}%
            </p>
            <p className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
              Annual Return Rate
            </p>
          </LoopFundCard>

          <LoopFundCard className="p-6 bg-gradient-to-br from-loopfund-electric-50 to-loopfund-electric-100 dark:from-loopfund-electric-900/20 dark:to-loopfund-electric-800/20 border-loopfund-electric-200 dark:border-loopfund-electric-800">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
              <span className="text-xs font-medium text-loopfund-electric-700 dark:text-loopfund-electric-300 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/30 px-2 py-1 rounded-full">
                Active
                    </span>
                  </div>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
              Active Plans
            </p>
            <p className="text-3xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {earnStats.activeGoals + earnStats.activeGroups}
            </p>
            <p className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
              {earnStats.activeGoals} Goals • {earnStats.activeGroups} Pools
            </p>
              </LoopFundCard>
        </motion.div>
      )}

      {/* Earning Options */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Ways to Earn
            </h2>
            <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
              Choose how you want to grow your money
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {earningOptions.map((option, index) => {
            const Icon = option.icon;
            const colors = getColorClasses(option.color);
            
            return (
        <motion.div
                key={option.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <LoopFundCard className="p-6 h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  {/* Background Gradient Effect */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${colors.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${colors.text}`}>
                          {option.apy}%
                        </div>
                        <div className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                          Annual Return
                        </div>
                  </div>
                </div>
                
                    <h3 className="font-display text-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                      {option.name}
                </h3>
                    
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                      {option.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Risk Level
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(option.risk)}`}>
                          {option.risk}
                    </span>
                  </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Minimum
                    </span>
                    <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {option.minAmount} CELO
                    </span>
                  </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Duration
                    </span>
                    <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {option.duration}
                    </span>
                  </div>
                </div>

                    {/* Features */}
                <div className="space-y-2 mb-6">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                          <span className="mr-2">{feature}</span>
                  </div>
                      ))}
                </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: option.comingSoon ? 1 : 1.02 }}
                      whileTap={{ scale: option.comingSoon ? 1 : 0.98 }}
                      onClick={option.action}
                      disabled={option.comingSoon}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        option.comingSoon
                          ? 'bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 text-loopfund-neutral-500 dark:text-loopfund-neutral-400 cursor-not-allowed'
                          : `${colors.bg} text-white shadow-md hover:shadow-lg`
                      }`}
                    >
                      <span>{option.cta}</span>
                      {!option.comingSoon && <ChevronRight className="w-5 h-5" />}
                    </motion.button>
                  </div>
              </LoopFundCard>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <LoopFundCard className="p-8 bg-gradient-to-br from-loopfund-neutral-50 to-white dark:from-loopfund-midnight-800 dark:to-loopfund-midnight-900">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-6 h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
            <h3 className="font-display text-2xl text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              How Earning Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 flex items-center justify-center text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-bold">
                1
                      </div>
                      <div>
                <h4 className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Save Your CELO
                </h4>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Set a goal or join a pool. Your CELO is locked in a secure smart contract on the blockchain.
                </p>
                    </div>
                  </div>
                  
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 flex items-center justify-center text-loopfund-coral-600 dark:text-loopfund-coral-400 font-bold">
                2
                    </div>
                    <div>
                <h4 className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Earn Automatically
                </h4>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Returns accumulate daily. Up to 10% annual returns on group pools, 8.5% on personal goals.
                </p>
                      </div>
                    </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 flex items-center justify-center text-loopfund-gold-600 dark:text-loopfund-gold-400 font-bold">
                3
                    </div>
                    <div>
                <h4 className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Withdraw Anytime
                </h4>
                <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  After the lock period ends, withdraw your savings plus earnings directly to your wallet.
                </p>
                      </div>
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>

      {/* Call to Action */}
      {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <LoopFundCard className="p-12 bg-gradient-to-br from-loopfund-emerald-50 via-loopfund-mint-50 to-loopfund-emerald-50 dark:from-loopfund-emerald-900/20 dark:via-loopfund-mint-900/20 dark:to-loopfund-emerald-900/20 border-2 border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
            <Sparkles className="w-12 h-12 text-loopfund-emerald-600 dark:text-loopfund-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-3xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              Ready to Start Earning?
                </h3>
            <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6 max-w-2xl mx-auto">
              Your CELO can work for you. Create your first savings goal today and watch your money grow.
                </p>
            <div className="flex justify-center space-x-4">
                <LoopFundButton
                  variant="primary"
                  size="lg"
                onClick={() => navigate('/app/goals')}
                >
                <Plus className="w-5 h-5 mr-2" />
                Start Earning Now
                <ArrowUpRight className="w-5 h-5 ml-2" />
                </LoopFundButton>
              </div>
          </LoopFundCard>
            </motion.div>
          )}
        </motion.div>
  );
};

export default EarnPage;
