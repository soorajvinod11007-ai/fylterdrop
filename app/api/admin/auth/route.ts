import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  hasSameOrigin,
  hashAdminLoginAddress,
  hasValidAdminSession,
} from "@/lib/admin-session";
import {
  checkAdminLoginAttempt,
  clearAdminLoginAttempts,
  isSharedCatalogConfigured,
} from "@/lib/supabase-catalog";

export const runtime = "nodejs";

function noStoreJson(body: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
  });
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return noStoreJson({ success: false, message: "Request origin is not allowed." }, 403);
  }

  const adminPin = process.env.ADMIN_PIN;
  const session = createAdminSession();
  if (!adminPin || adminPin.trim().length < 12 || !session) {
    return noStoreJson(
      { success: false, message: "Admin authentication is not securely configured on this deployment." },
      503,
    );
  }
  if (process.env.NODE_ENV === "production" && !isSharedCatalogConfigured()) {
    return noStoreJson(
      { success: false, message: "Secure admin login requires the shared storage service." },
      503,
    );
  }

  let payload: { pin?: unknown };
  try {
    payload = await request.json();
  } catch {
    return noStoreJson({ success: false, message: "Invalid request payload." }, 400);
  }

  if (typeof payload.pin !== "string" || payload.pin.length > 128) {
    return noStoreJson({ success: false, message: "Invalid request payload." }, 400);
  }

  const forwardedAddresses = request.headers.get("x-forwarded-for")?.split(",");
  const forwardedAddress = forwardedAddresses?.[forwardedAddresses.length - 1]?.trim();
  const address =
    request.headers.get("x-real-ip")?.trim() ||
    forwardedAddress ||
    "unknown";
  const addressHash = hashAdminLoginAddress(address);
  if (!addressHash) {
    return noStoreJson({ success: false, message: "Admin session signing is not configured." }, 503);
  }

  try {
    if (isSharedCatalogConfigured() && !(await checkAdminLoginAttempt(addressHash))) {
      return noStoreJson({ success: false, message: "Too many login attempts. Try again in 15 minutes." }, 429);
    }

    const enteredHash = createHash("sha256").update(payload.pin.trim()).digest();
    const expectedHash = createHash("sha256").update(adminPin.trim()).digest();
    if (!timingSafeEqual(enteredHash, expectedHash)) {
      return noStoreJson({ success: false, message: "Incorrect PIN." }, 401);
    }

    if (isSharedCatalogConfigured()) {
      await clearAdminLoginAttempts(addressHash);
    }

    const response = noStoreJson({ success: true, message: "Authenticated successfully." });
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("[AdminAuth] Login rate limit could not be verified:", error);
    return noStoreJson(
      { success: false, message: "Admin authentication is temporarily unavailable." },
      503,
    );
  }
}

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return noStoreJson({ authenticated: false }, 401);
  }
  return noStoreJson({ authenticated: true });
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return noStoreJson({ success: false, message: "Request origin is not allowed." }, 403);
  }

  const response = noStoreJson({ success: true, message: "Logged out." });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
