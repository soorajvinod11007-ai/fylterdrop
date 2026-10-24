import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin, hasValidAdminSession } from "@/lib/admin-session";
import {
  createSignedProductImageUpload,
  type ProductImageContentType,
} from "@/lib/supabase-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedContentTypes: ProductImageContentType[] = [
  "image/webp",
  "image/svg+xml",
];

function isAllowedContentType(value: unknown): value is ProductImageContentType {
  return allowedContentTypes.some((contentType) => contentType === value);
}

function noStoreJson(body: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
  });
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return noStoreJson({ message: "Admin authentication is required." }, 401);
  }

  if (!hasSameOrigin(request)) {
    return noStoreJson({ message: "Request origin is not allowed." }, 403);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return noStoreJson(
      { message: "Image uploads need the Supabase public anon key configured." },
      503,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return noStoreJson({ message: "Request body must be valid JSON." }, 400);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("contentType" in payload) ||
    !isAllowedContentType(payload.contentType)
  ) {
    return noStoreJson({ message: "Image file type is not supported." }, 400);
  }

  try {
    const upload = await createSignedProductImageUpload(
      payload.contentType,
    );
    return noStoreJson(upload);
  } catch (error) {
    console.error("[Catalog] Could not create a signed image upload:", error);
    return noStoreJson(
      {
        message:
          "Image storage is unavailable. Confirm that the Supabase image bucket migration has been applied.",
      },
      503,
    );
  }
}
