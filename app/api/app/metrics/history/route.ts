import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/metrics/history — forwards category, metricType,
 * realmId, fromDate, and toDate query params to the backend.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await serverFetch(
      `/api/app/metrics/history?${searchParams}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch metric history: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching metric history" },
      { status: 500 }
    );
  }
}
