"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getProductPath } from "@/data/products";
import {
  siteConfig,
  shippingPolicy,
  getWhatsAppOrderUrl,
  getWhatsAppSupportUrl,
} from "@/config/site";
import { useAdmin } from "@/context/AdminContext";
import ProductCard from "@/components/ProductCard";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { Badge } from "@/components/ui";
import {
  MessageCircle,
  Instagram,
  Copy,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Share2
} from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products: contextProducts, siteSettings, catalogStorage } = useAdmin();
  const product =
    contextProducts.find((p) => p.slug === slug) ||
    (catalogStorage !== "loading"
      ? contextProducts.find((p) => p.id === slug)
      : undefined);

  // State
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [copiedSku, setCopiedSku] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const initial: Record<string, string> = {};
    if (product?.variants) {
      product.variants.forEach((v) => {
        if (v.values.length > 0) initial[v.name] = v.values[0];
      });
    }
    setSelectedVariants(initial);
  }, [product]);

  if (!product && catalogStorage === "loading") {
    return (
      <div className="min-h-[75vh] bg-fylter-darkest flex items-center justify-center px-4">
        <p className="text-sm font-medium text-fylter-muted" role="status" aria-live="polite">
          Loading product…
        </p>
      </div>
    );
  }

  if (!product && catalogStorage === "error") {
    return (
      <div className="min-h-[75vh] bg-fylter-darkest flex items-center justify-center px-4">
        <p className="text-sm font-medium text-fylter-muted" role="alert">
          The product catalog is temporarily unavailable. Please try again later.
        </p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Variant string for WhatsApp message
  const variantString = Object.entries(selectedVariants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const productUrl = `${siteSettings.url || siteConfig.url}${getProductPath(product)}`;

  // WhatsApp order link with dynamic details
  const whatsappOrderUrl = getWhatsAppOrderUrl({
    productName: product.name,
    sku: product.sku,
    price: product.price,
    selectedVariant: variantString || undefined,
    productUrl,
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  const copyToClipboard = (text: string, type: "sku" | "link") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "sku") {
        setCopiedSku(true);
        setTimeout(() => setCopiedSku(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const relatedProducts = contextProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.slug !== product.slug &&
        candidate.category === product.category,
    )
    .slice(0, 4);
  const comboProducts = product.isCombo
    ? contextProducts.filter((candidate) => product.comboProductIds?.includes(candidate.id))
    : [];

  return (
    <div className="min-h-screen bg-fylter-darkest pb-24 sm:pb-28">
      {/* Breadcrumbs */}
      <div className="border-b border-fylter-border/30 bg-fylter-darkest/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-fylter-muted overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-fylter-gold whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hover:text-fylter-gold whitespace-nowrap">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-fylter-gold whitespace-nowrap"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-fylter-paleGold truncate font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ==================================================
              LEFT: PRODUCT GALLERY
          ================================================== */}
          <div className="lg:col-span-7 space-y-4">
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
            />

            <div className="flex flex-wrap gap-2">
              {product.discount && <Badge variant="gold">{product.discount}% OFF</Badge>}
              <Badge variant="pill">{product.stockStatus}</Badge>
            </div>

            {/* Trust highlights under gallery */}
            <div className="pt-6 border-t border-fylter-border/30 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-fylter-secondary/20 border border-fylter-border/30">
                <Truck className="w-5 h-5 text-fylter-gold mx-auto mb-1.5" />
                <span className="text-xs font-medium text-fylter-offWhite block">Pan-India Express</span>
                <span className="text-[10px] text-fylter-muted block">{shippingPolicy.deliveryTime}</span>
              </div>
              <div className="p-3 rounded-xl bg-fylter-secondary/20 border border-fylter-border/30">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span className="text-xs font-medium text-fylter-offWhite block">Quality Tested</span>
                <span className="text-[10px] text-fylter-muted block">100% Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-fylter-secondary/20 border border-fylter-border/30">
                <RotateCcw className="w-5 h-5 text-fylter-gold mx-auto mb-1.5" />
                <span className="text-xs font-medium text-fylter-offWhite block">Replacement Policy</span>
                <span className="text-[10px] text-fylter-muted block">7-Day Coverage</span>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT: PRODUCT INFO & ORDER ACTIONS
          ================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-fylter-gold">
                  {product.category}
                </span>

                {product.rating && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fylter-secondary border border-fylter-gold/30 text-xs text-fylter-paleGold">
                    <Star className="w-3.5 h-3.5 fill-fylter-gold text-fylter-gold" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-fylter-muted">({product.reviewsCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-fylter-offWhite leading-snug">
                {product.name}
              </h1>

              {/* SKU & Copy Interaction */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-fylter-muted">
                  SKU: <strong className="text-fylter-paleGold font-mono">{product.sku}</strong>
                </span>

                <button
                  onClick={() => copyToClipboard(product.sku, "sku")}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-fylter-secondary/80 border border-fylter-border/50 text-fylter-gold hover:border-fylter-gold transition-colors"
                  title="Copy SKU for Instagram DM"
                >
                  {copiedSku ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Product Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(typeof window !== "undefined" ? window.location.href : "", "link")}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded text-fylter-muted hover:text-fylter-gold transition-colors"
                  title="Share product link"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                  <span>{copiedLink ? "Link Copied" : "Share"}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-fylter-border/30 flex items-baseline gap-3">
                <span className="price-display text-3xl sm:text-4xl">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.oldPrice && (
                  <span className="price-original text-lg">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {product.discount && (
                  <Badge variant="emerald">Save {product.discount}%</Badge>
                )}
              </div>

              <p className="mt-3 text-sm text-fylter-muted leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Variant Selectors (Color / Size / Finish) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-fylter-border/30">
                {product.variants.map((variant) => (
                  <div key={variant.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-fylter-offWhite">
                        Select {variant.name}:
                      </span>
                      <span className="text-fylter-gold font-bold">
                        {selectedVariants[variant.name]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {variant.values.map((val) => {
                        const isSelected = selectedVariants[variant.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: val,
                              }))
                            }
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                              isSelected
                                ? "btn-3d-gold text-fylter-darkest shadow-md"
                                : "glass-pill text-fylter-offWhite hover:text-fylter-gold hover:border-fylter-gold/50"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct Social Order Call to Actions */}
            <div className="space-y-3.5 pt-5 border-t border-fylter-border/30">
              <p className="text-center text-xs text-fylter-muted">
                Free shipping on orders ₹{shippingPolicy.freeShippingMinimum} and above.
                Orders below ₹{shippingPolicy.freeShippingMinimum} have a ₹{shippingPolicy.lowOrderHandlingCharge} handling charge.
                COD adds ₹{shippingPolicy.cashOnDeliveryCharge}.
              </p>
              {/* PRIMARY CTA: ORDER ON WHATSAPP (3D Physical Button) */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-whatsapp w-full py-4 px-6 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3 text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Order On WhatsApp</span>
              </a>

              {/* SECONDARY CTA: ORDER ON INSTAGRAM */}
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl glass-panel hover:bg-fylter-surface text-fylter-gold border border-fylter-gold/40 hover:border-fylter-gold font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 text-center shadow-lg"
              >
                <Instagram className="w-4 h-4 text-fylter-gold" />
                <span>Order On Instagram</span>
              </a>

              {/* Instagram Helper Note */}
              <p className="text-center text-[11px] text-fylter-muted">
                Tip for Instagram: Copy the product SKU (<code className="text-fylter-gold font-mono font-bold">{product.sku}</code>) or take a screenshot and send it to our DM.
              </p>

              {/* Chat Support Inquirer */}
              <div className="text-center pt-1">
                <a
                  href={getWhatsAppSupportUrl(product.name, {
                    whatsappNumber: siteSettings.whatsappNumber,
                    brandName: siteSettings.name,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fylter-gold hover:underline inline-flex items-center gap-1.5 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Need help deciding? Message our specialists on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Features Accordion / Highlights */}
            <div className="pt-6 border-t border-fylter-border/30 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-fylter-gold">
                Key Features
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-fylter-muted">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-fylter-gold shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table with Glass Card */}
            <div className="pt-6 border-t border-fylter-border/30 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-fylter-gold">
                Technical Specifications
              </h3>
              <div className="rounded-2xl overflow-hidden glass-card divide-y divide-fylter-border/20 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-3.5 bg-fylter-secondary/10">
                    <span className="font-medium text-fylter-muted">{key}</span>
                    <span className="text-fylter-offWhite font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Full Description */}
        <div className="mt-16 pt-12 border-t border-fylter-border/30 max-w-4xl">
          <h2 className="text-2xl font-bold text-fylter-offWhite mb-4">
            Product Overview & Purity Standards
          </h2>
          <div className="prose prose-invert text-sm text-fylter-muted leading-relaxed space-y-4">
            <p>{product.description}</p>
            <p>
              At Fylter, we prioritize uncompromising material safety. Every component coming into contact with air or water is certified BPA-free, lead-free, and tested against rigorous degradation standards under varying room temperatures and hard water parameters.
            </p>
          </div>
        </div>

        {product.isCombo && comboProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-fylter-border/30">
            <div className="mb-8">
              <span className="section-label">Included in this combo</span>
              <h2 className="mt-2 text-2xl font-extrabold text-fylter-offWhite">
                {comboProducts.length} {comboProducts.length === 1 ? "product" : "products"}, one bundle
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {comboProducts.map((comboProduct) => (
                <ProductCard key={comboProduct.id} product={comboProduct} />
              ))}
            </div>
          </section>
        )}

        {/* ==================================================
            RELATED PRODUCTS
        ================================================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-fylter-border/30">
          <div className="flex items-center justify-between mb-8">
              <div>
                <span className="section-label">Complementary Finds</span>
                <h2 className="text-2xl font-extrabold text-fylter-offWhite mt-2">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-fylter-gold hover:underline"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================================================
          STICKY MOBILE ORDER BAR (Requirement 18 - 3D Glassmorphism)
      ================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav p-3 sm:px-6 shadow-[0_-10px_30px_rgba(4,23,25,0.7)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-fylter-muted uppercase tracking-wider font-semibold">Total Price</span>
            <span className="sticky-product-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on Instagram"
              className="p-3 rounded-xl glass-pill text-fylter-gold hover:text-white transition-colors flex items-center justify-center shadow-md"
              title="Instagram DM"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-whatsapp py-3 px-5 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 flex-1 max-w-[240px] text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
