"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SmoothScroll from "@/components/SmoothScroll";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { useAdmin } from "@/context/AdminContext";

const loadingStates = [
  { text: "VIsit our instagram for special discounts" },
  { text: "Curating a happy little collection" },
  { text: "Getting your Fylter favorites ready" },
];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { catalogStorage } = useAdmin();
  const [minimumLoadingTimeElapsed, setMinimumLoadingTimeElapsed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMinimumLoadingTimeElapsed(true), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={
          !isAdmin &&
          (catalogStorage === "loading" || !minimumLoadingTimeElapsed)
        }
        duration={800}
        loop={false}
      />
      <SmoothScroll />
      {isAdmin ? (
        children
      ) : (
        <div className="storefront-shell">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      )}
    </>
  );
}
