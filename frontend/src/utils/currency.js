/**
 * Global Currency Utility for LoopFund
 * Handles consistent currency formatting across the application
 */

// Default currency configuration - Now using CELO for Web3
const DEFAULT_CURRENCY = {
  code: 'CELO',
  symbol: 'CELO',
  locale: 'en-US',
  name: 'Celo',
  decimals: 4
};

// Currency configurations
const CURRENCIES = {
  CELO: {
    code: 'CELO',
    symbol: 'CELO',
    locale: 'en-US',
    name: 'Celo',
    decimals: 4 // CELO uses 4 decimal places
  },
  cUSD: {
    code: 'cUSD',
    symbol: 'cUSD',
    locale: 'en-US',
    name: 'Celo Dollar',
    decimals: 2
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    locale: 'en-NG',
    name: 'Nigerian Naira',
    decimals: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    name: 'US Dollar',
    decimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'en-EU',
    name: 'Euro',
    decimals: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    name: 'British Pound',
    decimals: 2
  }
};

/**
 * Get user's preferred currency from localStorage or default to NGN
 */
export const getUserCurrency = () => {
  try {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    return savedCurrency && CURRENCIES[savedCurrency] ? CURRENCIES[savedCurrency] : DEFAULT_CURRENCY;
  } catch (error) {
    console.warn('Error getting user currency preference:', error);
    return DEFAULT_CURRENCY;
  }
};

/**
 * Set user's preferred currency
 */
export const setUserCurrency = (currencyCode) => {
  try {
    if (CURRENCIES[currencyCode]) {
      localStorage.setItem('preferredCurrency', currencyCode);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Error setting user currency preference:', error);
    return false;
  }
};

/**
 * Format currency amount with proper symbol and locale
 */
export const formatCurrency = (amount, options = {}) => {
  const currency = options.currency || getUserCurrency();
  const {
    showSymbol = true,
    showDecimals = true,
    compact = false,
    customSymbol = null
  } = options;

  // Ensure amount is a number
  const numAmount = parseFloat(amount) || 0;

  // Handle compact notation (e.g., 1K, 1M)
  if (compact && numAmount >= 1000) {
    const compactAmount = formatCompactCurrency(numAmount, currency);
    return showSymbol ? `${currency.symbol}${compactAmount}` : compactAmount;
  }

  // Standard formatting
  const formatter = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });

  const formatted = formatter.format(numAmount);
  
  // Use custom symbol if provided
  if (customSymbol) {
    return formatted.replace(currency.symbol, customSymbol);
  }

  return formatted;
};

/**
 * Format currency in compact notation (1K, 1M, etc.)
 */
export const formatCompactCurrency = (amount, currency = getUserCurrency()) => {
  const numAmount = parseFloat(amount) || 0;
  
  if (numAmount >= 1000000) {
    return `${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `${(numAmount / 1000).toFixed(1)}K`;
  }
  
  return numAmount.toFixed(0);
};

/**
 * Format currency with symbol only (no locale formatting)
 */
export const formatCurrencySimple = (amount, options = {}) => {
  const currency = options.currency || getUserCurrency();
  const numAmount = parseFloat(amount) || 0;
  const { showDecimals = true } = options;
  
  // Use currency-specific decimal places
  const decimals = currency.decimals || 2;
  
  const formatted = numAmount.toLocaleString(currency.locale, {
    minimumFractionDigits: showDecimals ? decimals : 0,
    maximumFractionDigits: showDecimals ? decimals : 0
  });
  
  // For crypto, show symbol after the amount
  if (currency.code === 'CELO' || currency.code === 'cUSD') {
    return `${formatted} ${currency.symbol}`;
  }
  
  return `${currency.symbol}${formatted}`;
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  if (!currencyString) return 0;
  
  // Remove currency symbols and commas
  const cleaned = currencyString.toString().replace(/[₦$€£,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currencyCode = null) => {
  const currency = currencyCode ? CURRENCIES[currencyCode] : getUserCurrency();
  return currency ? currency.symbol : DEFAULT_CURRENCY.symbol;
};

/**
 * Get all available currencies
 */
export const getAvailableCurrencies = () => {
  return Object.values(CURRENCIES);
};

/**
 * Convert amount between currencies (placeholder for future implementation)
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // TODO: Implement actual currency conversion with exchange rates
  // For now, return the same amount
  console.warn('Currency conversion not implemented yet');
  return amount;
};

// Export default currency for backward compatibility
export const DEFAULT_CURRENCY_CONFIG = DEFAULT_CURRENCY;

export default {
  formatCurrency,
  formatCurrencySimple,
  formatCompactCurrency,
  parseCurrency,
  getCurrencySymbol,
  getUserCurrency,
  setUserCurrency,
  getAvailableCurrencies,
  convertCurrency,
  DEFAULT_CURRENCY_CONFIG
};
