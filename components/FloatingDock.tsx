"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  Grid2X2,
  House,
  Info,
  Mail,
  ShoppingBag,
} from "lucide-react";

const dockLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Categories", href: "/categories", icon: Grid2X2 },
  { label: "About", href: "/about", icon: Info },
  { label: "FAQ", href: "/faq", icon: CircleHelp },
  { label: "Contact", href: "/contact", icon: Mail },
];

export default function FloatingDock() {
  const pathname = usePathname();

  return (
    <nav className="floating-dock" aria-label="Main navigation">
      {dockLinks.map(({ label, href, icon: Icon }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            title={label}
            className={`floating-dock__item${isActive ? " is-active" : ""}`}
          >
            <Icon aria-hidden="true" />
            <span className="floating-dock__label" aria-hidden="true">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
