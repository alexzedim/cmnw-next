import { NextRequest, NextResponse } from "next/server";

import { ENDPOINTS } from "@/constants/endpoints";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "id parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = new URL(`${ENDPOINTS.API}/api/dma/item`);

    apiUrl.searchParams.set("id", id);

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
        { error: `Failed to fetch item: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching item:", error);

    return NextResponse.json(
      { error: "Internal server error while fetching item" },
      { status: 500 }
    );
  }
}
