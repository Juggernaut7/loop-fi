import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import walletService from '../../services/walletService';
import LoopFiButton from "../ui/LoopFiButton";
import logo from '../../assets/logo.jpg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleConnectWallet = async () => {
    try {
      const result = await walletService.connectWallet();
      if (result.isConnected) {
        toast.success('Wallet connected successfully!');
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      // Only show error if it's not a cancellation
      if (error.message !== 'Wallet connection cancelled') {
        toast.error('Wallet connection failed. Please try again.');
      }
    }
  };

  // Use hash paths for in-page sections (no leading slash). Remove old '/defi' route.
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' }, // Main dashboard
    { name: 'Features', path: '#features' },
    { name: 'About', path: '#about' },
    { name: 'Contact', path: '#contact' }
  ];

  // Click handler supports two behaviors:
  // - If the link is a hash (e.g. '#features') and we're on the landing page ("/"), scroll into view.
  // - If the link is a hash but we're on another route, navigate to '/' and pass a state value so
  //   the landing page can scroll to the requested section after mount.
  // - Otherwise navigate using react-router normally.
  const handleNavClick = (e, item) => {
    // Allow normal cmd/click or new tab behavior if modifier keys are used
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    e && e.preventDefault();

    if (item.path && item.path.startsWith('#')) {
      const id = item.path.slice(1);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      // Not on landing page: navigate to landing and pass scroll target via state
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    // Regular route navigation
    navigate(item.path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-loopfund-neutral-50/95 dark:bg-loopfund-dark-surface/95 backdrop-blur-md shadow-lg border-b border-loopfund-neutral-200/50 dark:border-loopfund-neutral-600/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Revolutionary Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 p-1"
              >
                <img 
                  src={logo} 
                  alt="LoopFi Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </motion.div>
              <span className="font-display text-h4 text-loopfund-midnight-900 dark:text-loopfund-dark-text group-hover:text-gradient transition-all duration-300">
                LoopFi
              </span>
            </Link>
          </motion.div>

          {/* Revolutionary Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`font-body text-body-sm font-medium transition-all duration-300 relative group ${
                    isActive(item.path)
                      ? 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400'
                      : 'text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400'
                  }`}
                >
                  {item.name}
                  {/* Animated Underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isActive(item.path) ? '100%' : 0 
                    }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Revolutionary CTA Buttons & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Revolutionary Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 hover:bg-loopfund-emerald-100 dark:hover:bg-loopfund-emerald-900/30 transition-all duration-300 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-loopfund-gold-500" />
              ) : (
                <Moon size={20} className="text-loopfund-midnight-600" />
              )}
            </motion.button>

            <LoopFiButton
              variant="primary"
              size="sm"
              onClick={handleConnectWallet}
              className="group"
            >
              Connect Wallet
            </LoopFiButton>
          </div>

          {/* Revolutionary Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Revolutionary Theme Toggle for Mobile */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 hover:bg-loopfund-emerald-100 dark:hover:bg-loopfund-emerald-900/30 transition-all duration-300 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-loopfund-gold-500" />
              ) : (
                <Moon size={20} className="text-loopfund-midnight-600" />
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-neutral-800 transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Revolutionary Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-600"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={item.path}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleNavClick(e, item);
                    }}
                    className={`block font-body text-body-md font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400'
                        : 'text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400'
                    }`}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-600 space-y-3">
                <LoopFiButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsOpen(false);
                    handleConnectWallet();
                  }}
                  className="w-full"
                >
                  Connect Wallet
                </LoopFiButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;

