"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteConfig as defaultSiteConfig, type SiteConfig } from "@/config/site";
import { products as defaultProducts, type Product } from "@/data/products";

// ─── Editable Site Config ────────────────────────────────────────
interface AdminContextValue {
  siteSettings: SiteConfig;
  products: Product[];
  updateSiteSettings: (updates: Partial<SiteConfig>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetSiteSettings: () => void;
  resetProducts: () => void;
  resetAll: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const STORAGE_KEY_SITE = "fylter_admin_site_settings";
const STORAGE_KEY_PRODUCTS = "fylter_admin_products";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteConfig>(defaultSiteConfig);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedSite = localStorage.getItem(STORAGE_KEY_SITE);
      if (storedSite) {
        const parsed = JSON.parse(storedSite);
        setSiteSettings({ ...defaultSiteConfig, ...parsed });
      }
    } catch {
      // Ignore parsing errors
    }

    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch {
      // Ignore parsing errors
    }

    setIsHydrated(true);
  }, []);

  // Persist site settings to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_SITE, JSON.stringify(siteSettings));
    }
  }, [siteSettings, isHydrated]);

  // Persist products to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    }
  }, [products, isHydrated]);

  const updateSiteSettings = useCallback((updates: Partial<SiteConfig>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const resetSiteSettings = useCallback(() => {
    setSiteSettings(defaultSiteConfig);
    localStorage.removeItem(STORAGE_KEY_SITE);
  }, []);

  const resetProducts = useCallback(() => {
    setProducts(defaultProducts);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
  }, []);

  const resetAll = useCallback(() => {
    resetSiteSettings();
    resetProducts();
  }, [resetSiteSettings, resetProducts]);

  return (
    <AdminContext.Provider
      value={{
        siteSettings,
        products,
        updateSiteSettings,
        updateProduct,
        addProduct,
        deleteProduct,
        resetSiteSettings,
        resetProducts,
        resetAll,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}

/**
 * Hook to get site settings from admin context.
 * Can be used in any client component.
 */
export function useSiteSettings(): SiteConfig {
  const { siteSettings } = useAdmin();
  return siteSettings;
}

/**
 * Hook to get products from admin context.
 * Can be used in any client component.
 */
export function useProducts(): Product[] {
  const { products } = useAdmin();
  return products;
}
