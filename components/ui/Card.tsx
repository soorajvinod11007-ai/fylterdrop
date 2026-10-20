import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

/**
 * Glass-morphic card with optional 3D hover.
 * Uses `glass-card`, `card-3d`, and `glass-shimmer` from globals.css.
 */
export const Card: React.FC<CardProps> = ({ className = '', children, ...rest }) => (
  <div
    className={`glass-card card-3d glass-shimmer relative ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);
