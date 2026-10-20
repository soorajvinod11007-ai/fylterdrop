"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Badge, Input } from "@/components/ui";
import { useAdmin } from "@/context/AdminContext";
import { categories } from "@/data/products";
import { Search, X, ArrowUpDown, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────
   Loading skeleton shown while suspending
───────────────────────────────────────────── */
function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-48 skeleton mx-auto mb-10 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main shop content
───────────────────────────────────────────── */
function ShopContent() {
  const { products, siteSettings } = useAdmin();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const initialCategory =
    categories.find((category) => category === requestedCategory) ?? "All";
  const requestedFilter = searchParams.get("filter");
  const initialFilter =
    requestedFilter === "new" ||
    requestedFilter === "trending" ||
    requestedFilter === "featured"
      ? requestedFilter
      : "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<
    "featured" | "price-asc" | "price-desc" | "newest"
  >("featured");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>(initialFilter);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setActiveQuickFilter(initialFilter);
  }, [initialCategory, initialFilter]);

  /* ── Filtering + sorting ── */
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (
            !product.name.toLowerCase().includes(q) &&
            !product.category.toLowerCase().includes(q) &&
            !product.sku.toLowerCase().includes(q) &&
            !product.shortDescription.toLowerCase().includes(q)
          )
            return false;
        }
        if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
        if (activeQuickFilter === "new" && !product.newArrival) return false;
        if (activeQuickFilter === "trending" && !product.trending) return false;
        if (activeQuickFilter === "featured" && !product.featured) return false;
        if (product.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "newest") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [searchQuery, selectedCategory, selectedSort, activeQuickFilter, maxPrice, products]);

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All" || activeQuickFilter || maxPrice < 5000;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setActiveQuickFilter("");
    setSelectedSort("featured");
    setMaxPrice(5000);
  };

  return (
    <div className="min-h-screen bg-fylter-darkest py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in">
          <span className="section-label mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Pure Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fylter-offWhite tracking-tight mt-3">
            Explore <span className="gold-gradient-text">Fylter</span>
          </h1>
          <p className="text-sm sm:text-base text-fylter-muted mt-2">
            Find something that fits your everyday. All products verified for quality and direct
            WhatsApp ordering.
          </p>
        </div>

        {/* ── Filter Toolbar ── */}
        <div className="p-5 sm:p-7 rounded-3xl glass-panel mb-10 space-y-5 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="relative md:col-span-6">
              <Input
                id="shop-search"
                type="text"
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU (e.g. FYL-001), or keywords..."
                icon={<Search className="w-4 h-4" />}
                className={searchQuery ? "pr-11" : ""}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fylter-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="md:col-span-3 relative">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fylter-gold pointer-events-none z-10" />
              <select
                id="shop-sort"
                aria-label="Sort products"
                value={selectedSort}
                onChange={(event) => {
                  const value = event.target.value;
                  if (
                    value === "featured" ||
                    value === "price-asc" ||
                    value === "price-desc" ||
                    value === "newest"
                  ) {
                    setSelectedSort(value);
                  }
                }}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-fylter-darkest/90 border border-fylter-border/70 text-fylter-offWhite text-sm focus:outline-none focus:border-fylter-gold appearance-none cursor-pointer shadow-inner transition-colors"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals First</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="md:col-span-3 flex flex-col justify-center px-2">
              <div className="flex justify-between text-xs text-fylter-muted mb-1.5">
                <span>Max Price:</span>
                <span className="font-bold text-fylter-gold">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                aria-label="Maximum price"
                min="800"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-fylter-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Category pills + quick filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-fylter-border/30">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all focus-ring ${
                    selectedCategory === cat
                      ? "btn-3d-gold text-fylter-darkest shadow-md"
                      : "glass-pill text-fylter-offWhite/80 hover:text-fylter-gold hover:border-fylter-gold/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick status filters using Badge logic */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveQuickFilter(activeQuickFilter === "new" ? "" : "new")
                }
                aria-pressed={activeQuickFilter === "new"}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring ${
                  activeQuickFilter === "new"
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-400 shadow-sm"
                    : "glass-pill text-fylter-muted hover:text-white"
                }`}
              >
                New Arrivals
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveQuickFilter(activeQuickFilter === "trending" ? "" : "trending")
                }
                aria-pressed={activeQuickFilter === "trending"}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring ${
                  activeQuickFilter === "trending"
                    ? "glass-gold text-fylter-paleGold border-fylter-gold shadow-sm"
                    : "glass-pill text-fylter-muted hover:text-white"
                }`}
              >
                Trending
              </button>
            </div>
          </div>
        </div>

        {/* ── Results bar ── */}
        <div
          className="flex items-center justify-between text-xs text-fylter-muted mb-6 px-1"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            Showing{" "}
            <strong className="text-fylter-offWhite">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {selectedCategory !== "All" && (
              <>
                {" "}in{" "}
                <Badge variant="pill" className="ml-1 align-middle">
                  {selectedCategory}
                </Badge>
              </>
            )}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-fylter-gold hover:underline font-semibold transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* ── Product Grid ── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-fylter-primary border border-fylter-gold/30 flex items-center justify-center text-fylter-gold mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-fylter-offWhite">No products found</h3>
            <p className="text-xs text-fylter-muted mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any products matching your current filters. Try changing your
              search query or reset filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-3d-gold mt-5 px-6 py-2 rounded-lg font-semibold text-xs"
            >
              Reset Filters &amp; Browse All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page export (wrapped in Suspense for params)
───────────────────────────────────────────── */
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
