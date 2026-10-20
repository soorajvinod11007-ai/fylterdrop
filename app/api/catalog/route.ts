import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-session";
import { products as defaultProducts, productCategories, type Product } from "@/data/products";
import { isSharedCatalogConfigured, readSharedCatalog, writeSharedCatalog } from "@/lib/supabase-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSharedCatalogConfigured()) {
    return NextResponse.json({ products: defaultProducts, shared: false });
  }

  try {
    const catalog = await readSharedCatalog();
    return NextResponse.json({ products: catalog, shared: true });
  } catch (error) {
    console.error("[Catalog] Failed to load shared products:", error);
    return NextResponse.json(
      { message: "The shared product catalog could not be loaded." },
      { status: 503 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return NextResponse.json({ message: "Admin authentication is required." }, { status: 401 });
  }

  if (!isSharedCatalogConfigured()) {
    return NextResponse.json(
      { message: "Shared catalog storage is not configured." },
      { status: 503 },
    );
  }

  let payload: { products?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    !Array.isArray(payload.products) ||
    payload.products.length > 500 ||
    !payload.products.every(isProduct)
  ) {
    return NextResponse.json({ message: "Product catalog data is invalid." }, { status: 400 });
  }

  try {
    await writeSharedCatalog(payload.products);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Catalog] Failed to save shared products:", error);
    return NextResponse.json(
      { message: "The shared product catalog could not be saved." },
      { status: 503 },
    );
  }
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Partial<Product>;
  return (
    typeof product.id === "string" &&
    typeof product.slug === "string" &&
    typeof product.sku === "string" &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    productCategories.includes(product.category as (typeof productCategories)[number]) &&
    typeof product.price === "number" &&
    Array.isArray(product.images) &&
    product.images.every((image) => typeof image === "string") &&
    typeof product.shortDescription === "string" &&
    typeof product.description === "string" &&
    Array.isArray(product.features) &&
    typeof product.specifications === "object" &&
    product.specifications !== null &&
    typeof product.featured === "boolean" &&
    typeof product.trending === "boolean" &&
    typeof product.newArrival === "boolean" &&
    typeof product.stockStatus === "string" &&
    (product.kidsCollection === undefined || typeof product.kidsCollection === "boolean")
  );
}
