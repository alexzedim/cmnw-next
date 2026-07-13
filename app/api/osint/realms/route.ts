import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/osint/realms — forwards all query params (id, slug,
 * name, region, connectedRealmId, or none for the full list) to the backend.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await serverFetch(`/api/osint/realms?${searchParams}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch realms: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching realms" },
      { status: 500 }
    );
  }
}
