import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/metrics — backend health/status payload used by
 * the live status indicator.
 */
export async function GET(_request: NextRequest) {
  try {
    const response = await serverFetch("/api/app/metrics", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch app metrics: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching app metrics" },
      { status: 500 }
    );
  }
}
