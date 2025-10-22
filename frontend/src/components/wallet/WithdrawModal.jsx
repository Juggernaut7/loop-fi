import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, CreditCard, Banknote, AlertCircle, CheckCircle } from 'lucide-react';
import LoopFundButton from '../ui/LoopFundButton';
import LoopFundCard from '../ui/LoopFundCard';

const WithdrawModal = ({ isOpen, onClose, onSuccess, wallet }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Transfer to your bank account',
      processingTime: '1-3 business days',
      fee: '₦50'
    },
    {
      id: 'card',
      name: 'Debit Card',
      icon: CreditCard,
      description: 'Withdraw to your linked card',
      processingTime: 'Instant',
      fee: '₦25'
    }
  ];

  const handleAmountChange = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };

  const handleWithdraw = async () => {
    if (!amount || !selectedMethod) return;

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  const formatCurrency = (value) => {
    if (!value) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

  const availableBalance = wallet?.balance || 0;
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <LoopFundCard className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                {step > 1 && (
                  <motion.button
                    onClick={() => setStep(step - 1)}
                    className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-neutral-800 rounded-lg transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                  </motion.button>
                )}
                <div>
                  <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Withdraw Funds
                  </h2>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Step {step} of 2
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-neutral-800 rounded-lg transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
              </motion.button>
            </div>

            {/* Step 1: Amount Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2 block">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-loopfund-neutral-200 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      NGN
                    </span>
                  </div>
                  <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                    Available: {formatCurrency(availableBalance)}
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {[1000, 5000, 10000, 25000, 50000, 'Max'].map((quickAmount) => (
                    <motion.button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount === 'Max' ? availableBalance.toString() : quickAmount.toString())}
                      className="px-4 py-2 text-center font-body text-body-sm border border-loopfund-neutral-200 dark:border-loopfund-neutral-600 rounded-lg hover:bg-loopfund-emerald-50 dark:hover:bg-loopfund-emerald-900/20 hover:border-loopfund-emerald-300 dark:hover:border-loopfund-emerald-600 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      {quickAmount === 'Max' ? 'Max' : formatCurrency(quickAmount)}
                    </motion.button>
                  ))}
                </div>

                {/* Amount Preview */}
                {amount && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-body-sm text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                        You'll receive:
                      </span>
                      <span className="font-display text-h4 text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  </motion.div>
                )}

                <LoopFundButton
                  onClick={() => setStep(2)}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!isValidAmount}
                >
                  Continue
                </LoopFundButton>
              </motion.div>
            )}

            {/* Step 2: Withdrawal Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                    Choose Withdrawal Method
                  </h3>
                  <div className="space-y-3">
                    {withdrawalMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedMethod === method.id
                            ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20'
                            : 'border-loopfund-neutral-200 dark:border-loopfund-neutral-600 hover:border-loopfund-emerald-300 dark:hover:border-loopfund-emerald-600'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedMethod === method.id
                              ? 'bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40'
                              : 'bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800'
                          }`}>
                            <method.icon className={`w-5 h-5 ${
                              selectedMethod === method.id
                                ? 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400'
                                : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {method.name}
                            </h4>
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              {method.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                {method.processingTime}
                              </span>
                              <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                Fee: {method.fee}
                              </span>
                            </div>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Withdrawal Summary */}
                <div className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-neutral-800/50 rounded-xl">
                  <h4 className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                    Withdrawal Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        Amount:
                      </span>
                      <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        Fee:
                      </span>
                      <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        ₦25
                      </span>
                    </div>
                    <div className="border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                          Total:
                        </span>
                        <span className="font-display text-h5 font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {formatCurrency(parseFloat(amount) + 25)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <LoopFundButton
                    onClick={() => setStep(1)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </LoopFundButton>
                  <LoopFundButton
                    onClick={handleWithdraw}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={!selectedMethod || isProcessing}
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {isProcessing ? 'Processing...' : 'Withdraw'}
                  </LoopFundButton>
                </div>
              </motion.div>
            )}
          </LoopFundCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WithdrawModal;
