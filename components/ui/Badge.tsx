import React from 'react';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** `gold` = discount/promo, `pill` = new-arrival/tag, `emerald` = status */
  variant?: 'gold' | 'pill' | 'emerald';
  children: React.ReactNode;
};

/** Inline badge/chip using design system utilities. */
export const Badge: React.FC<BadgeProps> = ({ variant = 'pill', className = '', children, ...rest }) => {
  const map = {
    gold: 'bg-gradient-to-r from-fylter-gold to-fylter-lightGold text-fylter-darkest border border-fylter-paleGold/50 shadow-md',
    pill: 'glass-pill text-fylter-paleGold',
    emerald: 'bg-emerald-600/30 text-emerald-300 border border-emerald-400',
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase ${map[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
};
