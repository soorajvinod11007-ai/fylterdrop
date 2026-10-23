"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductPath, type Product } from "@/data/products";
import { getWhatsAppOrderUrl, siteConfig } from "@/config/site";
import { useAdmin } from "@/context/AdminContext";
import { ArrowUpRight, MessageCircle, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { siteSettings } = useAdmin();
  const productPath = getProductPath(product);
  const whatsappUrl = getWhatsAppOrderUrl({
    productName: product.name,
    sku: product.sku,
    price: product.price,
    selectedVariant: product.variants?.[0]?.values?.[0],
    productUrl: `${siteSettings.url || siteConfig.url}${productPath}`,
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  return (
    <article className="discovery-card">
      <Link
        href={productPath}
        className="discovery-card__image"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center"
        />
        <span className="discovery-card__category">{product.category}</span>
        {product.discount ? (
          <span className="discovery-card__badge">{product.discount}% off</span>
        ) : null}
        {product.rating ? (
          <span className="discovery-card__rating">
            <Star aria-hidden="true" />
            {product.rating}
          </span>
        ) : null}
      </Link>

      <div className="discovery-card__body">
        <div className="discovery-card__copy">
          <Link href={productPath} className="discovery-card__title">
            {product.name}
          </Link>
          {product.isCombo && (
            <span className="inline-flex w-fit rounded-full bg-fylter-gold/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-fylter-gold">
              Combo · {product.comboProductIds?.length ?? 0} items
            </span>
          )}
          <p>{product.shortDescription}</p>
        </div>
        <div className="discovery-card__purchase">
          <div className="discovery-card__price">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            {product.oldPrice ? (
              <del>₹{product.oldPrice.toLocaleString("en-IN")}</del>
            ) : null}
          </div>
          <div className="discovery-card__actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="discovery-card__action discovery-card__action--whatsapp"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <MessageCircle aria-hidden="true" />
            </a>
            <Link
              href={productPath}
              className="discovery-card__action discovery-card__action--details"
              aria-label={`See details for ${product.name}`}
            >
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
