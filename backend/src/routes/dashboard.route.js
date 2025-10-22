const { Router } = require('express');
// Auth middleware removed - using Web3 wallet authentication
const { getDashboardStats } = require('../controllers/dashboard.controller');

const router = Router();

// Get dashboard statistics
router.get('/stats', getDashboardStats);

module.exports = router; 