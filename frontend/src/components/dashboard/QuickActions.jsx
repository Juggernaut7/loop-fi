import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Wallet, 
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
  Coins,
  TrendingUp,
  Shield
} from 'lucide-react';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundCard from '../ui/LoopFundCard';
import walletService from '../../services/walletService';

const QuickActions = () => {
  const navigate = useNavigate();
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);

  useEffect(() => {
    const connectionStatus = walletService.getConnectionStatus();
    setIsWeb3Connected(connectionStatus.isConnected);
  }, []);

  const web3Actions = [
    {
      title: 'My Wallet',
      icon: Shield,
      color: 'loopfund-emerald',
      onClick: () => navigate('/app/wallet'),
      web3Only: true
    },
    {
      title: 'Savings Account',
      icon: Coins,
      color: 'loopfund-coral',
      onClick: () => navigate('/defi/vault'),
      web3Only: true
    },
    {
      title: 'Earn Interest',
      icon: TrendingUp,
      color: 'loopfund-gold',
      onClick: () => navigate('/defi/stake'),
      web3Only: true
    },
    {
      title: 'Grow Savings',
      icon: Zap,
      color: 'loopfund-electric',
      onClick: () => navigate('/defi/yield'),
      web3Only: true
    }
  ];

  const traditionalActions = [
    {
      title: 'New Savings Goal',
      icon: Target,
      color: 'loopfund-emerald',
      onClick: () => navigate('/goals/create')
    },
    {
      title: 'Save with Friends',
      icon: Users,
      color: 'loopfund-coral',
      onClick: () => navigate('/groups/create')
    },
    {
      title: 'Add Money',
      icon: Wallet,
      color: 'loopfund-gold',
      onClick: () => navigate('/contributions/pay')
    },
    {
      title: 'Quick Deposit',
      icon: Zap,
      color: 'loopfund-electric',
      onClick: () => navigate('/contributions/quick-save')
    }
  ];

  const actions = isWeb3Connected ? web3Actions : traditionalActions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <LoopFundCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {isWeb3Connected ? 'Quick Actions' : 'Quick Actions'}
            </h3>
            {isWeb3Connected && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Wallet Connected • Ready to save and grow your money
              </p>
            )}
          </div>
          <motion.button 
            onClick={() => navigate('/dashboard')}
            className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium flex items-center space-x-2 transition-colors"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LoopFundCard 
                className="p-6 hover:shadow-loopfund-lg transition-all duration-300 cursor-pointer group"
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text text-center">
                    {action.title}
                  </span>
                </div>
              </LoopFundCard>
            </motion.div>
          ))}
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default QuickActions;