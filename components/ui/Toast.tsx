import React from 'react';
import { X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-400/50 bg-emerald-900/40 text-emerald-300',
  error:   'border-red-400/50 bg-red-900/40 text-red-300',
  info:    'border-fylter-gold/40 bg-fylter-secondary/60 text-fylter-paleGold',
  warning: 'border-amber-400/50 bg-amber-900/30 text-amber-300',
};

/**
 * Inline toast/notification strip.
 * For a full toast stack, wrap this in a fixed portal container.
 */
export const Toast: React.FC<ToastProps> = ({ message, variant = 'info', onClose }) => (
  <div
    role="alert"
    className={`flex items-center justify-between gap-3 px-5 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-lg ${variantStyles[variant]}`}
  >
    <span>{message}</span>
    {onClose && (
      <button onClick={onClose} aria-label="Dismiss" className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);
