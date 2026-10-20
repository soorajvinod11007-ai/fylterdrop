"use client";

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Design‑system modal — glass‑panel backdrop with gold border.
 * Traps focus and closes on Escape or backdrop click.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-fylter-darkest/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 id="modal-title" className="text-xl font-bold text-fylter-offWhite gold-gradient-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-fylter-muted hover:text-fylter-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
