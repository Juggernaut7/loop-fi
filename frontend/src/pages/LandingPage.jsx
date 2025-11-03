import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import walletService from '../services/walletService';
import { useToast } from '../context/ToastContext';
import { 
  ArrowRight, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  Award,
  Home,
  Car,
  BookOpen,
  Plane,
  Gift,
  Heart,
  Play,
  Brain,
  Gamepad2,
  Coins,
  Zap,
  Wallet,
  // Social media icons
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/hero-animation.json';
import logo1 from '../assets/logo1.jpg';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundCard from '../components/ui/LoopFundCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleWatchDemo = () => {
    window.open('https://youtu.be/bVrfGI-CAlA?feature=shared', '_blank');
  };

  const handleNewsletterSubscribe = () => {
    toast.success('Thank you for subscribing! You\'ll receive DeFi insights and updates.');
  };

  const handleConnectWallet = async () => {
    try {
      const result = await walletService.connectWallet();
      if (result.isConnected) {
        toast.success('🎉 Wallet connected! Redirecting to dashboard...');
        // Small delay to show success message
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      // Only show error if it's not a user cancellation
      if (error.message && !error.message.includes('cancelled') && !error.message.includes('rejected')) {
        toast.error(error.message || 'Failed to connect wallet. Please try again.');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If navigation passes a scroll target in state (navigate('/', { state: { scrollTo: 'features' }})),
  // scroll to the section after mount.
  useEffect(() => {
    if (location && location.state && location.state.scrollTo) {
      const id = location.state.scrollTo;
      // small timeout to allow the landing page to render content
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // clear the state so subsequent navigations don't re-trigger
        try {
          navigate(location.pathname, { replace: true, state: {} });
        } catch (e) {
          // ignore
        }
      }, 120);
    }
  }, [location, navigate]);


  const stats = [
    {
      icon: Coins,
      value: "1,250+",
      label: "Active Vaults",
      color: "from-loopfund-emerald-500 to-loopfund-mint-500"
    },
    {
      icon: TrendingUp,
      value: "15.7%",
      label: "Average APY",
      color: "from-loopfund-coral-500 to-loopfund-orange-500"
    },
    {
      icon: Wallet,
      value: "$125M+",
      label: "Total Value Locked",
      color: "from-loopfund-gold-500 to-loopfund-electric-500"
    },
    {
      icon: Shield,
      value: "98.5%",
      label: "Network Health",
      color: "from-loopfund-lavender-500 to-loopfund-midnight-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI DeFi Advisor",
      description: "AI-powered recommendations for optimal DeFi strategies based on your risk profile and market conditions",
      color: "text-loopfund-lavender-600"
    },
    {
      icon: Coins,
      title: "Smart Contract Vaults",
      description: "Deploy your savings goals as secure smart contracts on Celo blockchain with automatic yield generation",
      color: "text-loopfund-coral-600"
    },
    {
      icon: Shield,
      title: "Celo-Backed Security",
      description: "All operations secured by Celo's mobile-first blockchain with proof-of-stake consensus for maximum security",
      color: "text-loopfund-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "DeFi Yield Farming",
      description: "Earn up to 15.7% APY through multiple DeFi protocols with AI-optimized risk management",
      color: "text-loopfund-orange-600"
    },
    {
      icon: Users,
      title: "Group DeFi Pools",
      description: "Collaborative savings pools where multiple users contribute and share yield rewards",
      color: "text-loopfund-electric-600"
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Live portfolio tracking, yield monitoring, and market insights powered by blockchain data",
      color: "text-loopfund-gold-600"
    }
  ];

  const goalExamples = [
    { icon: Home, title: 'Home Down Payment', amount: '50 CELO', type: 'individual', apy: '8.5%' },
    { icon: Car, title: 'New Car', amount: '25 CELO', type: 'individual', apy: '12.3%' },
    { icon: BookOpen, title: 'Education Fund', amount: '15 CELO', type: 'individual', apy: '15.7%' },
    { icon: Plane, title: 'Family Vacation', amount: '8 CELO', type: 'group', apy: '10.2%' },
    { icon: Gift, title: 'Wedding Gift', amount: '5 CELO', type: 'group', apy: '9.8%' },
    { icon: Heart, title: 'Emergency Fund', amount: '10 CELO', type: 'individual', apy: '7.5%' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'DeFi Investor',
      content: 'I earned 12.3% APY on my savings vault! The AI recommendations helped me optimize my DeFi strategy.',
      avatar: 'SJ',
      type: 'individual'
    },
    {
      name: 'The Martinez Family',
      role: 'Group DeFi Pool',
      content: 'Our family DeFi pool earned 10.2% APY together. The smart contracts made everything transparent and secure.',
      avatar: 'MF',
      type: 'group'
    },
    {
      name: 'David Chen',
      role: 'Crypto Native',
      content: 'Finally, a DeFi app that makes sense! The Celo mobile-first blockchain gives me confidence to earn yield safely.',
      avatar: 'DC',
      type: 'individual'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
      
      <Navigation isScrolled={isScrolled} />
      
      
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-[500px] sm:min-h-[550px] md:min-h-[600px]">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-loopfund-neutral-900 dark:text-loopfund-dark-text leading-tight">
                  Your AI-Powered{' '}
                  <span className="bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 bg-clip-text text-transparent">
                    DeFi Advisor on Celo
                  </span>
                </h1>
                <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed max-w-xl">
                  Transform your savings into DeFi yield with AI-powered recommendations on Celo's mobile-first blockchain. 
                  Earn up to 15.7% APY through smart contracts on Celo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <LoopFundButton
                      variant="primary"
                      size="lg"
                      onClick={handleConnectWallet}
                      className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px]"
                    >
                      <span className="hidden sm:inline">Connect Wallet & Start Earning</span>
                      <span className="sm:hidden">Connect Wallet</span>
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
                    </LoopFundButton>
                <LoopFundButton
                  variant="secondary"
                  size="lg"
                  onClick={handleWatchDemo}
                  className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px]"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-200" />
                  Watch Demo
                </LoopFundButton>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end items-center h-full mt-8 lg:mt-0">
              <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md">
                <Lottie animationData={heroAnimation} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3 sm:mb-4">
              Trusted by Thousands
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Join our growing community of successful savers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <LoopFundCard key={stat.label} className="p-3 sm:p-4 md:p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1 w-full">
                    <p className="font-body text-xs sm:text-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="font-display text-xl sm:text-2xl md:text-3xl text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 md:p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                  </div>
                </div>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

  {/* Features Section */}
  <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-loopfund-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4 sm:mb-6 px-4">
              Revolutionary Financial Wellness Features
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed px-4">
              The only app that combines AI therapy, community support, and behavioral interventions 
              to transform your relationship with money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <LoopFundCard key={feature.title} className="p-4 sm:p-5 md:p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund mr-3 sm:mr-4 flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg md:text-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {feature.title}
                  </h3>
                </div>
                <p className="font-body text-sm sm:text-base text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>


      {/* About Section (anchor target for About link) */}
      <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              About LoopFi
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed">
              LoopFi combines AI-driven financial advice with secure smart contract vaults on the Celo blockchain.
              We help individuals and groups save, earn yield, and reach financial goals through transparent, mobile-first DeFi tooling.
            </p>
          </div>
        </div>
      </section>

      {/* Goal Examples Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4 sm:mb-6 px-4">
              What Are You Saving For?
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed px-4">
              From personal dreams to shared adventures, discover how LoopFi helps you achieve any financial goal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {goalExamples.map((goal, index) => (
              <LoopFundCard key={index} className="p-4 sm:p-6 md:p-8 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund">
                    <goal.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 text-white" />
                  </div>
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                    {goal.type === 'individual' ? 'Individual' : 'Group'}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 sm:mb-3">
                  {goal.title}
                </h3>
                <p className="font-display text-xl sm:text-2xl md:text-3xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1 sm:mb-2">
                  {goal.amount}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                  {goal.apy} APY
                </p>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4 sm:mb-6 px-4">
              Loved by Thousands
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed px-4">
              See how LoopFi is helping people achieve their financial dreams, both individually and together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <LoopFundCard key={index} className="p-4 sm:p-6 md:p-8 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg mr-3 sm:mr-4 shadow-loopfund flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-display text-base sm:text-lg md:text-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {testimonial.name}
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm sm:text-base md:text-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed mb-4 sm:mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                    {testimonial.type === 'individual' ? 'Individual Saver' : 'Group Saver'}
                  </span>
                </div>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-r from-loopfund-emerald-600 via-loopfund-coral-600 to-loopfund-gold-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 px-4">
              Ready to Earn DeFi Yield on Celo?
            </h2>
            <p className="font-body text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Connect your Celo wallet and start earning up to 15.7% APY through AI-optimized DeFi strategies 
              secured by Celo's mobile-first blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4">
              <LoopFundButton
                variant="primary"
                size="lg"
                onClick={handleConnectWallet}
                className="group bg-white text-loopfund-neutral-900 hover:bg-loopfund-neutral-50 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]"
              >
                <span className="hidden sm:inline">Connect Wallet & Start Earning</span>
                <span className="sm:hidden">Connect Wallet</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
              </LoopFundButton>
              <LoopFundButton
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="border-2 border-white text-white hover:bg-white hover:text-loopfund-neutral-900 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]"
              >
                Watch DeFi Demo
              </LoopFundButton>
            </div>
          </div>
        </div>
      </section>

  {/* Footer */}
  <footer id="contact" className="bg-loopfund-neutral-900 dark:bg-loopfund-dark-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={logo1} alt="LoopFi" className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="font-display text-xl sm:text-2xl text-white">LoopFi</span>
              </div>
              <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-6">
                Transform your savings into DeFi yield with AI-powered recommendations on Celo's mobile-first blockchain.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-emerald-600 min-h-[44px] min-w-[44px]">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-coral-600 min-h-[44px] min-w-[44px]">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-gold-600 min-h-[44px] min-w-[44px]">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-lavender-600 min-h-[44px] min-w-[44px]">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Product</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base cursor-pointer text-left min-h-[44px] flex items-center">Get Started</button></li>
                <li><a href="#features" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Features</a></li>
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base cursor-pointer text-left min-h-[44px] flex items-center">Join DeFi Pool</button></li>
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base cursor-pointer text-left min-h-[44px] flex items-center">Connect Wallet</button></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Company</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link to="/#about" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">About Us</Link></li>
                <li><Link to="/#contact" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Contact</Link></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Blog</a></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Careers</a></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Help Center</a></li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="lg:col-span-1 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Stay Updated</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4 sm:mb-6">
                Get the latest financial tips and updates delivered to your inbox.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-loopfund-neutral-700 border border-loopfund-neutral-600 rounded-xl text-white placeholder-loopfund-neutral-400 focus:outline-none focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-sm sm:text-base min-h-[48px]"
                  />
                  <LoopFundButton
                    variant="primary"
                    size="md"
                    onClick={handleNewsletterSubscribe}
                    className="w-full whitespace-nowrap min-h-[48px]"
                  >
                    Subscribe
                  </LoopFundButton>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Join 10,000+ users getting financial insights weekly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
              <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6 text-center md:text-left">
                <p className="text-slate-400 text-sm sm:text-base">
                  © 2024 LoopFi. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Privacy Policy</a>
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Terms of Service</a>
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-sm sm:text-base min-h-[44px] flex items-center">Cookie Policy</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-loopfund-neutral-400 font-body text-xs sm:text-sm md:text-base">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Simple Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 hover:from-loopfund-emerald-700 hover:to-loopfund-coral-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[48px] min-w-[48px]"
        aria-label="Scroll to top"
      >
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-[-90deg]" />
      </button>
    </div>
  );
};

export default LandingPage;

