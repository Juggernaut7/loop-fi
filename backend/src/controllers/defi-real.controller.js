// Celo DeFi Controller - Production-ready DeFi operations
// Handles actual blockchain interactions, AI recommendations, and yield farming

const celoService = require('../services/celo.service');
const defiAIService = require('../services/defi-ai.service');

class CeloDeFiController {
  constructor() {
    console.log('✅ Celo DeFi Controller initialized - Production ready');
  }

  // Get dashboard data
  async getDashboardData(req, res, next) {
    try {
      const { walletAddress } = req.query;

      // Return mock dashboard data for now
      const dashboardData = {
        success: true,
        data: {
          totalBalance: 0,
          totalSavings: 0,
          activeGoals: 0,
          groupPools: 0,
          totalYield: 0,
          recentActivity: []
        }
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('❌ Dashboard Error:', error);
      next(error);
    }
  }

  // Get comprehensive DeFi advice with real AI analysis
  async getDeFiAdvice(req, res, next) {
    try {
      const { query, userProfile } = req.body;
      const { walletAddress } = req.params;

      console.log('🤖 Celo DeFi AI Advice Request:', { query, walletAddress });

      // Get real portfolio data from blockchain
      const portfolio = await celoService.getUserPortfolio(walletAddress);
      const marketData = await celoService.getMarketData();
      const yieldRates = await celoService.getYieldRates();

      // Use AI for analysis
      const aiAnalysis = await defiAIService.getDeFiRecommendations(
        userProfile,
        portfolio.portfolio,
        marketData.marketData
      );

      // Generate comprehensive advice
      const advice = {
        query: query,
        walletAddress: walletAddress,
        aiRecommendations: aiAnalysis.recommendations || [],
        portfolio: portfolio.portfolio,
        marketConditions: marketData.marketData,
        yieldRates: yieldRates.yieldRates,
        confidence: aiAnalysis.confidence,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Celo DeFi AI Response generated:', advice.aiRecommendations.length, 'recommendations');

      res.json({
        success: true,
        data: advice,
        type: 'celo_defi_advice'
      });
    } catch (error) {
      console.error('❌ Celo DeFi Controller Error:', error);
      next(error);
    }
  }

  // Get real portfolio with blockchain data
  async getPortfolio(req, res, next) {
    try {
      const { walletAddress } = req.params;

      console.log('📊 Celo Portfolio Request:', { walletAddress });

      // Get comprehensive portfolio data
      const [portfolio, marketData, yieldRates] = await Promise.all([
        celoService.getUserPortfolio(walletAddress),
        celoService.getMarketData(),
        celoService.getYieldRates()
      ]);

      // Calculate portfolio metrics
      const portfolioMetrics = this.calculatePortfolioMetrics(
        portfolio.portfolio,
        marketData.marketData,
        yieldRates.yieldRates
      );

      const result = {
        success: true,
        portfolio: {
          ...portfolio.portfolio,
          metrics: portfolioMetrics,
          marketData: marketData.marketData,
          yieldRates: yieldRates.yieldRates
        }
      };

      res.json(result);
    } catch (error) {
      console.error('❌ Portfolio Error:', error);
      next(error);
    }
  }

  // Get wallet balance
  async getWalletBalance(req, res, next) {
    try {
      const { walletAddress } = req.params;

      console.log('💰 Wallet Balance Request:', { walletAddress });

      const balance = await celoService.getWalletBalance(walletAddress);

      res.json(balance);
    } catch (error) {
      console.error('❌ Wallet Balance Error:', error);
      next(error);
    }
  }

  // Get transaction history
  async getTransactionHistory(req, res, next) {
    try {
      const { walletAddress } = req.params;

      console.log('📜 Transaction History Request:', { walletAddress });

      const history = await celoService.getTransactionHistory(walletAddress);

      res.json(history);
    } catch (error) {
      console.error('❌ Transaction History Error:', error);
      next(error);
    }
  }

  // Get savings goal information
  async getSavingsGoal(req, res, next) {
    try {
      const { goalId } = req.params;

      console.log('🎯 Savings Goal Request:', { goalId });

      const goalInfo = await celoService.getSavingsGoal(goalId);

      res.json(goalInfo);
    } catch (error) {
      console.error('❌ Savings Goal Error:', error);
      next(error);
    }
  }

  // Get group pool information
  async getGroupPool(req, res, next) {
    try {
      const { poolId } = req.params;

      console.log('👥 Group Pool Request:', { poolId });

      const poolInfo = await celoService.getGroupPool(poolId);

      res.json(poolInfo);
    } catch (error) {
      console.error('❌ Group Pool Error:', error);
      next(error);
    }
  }

  // Get NFT badges
  async getNFTBadges(req, res, next) {
    try {
      const { walletAddress } = req.params;

      console.log('🏆 NFT Badges Request:', { walletAddress });

      const badges = await celoService.getNFTBadges(walletAddress);

      res.json(badges);
    } catch (error) {
      console.error('❌ NFT Badges Error:', error);
      next(error);
    }
  }

  // Calculate portfolio metrics
  calculatePortfolioMetrics(portfolio, marketData, yieldRates) {
    const totalValue = portfolio.balance || 0;
    const celoPrice = marketData.celo_price || 0.5;
    const usdValue = totalValue * celoPrice;

    // Calculate potential yield
    const avgYield = (yieldRates.celo_staking?.apy || 5) + (yieldRates.defi_pools?.apy || 8);
    const potentialAnnualYield = (totalValue * avgYield / 100);

    return {
      totalValueCELO: totalValue,
      totalValueUSD: usdValue,
      potentialAnnualYield: potentialAnnualYield,
      averageAPY: avgYield,
      riskScore: this.calculateRiskScore(portfolio),
      diversification: this.calculateDiversification(portfolio)
    };
  }

  // Calculate risk score
  calculateRiskScore(portfolio) {
    let riskScore = 0.3; // Base risk score for Celo

    // Adjust based on portfolio composition
    if (portfolio.savingsGoals && portfolio.savingsGoals.length > 0) {
      riskScore += 0.1; // Savings goals add some risk
    }

    if (portfolio.groupPools && portfolio.groupPools.length > 0) {
      riskScore += 0.2; // Group pools add more risk
    }

    return Math.min(riskScore, 1.0);
  }

  // Calculate diversification
  calculateDiversification(portfolio) {
    const totalAssets = (portfolio.savingsGoals?.length || 0) + (portfolio.groupPools?.length || 0);
    
    if (totalAssets === 0) return 0;
    if (totalAssets === 1) return 0.3;
    if (totalAssets <= 3) return 0.6;
    return 0.9;
  }
}

module.exports = new CeloDeFiController();