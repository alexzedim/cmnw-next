import type { ToastSeverity } from "@/lib/toast";

import type { Dictionary } from "@/dictionaries";
import { ApiError } from "@/lib/api";

type ToastDict = Dictionary["toast"];

export type { ToastSeverity };

interface ResolvedToast {
  title: string;
  description: string;
  severity: ToastSeverity;
}

/**
 * Map an error to a translated, human-readable toast payload.
 *
 * Inspects the ApiError status code (and, as a last resort, the raw error type)
 * and selects the appropriate translated title/description + severity. This is
 * the single place that decides *what* the user sees when a request fails.
 */
export function resolveApiError(
  toastDict: ToastDict,
  error: unknown,
): ResolvedToast {
  if (error instanceof ApiError) {
    // statusCode 0 => network failure (the client sets it when fetch throws).
    if (error.statusCode === 0) {
      return { ...toastDict.network, severity: "warning" };
    }
    if (error.isNotFound) {
      return { ...toastDict.notFound, severity: "warning" };
    }
    if (error.isUnauthorized || error.isForbidden) {
      return { ...toastDict.forbidden, severity: "danger" };
    }
    if (error.isServerError) {
      return { ...toastDict.server, severity: "danger" };
    }
  }

  // Non-ApiError or unrecognized — generic.
  return { ...toastDict.generic, severity: "danger" };
}

