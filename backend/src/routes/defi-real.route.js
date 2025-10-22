// Celo DeFi Routes - Production-ready DeFi operations
// Handles actual blockchain interactions and AI recommendations

const express = require('express');
const router = express.Router();
const defiRealController = require('../controllers/defi-real.controller');

// Dashboard data
router.get('/dashboard', defiRealController.getDashboardData);

// Celo DeFi AI Advice
router.post('/advice/:walletAddress', defiRealController.getDeFiAdvice);

// Portfolio Management with blockchain data
router.get('/portfolio/:walletAddress', defiRealController.getPortfolio);
router.get('/wallet/:walletAddress/balance', defiRealController.getWalletBalance);
router.get('/wallet/:walletAddress/transactions', defiRealController.getTransactionHistory);

// Savings Goals and Group Pools
router.get('/savings-goal/:goalId', defiRealController.getSavingsGoal);
router.get('/group-pool/:poolId', defiRealController.getGroupPool);

// NFT Badges
router.get('/badges/:walletAddress', defiRealController.getNFTBadges);

module.exports = router;
