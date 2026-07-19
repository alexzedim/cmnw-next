import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/raid-logs/stats — forwards realmSlug, realmName,
 * and realmId query params to the backend. Returns global totals when no
 * realm parameter is supplied.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await serverFetch(
      `/api/app/raid-logs/stats?${searchParams}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch raid logs stats: ${errorText}` },
        { status: response.status }
      );
    }

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, { status: 200 });
    }

    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching raid logs stats" },
      { status: 500 }
    );
  }
}
