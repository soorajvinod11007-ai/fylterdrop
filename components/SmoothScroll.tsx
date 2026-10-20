"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) lenis.stop();
      else lenis.start();
    };
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      reducedMotion.removeEventListener("change", handleMotionChange);
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
