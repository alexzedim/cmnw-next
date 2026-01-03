import { NextRequest, NextResponse } from "next/server";

import { ENDPOINTS } from "@/constants/endpoints";

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
    const apiUrl = new URL(`${ENDPOINTS.API}/api/osint/guild/logs`);

    apiUrl.searchParams.set("guid", guid);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch guild logs: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching guild logs:", error);

    return NextResponse.json(
      { error: "Internal server error while fetching guild logs" },
      { status: 500 }
    );
  }
}
