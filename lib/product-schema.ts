import { z } from "zod";
import { productCategories } from "@/data/products";

export const MAX_CATALOG_PRODUCTS = 2_000;

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createFallbackProductSlug(name: string, id: string): string {
  const namePart = slugify(name).slice(0, 100).replace(/-+$/g, "");
  const idPart = slugify(id).slice(0, 80).replace(/-+$/g, "") || "product";
  return `${namePart || "product"}-${idPart}`;
}

export const productSchema = z.object({
  id: z.string().trim().min(1).max(100),
  slug: z.string().trim().max(200).optional(),
  sku: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(300),
  category: z.enum(productCategories),
  kidsCollection: z.boolean().optional(),
  isCombo: z.boolean().optional(),
  comboProductIds: z.array(z.string().min(1).max(100)).max(100).optional(),
  price: z.number().finite().min(0).max(10_000_000),
  oldPrice: z.number().finite().min(0).max(10_000_000).optional(),
  discount: z.number().finite().min(0).max(100).optional(),
  images: z.array(z.string().min(1).max(7_000_000)).max(20),
  shortDescription: z.string().max(2_000),
  description: z.string().max(20_000),
  features: z.array(z.string().max(500)).max(100),
  specifications: z.record(z.string().max(100), z.string().max(2_000)).refine(
    (specifications) => Object.keys(specifications).length <= 100,
  ),
  variants: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        values: z.array(z.string().max(200)).max(100),
      }).strict(),
    )
    .max(20)
    .optional(),
  featured: z.boolean(),
  trending: z.boolean(),
  newArrival: z.boolean(),
  stockStatus: z.enum(["In Stock", "Low Stock", "Pre-Order"]),
  rating: z.number().finite().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).max(1_000_000_000).optional(),
}).strict().transform((product) => ({
  ...product,
  slug: product.slug?.trim() || createFallbackProductSlug(product.name, product.id),
}));

export const productListSchema = z.array(productSchema).max(MAX_CATALOG_PRODUCTS);
export const catalogPayloadSchema = z.object({ products: productListSchema }).strict();

export function formatProductValidationError(
  error: z.ZodError,
  products: unknown[] = [],
): string {
  const maxIssues = 5;
  const details = error.issues.slice(0, maxIssues).map((issue) => {
    const productPathOffset = issue.path[0] === "products" ? 1 : 0;
    const productIndex =
      typeof issue.path[productPathOffset] === "number"
        ? issue.path[productPathOffset]
        : null;
    if (productIndex === null) {
      return `Catalog: ${issue.message}`;
    }

    const product = products[productIndex];
    const productRecord =
      product && typeof product === "object" && !Array.isArray(product)
        ? (product as Record<string, unknown>)
        : null;
    const label =
      (typeof productRecord?.sku === "string" && productRecord.sku.trim()) ||
      (typeof productRecord?.name === "string" && productRecord.name.trim()) ||
      `#${productIndex + 1}`;
    const field = issue.path.slice(productPathOffset + 1).join(".") || "product";
    return `Product ${productIndex + 1} (${label}), ${field}: ${issue.message}`;
  });

  const remaining = error.issues.length - details.length;
  return `Catalog validation failed: ${details.join("; ")}${
    remaining > 0 ? `; and ${remaining} more issue${remaining === 1 ? "" : "s"}` : ""
  }`;
}
