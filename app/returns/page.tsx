import React from "react";
import Link from "next/link";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Return & Refund Policy",
  description: "Fylter's 7-Day Replacement Guarantee and return guidelines.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-fylter-gold font-semibold">
            Customer Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fylter-offWhite mt-1">
            7-Day Replacement & Return Policy
          </h1>
          <p className="text-sm text-fylter-muted mt-2">
            Last updated: October 2026 • Simple, transparent resolution for all Fylter customers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-fylter-secondary/40 border border-fylter-gold/30 space-y-3">
          <div className="flex items-center gap-2.5 text-fylter-gold font-bold text-base">
            <RotateCcw className="w-5 h-5" />
            <span>The Fylter Purity Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-fylter-offWhite/90 leading-relaxed">
            We want you to be genuinely delighted with every product you discover on Fylter. If your product arrives defective, physically damaged, or fails to function as advertised, we will replace it free of charge within 7 days of delivery.
          </p>
        </div>

        <div className="space-y-6 text-sm text-fylter-muted leading-relaxed border-t border-fylter-border/30 pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">1. Eligibility for Replacement</h2>
            <p>
              To qualify for a 7-day hassle-free replacement:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>The item must be in its original packaging with all included accessories, filter cartridges, and power cables.</li>
              <li>A claim must be initiated on WhatsApp or Instagram within 7 calendar days of confirmed carrier delivery.</li>
              <li>Provide a clear photo or short video clip demonstrating the defect or physical damage.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">2. How to Request a Replacement</h2>
            <p>
              You do not need to fill out complex RMA forms. Simply message our support team on WhatsApp at <strong className="text-fylter-gold">{siteConfig.whatsappDisplayNumber}</strong> with your order details and photos of the item. We will arrange a reverse pickup or expedite a replacement unit to your doorstep immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">3. Non-Returnable Items</h2>
            <p>
              Due to sanitary and personal hygiene regulations, filter cartridges or consumable elements that have already been immersed in water or used for personal consumption cannot be returned unless verified as defective upon initial unboxing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">4. Refunds</h2>
            <p>
              If a replacement cannot be provided due to out-of-stock inventory, a 100% full refund will be processed back to your original payment account (UPI or bank account) within 24 to 48 hours of verification.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
