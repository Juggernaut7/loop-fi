import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  Users, 
  UserPlus,
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2, 
  ArrowUpRight,
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle,
  Copy,
  Share2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useWallet } from '../hooks/useWallet';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundCard from '../components/ui/LoopFundCard';
import { formatCurrencySimple } from '../utils/currency';
import api from '../services/api';
import contractInteractionService from '../services/contractInteraction.service';

const GoalsPage = () => {
  const [activeTab, setActiveTab] = useState('my-goals');
  const [goals, setGoals] = useState([]);
  const [groupPools, setGroupPools] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showJoinPoolModal, setShowJoinPoolModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use wallet hook for Web3 wallet data
  const { isConnected: isWalletConnected, address: walletAddress, balance } = useWallet();

  // Memoized function to load goals data (prevents infinite loops)
  const loadGoalsData = useCallback(async () => {
    if (!isWalletConnected || !walletAddress) {
      console.log('⚠️ Wallet not connected, showing empty state');
          setIsLoading(false);
          return;
        }

    try {
      setIsLoading(true);
      console.log('📡 Loading goals data for wallet:', walletAddress);
        
        // Get individual savings goals from backend API
        const goalsResponse = await api.get('/goals', {
        params: { walletAddress }
        });
      
        if (goalsResponse.data.success) {
        console.log('✅ Goals loaded:', goalsResponse.data.data);
          setGoals(goalsResponse.data.data || []);
        }

        // Get group pools from backend API
        const groupsResponse = await api.get('/groups', {
        params: { walletAddress }
        });
      
        if (groupsResponse.data.success) {
        console.log('✅ Groups loaded:', groupsResponse.data.data);
          setGroupPools(groupsResponse.data.data || []);
        }

      } catch (error) {
      console.error('❌ Error loading goals data:', error);
      
      // Show error message but don't use mock data
      if (error.response?.status === 404) {
        console.log('ℹ️ No goals found for this wallet');
        setGoals([]);
        setGroupPools([]);
      } else {
        toast.error('Failed to load your savings goals. Please try again.');
      }
      } finally {
        setIsLoading(false);
      }
  }, [isWalletConnected, walletAddress, toast]);

  // Load goals data on mount and when wallet changes
  useEffect(() => {
    loadGoalsData();
  }, [loadGoalsData]);

  const handleCreateGoal = () => {
    setShowCreateModal(true);
  };

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    setShowGoalModal(true);
  };

  const handleJoinPool = async (inviteCode) => {
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!inviteCode || inviteCode.trim() === '') {
      toast.error('Please enter an invite code');
      return;
    }

    try {
      setIsLoading(true);
      
      toast.info('🔍 Finding pool...');
      
      // Join pool in backend database
      const response = await api.post('/groups/join', {
        inviteCode: inviteCode.trim(),
        walletAddress: walletAddress
      });

      if (response.data.success) {
        toast.success('🎉 Successfully joined the pool!');
        console.log('✅ Joined pool:', response.data.data);
        
        // Refresh pools list
        await loadGoalsData();
        
        setShowJoinPoolModal(false);
      } else {
        throw new Error(response.data.error || 'Failed to join pool');
      }

    } catch (error) {
      console.error('❌ Error joining pool:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Unable to join pool: ${error.response.data.error}`);
      } else {
        toast.error(`Unable to join pool: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('📋 Invite code copied to clipboard!');
  };

  const handleCreateGroupSubmit = async (groupData) => {
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('👥 Creating group pool:', {
        name: groupData.name,
        targetAmount: groupData.targetAmount,
        maxMembers: groupData.maxMembers,
        deadline: groupData.deadline,
        walletAddress
      });

      // Step 1: Create pool on blockchain (REAL smart contract interaction)
      toast.info('📝 Setting up your savings pool...');
      const contractResult = await contractInteractionService.createGroupPool(
        groupData.name,
        groupData.description || '',
        groupData.targetAmount,
        groupData.maxMembers,
        groupData.deadline
      );

      if (!contractResult.success) {
        throw new Error(contractResult.error || 'Failed to create pool on blockchain');
      }

      console.log('✅ Pool created on blockchain:', {
        txHash: contractResult.txHash,
        poolId: contractResult.poolId
      });

      // Step 2: Save group to backend database with blockchain reference
        const backendGroupData = {
          name: groupData.name,
          description: groupData.description || '',
        targetAmount: groupData.targetAmount,
          maxMembers: groupData.maxMembers,
          endDate: groupData.deadline,
        category: groupData.category || 'Group Savings',
          walletAddress: walletAddress,
        blockchainPoolId: contractResult.poolId, // Link to blockchain
        creationTxHash: contractResult.txHash // Transaction hash
        };

      console.log('📤 Sending to backend:', backendGroupData);

        const backendResponse = await api.post('/groups', backendGroupData);
        
        if (backendResponse.data.success) {
        toast.success('🎉 Savings pool created successfully!');
        console.log('✅ Group saved to database:', backendResponse.data.data);
        
        // Refresh groups list using memoized function
        await loadGoalsData();
          
          setShowCreateGroupModal(false);
        } else {
          throw new Error(backendResponse.data.error || 'Failed to save group to database');
      }

    } catch (error) {
      console.error('❌ Error creating group:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Unable to create pool: ${error.response.data.error}`);
      } else {
        toast.error(`Unable to create pool: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoalSubmit = async (goalData) => {
    if (!isWalletConnected || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('💰 Creating savings goal:', {
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        deadline: goalData.deadline,
        walletAddress
      });

      // Step 1: Create goal on blockchain (REAL smart contract interaction)
      toast.info('📝 Setting up your savings goal...');
      const contractResult = await contractInteractionService.createSavingsGoal(
        goalData.targetAmount,
        goalData.deadline
      );

      if (!contractResult.success) {
        throw new Error(contractResult.error || 'Failed to create goal on blockchain');
      }

      console.log('✅ Goal created on blockchain:', {
        txHash: contractResult.txHash,
        goalId: contractResult.goalId
      });

      // Step 2: Save goal to backend database with blockchain reference
        const backendGoalData = {
          name: goalData.name,
          description: goalData.description || '',
        targetAmount: goalData.targetAmount, // Amount in CELO
        endDate: goalData.deadline, // Backend expects endDate
          frequency: 'monthly', // Required field - default to monthly
        amount: goalData.targetAmount / 12, // Monthly contribution amount
        category: goalData.category || 'Savings',
        walletAddress: walletAddress, // Required for backend to identify user
        blockchainGoalId: contractResult.goalId, // Link to blockchain
        creationTxHash: contractResult.txHash // Transaction hash
      };

      console.log('📤 Sending to backend:', backendGoalData);

        const backendResponse = await api.post('/goals', backendGoalData);
        
        if (backendResponse.data.success) {
        toast.success('🎉 Savings goal created successfully!');
        console.log('✅ Goal saved to database:', backendResponse.data.data);
        
        // Refresh goals list using the memoized function
        await loadGoalsData();
          
          setShowCreateModal(false);
        } else {
          throw new Error(backendResponse.data.error || 'Failed to save goal to database');
      }

    } catch (error) {
      console.error('❌ Error creating goal:', error);
      
      if (error.response?.data?.error) {
        toast.error(`Unable to create goal: ${error.response.data.error}`);
      } else {
        toast.error(`Unable to create goal: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (amount) => {
    if (!selectedGoal || !isWalletConnected || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      
      // Determine if this is a goal or group
      const isGroup = selectedGoal.members && Array.isArray(selectedGoal.members);
      
      console.log('💰 Depositing to goal:', {
        vaultId: selectedGoal._id || selectedGoal.id,
        amount,
        walletAddress,
        isGroup
      });

      // Check wallet balance before deposit
      if (balance < amount) {
        toast.error(`Not enough funds. You have ${balance.toFixed(4)} CELO but need ${amount.toFixed(4)} CELO`);
        return;
      }

      // Deposit to blockchain using REAL smart contract
      toast.info('⏳ Preparing your deposit... Please approve in your wallet');
      
      let txResult;
      if (isGroup) {
        // Contribute to group pool contract  
        // Use blockchainPoolId stored in backend
        const poolId = selectedGoal.blockchainPoolId;
        
        console.log('📋 Group details:', {
          _id: selectedGoal._id,
          blockchainPoolId: selectedGoal.blockchainPoolId,
          name: selectedGoal.name
        });
        
        if (!poolId) {
          throw new Error('This group pool is not linked to the blockchain. Please recreate the pool.');
        }
        
        // Check if user is a member of the pool
        toast.info('🔍 Verifying your membership...');
        const membershipCheck = await contractInteractionService.isPoolMember(poolId);
        
        if (!membershipCheck.success) {
          throw new Error('Failed to check pool membership');
        }
        
        if (!membershipCheck.isMember) {
          // User is not a member yet - join the pool with this contribution
          console.log('👥 User is not a member yet, joining pool...');
          toast.info('👥 Joining pool and adding your money...');
          txResult = await contractInteractionService.joinGroupPool(
            poolId,
            amount
          );
      } else {
          // User is already a member - make regular contribution
          console.log('💰 User is already a member, contributing...');
          txResult = await contractInteractionService.contributeToGroup(
            poolId,
            amount
          );
        }
      } else {
        // Contribute to individual savings goal contract
        // This will handle: 1) Token approval, 2) Deposit
        txResult = await contractInteractionService.contributeToGoal(
          selectedGoal.blockchainGoalId || selectedGoal._id,
          amount
        );
      }

      if (!txResult.success) {
        throw new Error(txResult.error || 'Blockchain transaction failed');
      }

      console.log('✅ Blockchain transaction successful:', txResult.txHash);

      // Update goal in backend database with blockchain transaction hash
        const updateData = {
          currentAmount: Number(selectedGoal.currentAmount || 0) + Number(amount),
          lastDepositAmount: Number(amount),
        lastDepositTxHash: String(txResult.txHash), // Real transaction hash from blockchain
          walletAddress: String(walletAddress)
        };

        // Determine API endpoint based on whether this is a goal or group
        const apiEndpoint = isGroup ? `/groups/${selectedGoal._id}` : `/goals/${selectedGoal._id || selectedGoal.id}`;
        
        const backendResponse = await api.put(apiEndpoint, updateData);
        
        if (backendResponse.data.success) {
          toast.success(`🎉 ${amount.toFixed(4)} CELO added successfully!`);
          console.log('✅ Blockchain deposit successful and database updated');
          
          // Refresh data using the memoized function
          await loadGoalsData();
          
          setShowGoalModal(false);
        } else {
          throw new Error(backendResponse.data.error || 'Failed to update goal in database');
      }

    } catch (error) {
      console.error('Error depositing:', error);
      toast.error(`Unable to add money: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-loopfund-emerald-500';
    if (progress >= 50) return 'bg-loopfund-gold-500';
    return 'bg-loopfund-coral-500';
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'emergency':
        return 'bg-loopfund-coral-500';
      case 'travel':
        return 'bg-loopfund-emerald-500';
      case 'education':
        return 'bg-loopfund-electric-500';
      default:
        return 'bg-loopfund-neutral-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center"
        >
          <div className="w-4 h-4 text-white">🔄</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Your Savings Goals
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 text-lg">
            Create and manage your savings goals with smart contracts
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'my-goals' ? (
          <LoopFundButton
            variant="primary"
            size="lg"
            onClick={handleCreateGoal}
          >
            <Plus className="w-5 h-5 mr-3" />
            Create Goal
          </LoopFundButton>
          ) : (
            <>
          <LoopFundButton
            variant="secondary"
                size="lg"
                onClick={() => setShowJoinPoolModal(true)}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Join Pool
              </LoopFundButton>
              <LoopFundButton
                variant="primary"
            size="lg"
            onClick={() => setShowCreateGroupModal(true)}
          >
            <Users className="w-5 h-5 mr-3" />
            Create Group
          </LoopFundButton>
            </>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex space-x-1 bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 p-1 rounded-xl"
      >
        <button
          onClick={() => setActiveTab('my-goals')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'my-goals'
              ? 'bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
              : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-dark-text'
          }`}
        >
          My Goals
        </button>
        <button
          onClick={() => setActiveTab('group-pools')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'group-pools'
              ? 'bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-sm'
              : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-dark-text'
          }`}
        >
          Group Pools
        </button>
      </motion.div>

      {/* Goals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activeTab === 'my-goals' ? (
          goals.map((goal, index) => (
            <motion.div
              key={goal.id || `goal-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <LoopFundCard className="p-6 hover:shadow-lg transition-all duration-300">
                <div 
                  className="cursor-pointer"
                onClick={() => handleGoalClick(goal)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getCategoryColor(goal.category)}`}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 text-loopfund-emerald-700 dark:text-loopfund-emerald-300 rounded-full text-sm font-medium">
                      {goal.apy}% Returns
                  </span>
                </div>
                
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  {goal.name}
                </h3>
                <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                  {goal.category} • {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline set'}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-loopfund-neutral-500 dark:text-loopfund-neutral-400">Progress</span>
                    <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressColor(Math.round((goal.currentAmount / goal.targetAmount) * 100))}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {(goal.currentAmount || 0).toFixed(4)} CELO
                    </span>
                    <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        of {(goal.targetAmount || 0).toFixed(4)} CELO
                    </span>
                  </div>
                </div>
                </div>
                
                {/* Add Money Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoalClick(goal);
                  }}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 hover:from-loopfund-emerald-600 hover:to-loopfund-mint-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Add Money</span>
                </motion.button>
              </LoopFundCard>
            </motion.div>
          ))
        ) : (
          groupPools.map((pool, index) => {
            // Debug: Log pool structure to identify the issue
            console.log('Rendering pool:', JSON.stringify(pool, null, 2));
            return (
            <motion.div
              key={pool._id || pool.id || `pool-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <LoopFundCard className="p-6 hover:shadow-lg transition-all duration-300">
                <div 
                  className="cursor-pointer"
                onClick={() => handleGoalClick(pool)}
              >
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-loopfund-coral-500 to-loopfund-coral-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/30 text-loopfund-coral-700 dark:text-loopfund-coral-300 rounded-full text-sm font-medium">
                      {typeof pool.apy === 'number' ? pool.apy : 0}% Returns
                  </span>
                </div>
                
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  {typeof pool.name === 'string' ? pool.name : 'Unnamed Group'}
                </h3>
                <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                  {Array.isArray(pool.members) ? pool.members.length : (typeof pool.members === 'number' ? pool.members : 0)} members • {pool.endDate && typeof pool.endDate === 'string' ? new Date(pool.endDate).toLocaleDateString() : 'No deadline set'}
                  {pool.progress && typeof pool.progress === 'object' && pool.progress.daysRemaining ? ` • ${pool.progress.daysRemaining} days left` : ''}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-loopfund-neutral-500 dark:text-loopfund-neutral-400">Progress</span>
                    <span className="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {typeof pool.progress === 'number' ? pool.progress : (pool.progress && typeof pool.progress.percentage === 'number' ? pool.progress.percentage : 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                    <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-loopfund-coral-500 to-loopfund-coral-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${typeof pool.progress === 'number' ? pool.progress : (pool.progress && typeof pool.progress.percentage === 'number' ? pool.progress.percentage : 0)}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {(pool.currentAmount || 0).toFixed(4)} CELO
                    </span>
                    <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        of {(pool.targetAmount || 0).toFixed(4)} CELO
                    </span>
                  </div>
                </div>
                </div>
                
                {/* Add Money Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoalClick(pool);
                  }}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-coral-600 hover:from-loopfund-coral-600 hover:to-loopfund-coral-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Add Money</span>
                </motion.button>
              </LoopFundCard>
            </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-loopfund-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
            >
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
                Create New Goal
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const deadline = formData.get('deadline');
                
                // Validate deadline
                if (!deadline) {
                  toast.error('Please select a deadline date');
                  return;
                }
                
                handleCreateGoalSubmit({
                  name: formData.get('name'),
                  targetAmount: parseFloat(formData.get('targetAmount')),
                  category: formData.get('category'),
                  deadline: new Date(deadline).toISOString(),
                  description: formData.get('description') || '',
                  apy: 8.5
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Goal Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="e.g., Emergency Fund"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Target Amount (CELO)
                    </label>
                    <input
                      name="targetAmount"
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="2.5"
                      onChange={(e) => {
                        const targetAmount = parseFloat(e.target.value) || 0;
                        const deadline = document.querySelector('input[name="deadline"]').value;
                        
                        if (targetAmount > 0 && deadline) {
                          const deadlineDate = new Date(deadline);
                          const now = new Date();
                          const daysUntilTarget = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
                          
                          if (daysUntilTarget > 0) {
                            const dailyContribution = targetAmount / daysUntilTarget;
                            const weeklyContribution = dailyContribution * 7;
                            const monthlyContribution = dailyContribution * 30;
                            
                            // Update contribution display
                            const contributionDiv = document.getElementById('contribution-calculation');
                            if (contributionDiv) {
                              contributionDiv.innerHTML = `
                                <div class="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800 rounded-xl p-4 mt-3">
                                  <h4 class="font-semibold text-loopfund-emerald-700 dark:text-loopfund-emerald-300 mb-2">Savings Plan</h4>
                                  <div class="grid grid-cols-3 gap-2 text-sm">
                                    <div class="text-center">
                                      <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${dailyContribution.toFixed(4)} CELO</div>
                                      <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Daily</div>
                                    </div>
                                    <div class="text-center">
                                      <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${weeklyContribution.toFixed(4)} CELO</div>
                                      <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Weekly</div>
                                    </div>
                                    <div class="text-center">
                                      <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${monthlyContribution.toFixed(4)} CELO</div>
                                      <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Monthly</div>
                                    </div>
                                  </div>
                                  <p class="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                                    Based on ${daysUntilTarget} days remaining
                                  </p>
                                </div>
                              `;
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                    >
                      <option value="Emergency">Emergency</option>
                      <option value="Travel">Travel</option>
                      <option value="Education">Education</option>
                      <option value="Investment">Investment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Deadline
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      onChange={(e) => {
                        const targetAmount = parseFloat(document.querySelector('input[name="targetAmount"]').value) || 0;
                        const deadline = new Date(e.target.value);
                        const now = new Date();
                        const daysUntilTarget = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                        
                        if (targetAmount > 0 && daysUntilTarget > 0) {
                          const dailyContribution = targetAmount / daysUntilTarget;
                          const weeklyContribution = dailyContribution * 7;
                          const monthlyContribution = dailyContribution * 30;
                          
                          // Update contribution display
                          const contributionDiv = document.getElementById('contribution-calculation');
                          if (contributionDiv) {
                            contributionDiv.innerHTML = `
                              <div class="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800 rounded-xl p-4 mt-3">
                                <h4 class="font-semibold text-loopfund-emerald-700 dark:text-loopfund-emerald-300 mb-2">Savings Plan</h4>
                                <div class="grid grid-cols-3 gap-2 text-sm">
                                  <div class="text-center">
                                    <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${dailyContribution.toFixed(4)} CELO</div>
                                    <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Daily</div>
                                  </div>
                                  <div class="text-center">
                                    <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${weeklyContribution.toFixed(4)} CELO</div>
                                    <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Weekly</div>
                                  </div>
                                  <div class="text-center">
                                    <div class="font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">${monthlyContribution.toFixed(4)} CELO</div>
                                    <div class="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Monthly</div>
                                  </div>
                                </div>
                                <p class="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                                  Based on ${daysUntilTarget} days remaining
                                </p>
                              </div>
                            `;
                          }
                        }
                      }}
                    />
                    <div id="contribution-calculation"></div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <LoopFundButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 text-lg font-semibold rounded-xl"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="flex-1 py-4 text-lg font-semibold rounded-xl"
                  >
                    Create Goal
                  </LoopFundButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-loopfund-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
            >
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
                Create New Group
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreateGroupSubmit({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  targetAmount: parseFloat(formData.get('targetAmount')),
                  maxMembers: parseInt(formData.get('maxMembers')),
                  deadline: formData.get('deadline')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Group Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="e.g., Family Vacation Fund"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="Describe your group savings goal..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Target Amount (CELO)
                    </label>
                    <input
                      name="targetAmount"
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="10.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Max Members
                    </label>
                    <input
                      name="maxMembers"
                      type="number"
                      min="2"
                      max="20"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Deadline
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <LoopFundButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowCreateGroupModal(false)}
                    className="flex-1 py-4 text-lg font-semibold rounded-xl"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="flex-1 py-4 text-lg font-semibold rounded-xl"
                  >
                    Create Group
                  </LoopFundButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Pool Modal */}
      <AnimatePresence>
        {showJoinPoolModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 max-w-md w-full shadow-loopfund-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
            >
              <div className="flex items-center mb-6">
                <UserPlus className="w-8 h-8 text-loopfund-coral-500 mr-3" />
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Join a Savings Pool
                </h3>
              </div>
              
              <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                Enter the invite code shared by the pool creator to join and start saving together!
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const inviteCode = formData.get('inviteCode');
                handleJoinPool(inviteCode);
              }}>
                <div className="space-y-4">
                  <div className="bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 p-4 rounded-xl border border-loopfund-coral-200 dark:border-loopfund-coral-800">
                    <div className="flex items-center mb-2">
                      <Share2 className="w-5 h-5 text-loopfund-coral-600 dark:text-loopfund-coral-400 mr-2" />
                      <span className="text-sm font-medium text-loopfund-coral-800 dark:text-loopfund-coral-200">
                        📨 Ask for Invite Code
                      </span>
                    </div>
                    <p className="text-sm text-loopfund-coral-700 dark:text-loopfund-coral-300">
                      Request the unique invite code from your friend or family member who created the pool.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      name="inviteCode"
                      placeholder="INV_1234567890_ABC123XY"
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-coral-500 focus:border-transparent bg-white dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text font-mono text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <LoopFundButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowJoinPoolModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="flex-1"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join Pool
                  </LoopFundButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Goal Details Modal */}
      <AnimatePresence>
        {showGoalModal && selectedGoal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-loopfund-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
            >
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
                {selectedGoal.name}
              </h3>

              {/* Show invite code for group pools */}
              {selectedGoal.members && Array.isArray(selectedGoal.members) && selectedGoal.inviteCode && (
                <div className="bg-gradient-to-r from-loopfund-coral-50 to-loopfund-coral-100 dark:from-loopfund-coral-900/20 dark:to-loopfund-coral-800/20 p-4 rounded-xl border-2 border-loopfund-coral-300 dark:border-loopfund-coral-700 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Share2 className="w-5 h-5 text-loopfund-coral-600 dark:text-loopfund-coral-400 mr-2" />
                      <span className="text-sm font-semibold text-loopfund-coral-800 dark:text-loopfund-coral-200">
                        🔗 Share Pool Invite Code
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-loopfund-coral-700 dark:text-loopfund-coral-300 mb-3">
                    Share this code with friends and family to invite them to join your savings pool!
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedGoal.inviteCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white dark:bg-loopfund-dark-surface border border-loopfund-coral-300 dark:border-loopfund-coral-600 rounded-lg text-sm font-mono text-loopfund-neutral-900 dark:text-loopfund-dark-text"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyInviteCode(selectedGoal.inviteCode)}
                      className="p-2 bg-loopfund-coral-500 hover:bg-loopfund-coral-600 text-white rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Progress</span>
                  <span className="font-semibold">{Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getProgressColor(Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100))}`}
                    style={{ width: `${Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{(selectedGoal.currentAmount || 0).toFixed(4)} CELO</span>
                  <span>of {(selectedGoal.targetAmount || 0).toFixed(4)} CELO</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 p-4 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-loopfund-emerald-600 dark:text-loopfund-emerald-400 mr-2" />
                    <span className="text-sm font-medium text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                      💰 Secure Wallet Transfer
                    </span>
                  </div>
                  <p className="text-sm text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                    Money will be safely transferred from your wallet to your savings goal.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    How much would you like to add? (CELO)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Enter amount to deposit"
                    className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent"
                    id="depositAmount"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <LoopFundButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const input = document.getElementById('depositAmount');
                      input.value = '0.1';
                      handleDeposit(0.1);
                    }}
                    className="w-full"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    0.1 CELO
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const input = document.getElementById('depositAmount');
                      input.value = '0.5';
                      handleDeposit(0.5);
                    }}
                    className="w-full"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    0.5 CELO
                  </LoopFundButton>
                </div>

                <LoopFundButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const input = document.getElementById('depositAmount');
                    const amount = parseFloat(input.value);
                    if (amount && amount > 0) {
                      handleDeposit(amount);
                    } else {
                      toast.error('Please enter a valid amount');
                    }
                  }}
                  className="w-full"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Add Money
                </LoopFundButton>
                
                <LoopFundButton
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowGoalModal(false)}
                  className="w-full"
                >
                  Close
                </LoopFundButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoalsPage;