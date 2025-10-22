// DeFi AI Service - Enhanced AI advisor with DeFi analytics
// Combines existing AI capabilities with blockchain and DeFi insights

const aiService = require('./ai.service');
const celoService = require('./celo.service');
const huggingFaceAI = require('./huggingface-ai.service');

class DeFiAIService {
  constructor() {
    console.log('✅ DeFi AI Service initialized - Enhanced with blockchain analytics');
  }

  // Enhanced financial advice with DeFi recommendations
  async getDeFiAdvice(userQuery, userProfile, walletAddress) {
    try {
      // Get user's blockchain portfolio
      const portfolio = await celoService.getUserPortfolio(walletAddress);
      
      // Get current market data
      const marketData = await celoService.getMarketData();
      
      // Get yield rates
      const yieldRates = await celoService.getYieldRates();
      
      // Use Hugging Face AI for advanced DeFi recommendations
      const huggingFaceRecommendations = await huggingFaceAI.getDeFiRecommendations(
        userProfile,
        portfolio.portfolio,
        marketData.marketData
      );
      
      // Combine with existing AI analysis
      const aiAdvice = await aiService.getFinancialAdvice(userQuery, userProfile);
      
      // Generate DeFi-specific recommendations
      const defiRecommendations = await this.generateDeFiRecommendations(
        userProfile, 
        portfolio.portfolio, 
        marketData.marketData, 
        yieldRates.yieldRates
      );
      
      return {
        success: true,
        data: {
          ...aiAdvice.data,
          hugging_face_recommendations: huggingFaceRecommendations.recommendations || [],
          hugging_face_confidence: huggingFaceRecommendations.confidence || 0.7,
          defi_insights: defiRecommendations,
          portfolio_summary: this.summarizePortfolio(portfolio.portfolio),
          market_conditions: this.analyzeMarketConditions(marketData.marketData),
          recommended_actions: this.generateRecommendedActions(userProfile, defiRecommendations)
        },
        type: 'defi_financial_advice'
      };
    } catch (error) {
      console.error('Error in DeFi advice:', error);
      return {
        success: false,
        error: error.message,
        type: 'defi_financial_advice'
      };
    }
  }

  // Generate DeFi investment recommendations
  async generateDeFiRecommendations(userProfile, portfolio, marketData, yieldRates) {
    try {
      const recommendations = [];
      
      // Analyze user's risk tolerance
      const riskTolerance = this.assessRiskTolerance(userProfile);
      
      // Calculate optimal strategy
      const optimalStrategy = await celoService.calculateOptimalStrategy(userProfile, riskTolerance);
      
      // Generate specific recommendations
      if (portfolio.balance > 1) { // More than 1 CELO
        recommendations.push({
          type: 'staking',
          title: 'Earn Interest on Your CELO',
          description: `You have ${portfolio.balance.toFixed(4)} CELO available for earning interest`,
          apy: yieldRates.celo_staking?.apy || 8.5,
          risk: yieldRates.celo_staking?.risk || 'low',
          potential_earnings: portfolio.balance * (yieldRates.celo_staking?.apy || 8.5) / 100,
          action: 'stake_celo'
        });
      }
      
      if (portfolio.vaults && portfolio.vaults.length > 0) {
        const activeVaults = portfolio.vaults.filter(v => v.is_active);
        if (activeVaults.length > 0) {
          recommendations.push({
            type: 'vault_optimization',
            title: 'Optimize Your Vaults',
            description: `You have ${activeVaults.length} active vaults that could earn more yield`,
            current_yield: 5.0, // Current vault yield
            potential_yield: yieldRates.defi_pools.apy,
            additional_earnings: this.calculateAdditionalEarnings(activeVaults, yieldRates),
            action: 'optimize_vaults'
          });
        }
      }
      
      // Group savings recommendations
      if (portfolio.groups && portfolio.groups.length > 0) {
        recommendations.push({
          type: 'group_optimization',
          title: 'Maximize Group Savings',
          description: 'Your group savings could benefit from DeFi yield strategies',
          current_apy: 5.0,
          potential_apy: yieldRates.btc_yield.apy,
          group_benefit: this.calculateGroupBenefit(portfolio.groups, yieldRates),
          action: 'optimize_groups'
        });
      }
      
      return {
        risk_tolerance: riskTolerance,
        optimal_strategy: optimalStrategy.strategies,
        recommendations,
        total_potential_earnings: this.calculateTotalPotentialEarnings(portfolio, yieldRates)
      };
    } catch (error) {
      console.error('Error generating DeFi recommendations:', error);
      return {
        risk_tolerance: 'medium',
        optimal_strategy: [],
        recommendations: [],
        total_potential_earnings: 0
      };
    }
  }

