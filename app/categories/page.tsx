import React from "react";
import Link from "next/link";
import Image from "next/image";
import { products, categoryMeta } from "@/data/products";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Categories",
  description: "Browse Fylter products organized by collection and filtration application.",
};

export default function CategoriesPage() {

  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fylter-secondary border border-fylter-gold/30 text-xs text-fylter-gold font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fylter-offWhite tracking-tight">
            Browse By <span className="gold-gradient-text">Category</span>
          </h1>
          <p className="text-sm sm:text-base text-fylter-muted mt-2">
            Targeted filtration engineered for every dimension of modern living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoryMeta.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;

            return (
              <div
                key={cat.name}
                className="group relative rounded-2xl overflow-hidden border border-fylter-border/50 hover:border-fylter-gold/60 transition-all duration-300 bg-fylter-secondary/40 shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fylter-darkest via-fylter-darkest/40 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-fylter-darkest/80 backdrop-blur-md border border-fylter-border/60 text-xs font-semibold text-fylter-paleGold">
                    {count} Products
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-fylter-offWhite group-hover:text-fylter-gold transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-fylter-muted mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-fylter-border/30 flex items-center justify-between">
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-fylter-gold hover:text-fylter-lightGold transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
