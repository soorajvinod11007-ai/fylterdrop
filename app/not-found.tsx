import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, getWhatsAppSupportUrl } from "@/config/site";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-fylter-darkest flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Brand Logo */}
        <div className="relative w-28 h-10 mx-auto overflow-hidden rounded border border-fylter-gold/40">
          <Image
            src="/assets/fylter-logo.jpeg"
            alt="FYLTER"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-fylter-gold">404</span>
          <h1 className="text-2xl font-bold text-fylter-offWhite">
            Page or Product Not Found
          </h1>
          <p className="text-xs sm:text-sm text-fylter-muted">
            The page you are looking for may have been moved, renamed, or is currently out of stock in our active catalog.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-fylter-gold text-fylter-darkest font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-fylter-secondary border border-fylter-gold/40 text-fylter-paleGold hover:text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-fylter-border/30">
          <a
            href={getWhatsAppSupportUrl("Help locating a product")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-fylter-gold hover:underline inline-flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Looking for a specific item? Message us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
