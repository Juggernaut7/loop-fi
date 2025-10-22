const { Router } = require('express');
// Auth middleware removed - using Web3 wallet authentication
const aiController = require('../controllers/ai.controller');

const router = Router();

// AI Financial Advisor
router.post('/advice', aiController.getFinancialAdvice);

// Savings Predictions
router.post('/predict', aiController.getSavingsPrediction);

// Smart Goal Recommendations
router.post('/goals', aiController.getSmartGoals);

// Behavioral Analysis
router.post('/behavior', aiController.analyzeBehavior);

// NEW: AI Financial Therapist Endpoints
router.post('/therapy/session', aiController.startTherapySession);
router.post('/therapy/analyze-emotion', aiController.analyzeEmotionalState);
router.post('/therapy/interventions', aiController.getPersonalizedInterventions);
router.post('/therapy/progress', aiController.trackTherapyProgress);

// NEW: Predictive Health Endpoints
router.post('/predictive/forecast', aiController.getFinancialForecast);
router.post('/predictive/crisis-alerts', aiController.getCrisisAlerts);
router.post('/predictive/opportunity-costs', aiController.calculateOpportunityCosts);
router.post('/predictive/life-events', aiController.analyzeLifeEvents);

// NEW: Community AI Insights
router.post('/community/analyze-post', aiController.analyzeCommunityPost);
router.post('/community/recommendations', aiController.getCommunityRecommendations);
router.post('/community/success-stories', aiController.analyzeSuccessStories);


// NEW: Therapy Games
router.post('/games/anxiety-reduction', aiController.startAnxietyReductionGame);
router.post('/games/trigger-identification', aiController.startTriggerIdentificationGame);
router.post('/games/mindset-transformation', aiController.startMindsetTransformationGame);
router.post('/games/confidence-building', aiController.startConfidenceBuildingGame);

module.exports = router; 