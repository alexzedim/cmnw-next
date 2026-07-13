import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/app/search — forwards searchQuery to the backend
 * universal search across characters, guilds, items, and realms.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("searchQuery");

  if (!searchQuery) {
    return NextResponse.json(
      { error: "searchQuery parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await serverFetch(`/api/app/search?${searchParams}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to search: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while searching" },
      { status: 500 }
    );
  }
}
