"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ThreeHero from "@/components/ThreeHero";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl } from "@/config/site";
import { categoryMeta } from "@/data/products";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  Instagram,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { siteSettings, products } = useAdmin();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const trendingProducts = products.filter((product) => product.trending).slice(0, 4);
  const whatsappSupportUrl = getWhatsAppSupportUrl(undefined, {
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP, ScrollTrigger);
      const root = pageRef.current;
      if (!root) return;

      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".home-hero__copy", {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
          ease: "power2.out",
        });

        gsap.from(".home-hero__visual", {
          autoAlpha: 0,
          y: 18,
          duration: 1,
          delay: 0.12,
          ease: "power2.out",
        });

        gsap.to(".home-hero__visual", {
          yPercent: 5,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: ".home-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        root.querySelectorAll<HTMLElement>("[data-scroll-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                once: true,
              },
            },
          );
        });

        const chapter = root.querySelector<HTMLElement>("[data-home-values-chapter]");
        const viewport = root.querySelector<HTMLElement>("[data-home-values-viewport]");
        const track = root.querySelector<HTMLElement>("[data-home-values-track]");

        if (chapter && viewport && track) {
          const desktop = gsap.matchMedia();
          desktop.add("(min-width: 960px)", () => {
            viewport.classList.add("is-pinned");
            const getDistance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

            if (getDistance() > 0) {
              gsap.to(track, {
                x: () => -getDistance(),
                ease: "none",
                scrollTrigger: {
                  trigger: chapter,
                  pin: chapter,
                  start: "top top",
                  end: () => `+=${Math.max(getDistance(), window.innerHeight * 1.15)}`,
                  scrub: 1,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
            }

            return () => viewport.classList.remove("is-pinned");
          });

          return () => desktop.revert();
        }
      });

      return () => motion.revert();
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="homepage">
      <section className="home-hero">
        <div className="home-container">
          <div className="home-hero__grid">
            <div className="home-hero__copy">
              <span className="home-eyebrow">
                <Sparkles aria-hidden="true" />
                {siteSettings.name} <span aria-hidden="true">/</span> {siteSettings.tagline}
              </span>
              <h1>
                A more considered <em>everyday.</em>
              </h1>
              <p className="home-hero__description">
                {siteSettings.description}
              </p>
              <div className="home-hero__actions">
                <Link href="/shop" className="home-button-primary">
                  Explore the collection
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/about" className="home-button-secondary">
                  Our point of view
                </Link>
              </div>
            </div>

            <div className="home-hero__visual" data-scroll-hero-visual>
              <ThreeHero className="home-hero__canvas" />
              <div className="home-hero__image-note">
                <div>
                  <small>Interactive study / 01</small>
                  <strong>Form follows a finer balance.</strong>
                </div>
                <Link href="/shop" aria-label="Explore the collection">
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="home-proof" aria-label="Shopping benefits">
            <div className="home-proof__item">
              <Check aria-hidden="true" />
              <span>Independently curated essentials</span>
            </div>
            <div className="home-proof__item">
              <MessageCircle aria-hidden="true" />
              <span>Personal help before you order</span>
            </div>
            <div className="home-proof__item">
              <Truck aria-hidden="true" />
              <span>Delivery across India</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--dark">
        <div className="home-container">
          <div className="home-section__heading" data-scroll-reveal>
            <div>
              <span className="home-section-label">The edit / 01</span>
              <h2>Chosen with intention.</h2>
              <p>
                Fewer, better discoveries for the spaces you live in and the life you lead.
              </p>
            </div>
            <Link href="/shop" className="home-text-link">
              View all products <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" data-scroll-reveal>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="home-empty-state">
              Our next edit is being prepared. Explore the full collection in the meantime.
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-section--paper">
        <div className="home-container">
          <div className="home-section__heading" data-scroll-reveal>
            <div>
              <span className="home-section-label">Browse by context</span>
              <h2>Find your kind of better.</h2>
              <p>
                Thoughtful utility, organized around the places and routines that matter.
              </p>
            </div>
            <Link href="/categories" className="home-text-link">
              All categories <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="home-categories" data-scroll-reveal>
            {categoryMeta.map((category, index) => (
              <Link
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="home-category"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
                />
                <div className="home-category__copy">
                  <small>{String(index + 1).padStart(2, "0")} / Collection</small>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--paper home-values-chapter" data-home-values-chapter>
        <div className="home-container">
          <div className="home-section__heading" data-scroll-reveal>
            <div>
              <span className="home-section-label">The Fylter difference</span>
              <h2>Less noise. More considered choices.</h2>
            </div>
          </div>
          <div className="home-values__viewport" data-home-values-viewport>
            <div className="home-values" data-home-values-track>
              <article className="home-value">
                <Sparkles aria-hidden="true" />
                <h3>Curated, not crowded</h3>
                <p>Every find earns its place through usefulness, quality, and thoughtful design.</p>
              </article>
              <article className="home-value">
                <MessageCircle aria-hidden="true" />
                <h3>Real conversation</h3>
                <p>Ask questions and get personal guidance directly from our team.</p>
              </article>
              <article className="home-value">
                <ShieldCheck aria-hidden="true" />
                <h3>Clarity comes first</h3>
                <p>Understand the details, availability, and delivery before you decide.</p>
              </article>
              <article className="home-value">
                <Truck aria-hidden="true" />
                <h3>Delivered with care</h3>
                <p>Thoughtful finds, sent to homes across India with reliable support.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {trendingProducts.length > 0 && (
        <section className="home-section home-section--dark">
          <div className="home-container">
            <div className="home-section__heading" data-scroll-reveal>
              <div>
                <span className="home-section-label">A closer look / 02</span>
                <h2>What people are finding.</h2>
              </div>
              <Link href="/shop" className="home-text-link">
                Explore the shop <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" data-scroll-reveal>
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-section home-section--paper">
        <div className="home-container">
          <div className="home-final-cta" data-scroll-reveal>
            <div>
              <span className="home-section-label">A better way to discover</span>
              <h2>Good choices start with a conversation.</h2>
              <p>
                Need help finding the right fit? Talk to our team directly, or follow along for
                new arrivals and considered finds.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappSupportUrl} target="_blank" rel="noopener noreferrer" className="home-button-primary">
                <MessageCircle aria-hidden="true" />
                Talk to our team
              </a>
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="home-button-secondary">
                <Instagram aria-hidden="true" />
                Follow along
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
