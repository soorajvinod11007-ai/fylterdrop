"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig, getWhatsAppSupportUrl } from "@/config/site";
import { ChevronDown, MessageCircle, Instagram, HelpCircle, Sparkles } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does ordering through WhatsApp work?",
      a: "When you find a product you love on Fylter, click the 'ORDER ON WHATSAPP' button. This automatically opens WhatsApp with a pre-filled message containing the product name, SKU, price, and selected variant. Our team will immediately confirm real-time stock availability, delivery timelines to your pin code, and share seamless payment details."
    },
    {
      q: "How do I place an order through Instagram DM?",
      a: "Click 'ORDER ON INSTAGRAM' or copy the product SKU code using the 'Copy Product Code' button on the product page. Send us a direct message on Instagram (@fylter.in) with the SKU or a screenshot. Our team responds promptly during business hours to finalize your order."
    },
    {
      q: "Why is there no credit card payment or cart checkout on this website?",
      a: "At Fylter, we believe in high-touch, personalized service. Many high-performance products have specific size, voltage, or fitting considerations (such as shower thread adapters or laptop screen dimensions). By confirming orders directly on WhatsApp or Instagram, we ensure you receive the exact right model and avoid returns or mismatched orders."
    },
    {
      q: "What payment methods do you accept once we connect?",
      a: "Once we confirm your order details on WhatsApp or Instagram, you can pay easily via any standard Indian payment mode: UPI (Google Pay, PhonePe, Paytm, BHIM), Direct IMPS/NEFT Bank Transfer, or Cash on Delivery (COD) for eligible pin codes."
    },
    {
      q: "What are the shipping charges and delivery timelines?",
      a: "We offer FREE standard express shipping across India on all orders above ₹999. Orders below ₹999 incur a flat ₹79 delivery fee. Most metro deliveries take 2–4 business days, while rest-of-India destinations typically arrive in 3–6 business days with door-to-door tracking."
    },
    {
      q: "What if I receive a damaged or malfunctioning product?",
      a: "Every Fylter item is backed by our 7-Day Replacement Guarantee. Simply send us an unboxing photo or quick video on WhatsApp or Instagram within 7 days of delivery, and we will dispatch a brand-new replacement unit without tedious warranty paperwork."
    },
    {
      q: "Can you help me choose the right find?",
      a: "Of course. Tell us what you are shopping for, who it is for, or what you have in mind. Our team will be happy to help you find a lovely fit."
    }
  ];

  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fylter-secondary border border-fylter-gold/30 text-xs text-fylter-gold font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fylter-offWhite tracking-tight">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h1>

          <p className="text-sm sm:text-base text-fylter-muted max-w-xl mx-auto">
            Everything you need to know about Fylter's direct WhatsApp ordering, delivery across India, and product guarantees.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-fylter-secondary/40 border border-fylter-border/40 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-fylter-secondary/60 transition-colors"
                >
                  <span className="font-semibold text-base sm:text-lg text-fylter-offWhite">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-fylter-primary border border-fylter-gold/30 text-fylter-gold shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-fylter-muted leading-relaxed border-t border-fylter-border/20 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="p-8 rounded-2xl bg-fylter-secondary/30 border border-fylter-gold/30 text-center space-y-4">
          <h3 className="text-xl font-bold text-fylter-offWhite">
            Have a question not listed here?
          </h3>
          <p className="text-xs sm:text-sm text-fylter-muted max-w-md mx-auto">
            Our team is available on WhatsApp and Instagram to help you find your next favourite.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={getWhatsAppSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-fylter-secondary border border-fylter-gold/40 text-fylter-gold hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>DM on Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
