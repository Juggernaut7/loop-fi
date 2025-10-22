import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <section className="relative pt-24 md:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="font-display text-h1 md:text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text leading-tight">
                  Your AI-Powered{' '}
                  <span className="bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 bg-clip-text text-transparent">
                    DeFi Advisor on Celo
                  </span>
                </h1>
                <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed max-w-xl">
                  Transform your savings into DeFi yield with AI-powered recommendations on Celo's mobile-first blockchain. 
                  Earn up to 15.7% APY through smart contracts on Celo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                    <LoopFundButton
                      variant="primary"
                      size="lg"
                      onClick={handleConnectWallet}
                      className="group px-8 py-4 text-lg font-semibold"
                    >
                      Connect Wallet & Start Earning
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200" />
                    </LoopFundButton>
                <LoopFundButton
                  variant="secondary"
                  size="lg"
                  onClick={handleWatchDemo}
                  className="group px-8 py-4 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2 transition-transform duration-200" />
                  Watch DeFi Demo
                </LoopFundButton>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end items-center h-full">
              <div className="w-full max-w-md">
                <Lottie animationData={heroAnimation} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              Trusted by Thousands
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Join our growing community of successful savers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <LoopFundCard key={stat.label} className="p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full">
                    <stat.icon className="w-6 h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                  </div>
                </div>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-loopfund-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              Revolutionary Financial Wellness Features
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
              The only app that combines AI therapy, community support, and behavioral interventions 
              to transform your relationship with money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <LoopFundCard key={feature.title} className="p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund mr-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {feature.title}
                  </h3>
                </div>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {feature.description}
                </p>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>


      {/* Goal Examples Section */}
      <section className="py-24 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-display-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              What Are You Saving For?
            </h2>
            <p className="font-body text-body-xl text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
              From personal dreams to shared adventures, discover how LoopFi helps you achieve any financial goal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goalExamples.map((goal, index) => (
              <LoopFundCard key={index} className="p-8 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund mr-4">
                    <goal.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                    {goal.type === 'individual' ? 'Individual' : 'Group'}
                  </span>
                </div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                  {goal.title}
                </h3>
                <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  {goal.amount}
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {goal.apy} APY
                </p>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              Loved by Thousands
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
              See how LoopFi is helping people achieve their financial dreams, both individually and together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <LoopFundCard key={index} className="p-8 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 flex items-center justify-center text-white font-semibold text-lg mr-4 shadow-loopfund">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {testimonial.name}
                    </h4>
                    <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                    {testimonial.type === 'individual' ? 'Individual Saver' : 'Group Saver'}
                  </span>
                </div>
              </LoopFundCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-loopfund-emerald-600 via-loopfund-coral-600 to-loopfund-gold-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-display-xl text-white mb-6">
              Ready to Earn DeFi Yield on Celo?
            </h2>
            <p className="font-body text-body-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect your Celo wallet and start earning up to 15.7% APY through AI-optimized DeFi strategies 
              secured by Celo's mobile-first blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <LoopFundButton
                variant="primary"
                size="lg"
                onClick={handleConnectWallet}
                className="group bg-white text-loopfund-neutral-900 hover:bg-loopfund-neutral-50"
              >
                Connect Wallet & Start Earning
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200" />
              </LoopFundButton>
              <LoopFundButton
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="border-2 border-white text-white hover:bg-white hover:text-loopfund-neutral-900"
              >
                Watch DeFi Demo
              </LoopFundButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-loopfund-neutral-900 dark:bg-loopfund-dark-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={logo1} alt="LoopFi" className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="font-display text-h3 text-white">LoopFi</span>
              </div>
              <p className="font-body text-body-md text-white/80 leading-relaxed mb-6">
                Transform your savings into DeFi yield with AI-powered recommendations on Celo's mobile-first blockchain.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-emerald-600">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-coral-600">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-gold-600">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-loopfund-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-lavender-600">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg cursor-pointer">Get Started</button></li>
                <li><a href="#features" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Features</a></li>
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg cursor-pointer">Join DeFi Pool</button></li>
                <li><button onClick={handleConnectWallet} className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg cursor-pointer">Connect Wallet</button></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li><Link to="/#about" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">About Us</Link></li>
                <li><Link to="/#contact" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Contact</Link></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Blog</a></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Careers</a></li>
                <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Help Center</a></li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-white">Stay Updated</h3>
              <p className="text-slate-300 text-lg mb-6">
                Get the latest financial tips and updates delivered to your inbox.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-loopfund-neutral-700 border border-loopfund-neutral-600 rounded-xl sm:rounded-l-xl sm:rounded-r-none text-white placeholder-loopfund-neutral-400 focus:outline-none focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent min-w-0 font-body text-body-sm"
                  />
                  <LoopFundButton
                    variant="primary"
                    size="md"
                    onClick={handleNewsletterSubscribe}
                    className="sm:rounded-l-none sm:rounded-r-xl whitespace-nowrap"
                  >
                    Subscribe
                  </LoopFundButton>
                </div>
                <p className="text-slate-400 text-sm">
                  Join 10,000+ users getting financial insights weekly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-slate-400 text-lg">
                  © 2024 LoopFi. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Privacy Policy</a>
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Terms of Service</a>
                  <a href="#" className="text-loopfund-neutral-400 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body-lg">Cookie Policy</a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-loopfund-neutral-400 font-body text-body-lg">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Simple Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 hover:from-loopfund-emerald-700 hover:to-loopfund-coral-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowRight className="w-5 h-5 text-white transform rotate-[-90deg]" />
      </button>
    </div>
  );
};

export default LandingPage;

