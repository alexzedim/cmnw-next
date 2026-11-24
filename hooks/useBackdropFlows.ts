"use client";

import type { BackdropFlows } from "@/lib/types";

import useSWR from "swr";

import { ENDPOINTS } from "@/constants/endpoints";
import { clientFetch } from "@/lib/api/origins";

/**
 * Fetches the backdrop payload pools (recent characters / guilds / orders)
 * used by the home flow schemas. No interval polling — each request costs the
 * backend a pass over `market`, and the pools only seed chips, so staleness
 * is invisible.
 */
const fetchBackdropFlows = async (): Promise<BackdropFlows> => {
  const response = await clientFetch(ENDPOINTS.BACKDROP_FLOWS_PATH, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Backdrop flow payloads are unavailable");
  }

  return response.json();
};

export const useBackdropFlows = () =>
  useSWR<BackdropFlows>(ENDPOINTS.BACKDROP_FLOWS_PATH, fetchBackdropFlows, {
    revalidateOnFocus: false,
  });
