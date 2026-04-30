import { NextResponse } from "next/server";

import { ENDPOINTS } from "@/constants/endpoints";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${ENDPOINTS.API}/api/osint/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");

      return NextResponse.json(
        { error: `Failed to upload data: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading OSINT data:", error);

    return NextResponse.json(
      { error: "Internal server error while uploading data" },
      { status: 500 }
    );
  }
}
