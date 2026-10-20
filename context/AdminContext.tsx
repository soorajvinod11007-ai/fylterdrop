"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { siteConfig as defaultSiteConfig, type SiteConfig } from "@/config/site";
import {
  productCategories,
  products as defaultProducts,
  type Product,
  type ProductCategory,
} from "@/data/products";

// ─── Editable Site Config ────────────────────────────────────────
interface AdminContextValue {
  siteSettings: SiteConfig;
  products: Product[];
  catalogStorage: "loading" | "local" | "shared" | "saving" | "error";
  catalogError: string | null;
  retryCatalogSync: () => void;
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

const legacyCategoryMap: Record<string, ProductCategory> = {
  "Home & Living": "Smart Everyday",
  "Lifestyle & Wellness": "Smart Everyday",
  "Tech Accessories": "Smart Everyday",
  "Travel & Outdoor": "Smart Everyday",
};

function migrateProducts(storedProducts: unknown[]): Product[] {
  return storedProducts.map((storedProduct) => {
    if (!storedProduct || typeof storedProduct !== "object") {
      throw new Error("Saved product data is invalid.");
    }

    const product = storedProduct as Product;
    const category = product.category as string;
    const migratedCategory = legacyCategoryMap[category] ??
      (productCategories.includes(category as ProductCategory)
        ? (category as ProductCategory)
        : "Smart Everyday");

    return {
      ...product,
      category: migratedCategory,
      kidsCollection: product.kidsCollection ?? false,
    };
  });
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteConfig>(defaultSiteConfig);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [catalogStorage, setCatalogStorage] = useState<AdminContextValue["catalogStorage"]>("loading");
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const productsDirty = useRef(false);
  const sharedCatalogAvailable = useRef(false);
  const catalogRevision = useRef(0);
  const productsRef = useRef(products);
  const [syncAttempt, setSyncAttempt] = useState(0);
  productsRef.current = products;

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedSite = localStorage.getItem(STORAGE_KEY_SITE);
      if (storedSite) {
        const parsed = JSON.parse(storedSite);
        const nextSettings = { ...defaultSiteConfig, ...parsed };
        if (nextSettings.tagline === "Purely Filters") {
          nextSettings.tagline = defaultSiteConfig.tagline;
        }
        if (
          nextSettings.description ===
          "Curated everyday essentials, aesthetic finds, and high-performance filters worth bringing home."
        ) {
          nextSettings.description = defaultSiteConfig.description;
        }
        setSiteSettings(nextSettings);
      }
    } catch {
      // Ignore parsing errors
    }

    let localProducts = defaultProducts;
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localProducts = migrateProducts(parsed);
        }
      }
    } catch {
      console.error("[Catalog] Saved browser catalog could not be loaded.");
    }

    void fetch("/api/catalog", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "The catalog could not be loaded from the server.");
        }

        if (data.shared === true && Array.isArray(data.products)) {
          const sharedProducts = migrateProducts(data.products);
          setProducts(sharedProducts);
          sharedCatalogAvailable.current = true;
          productsDirty.current = false;
          setCatalogStorage("shared");
          setCatalogError(null);
        } else {
          setProducts(localProducts);
          setCatalogStorage("local");
        }
      })
      .catch((error: unknown) => {
        console.error("[Catalog] Shared catalog is unavailable:", error);
        setProducts(localProducts);
        setCatalogStorage("error");
        setCatalogError(
          error instanceof Error ? error.message : "The shared catalog is unavailable.",
        );
      })
      .finally(() => setIsHydrated(true));
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

  useEffect(() => {
    if (!isHydrated || !productsDirty.current) return;

    if (
      catalogStorage === "saving" ||
      catalogStorage === "loading" ||
      catalogStorage === "error"
    ) return;

    if (!sharedCatalogAvailable.current) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      return;
    }

    const timeout = window.setTimeout(() => {
      const revision = catalogRevision.current;
      const catalogSnapshot = productsRef.current;
      setCatalogStorage("saving");
      void fetch("/api/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: catalogSnapshot }),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "The shared catalog could not be saved.");
          }
          productsDirty.current = catalogRevision.current !== revision;
          setCatalogStorage("shared");
          setCatalogError(null);
        })
        .catch((error: unknown) => {
          console.error("[Catalog] Product changes could not be synced:", error);
          setCatalogStorage("error");
          setCatalogError(
            error instanceof Error ? error.message : "Product changes could not be synced.",
          );
        });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [products, isHydrated, catalogStorage, syncAttempt]);

  const updateSiteSettings = useCallback((updates: Partial<SiteConfig>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    catalogRevision.current += 1;
    productsDirty.current = true;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  }, []);

  const addProduct = useCallback((product: Product) => {
    catalogRevision.current += 1;
    productsDirty.current = true;
    setProducts((prev) => [...prev, product]);
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    catalogRevision.current += 1;
    productsDirty.current = true;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const retryCatalogSync = useCallback(() => {
    if (sharedCatalogAvailable.current) {
      setCatalogStorage("shared");
      productsDirty.current = true;
      setSyncAttempt((attempt) => attempt + 1);
      return;
    }

    void fetch("/api/catalog", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "The catalog could not be loaded from the server.");
        }
        if (data.shared !== true || !Array.isArray(data.products)) {
          setCatalogStorage("local");
          setCatalogError("Shared catalog storage is not configured.");
          return;
        }
        const sharedProducts = migrateProducts(data.products);
        setProducts(sharedProducts);
        sharedCatalogAvailable.current = true;
        productsDirty.current = false;
        setCatalogStorage("shared");
        setCatalogError(null);
      })
      .catch((error: unknown) => {
        console.error("[Catalog] Shared catalog retry failed:", error);
        setCatalogStorage("error");
        setCatalogError(
          error instanceof Error ? error.message : "The shared catalog is unavailable.",
        );
      });
  }, []);

  const resetSiteSettings = useCallback(() => {
    setSiteSettings(defaultSiteConfig);
    localStorage.removeItem(STORAGE_KEY_SITE);
  }, []);

  const resetProducts = useCallback(() => {
    catalogRevision.current += 1;
    productsDirty.current = true;
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
        catalogStorage,
        catalogError,
        retryCatalogSync,
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
