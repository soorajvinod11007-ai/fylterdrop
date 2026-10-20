import React from "react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Fylter - Purely Filters.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-fylter-gold font-semibold">
            Legal & Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fylter-offWhite mt-1">
            Privacy Policy
          </h1>
          <p className="text-sm text-fylter-muted mt-2">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-fylter-muted leading-relaxed border-t border-fylter-border/30 pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">1. Information We Collect</h2>
            <p>
              Fylter operates on a minimal data model. Because our catalog website does not process credit cards or store financial credentials, we only collect personal data (such as shipping name, delivery address, phone number, and email) that you explicitly provide to us when communicating via WhatsApp or Instagram to fulfill your orders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">2. How Your Information Is Used</h2>
            <p>
              Your contact and shipping address details are used solely to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
              <li>Process and dispatch your requested products via authorized logistics partners.</li>
              <li>Share tracking updates and delivery status notifications on WhatsApp.</li>
              <li>Provide customer support, replacement assistance, or answer technical product questions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">3. No Card Storage or Third-Party Selling</h2>
            <p>
              We do not sell, rent, or lease customer contact information to advertisers. We do not store credit card numbers, CVVs, or bank login passwords.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">4. Contact Regarding Privacy</h2>
            <p>
              If you have any questions about how your delivery data is handled, feel free to contact us at <strong className="text-fylter-gold">{siteConfig.email}</strong> or reach us via WhatsApp at <strong className="text-fylter-gold">{siteConfig.whatsappDisplayNumber}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
