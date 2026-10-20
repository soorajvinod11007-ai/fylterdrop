"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { getWhatsAppOrderUrl, siteConfig } from "@/config/site";
import { useAdmin } from "@/context/AdminContext";
import { MessageCircle, ArrowUpRight, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { siteSettings } = useAdmin();
  const whatsappUrl = getWhatsAppOrderUrl({
    productName: product.name,
    sku: product.sku,
    price: product.price,
    selectedVariant: product.variants?.[0]?.values?.[0],
    productUrl: `${siteSettings.url || siteConfig.url}/products/${product.slug}`,
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  return (
    <div className="perspective-container">
      <div className="group relative rounded-2xl glass-card card-3d glass-shimmer flex flex-col overflow-hidden">
        {/* Product Image Container with 3D Depth */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full aspect-square overflow-hidden bg-fylter-darkest/80"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Frosted Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-fylter-darkest/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* 3D Pop-out Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 layer-depth-2">
            {product.discount && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-gradient-to-r from-fylter-gold to-fylter-lightGold text-fylter-darkest tracking-wider uppercase shadow-md border border-fylter-paleGold/50">
                {product.discount}% OFF
              </span>
            )}
            {product.newArrival && (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold glass-pill text-fylter-paleGold tracking-wider uppercase">
                New Arrival
              </span>
            )}
          </div>

          {/* 3D Glass Rating Badge */}
          {product.rating && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full glass-pill text-[11px] text-fylter-paleGold layer-depth-1">
              <Star className="w-3 h-3 fill-fylter-gold text-fylter-gold drop-shadow-[0_0_4px_rgba(197,165,102,0.8)]" />
              <span className="font-bold">{product.rating}</span>
            </div>
          )}
        </Link>

        {/* Product Information */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 layer-depth-1">
          <div>
            {/* Category */}
            <span className="text-[11px] font-semibold uppercase tracking-widest text-fylter-gold/90 block">
              {product.category}
            </span>

            {/* Product Name */}
            <Link
              href={`/products/${product.slug}`}
              className="mt-1 block text-sm sm:text-base font-bold text-fylter-offWhite group-hover:text-fylter-gold transition-colors line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>

            {/* Short Description */}
            <p className="mt-1 text-xs text-fylter-muted line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Price & 3D Interactive Actions */}
          <div className="product-card__purchase-row pt-3 border-t border-fylter-border/30 flex items-center justify-between gap-2">
            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-fylter-offWhite">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-fylter-muted/80 line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                Free Express Delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="product-card__actions flex items-center gap-2">
              {/* 3D Physical WhatsApp Order Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card__action btn-3d-whatsapp p-2.5 rounded-xl text-white flex items-center justify-center"
                title="Order on WhatsApp"
                aria-label={`Order ${product.name} on WhatsApp`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* View Product Details Button */}
              <Link
                href={`/products/${product.slug}`}
                className="product-card__action p-2.5 rounded-xl glass-pill text-fylter-paleGold hover:text-fylter-darkest hover:bg-fylter-gold transition-all duration-300 flex items-center justify-center"
                title="View Product Details"
                aria-label={`View details for ${product.name}`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
