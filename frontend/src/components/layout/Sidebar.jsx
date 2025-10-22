import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  Users, 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  HelpCircle,
  Brain,
  DollarSign,
  Shield,
  Heart,
  Gamepad2,
  Sparkles,
  Zap,
  Star,
  Gift,
  MessageCircle,
  BookOpen,
  CreditCard,
  PieChart,
  TrendingDown,
  Wallet,
  PiggyBank,
  Building2,
  UserPlus,
  Share2,
  Trophy
} from 'lucide-react';
import walletService from '../../services/walletService';
import logo1 from '../../assets/logo1.jpg';

const Sidebar = ({ isCollapsed, toggleSidebar, unreadCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  // Handle wallet disconnect
  const handleLogout = () => {
    walletService.disconnectWallet();
    navigate('/');
  };

  // Get wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      const connectionStatus = await walletService.checkConnection();
      setWalletAddress(connectionStatus.address);
    };

    checkWalletConnection();
    
    // Add listener for connection changes
    const handleConnectionChange = (status) => {
      setWalletAddress(status.address);
    };

    walletService.addListener(handleConnectionChange);
    
    return () => {
      walletService.removeListener(handleConnectionChange);
    };
  }, []);

  // Handle therapy games click
  const handleTherapyGamesClick = (e) => {
    e.preventDefault();
    setShowComingSoonModal(true);
  };

  // Main navigation items - Core sections
  const mainMenuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/app/dashboard',
      badge: '🚀',
      description: 'Main overview & wallet'
    },
    {
      title: 'Goals',
      icon: Target,
      path: '/app/goals',
      badge: null,
      description: 'Create and manage savings goals'
    },
    {
      title: 'Earn',
      icon: TrendingUp,
      path: '/app/earn',
      badge: null,
      description: 'Earn yield on your savings'
    },
    {
      title: 'AI Advisor',
      icon: Brain,
      path: '/app/ai-advisor',
      badge: 'Soon',
      description: 'AI-powered financial advice',
      comingSoon: true
    },
    {
      title: 'NFTs',
      icon: Award,
      path: '/app/nft',
      badge: 'Soon',
      description: 'Achievement NFTs',
      comingSoon: true
    },
    {
      title: 'Leaderboard',
      icon: Trophy,
      path: '/app/leaderboard',
      badge: 'Soon',
      description: 'Community rankings',
      comingSoon: true
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/app/notifications',
      badge: null,
      description: 'Stay updated'
    },
    {
      title: 'Wallet',
      icon: Wallet,
      path: '/app/wallet',
      badge: null,
      description: 'Manage your Celo wallet'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/app/settings',
      badge: null,
      description: 'Account and preferences'
    }
  ];

  // No additional features section needed
  const web3Features = [];
  const toolsMenuItems = [];
  const utilityItems = [];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 300 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  const submenuVariants = {
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full max-h-screen bg-gradient-to-br from-loopfund-midnight-900 via-loopfund-midnight-800 to-loopfund-midnight-900 border-r border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 shadow-xl flex flex-col overflow-hidden relative"
    >
      {/* Revolutionary Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-4 w-16 h-16 bg-loopfund-emerald-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-4 w-12 h-12 bg-loopfund-emerald-500/10 rounded-full blur-xl animate-float-delayed" />

      {/* Header Section */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 relative z-10">
        <motion.div
          variants={contentVariants}
          animate={isCollapsed ? "collapsed" : "expanded"}
          className="flex items-center space-x-3"
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img src={logo1} alt="LoopFi" className="w-full h-full object-cover rounded-lg" />
              </motion.div>
              <span className="font-display text-display-sm text-loopfund-neutral-50 font-bold">LoopFi</span>
            </div>
          )}
        </motion.div>
        
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-loopfund-neutral-800/50 text-loopfund-neutral-300 transition-all duration-200 backdrop-blur-sm"
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-6 border-b border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 relative z-10">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-gold-500 rounded-xl flex items-center justify-center shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <User size={20} className="text-white" />
          </motion.div>
          <motion.div
            variants={contentVariants}
            animate={isCollapsed ? "collapsed" : "expanded"}
            className="flex-1 min-w-0"
          >
            {!isCollapsed && (
              <>
                <p className="font-body text-body-sm text-loopfund-neutral-50 font-medium truncate">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet'}
                </p>
                <p className="font-body text-body-xs text-loopfund-neutral-400 truncate">
                  {walletAddress ? 'Connected' : 'Not Connected'}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* All Navigation Items - Single Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-4 min-h-0 relative z-10">
        <nav className="space-y-1 px-4">
          {/* All menu items together - Web3 DeFi focused */}
          {[...mainMenuItems, ...web3Features, ...toolsMenuItems, ...utilityItems].map((item, index) => (
            <div key={item.title}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.comingSoon ? '#' : item.path}
                  onClick={(e) => {
                    if (item.comingSoon) {
                      e.preventDefault();
                      setShowComingSoonModal(true);
                    } else if (item.submenu) {
                      toggleSubmenu(item.title);
                    }
                  }}
                  className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-loopfund-emerald-500/20 text-loopfund-emerald-400 border border-loopfund-emerald-500/30 shadow-lg'
                      : 'text-loopfund-neutral-300'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-loopfund-emerald-500 to-loopfund-mint-500 rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon size={20} className="flex-shrink-0" />
                  
                  <motion.div
                    variants={contentVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="flex-1 min-w-0 ml-3"
                  >
                    {!isCollapsed && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-body-sm font-medium">{item.title}</span>
                          {item.badge && (
                            <span className={`ml-auto text-loopfund-neutral-50 text-xs px-2 py-1 rounded-full font-medium ${
                              item.highlight 
                                ? 'bg-loopfund-emerald-500' 
                                : 'bg-loopfund-neutral-600'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {item.submenu && (
                            <ChevronRight 
                              size={16} 
                              className={`ml-2 transition-transform duration-200 ${
                                activeSubmenu === item.title ? 'rotate-90' : ''
                              }`}
                            />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-loopfund-neutral-400 mt-0.5">{item.description}</p>
                        )}
                      </>
                    )}
                  </motion.div>
                </Link>
              </motion.div>

              {/* Submenu */}
              {item.submenu && !isCollapsed && (
                <AnimatePresence>
                  {activeSubmenu === item.title && (
                    <motion.div
                      variants={submenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="ml-6 mt-2 space-y-1 overflow-hidden"
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <motion.div
                          key={subItem.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive(subItem.path)
                                ? 'text-loopfund-emerald-400 bg-loopfund-emerald-500/10'
                                : 'text-loopfund-neutral-400'
                            }`}
                          >
                            <subItem.icon size={16} className="mr-3" />
                            <span className="font-body text-body-sm">{subItem.title}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          {/* Wallet Disconnect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (mainMenuItems.length + web3Features.length + toolsMenuItems.length + utilityItems.length) * 0.05 }}
          >
            <motion.button 
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-loopfund-neutral-300 transition-all duration-200"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet size={20} className="flex-shrink-0" />
              <motion.div
                variants={contentVariants}
                animate={isCollapsed ? "collapsed" : "expanded"}
                className="ml-3"
              >
                {!isCollapsed && <span className="font-body text-body-sm font-medium">Disconnect Wallet</span>}
              </motion.div>
            </motion.button>
          </motion.div>
        </nav>
      </div>

      {/* New Goal Button - Always at bottom */}
      <div className="flex-shrink-0 p-4 relative z-10">
        <motion.div
          variants={contentVariants}
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          {!isCollapsed && (
            <motion.button
              onClick={() => navigate('/goals/new')}
              className="w-full bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg relative overflow-hidden group"
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000" />
              
              <Plus size={18} className="relative z-10" />
              <span className="font-body text-body-sm font-medium relative z-10">New Goal</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowComingSoonModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-2xl p-8 max-w-md w-full shadow-loopfund-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Gamepad2 className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Therapy Games
                </h3>
                
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                  Interactive financial wellness therapy games are coming soon! Learn about money management through engaging gameplay.
                </p>
                
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowComingSoonModal(false)}
                    className="flex-1 bg-loopfund-neutral-200 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 py-3 px-4 rounded-xl font-body text-body-sm font-medium transition-all duration-300"
                    whileTap={{ scale: 0.98 }}
                  >
                    Got it
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setShowComingSoonModal(false);
                      navigate('/community');
                    }}
                    className="flex-1 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white py-3 px-4 rounded-xl font-body text-body-sm font-medium transition-all duration-300 shadow-loopfund"
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Community
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;

