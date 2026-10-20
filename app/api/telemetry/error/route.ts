import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const errorPayload = await req.json();

    // Log with structured metadata on the server
    console.error("[TELEMETRY - Client Exception Captured]:", {
      timestamp: new Date().toISOString(),
      digest: errorPayload.digest || null,
      message: errorPayload.message || "Unknown error",
      stack: errorPayload.stack || null,
      url: errorPayload.url || null,
      userAgent: req.headers.get("user-agent") || null,
    });

    // In production, forward to your webhook (e.g. Sentry, Discord, Slack, Datadog):
    const webhookUrl = process.env.ERROR_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🚨 **Fylter Production Error Encountered**\n• **Message**: ${errorPayload.message}\n• **URL**: ${errorPayload.url}\n• **Time**: ${new Date().toISOString()}`,
        }),
      }).catch((e) => console.error("Failed to forward telemetry to webhook:", e));
    }

    return NextResponse.json({ success: true, logged: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error tracking endpoint error" }, { status: 500 });
  }
}
