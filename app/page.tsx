"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useAdmin } from "@/context/AdminContext";
import { categoryMeta, getProductPath } from "@/data/products";
import { ArrowRight, Baby, Gift, Palette, Sparkles, Zap } from "lucide-react";

type HomeMode = "discover" | "kids";

const categoryDetails = [
  { icon: Palette, note: "Make your desk a happy place", color: "stationery" },
  { icon: Gift, note: "Small surprises, big smiles", color: "novelty" },
  { icon: Zap, note: "Clever finds for every day", color: "everyday" },
];

export default function HomePage() {
  const { products, catalogStorage } = useAdmin();
  const [mode, setMode] = useState<HomeMode>("discover");
  const kidsProducts = products.filter((product) => product.kidsCollection);
  const heroProduct =
    mode === "kids" ? kidsProducts[0] : products.find((product) => product.featured) ?? products[0];

  if (catalogStorage === "loading") {
    return (
      <div className="homepage flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-fylter-muted" role="status" aria-live="polite">
          Loading the latest collection…
        </p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <section className="home-hero">
        <div className="home-container">
          <div className="home-hero__grid">
            <div className="home-hero__copy">
              <span className="home-eyebrow">
                <Sparkles aria-hidden="true" />
                Little finds. Big happy.
              </span>
              <h1>
                Good things for your <em>little world.</em>
              </h1>
              <p className="home-hero__description">
                A happy place for pretty paper, feel-good finds, and clever things for every day.
              </p>

              <div className="home-mode-switch" aria-label="Choose a collection">
                <button
                  type="button"
                  className={`home-mode-switch__button ${mode === "discover" ? "is-active" : ""}`}
                  aria-pressed={mode === "discover"}
                  onClick={() => setMode("discover")}
                >
                  <Sparkles aria-hidden="true" />
                  Shop the edit
                </button>
                <button
                  type="button"
                  className={`home-mode-switch__button ${mode === "kids" ? "is-active" : ""}`}
                  aria-pressed={mode === "kids"}
                  onClick={() => setMode("kids")}
                >
                  <Baby aria-hidden="true" />
                  Kids corner
                </button>
              </div>
            </div>

            <Link
              href={heroProduct ? getProductPath(heroProduct) : "/shop"}
              className={`home-hero__visual ${
                (mode === "kids" && !kidsProducts.length) || !heroProduct?.images[0]
                  ? "home-hero__visual--kids"
                  : ""
              }`}
              aria-label={heroProduct ? `View ${heroProduct.name}` : "Browse the shop"}
            >
              {heroProduct?.images[0] ? (
                <Image
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 960px) 100vw, 52vw"
                  className="home-hero__image"
                />
              ) : (
                <div className="home-kids-art">
                  <span className="home-kids-art__sparkle home-kids-art__sparkle--one" aria-hidden="true">
                    <Sparkles />
                  </span>
                  <span className="home-kids-art__sparkle home-kids-art__sparkle--two" aria-hidden="true">
                    <Sparkles />
                  </span>
                  <span className="home-kids-art__icon" aria-hidden="true">
                    {mode === "kids" ? <Baby /> : <Sparkles />}
                  </span>
                  <strong>
                    {mode === "kids"
                      ? <>Little things<br />for little wonders</>
                      : <>Your next favourite<br />is on its way</>}
                  </strong>
                </div>
              )}
              <span className="home-hero__stamp" aria-hidden="true">
                {mode === "kids" ? "A little joy for little people" : "Picked with a little love"}
              </span>
              <div className="home-hero__image-note">
                <div>
                  <small>{mode === "kids" ? "The Kids Corner" : "A happy little discovery"}</small>
                  <strong>
                    {mode === "kids"
                      ? "A little corner for big imaginations."
                      : "Everyday things, with a little extra feeling."}
                  </strong>
                </div>
                <span className="home-hero__flower" aria-hidden="true">
                  <Sparkles />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-discovery" aria-live="polite">
        <div className="home-container">
          {mode === "discover" ? (
            <>
              <div className="home-discovery__heading">
                <span className="home-section-label">A little something for everyone</span>
                <h2>What are you in the mood for?</h2>
                <p>Browse the little corners we think you’ll love.</p>
              </div>
              <div className="home-categories home-categories--discovery">
                {categoryMeta.map((category, index) => {
                  const details = categoryDetails[index];
                  const CategoryIcon = details.icon;
                  const categoryItems = products.filter(
                    (product) => product.category === category.name && !product.kidsCollection,
                  );

                  return (
                    <Link
                      key={category.name}
                      href={`/shop?category=${encodeURIComponent(category.name)}`}
                      className={`discovery-category discovery-category--${details.color}`}
                    >
                      {categoryItems[0]?.images[0] && (
                        <Image
                          src={categoryItems[0].images[0]}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 90vw, (max-width: 960px) 50vw, 33vw"
                        />
                      )}
                      <span className="discovery-category__sticker" aria-hidden="true">
                        <CategoryIcon />
                      </span>
                      <span className="discovery-category__number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="discovery-category__copy">
                        <span>{details.note}</span>
                        <strong>{category.name}</strong>
                        <span className="discovery-category__link">
                          Explore {categoryItems.length > 0 ? `(${categoryItems.length})` : ""}
                          <ArrowRight aria-hidden="true" />
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="home-discovery__heading">
                <span className="home-section-label">Made for little wonders</span>
                <h2>A little corner just for kids.</h2>
                <p>Fun, thoughtful finds for curious minds and busy little hands.</p>
              </div>
              {kidsProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                  {kidsProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="kids-empty-state">
                  <span className="kids-empty-state__icon" aria-hidden="true">
                    <Baby />
                  </span>
                  <h3>Our little collection is on its way.</h3>
                  <p>Check back soon for happy finds made just for kids.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
