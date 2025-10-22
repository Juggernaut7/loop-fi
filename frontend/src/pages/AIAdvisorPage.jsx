import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles,
  Clock,
  Rocket,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AIAdvisorPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Personalized Recommendations",
      description: "AI-powered financial advice tailored to your goals and risk profile",
      status: "coming-soon"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Analysis",
      description: "Real-time DeFi market insights and yield optimization strategies",
      status: "coming-soon"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Optimization",
      description: "Smart suggestions to accelerate your savings goals",
      status: "coming-soon"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Assessment",
      description: "Advanced risk analysis for your DeFi investments",
      status: "coming-soon"
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Core AI Integration",
      description: "Basic financial recommendations and goal tracking",
      timeline: "Q2 2024",
      status: "in-progress"
    },
    {
      phase: "Phase 2", 
      title: "Advanced Analytics",
      description: "Market prediction and portfolio optimization",
      timeline: "Q3 2024",
      status: "planned"
    },
    {
      phase: "Phase 3",
      title: "Full AI Advisor",
      description: "Complete AI-powered financial planning suite",
      timeline: "Q4 2024",
      status: "planned"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Preparing AI Advisor
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Loading advanced financial intelligence...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                AI Financial Advisor
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Coming Soon - Your personal AI-powered financial planning assistant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Rocket className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">AI Financial Advisor</h2>
                </div>
                <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                  Get personalized financial recommendations powered by advanced AI. 
                  Our advisor will analyze your goals, risk profile, and market conditions 
                  to provide intelligent investment strategies.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Personalized</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Brain className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                  {feature.icon}
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">Soon</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Roadmap Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Development Roadmap
            </h2>
          </div>
          
          <div className="space-y-6">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {item.status === 'in-progress' ? (
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                  ) : item.status === 'planned' ? (
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.phase}: {item.title}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {item.timeline}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {item.status === 'in-progress' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">In Progress</span>
                    </div>
                  )}
                  {item.status === 'planned' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">Planned</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center"
        >
          <div className="max-w-2xl mx-auto">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Be the First to Experience AI-Powered DeFi
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              Join our waitlist to get early access to the AI Financial Advisor 
              and receive exclusive updates on new features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => toast({
                  title: "Coming Soon!",
                  description: "AI Advisor will be available in Phase 2 of our roadmap.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => toast({
                  title: "Stay Updated",
                  description: "Follow our progress on GitHub and social media.",
                  type: "info"
                })}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-600 hover:bg-slate-700 rounded-lg transition-colors font-medium"
              >
                <span>Follow Progress</span>
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAdvisorPage;