import React from "react";
import { Sparkles } from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";

export const metadata = {
  title: "Categories",
  description: "Explore Fylter's aesthetic stationery, cute novelty, and smart everyday collections.",
};

export default function CategoriesPage() {

  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fylter-secondary border border-fylter-gold/30 text-xs text-fylter-gold font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Little collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fylter-offWhite tracking-tight">
            Browse by <span className="gold-gradient-text">mood</span>
          </h1>
          <p className="text-sm sm:text-base text-fylter-muted mt-2">
            Find your next favourite in a little corner made just for you.
          </p>
        </div>

        <CategoryGrid />
      </div>
    </div>
  );
}
