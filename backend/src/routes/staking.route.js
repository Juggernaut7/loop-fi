const express = require('express');
const { body } = require('express-validator');
const stakingController = require('../controllers/staking.controller');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// ==================== Pool Routes ====================

/**
 * @route   POST /api/staking/pools
 * @desc    Create a new staking pool
 * @access  Public
 */
router.post('/pools', [
  body('name')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Pool name must be between 1 and 50 characters'),
  body('apy')
    .isNumeric()
    .isInt({ min: 100 })
    .withMessage('APY must be at least 100 (1%)'),
  body('minStake')
    .isNumeric()
    .isInt({ min: 100000 })
    .withMessage('Minimum stake must be at least 0.1 CELO'),
  body('maxStake')
    .isNumeric()
    .isInt({ min: 100000 })
    .withMessage('Maximum stake must be at least 0.1 CELO'),
  body('walletAddress')
    .isString()
    .notEmpty()
    .withMessage('Wallet address is required'),
  body('contractTxId')
    .isString()
    .notEmpty()
    .withMessage('Contract transaction ID is required'),
  validateRequest
], (req, res) => stakingController.createPool(req, res));

/**
 * @route   GET /api/staking/pools
 * @desc    Get all staking pools
 * @access  Public
 */
router.get('/pools', (req, res) => stakingController.getPools(req, res));

/**
 * @route   GET /api/staking/pools/:poolId
 * @desc    Get pool by ID
 * @access  Public
 */
router.get('/pools/:poolId', (req, res) => stakingController.getPoolById(req, res));

// ==================== Stake Routes ====================

/**
 * @route   POST /api/staking/stakes
 * @desc    Create a new stake
 * @access  Public
 */
router.post('/stakes', [
  body('poolId')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('Pool ID must be a positive integer'),
  body('amount')
    .isNumeric()
    .isInt({ min: 100000 })
    .withMessage('Amount must be at least 0.1 CELO'),
  body('walletAddress')
    .isString()
    .notEmpty()
    .withMessage('Wallet address is required'),
  body('contractTxId')
    .isString()
    .notEmpty()
    .withMessage('Contract transaction ID is required'),
  validateRequest
], (req, res) => stakingController.createStake(req, res));

/**
 * @route   GET /api/staking/stakes
 * @desc    Get user's stakes
 * @access  Public
 */
router.get('/stakes', (req, res) => stakingController.getUserStakes(req, res));

/**
 * @route   GET /api/staking/stakes/:stakeId
 * @desc    Get stake by ID
 * @access  Public
 */
router.get('/stakes/:stakeId', (req, res) => stakingController.getStakeById(req, res));

/**
 * @route   PUT /api/staking/stakes/:stakeId
 * @desc    Update stake (unstake or claim rewards)
 * @access  Public
 */
router.put('/stakes/:stakeId', [
  body('walletAddress')
    .isString()
    .notEmpty()
    .withMessage('Wallet address is required'),
  body('contractTxId')
    .isString()
    .notEmpty()
    .withMessage('Contract transaction ID is required'),
  validateRequest
], (req, res) => stakingController.updateStake(req, res));

// ==================== Analytics Routes ====================

/**
 * @route   GET /api/staking/analytics
 * @desc    Get staking analytics for user
 * @access  Public
 */
router.get('/analytics', (req, res) => stakingController.getStakingAnalytics(req, res));

/**
 * @route   GET /api/staking/stats
 * @desc    Get platform statistics
 * @access  Public
 */
router.get('/stats', (req, res) => stakingController.getPlatformStats(req, res));

module.exports = router;
