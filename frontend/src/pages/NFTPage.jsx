import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Trophy,
  Star,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Users,
  Clock,
  Rocket,
  ArrowRight,
  CheckCircle,
  Gift,
  Crown,
  Gem,
  Sparkles,
  Heart,
  Flame
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const NFTPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const nftCategories = [
    {
      id: 'savings',
      title: 'Savings Achievements',
      description: 'NFTs earned by reaching savings milestones',
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      nfts: [
        { name: 'First Saver', description: 'Complete your first savings goal', rarity: 'common', icon: <Star className="w-8 h-8" /> },
        { name: 'Goal Crusher', description: 'Reach 5 savings goals', rarity: 'rare', icon: <Trophy className="w-8 h-8" /> },
        { name: 'Savings Master', description: 'Reach 25 savings goals', rarity: 'epic', icon: <Crown className="w-8 h-8" /> }
      ]
    },
    {
      id: 'community',
      title: 'Community NFTs',
      description: 'NFTs earned through group participation',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      nfts: [
        { name: 'Team Player', description: 'Join your first group pool', rarity: 'common', icon: <Users className="w-8 h-8" /> },
        { name: 'Group Leader', description: 'Create and manage a group pool', rarity: 'rare', icon: <Crown className="w-8 h-8" /> },
        { name: 'Community Champion', description: 'Help 10+ members reach goals', rarity: 'legendary', icon: <Heart className="w-8 h-8" /> }
      ]
    },
    {
      id: 'staking',
      title: 'Staking Rewards',
      description: 'NFTs earned through staking activities',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      nfts: [
        { name: 'Staking Starter', description: 'Stake your first tokens', rarity: 'common', icon: <Zap className="w-8 h-8" /> },
        { name: 'Yield Hunter', description: 'Earn 100+ STX in rewards', rarity: 'rare', icon: <Gem className="w-8 h-8" /> },
        { name: 'DeFi Legend', description: 'Earn 1000+ STX in rewards', rarity: 'legendary', icon: <Flame className="w-8 h-8" /> }
      ]
    }
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  };

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Basic Achievement System",
      description: "Core NFT achievements for savings milestones",
      timeline: "Q2 2024",
      status: "in-progress"
    },
    {
      phase: "Phase 2", 
      title: "Advanced Rewards",
      description: "Dynamic NFTs with utility and governance rights",
      timeline: "Q3 2024",
      status: "planned"
    },
    {
      phase: "Phase 3",
      title: "NFT Marketplace",
      description: "Trade and sell NFTs with other users",
      timeline: "Q4 2024",
      status: "planned"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Award className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Loading NFT Collection
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Preparing your achievement gallery...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                NFT Achievements
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Coming Soon - Earn unique NFTs for your DeFi milestones
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
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Gift className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">NFT Achievement System</h2>
                </div>
                <p className="text-xl text-purple-100 mb-6 max-w-2xl">
                  Earn unique, verifiable NFTs as you reach savings milestones, participate in group pools, 
                  and stake your assets. Each NFT represents your DeFi journey and achievements.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Achievements</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Verifiable</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-medium">Rare</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Award className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NFT Categories */}
        <div className="space-y-8 mb-8">
          {nftCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${category.color} rounded-lg text-white`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {category.nfts.map((nft, nftIndex) => (
                  <motion.div
                    key={nftIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (nftIndex * 0.05) }}
                    className="relative group"
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                      {/* Coming Soon Overlay */}
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center text-white">
                          <Clock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Coming Soon</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                          {nft.icon}
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          {nft.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {nft.description}
                        </p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${rarityColors[nft.rarity]}`}>
                          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Roadmap Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              NFT Development Roadmap
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
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse"></div>
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
                    <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
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
          className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 text-white text-center"
        >
          <div className="max-w-2xl mx-auto">
            <Gem className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Start Your NFT Collection Journey
            </h2>
            <p className="text-xl text-purple-200 mb-6">
              Begin earning NFTs by creating savings goals, joining group pools, 
              and staking your assets. Each achievement brings you closer to rare collectibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => toast({
                  title: "Coming Soon!",
                  description: "NFT achievements will be available in Phase 2 of our roadmap.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors font-medium"
              >
                <span>Start Earning NFTs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => toast({
                  title: "Stay Updated",
                  description: "Follow our progress to be notified when NFTs launch.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
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

export default NFTPage;
