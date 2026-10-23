import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 16 * 1024;

interface TelemetryPayload {
  message?: string;
  stack?: string;
  digest?: string;
  url?: string;
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, message: "Request payload is too large." }, { status: 413 });
  }

  let body: string;
  try {
    body = await readLimitedBody(req, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ success: false, message: "Request payload is too large." }, { status: 413 });
    }
    console.error("[Telemetry] Request body could not be read:", error);
    return NextResponse.json({ success: false, message: "Request payload could not be read." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ success: false, message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isTelemetryPayload(payload)) {
    return NextResponse.json({ success: false, message: "Request payload is invalid." }, { status: 400 });
  }

  const reportedPath = getSameOriginPath(payload.url, req.nextUrl.origin);

  console.error("[TELEMETRY - Client Exception Captured]:", {
    timestamp: new Date().toISOString(),
    digest: payload.digest || null,
    message: payload.message || "Unknown error",
    stack: payload.stack || null,
    url: reportedPath,
    userAgent: req.headers.get("user-agent") || null,
  });

  const webhookUrl = process.env.ERROR_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Fylter production error\nMessage: ${payload.message || "Unknown error"}\nURL: ${reportedPath || "Unavailable"}\nTime: ${new Date().toISOString()}`,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (error) {
      console.error("[Telemetry] Failed to forward error to webhook:", error);
    }
  }

  return NextResponse.json({ success: true, logged: true });
}

class PayloadTooLargeError extends Error {}

async function readLimitedBody(request: NextRequest, maxBytes: number): Promise<string> {
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

function isTelemetryPayload(value: unknown): value is TelemetryPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  const allowedKeys = new Set(["message", "stack", "digest", "url"]);
  if (Object.keys(payload).some((key) => !allowedKeys.has(key))) return false;

  return (
    (payload.message === undefined || (typeof payload.message === "string" && payload.message.length <= 2000)) &&
    (payload.stack === undefined || (typeof payload.stack === "string" && payload.stack.length <= 8000)) &&
    (payload.digest === undefined || (typeof payload.digest === "string" && payload.digest.length <= 200)) &&
    (payload.url === undefined || (typeof payload.url === "string" && payload.url.length <= 2048))
  );
}

function getSameOriginPath(urlValue: string | undefined, expectedOrigin: string): string | null {
  if (!urlValue) return null;

  try {
    const url = new URL(urlValue);
    return url.origin === expectedOrigin ? `${url.pathname}${url.search}` : null;
  } catch {
    return null;
  }
}
