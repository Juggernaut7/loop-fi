import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import WalletConnect from '../web3/WalletConnect';
import walletService from '../../services/walletService';

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Initialize will auto-connect if wallet was previously connected
        const connectionStatus = await walletService.initialize();
        setIsWalletConnected(connectionStatus.isConnected);
        setWalletAddress(connectionStatus.address);
        
        // If wallet is not connected and user tries to access app, they'll see WalletConnect
        // No redirect needed, just show the connect screen
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setIsWalletConnected(false);
        setWalletAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletConnection();
    
    // Add listener for connection changes
    const handleConnectionChange = (status) => {
      setIsWalletConnected(status.isConnected);
      setWalletAddress(status.address);
      
      // Don't redirect on disconnect, just show WalletConnect component
    };

    walletService.addListener(handleConnectionChange);
    
    return () => {
      walletService.removeListener(handleConnectionChange);
    };
  }, [navigate, location.pathname]);

  // Show loading state while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-emerald-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <div className="w-8 h-8 text-white">🔄</div>
          </motion.div>
          <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Checking wallet connection...
          </p>
        </div>
      </div>
    );
  }

  // Show wallet connection interface if not connected
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-emerald-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-emerald-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <TopNav 
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isCollapsed={isSidebarCollapsed}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
