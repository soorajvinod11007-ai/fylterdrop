"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl, shippingPolicy } from "@/config/site";
import { Instagram, MessageCircle, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { siteSettings } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappSupportUrl = getWhatsAppSupportUrl(undefined, {
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  return (
    <>
      <div className="site-announcement">
        <span className="site-announcement__mark" aria-hidden="true" />
        <span>Little things for a lovelier everyday</span>
        <span className="site-announcement__divider" aria-hidden="true">/</span>
        <span>
          Free shipping on orders ₹{shippingPolicy.freeShippingMinimum}+
          {" · "}Delivery {shippingPolicy.deliveryTime}
          {" · "}COD charge ₹{shippingPolicy.cashOnDeliveryCharge}
        </span>
      </div>
      <header className={`site-nav glass-nav ${isScrolled ? "site-nav--scrolled" : ""}`}>
        <div className="site-nav__inner">
          <Link href="/" className="site-brand" aria-label={`${siteSettings.name} home`}>
            <span className="site-brand__image">
              <Image
                src="/assets/fylter-logo.jpeg"
                alt=""
                fill
                priority
                sizes="112px"
                className="object-cover"
              />
            </span>
            <span className="site-brand__copy">
              <span className="site-brand__name">{siteSettings.name}</span>
              <span className="site-brand__tagline">{siteSettings.tagline}</span>
            </span>
          </Link>

          <div className="site-nav__actions">
            <Link href="/shop" aria-label="Search catalog" className="site-nav__icon-link">
              <Search aria-hidden="true" />
            </Link>
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteSettings.name} on Instagram`}
              className="site-nav__icon-link"
            >
              <Instagram aria-hidden="true" />
            </a>
            <ThemeToggle />
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order directly on WhatsApp"
              className="site-nav__order"
            >
              <MessageCircle aria-hidden="true" />
              <span>Order direct</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
