import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import walletService from '../../services/walletService';

const ProtectedLayout = ({ children }) => {
  const location = useLocation();
  const connectionStatus = walletService.getConnectionStatus();

  // For Web3, we allow access to all routes but show wallet connection prompts
  // No redirects - let each page handle wallet connection UI
  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;
