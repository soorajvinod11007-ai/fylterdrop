"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl } from "@/config/site";
import { MessageCircle, Instagram, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";

export default function Footer() {
  const { siteSettings } = useAdmin();

  const whatsappSupportUrl = getWhatsAppSupportUrl(undefined, {
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  return (
    <footer className="site-footer bg-fylter-dark border-t border-fylter-border/50 text-fylter-offWhite/80 pt-16 pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-fylter-border/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-fylter-primary border border-fylter-gold/30 text-fylter-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-fylter-offWhite">Curated Purity</h4>
              <p className="text-xs text-fylter-muted mt-1">
                Hand-selected air, water, and lifestyle filtration designed for modern living.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-fylter-primary border border-fylter-gold/30 text-fylter-gold">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-fylter-offWhite">Frictionless Ordering</h4>
              <p className="text-xs text-fylter-muted mt-1">
                Direct WhatsApp & Instagram confirmation. Talk to real humans before buying.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-fylter-primary border border-fylter-gold/30 text-fylter-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-fylter-offWhite">Pan-India Delivery</h4>
              <p className="text-xs text-fylter-muted mt-1">
                Express insured shipping to 19,000+ pin codes with live dispatch tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-fylter-primary border border-fylter-gold/30 text-fylter-gold">
              <ShieldCheck className="w-5 h-5 text-fylter-gold" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-fylter-offWhite">Quality Guaranteed</h4>
              <p className="text-xs text-fylter-muted mt-1">
                7-day replacement guarantee on defective units with hassle-free support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-10 overflow-hidden rounded border border-fylter-gold/30">
                <Image
                  src="/assets/fylter-logo.jpeg"
                  alt={`${siteSettings.name} Logo`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-base font-bold tracking-widest text-fylter-gold block">
                  {siteSettings.name.toUpperCase()}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-fylter-paleGold/80 block">
                  {siteSettings.tagline.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-sm text-fylter-muted max-w-sm leading-relaxed">
              {siteSettings.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-fylter-secondary border border-fylter-gold/30 text-xs font-medium text-fylter-paleGold hover:border-fylter-gold hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-fylter-gold" />
                <span>{siteSettings.instagramUsername}</span>
              </a>

              <a
                href={whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-xs font-medium text-emerald-300 hover:border-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{siteSettings.whatsappDisplayNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-fylter-gold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-fylter-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-fylter-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-fylter-gold transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-fylter-gold transition-colors">
                  About {siteSettings.name}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-fylter-gold transition-colors">
                  FAQ & Ordering
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-fylter-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-fylter-gold">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=Home+%26+Living" className="hover:text-fylter-gold transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Lifestyle+%26+Wellness" className="hover:text-fylter-gold transition-colors">
                  Lifestyle & Wellness
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Tech+Accessories" className="hover:text-fylter-gold transition-colors">
                  Tech Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Travel+%26+Outdoor" className="hover:text-fylter-gold transition-colors">
                  Travel & Outdoor
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-fylter-gold">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="hover:text-fylter-gold transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-fylter-gold transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-fylter-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-fylter-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-xs text-fylter-muted/80 leading-relaxed border-t border-fylter-border/20">
              <span className="font-semibold text-fylter-paleGold">Direct Order Model:</span> We do not collect credit cards or bank credentials on this website. All orders are confirmed personally with our team on WhatsApp or Instagram.
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-fylter-border/30 flex flex-col sm:flex-row items-center justify-between text-xs text-fylter-muted gap-4">
        <p>© {new Date().getFullYear()} {siteSettings.name.toUpperCase()}. {siteSettings.tagline}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-fylter-gold transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-fylter-gold transition-colors">
            Terms
          </Link>
          <Link href="/shipping" className="hover:text-fylter-gold transition-colors">
            Shipping
          </Link>
          <span className="text-fylter-gold/60">•</span>
          <span>Engineered with Purity</span>
        </div>
      </div>
    </footer>
  );
}
