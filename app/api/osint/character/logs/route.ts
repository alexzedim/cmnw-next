import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const guid = searchParams.get("guid");

  if (!guid) {
    return NextResponse.json(
      { error: "guid parameter is required" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({ guid });

    const response = await serverFetch(`/api/osint/character/logs?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch character logs: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching character logs" },
      { status: 500 }
    );
  }
}
