"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Palette, Zap } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { categoryMeta } from "@/data/products";

const categoryDetails = [
  { icon: Palette, note: "Make your desk a happy place", color: "stationery" },
  { icon: Gift, note: "Small surprises, big smiles", color: "novelty" },
  { icon: Zap, note: "Clever finds for every day", color: "everyday" },
];

export default function CategoryGrid() {
  const { products } = useAdmin();

  return (
    <div className="home-categories home-categories--discovery">
      {categoryMeta.map((category, index) => {
        const details = categoryDetails[index];
        const CategoryIcon = details.icon;
        const categoryProducts = products.filter(
          (product) => product.category === category.name && !product.kidsCollection,
        );

        return (
          <Link
            key={category.name}
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            className={`discovery-category discovery-category--${details.color}`}
          >
            <Image
              src={categoryProducts[0]?.images[0] || category.image}
              alt=""
              fill
              unoptimized={Boolean(categoryProducts[0]?.images[0])}
              sizes="(max-width: 640px) 90vw, (max-width: 960px) 50vw, 33vw"
            />
            <span className="discovery-category__sticker" aria-hidden="true">
              <CategoryIcon />
            </span>
            <span className="discovery-category__copy">
              <span>{details.note}</span>
              <strong>{category.name}</strong>
              <span className="discovery-category__link">
                Explore {categoryProducts.length > 0 ? `(${categoryProducts.length})` : ""}
                <ArrowRight aria-hidden="true" />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
