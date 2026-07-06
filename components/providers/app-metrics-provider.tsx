"use client";

import type { ReactNode } from "react";
import type { AppHealthPayload } from "@/lib/types";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ENDPOINTS } from "@/constants/endpoints";
import { clientFetch } from "@/lib/api/origins";

type AppMetricsStatus = "loading" | "online" | "degraded" | "error";

type AppMetricsContextValue = {
  metrics: AppHealthPayload | null;
  status: AppMetricsStatus;
  isLoading: boolean;
  hasError: boolean;
  refresh: () => Promise<void>;
};

const AppMetricsContext = createContext<AppMetricsContextValue | undefined>(
  undefined
);

const isAbortError = (error: unknown) =>
  typeof DOMException !== "undefined" &&
  error instanceof DOMException &&
  error.name === "AbortError";

export const AppMetricsProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<AppHealthPayload | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadMetrics = useCallback(async (signal?: AbortSignal) => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      const response = await clientFetch(ENDPOINTS.METRICS_PATH, {
        signal,
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }

      const payload: AppHealthPayload = await response.json();

      if (!isMountedRef.current) {
        return;
      }

      setMetrics(payload);
      setHasError(false);
    } catch (error: unknown) {
      if (isAbortError(error)) {
        return;
      }

      if (!isMountedRef.current) {
        return;
      }

      setHasError(true);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadMetrics(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadMetrics]);

  const handleRefresh = useCallback(async () => {
    await loadMetrics();
  }, [loadMetrics]);

  const status: AppMetricsStatus = useMemo(() => {
    if (hasError) {
      return "error";
    }

    if (metrics?.status === "ok") {
      return "online";
    }

    if (metrics) {
      return "degraded";
    }

    return "loading";
  }, [hasError, metrics]);

  const value = useMemo(
    () => ({
      metrics,
      status,
      isLoading,
      hasError,
      refresh: handleRefresh,
    }),
    [handleRefresh, hasError, isLoading, metrics, status]
  );

  return (
    <AppMetricsContext.Provider value={value}>
      {children}
    </AppMetricsContext.Provider>
  );
};

export const useAppMetrics = () => {
  const context = useContext(AppMetricsContext);

  if (!context) {
    throw new Error("useAppMetrics must be used within an AppMetricsProvider");
  }

  return context;
};
