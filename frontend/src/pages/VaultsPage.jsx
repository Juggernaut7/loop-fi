import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  Shield, 
  Coins,
  Users,
  ArrowUpRight,
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoopFundCard from '../components/ui/LoopFundCard';
import LoopFundButton from '../components/ui/LoopFundButton';
import walletService from '../services/walletService';

const VaultsPage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    fetchVaults();
  }, []);

  const checkConnection = () => {
    const status = walletService.getConnectionStatus();
    setIsConnected(status.isConnected);
  };

  const fetchVaults = async () => {
    setLoading(true);
    try {
      // Mock data for hackathon - replace with actual API calls
      const mockVaults = [
        {
          id: 1,
          name: 'Emergency Fund',
          target: 1000,
          current: 650,
          apy: 8.5,
          type: 'individual',
          endDate: '2024-12-31',
          status: 'active'
        },
        {
          id: 2,
          name: 'Vacation Fund',
          target: 500,
          current: 120,
          apy: 12.3,
          type: 'group',
          endDate: '2024-11-15',
          status: 'active'
        }
      ];
      setVaults(mockVaults);
    } catch (error) {
      console.error('Error fetching vaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSTX = (amount) => {
    return amount.toFixed(2);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'completed': return 'text-blue-600 dark:text-blue-400';
      case 'paused': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
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
            Smart Contract Vaults
          </h1>
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Deploy your savings goals as secure smart contracts on Stacks
          </p>
        </div>
        <LoopFundButton
          variant="primary"
          size="lg"
          onClick={() => navigate('/vaults/create')}
          className="group"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Vault
          <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </LoopFundButton>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <LoopFundCard className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Connect Your Wallet
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect your Stacks wallet to create and manage smart contract vaults.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Vaults</p>
              <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {vaults.length}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
          </div>
        </LoopFundCard>

        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Value</p>
              <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {formatSTX(vaults.reduce((sum, vault) => sum + vault.current, 0))} STX
              </p>
            </div>
            <Coins className="w-8 h-8 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
          </div>
        </LoopFundCard>

        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Avg APY</p>
              <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {vaults.length > 0 ? (vaults.reduce((sum, vault) => sum + vault.apy, 0) / vaults.length).toFixed(1) : '0.0'}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-loopfund-gold-600 dark:text-loopfund-gold-400" />
          </div>
        </LoopFundCard>

        <LoopFundCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Active</p>
              <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {vaults.filter(v => v.status === 'active').length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-loopfund-electric-600 dark:text-loopfund-electric-400" />
          </div>
        </LoopFundCard>
      </div>

      {/* Vaults List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
          My Vaults
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <LoopFundCard key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </LoopFundCard>
            ))}
          </div>
        ) : vaults.length === 0 ? (
          <LoopFundCard className="p-12 text-center">
            <Wallet className="w-16 h-16 text-loopfund-neutral-400 dark:text-loopfund-neutral-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              No Vaults Yet
            </h3>
            <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Create your first smart contract vault to start earning yield on your savings.
            </p>
            <LoopFundButton
              variant="primary"
              onClick={() => navigate('/vaults/create')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Vault
            </LoopFundButton>
          </LoopFundCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vaults.map((vault) => (
              <LoopFundCard key={vault.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {vault.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vault.status)}`}>
                        {vault.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        {vault.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {formatSTX(vault.current)}
                    </p>
                    <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      of {formatSTX(vault.target)} STX
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                    <span>Progress</span>
                    <span>{getProgressPercentage(vault.current, vault.target).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(vault.current, vault.target)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Vault Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                    <div>
                      <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">APY</p>
                      <p className="text-sm font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {vault.apy}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-loopfund-coral-600 dark:text-loopfund-coral-400" />
                    <div>
                      <p className="text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">End Date</p>
                      <p className="text-sm font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {new Date(vault.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <LoopFundButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/vaults/${vault.id}`)}
                  >
                    View Details
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/vaults/${vault.id}/deposit`)}
                  >
                    Deposit
                  </LoopFundButton>
                </div>
              </LoopFundCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VaultsPage;
