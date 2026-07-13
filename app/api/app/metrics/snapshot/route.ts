import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/metrics/snapshot — forwards category, metricType,
 * and realmId query params to the backend. Returns null when the backend has
 * no snapshot row (the client treats empty as "no snapshot").
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await serverFetch(
      `/api/app/metrics/snapshot?${searchParams}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch metric snapshot: ${errorText}` },
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
      { error: "Internal server error while fetching metric snapshot" },
      { status: 500 }
    );
  }
}