  // Assess user's risk tolerance based on profile
  assessRiskTolerance(userProfile) {
    const factors = {
      age: userProfile.age || 30,
      income: userProfile.income || 50000,
      savings_rate: userProfile.savings_rate || 0.1,
      investment_experience: userProfile.investment_experience || 'beginner'
    };
    
    let riskScore = 0;
    
    // Age factor (younger = higher risk tolerance)
    if (factors.age < 30) riskScore += 3;
    else if (factors.age < 50) riskScore += 2;
    else riskScore += 1;
    
    // Income factor
    if (factors.income > 100000) riskScore += 2;
    else if (factors.income > 50000) riskScore += 1;
    
    // Savings rate factor
    if (factors.savings_rate > 0.2) riskScore += 2;
    else if (factors.savings_rate > 0.1) riskScore += 1;
    
    // Experience factor
    if (factors.investment_experience === 'expert') riskScore += 3;
    else if (factors.investment_experience === 'intermediate') riskScore += 2;
    else riskScore += 1;
    
    if (riskScore >= 8) return 'high';
    else if (riskScore >= 5) return 'medium';
    else return 'low';
  }

  // Calculate additional earnings from optimization
  calculateAdditionalEarnings(vaults, yieldRates) {
    const totalVaultValue = vaults.reduce((sum, vault) => sum + vault.current_amount, 0);
    const currentYield = 5.0; // Current vault yield
    const potentialYield = yieldRates.defi_pools.apy;
    const additionalYield = potentialYield - currentYield;
    
    return (totalVaultValue * additionalYield / 100); // In CELO
  }

  // Calculate group benefit
  calculateGroupBenefit(groups, yieldRates) {
    const totalGroupValue = groups.reduce((sum, group) => sum + group.current_amount, 0);
    const currentYield = 5.0;
    const potentialYield = yieldRates.btc_yield.apy;
    const additionalYield = potentialYield - currentYield;
    
    return (totalGroupValue * additionalYield / 100); // In CELO
  }

  // Calculate total potential earnings
  calculateTotalPotentialEarnings(portfolio, yieldRates) {
    const totalValue = portfolio.balance + 
      (portfolio.vaults ? portfolio.vaults.reduce((sum, v) => sum + v.current_amount, 0) : 0) +
      (portfolio.groups ? portfolio.groups.reduce((sum, g) => sum + g.current_amount, 0) : 0);
    
    const avgYield = (yieldRates.celo_staking?.apy || 8.5 + yieldRates.defi_pools?.apy || 12.0) / 2;
    
    return (totalValue * avgYield / 100); // In CELO
  }

  // Summarize user's portfolio
  summarizePortfolio(portfolio) {
    const totalValue = portfolio.balance + 
      (portfolio.vaults ? portfolio.vaults.reduce((sum, v) => sum + v.current_amount, 0) : 0) +
      (portfolio.groups ? portfolio.groups.reduce((sum, g) => sum + g.current_amount, 0) : 0);
    
    const activeVaults = portfolio.vaults ? portfolio.vaults.filter(v => v.is_active).length : 0;
    const activeGroups = portfolio.groups ? portfolio.groups.filter(g => g.is_active).length : 0;
    
    return {
      total_value_celo: totalValue,
      total_value_usd: totalValue * (marketData.celo_price || 0.50), // CELO price
      active_vaults: activeVaults,
      active_groups: activeGroups,
      total_transactions: portfolio.transactions ? portfolio.transactions.length : 0
    };
  }

  // Analyze market conditions
  analyzeMarketConditions(marketData) {
    return {
      celo_price: marketData.celo_price || 0.50,
      btc_price: marketData.btc_price,
      network_health: marketData.network_health,
      market_sentiment: marketData.network_health > 95 ? 'bullish' : 'neutral',
      recommended_actions: marketData.network_health > 95 ? 
        ['Consider increasing savings', 'Earn more interest on CELO'] : 
        ['Maintain current positions', 'Monitor market conditions']
    };
  }

