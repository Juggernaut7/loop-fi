const { Router } = require('express');
const {
  getDeFiDashboard,
  getWalletData,
  getVaults,
  createVault,
  getActivity
} = require('../controllers/defi.controller');

const router = Router();

/**
 * DeFi Dashboard Routes
 * All routes use wallet address for authentication
 */

// Get comprehensive DeFi dashboard data
router.get('/dashboard', getDeFiDashboard);

// Get wallet data
router.get('/wallet/:walletAddress', getWalletData);

// Get user's vaults
router.get('/vaults', getVaults);

// Create new vault
router.post('/vaults', createVault);

// Get recent activity
router.get('/activity', getActivity);

module.exports = router;
