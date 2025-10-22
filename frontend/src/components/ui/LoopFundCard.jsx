import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LoopFundCard = React.forwardRef(({
  className,
  variant = 'standard',
  children,
  hover = true,
  onClick,
  ...props
}, ref) => {
  const baseClasses = "relative overflow-hidden transition-all duration-300";
  
  const variants = {
    standard: "bg-white dark:bg-loopfund-dark-surface border border-loopfund-neutral-200 dark:border-loopfund-dark-elevated rounded-2xl shadow-loopfund hover:shadow-loopfund-md",
    elevated: "bg-white dark:bg-loopfund-dark-surface border border-loopfund-neutral-200 dark:border-loopfund-dark-elevated rounded-2xl shadow-loopfund-lg",
    floating: "bg-white dark:bg-loopfund-dark-surface border border-loopfund-neutral-200 dark:border-loopfund-dark-elevated rounded-3xl shadow-loopfund-xl",
    glass: "bg-white/10 dark:bg-loopfund-dark-surface/50 backdrop-blur-md border border-white/20 dark:border-loopfund-dark-elevated rounded-2xl shadow-loopfund",
    gradient: "bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white rounded-2xl shadow-loopfund-lg",
    dark: "bg-loopfund-dark-surface border border-loopfund-dark-elevated rounded-2xl shadow-loopfund-lg"
  };
  
  const hoverEffects = hover ? {
    whileHover: { 
      y: -4,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    whileTap: { scale: 0.98 }
  } : {};
  
  const cardClasses = cn(
    baseClasses,
    variants[variant],
    onClick && "cursor-pointer",
    className
  );
  
  return (
    <motion.div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...hoverEffects}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow effect */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-loopfund-emerald-500/5 to-loopfund-coral-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}
    </motion.div>
  );
});

LoopFundCard.displayName = "LoopFundCard";

// Card Header Component
export const LoopFundCardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardHeader.displayName = "LoopFundCardHeader";

// Card Title Component
export const LoopFundCardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn("font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));

LoopFundCardTitle.displayName = "LoopFundCardTitle";

// Card Description Component
export const LoopFundCardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn("font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400", className)}
    {...props}
  >
    {children}
  </p>
));

LoopFundCardDescription.displayName = "LoopFundCardDescription";

// Card Content Component
export const LoopFundCardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardContent.displayName = "LoopFundCardContent";

// Card Footer Component
export const LoopFundCardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardFooter.displayName = "LoopFundCardFooter";

export default LoopFundCard;
