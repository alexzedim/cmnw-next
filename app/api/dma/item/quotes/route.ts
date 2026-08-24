import { NextRequest, NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/origins";

/**
 * Passthrough for /api/dma/item/quotes. Must exist as a static segment so
 * the dynamic /api/dma/item/[id] route does not swallow it (it would forward
 * id="quotes" and drop the real ?id= query param).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const response = await serverFetch(`/api/dma/item/quotes?${searchParams}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to fetch item quotes: ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching item quotes" },
      { status: 500 }
    );
  }
}
