import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, hasValidAdminSession } from "@/lib/admin-session";
import { isSharedCatalogConfigured, readSharedCatalog, writeSharedCatalog } from "@/lib/supabase-catalog";
import { catalogPayloadSchema } from "@/lib/product-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_CATALOG_BODY_BYTES = 32 * 1024 * 1024;

function noStoreJson(body: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
  });
}

export async function GET() {
  if (!isSharedCatalogConfigured()) {
    return noStoreJson({ products: [], shared: false });
  }

  try {
    const catalog = await readSharedCatalog();
    return noStoreJson({ products: catalog, shared: true });
  } catch (error) {
    console.error("[Catalog] Failed to load shared products:", error);
    return noStoreJson({ message: "The shared product catalog could not be loaded." }, 503);
  }
}

export async function PUT(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return noStoreJson({ message: "Admin authentication is required." }, 401);
  }

  if (!hasSameOrigin(request)) {
    return noStoreJson({ message: "Request origin is not allowed." }, 403);
  }

  if (!isSharedCatalogConfigured()) {
    return noStoreJson({ message: "Shared catalog storage is not configured." }, 503);
  }

  let body: string;
  try {
    body = await readLimitedBody(request, MAX_CATALOG_BODY_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return noStoreJson({ message: "Catalog request is too large." }, 413);
    }
    console.error("[Catalog] Request body could not be read:", error);
    return noStoreJson({ message: "Request body could not be read." }, 400);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return noStoreJson({ message: "Request body must be valid JSON." }, 400);
  }

  const parsedPayload = catalogPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return noStoreJson({ message: "Product catalog data is invalid." }, 400);
  }

  try {
    await writeSharedCatalog(parsedPayload.data.products);
    return noStoreJson({ success: true });
  } catch (error) {
    console.error("[Catalog] Failed to save shared products:", error);
    return noStoreJson({ message: "The shared product catalog could not be saved." }, 503);
  }
}

class PayloadTooLargeError extends Error {}

async function readLimitedBody(request: NextRequest, maxBytes: number): Promise<string> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PayloadTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}