  // Generate recommended actions
  generateRecommendedActions(userProfile, defiRecommendations) {
    const actions = [];
    
    if (defiRecommendations.recommendations.length > 0) {
      actions.push('Review DeFi opportunities');
      actions.push('Consider earning interest on your CELO');
    }
    
    if (defiRecommendations.risk_tolerance === 'low') {
      actions.push('Focus on low-risk staking options');
      actions.push('Build emergency fund first');
    } else if (defiRecommendations.risk_tolerance === 'high') {
      actions.push('Explore high-yield DeFi pools');
      actions.push('Consider diversified strategy');
    }
    
    return actions;
  }

  // Get DeFi yield predictions
  async getYieldPredictions(userProfile, walletAddress) {
    try {
      const portfolio = await celoService.getUserPortfolio(walletAddress);
      const yieldRates = await celoService.getYieldRates();
      
      const predictions = {
        current_yield: 5.0, // Current average yield
        potential_yield: yieldRates.yieldRates.defi_pools.apy,
        monthly_earnings: this.calculateMonthlyEarnings(portfolio.portfolio, yieldRates.yieldRates),
        yearly_earnings: this.calculateYearlyEarnings(portfolio.portfolio, yieldRates.yieldRates),
        risk_assessment: this.assessRiskTolerance(userProfile)
      };
      
      return {
        success: true,
        data: predictions,
        type: 'yield_predictions'
      };
    } catch (error) {
      console.error('Error getting yield predictions:', error);
      return {
        success: false,
        error: error.message,
        type: 'yield_predictions'
      };
    }
  }

  // Calculate monthly earnings
  calculateMonthlyEarnings(portfolio, yieldRates) {
    const totalValue = portfolio.balance + 
      (portfolio.vaults ? portfolio.vaults.reduce((sum, v) => sum + v.current_amount, 0) : 0) +
      (portfolio.groups ? portfolio.groups.reduce((sum, g) => sum + g.current_amount, 0) : 0);
    
    const avgYield = (yieldRates.celo_staking?.apy || 8.5 + yieldRates.defi_pools?.apy || 12.0) / 2;
    return (totalValue * avgYield / 100 / 12); // Monthly in CELO
  }

  // Calculate yearly earnings
  calculateYearlyEarnings(portfolio, yieldRates) {
    const totalValue = portfolio.balance + 
      (portfolio.vaults ? portfolio.vaults.reduce((sum, v) => sum + v.current_amount, 0) : 0) +
      (portfolio.groups ? portfolio.groups.reduce((sum, g) => sum + g.current_amount, 0) : 0);
    
    const avgYield = (yieldRates.celo_staking?.apy || 8.5 + yieldRates.defi_pools?.apy || 12.0) / 2;
    return (totalValue * avgYield / 100); // Yearly in CELO
  }

  // Get DeFi market analysis
  async getMarketAnalysis() {
    try {
      const marketData = await celoService.getMarketData();
      const yieldRates = await celoService.getYieldRates();
      
      const analysis = {
        market_overview: {
          total_value_locked: marketData.marketData.total_value_locked,
          active_vaults: marketData.marketData.active_vaults,
          network_health: marketData.marketData.network_health
        },
        yield_opportunities: Object.values(yieldRates.yieldRates).map(rate => ({
          protocol: rate.protocol,
          apy: rate.apy,
          risk: rate.risk,
          description: rate.description
        })),
        market_trends: {
          celo_trend: marketData.marketData.celo_price > 0.50 ? 'bullish' : 'bearish',
          defi_growth: marketData.marketData.total_value_locked > 100000000 ? 'growing' : 'stable',
          staking_adoption: marketData.marketData.active_vaults > 1000 ? 'high' : 'medium'
        }
      };
      
      return {
        success: true,
        data: analysis,
        type: 'market_analysis'
      };
    } catch (error) {
      console.error('Error getting market analysis:', error);
      return {
        success: false,
        error: error.message,
        type: 'market_analysis'
      };
    }
  }
}

module.exports = new DeFiAIService();
