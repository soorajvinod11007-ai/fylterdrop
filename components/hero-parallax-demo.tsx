"use client";

import React from "react";
import {
  HeroParallax,
  type HeroParallaxProduct,
} from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo({
  products,
  header,
}: {
  products: HeroParallaxProduct[];
  header?: React.ReactNode;
}) {
  return <HeroParallax products={products} header={header} />;
}
