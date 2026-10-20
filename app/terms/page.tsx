import React from "react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions for using Fylter and placing direct orders.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-fylter-gold font-semibold">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fylter-offWhite mt-1">
            Terms & Conditions
          </h1>
          <p className="text-sm text-fylter-muted mt-2">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-fylter-muted leading-relaxed border-t border-fylter-border/30 pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">1. Overview</h2>
            <p>
              By browsing this website and ordering products from Fylter ("we", "us", or "our"), you agree to be bound by the following terms and conditions. This website serves as a curated catalog and discovery platform with fulfillment coordinated through verified social messaging channels (WhatsApp and Instagram).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">2. Product Accuracy & Availability</h2>
            <p>
              We strive to display accurate descriptions, dimensions, specifications, and imagery for every item. However, slight manufacturing variations or color discrepancies due to screen calibration may occur. Stock availability is confirmed in real-time when you communicate with our concierge team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">3. Pricing & Payment</h2>
            <p>
              All prices listed on the website are in Indian Rupees (INR) and inclusive of applicable goods and services taxes. Delivery fees, where applicable, are disclosed before order finalization. Payments are made through standard Indian channels (UPI, Bank Transfer, or COD) as mutually confirmed on WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">4. Limitation of Liability</h2>
            <p>
              Fylter shall not be liable for any indirect, incidental, or consequential damages resulting from the misuse or unauthorized modification of filtration equipment or accessories.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
