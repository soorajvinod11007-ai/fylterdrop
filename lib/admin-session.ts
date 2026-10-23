import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "fylter_admin_session";
export const ADMIN_SESSION_MAX_AGE = 2 * 60 * 60;

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && Buffer.byteLength(secret) >= 32 ? secret : null;
}

export function createAdminSession(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const token = createHmac("sha256", secret)
    .update(randomBytes(32))
    .digest("hex");
  const signature = createHmac("sha256", secret).update(`${token}.${expiresAt}`).digest("hex");
  return `${token}.${expiresAt}.${signature}`;
}

export function hasValidAdminSession(request: NextRequest): boolean {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function isValidAdminSession(session: string | undefined): boolean {
  const secret = getSessionSecret();
  if (!secret || !session) return false;

  const [token, expiresAtValue, signature, ...extra] = session.split(".");
  if (!token || !expiresAtValue || !signature || extra.length > 0) return false;
  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const expected = createHmac("sha256", secret).update(`${token}.${expiresAtValue}`).digest();
  const supplied = Buffer.from(signature, "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function hashAdminLoginAddress(address: string): string | null {
  const secret = getSessionSecret();
  return secret ? createHmac("sha256", secret).update(address).digest("hex") : null;
}
