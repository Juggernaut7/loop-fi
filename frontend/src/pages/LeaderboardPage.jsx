import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal,
  Star,
  TrendingUp,
  Users,
  Target,
  Clock,
  Rocket,
  ArrowRight,
  Crown,
  Award,
  Zap,
  Flame,
  Gem,
  Sparkles,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LeaderboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('savings');
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const leaderboardData = {
    savings: [
      { rank: 1, name: "CryptoKing", amount: "15,420 STX", goals: 28, avatar: "👑", badge: "Savings Master" },
      { rank: 2, name: "DeFiDiva", amount: "12,850 STX", goals: 24, avatar: "💎", badge: "Goal Crusher" },
      { rank: 3, name: "StacksSavior", amount: "11,200 STX", goals: 22, avatar: "🚀", badge: "Consistent Saver" },
      { rank: 4, name: "BitcoinBuilder", amount: "9,750 STX", goals: 19, avatar: "⚡", badge: "Rising Star" },
      { rank: 5, name: "YieldHunter", amount: "8,900 STX", goals: 17, avatar: "🎯", badge: "Goal Achiever" },
      { rank: 6, name: "VaultMaster", amount: "7,650 STX", goals: 15, avatar: "🏆", badge: "Savings Pro" },
      { rank: 7, name: "StackerSupreme", amount: "6,800 STX", goals: 13, avatar: "💪", badge: "Dedicated Saver" },
      { rank: 8, name: "DeFiDynamo", amount: "5,950 STX", goals: 11, avatar: "🔥", badge: "Active Saver" },
      { rank: 9, name: "CryptoChampion", amount: "5,200 STX", goals: 10, avatar: "⭐", badge: "Goal Setter" },
      { rank: 10, name: "StacksStar", amount: "4,500 STX", goals: 9, avatar: "🌟", badge: "Savings Starter" }
    ],
    groups: [
      { rank: 1, name: "DeFi Dream Team", members: 45, totalSaved: "25,600 STX", avgPerMember: "568 STX", badge: "Community Champions" },
      { rank: 2, name: "Bitcoin Builders", members: 38, totalSaved: "22,100 STX", avgPerMember: "582 STX", badge: "Team Players" },
      { rank: 3, name: "Stacks Savers", members: 32, totalSaved: "18,750 STX", avgPerMember: "586 STX", badge: "Collaborative Savers" },
      { rank: 4, name: "Yield Warriors", members: 28, totalSaved: "16,200 STX", avgPerMember: "579 STX", badge: "Group Achievers" },
      { rank: 5, name: "Vault Ventures", members: 25, totalSaved: "14,800 STX", avgPerMember: "592 STX", badge: "Pool Masters" }
    ],
    staking: [
      { rank: 1, name: "StakingKing", staked: "50,000 STX", rewards: "3,250 STX", apy: "12.5%", badge: "Staking Legend" },
      { rank: 2, name: "YieldMaster", staked: "42,500 STX", rewards: "2,890 STX", apy: "11.8%", badge: "Reward Hunter" },
      { rank: 3, name: "DeFiStaker", staked: "38,000 STX", rewards: "2,650 STX", apy: "12.1%", badge: "Staking Pro" },
      { rank: 4, name: "VaultVeteran", staked: "32,500 STX", rewards: "2,200 STX", apy: "11.5%", badge: "Staking Expert" },
      { rank: 5, name: "StackerSupreme", staked: "28,000 STX", rewards: "1,950 STX", apy: "11.2%", badge: "Staking Star" }
    ]
  };

  const stats = [
    { label: "Total Users", value: "2,847", icon: <Users className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Goals Completed", value: "15,234", icon: <Target className="w-5 h-5" />, color: "text-green-600" },
    { label: "Total Saved", value: "1.2M STX", icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-600" },
    { label: "Groups Active", value: "342", icon: <Users className="w-5 h-5" />, color: "text-orange-600" }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Basic Leaderboards",
      description: "Simple rankings for savings and group performance",
      timeline: "Q2 2024",
      status: "in-progress"
    },
    {
      phase: "Phase 2", 
      title: "Advanced Analytics",
      description: "Detailed performance metrics and achievement tracking",
      timeline: "Q3 2024",
      status: "planned"
    },
    {
      phase: "Phase 3",
      title: "Rewards & Recognition",
      description: "NFT rewards for top performers and community recognition",
      timeline: "Q4 2024",
      status: "planned"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Trophy className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Loading Leaderboards
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Preparing community rankings...
          </p>
        </motion.div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-500 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3: return "bg-gradient-to-r from-orange-400 to-orange-600";
      default: return "bg-gradient-to-r from-slate-200 to-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Community Leaderboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Coming Soon - Compete with the community and climb the rankings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">Community Leaderboards</h2>
                </div>
                <p className="text-xl text-yellow-100 mb-6 max-w-2xl">
                  Compete with fellow DeFi enthusiasts! Climb the rankings by saving more, 
                  joining group pools, and staking your assets. Show off your achievements 
                  and inspire others.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Competitive</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Community</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Recognition</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center"
            >
              <div className={`${stat.color} mx-auto mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'savings', label: 'Savings Leaders', icon: <Target className="w-4 h-4" /> },
              { id: 'groups', label: 'Group Champions', icon: <Users className="w-4 h-4" /> },
              { id: 'staking', label: 'Staking Masters', icon: <TrendingUp className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'savings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Top Savers
                    </h3>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Coming Soon</span>
                    </div>
                  </div>
                  {leaderboardData.savings.map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getRankColor(user.rank)}`}>
                          {getRankIcon(user.rank)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{user.avatar}</span>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {user.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {user.badge}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {user.amount}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {user.goals} goals
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Top Groups
                    </h3>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Coming Soon</span>
                    </div>
                  </div>
                  {leaderboardData.groups.map((group, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getRankColor(group.rank)}`}>
                          {getRankIcon(group.rank)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {group.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {group.badge} • {group.members} members
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {group.totalSaved}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {group.avgPerMember} avg
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'staking' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Top Stakers
                    </h3>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Coming Soon</span>
                    </div>
                  </div>
                  {leaderboardData.staking.map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getRankColor(user.rank)}`}>
                          {getRankIcon(user.rank)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.badge}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {user.staked} staked
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {user.rewards} rewards ({user.apy})
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Roadmap Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Leaderboard Development Roadmap
            </h2>
          </div>
          
          <div className="space-y-6">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {item.status === 'in-progress' ? (
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-600 rounded-full animate-pulse"></div>
                    </div>
                  ) : item.status === 'planned' ? (
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.phase}: {item.title}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {item.timeline}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {item.status === 'in-progress' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">In Progress</span>
                    </div>
                  )}
                  {item.status === 'planned' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Planned</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-2xl p-8 text-white text-center"
        >
          <div className="max-w-2xl mx-auto">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Climb the Rankings
            </h2>
            <p className="text-xl text-yellow-200 mb-6">
              Start saving, join group pools, and stake your assets to climb the leaderboards. 
              Compete with the community and earn recognition for your DeFi achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => toast({
                  title: "Coming Soon!",
                  description: "Leaderboards will be available in Phase 2 of our roadmap.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium"
              >
                <span>Start Competing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => toast({
                  title: "Stay Updated",
                  description: "Follow our progress to be notified when leaderboards launch.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-medium"
              >
                <span>Get Notified</span>
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
