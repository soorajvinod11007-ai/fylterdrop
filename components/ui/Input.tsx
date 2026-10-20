import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

/**
 * Design‑system text input — dark background with gold focus ring.
 * Pass an `icon` (Lucide element) to render it inside the left edge.
 */
export const Input: React.FC<InputProps> = ({ icon, className = '', ...rest }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fylter-gold pointer-events-none">
        {icon}
      </span>
    )}
    <input
      className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-fylter-darkest/90 border border-fylter-border/70 text-fylter-offWhite placeholder-fylter-muted text-sm focus:outline-none focus:border-fylter-gold transition-colors shadow-inner ${className}`.trim()}
      {...rest}
    />
  </div>
);
