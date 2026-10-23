"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl, shippingPolicy } from "@/config/site";
import { Instagram, Menu, MessageCircle, Search, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { siteSettings } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

          <nav className="site-nav__links" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`site-nav__link ${isActive ? "is-active" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
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
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav__order"
            >
              <MessageCircle aria-hidden="true" />
              <span>Order direct</span>
            </a>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="site-nav__menu-button"
            >
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav id="mobile-navigation" className="site-nav__mobile" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`site-nav__mobile-link ${pathname === link.href ? "is-active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="site-nav__mobile-actions">
              <a href={whatsappSupportUrl} target="_blank" rel="noopener noreferrer" className="site-nav__order">
                <MessageCircle aria-hidden="true" />
                <span>Order directly on WhatsApp</span>
              </a>
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="site-nav__mobile-social">
                <Instagram aria-hidden="true" />
                <span>{siteSettings.instagramUsername}</span>
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
