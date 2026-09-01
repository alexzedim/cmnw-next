import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/backdrop/flows — recently-updated entities used as
 * payload chips by the home backdrop flow schemas.
 */
export async function GET(_request: NextRequest) {
  try {
    const response = await serverFetch("/api/app/backdrop/flows", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch backdrop flows: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching backdrop flows" },
      { status: 500 }
    );
  }
}
