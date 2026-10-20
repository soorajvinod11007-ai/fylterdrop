"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 1. Log client error to console
    console.error("[Fylter Runtime Error]:", error);

    // 2. Dispatch to server-side telemetry endpoint
    try {
      fetch("/api/telemetry/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: typeof window !== "undefined" ? window.location.href : "",
        }),
      }).catch(() => {
        // Fail silently so error boundary rendering isn't disrupted
      });
    } catch {
      // Ignore
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-fylter-darkest">
      <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-red-500/30 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-fylter-offWhite tracking-tight">
            Something went wrong
          </h2>
          <p className="text-xs text-fylter-muted mt-2 leading-relaxed">
            An unexpected error occurred while rendering this page. You can try refreshing or returning to the home page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-3d-gold px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl glass-panel border border-fylter-border/60 text-xs font-bold text-fylter-paleGold hover:text-white uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
