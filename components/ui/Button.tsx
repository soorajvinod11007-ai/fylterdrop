import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Design‑system variant:
   * - primary   → gold primary button (`btn-3d-gold`)
   * - secondary → WhatsApp action button (`btn-3d-whatsapp`)
   * - gold      → same as primary
   * - whatsapp  → same as secondary
   */
  variant?: 'primary' | 'secondary' | 'gold' | 'whatsapp';
  children: React.ReactNode;
};

/** Reusable button with shared primary and WhatsApp action styles. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const variantClass = {
    primary: 'btn-3d-gold',
    secondary: 'btn-3d-whatsapp',
    gold: 'btn-3d-gold',
    whatsapp: 'btn-3d-whatsapp',
  }[variant];

  return (
    <button className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
};
