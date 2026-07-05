/**
 * Per-browser session identifier, stored in localStorage.
 *
 * Used to route websocket feed events (e.g. interactive character refresh
 * progress) back to the browser that triggered them. Shared across tabs and
 * persisted across restarts — intentionally NOT per-tab.
 */

export const CLIENT_SESSION_KEY = "cmnw:session";

/**
 * Returns the browser's stable session id, creating one on first access.
 * Returns an empty string during SSR / before window is available.
 */
export function getClientSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    let id = window.localStorage.getItem(CLIENT_SESSION_KEY);

    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(CLIENT_SESSION_KEY, id);
    }

    return id;
  } catch {
    // localStorage may be unavailable (private mode, disabled storage) —
    // fall back to empty so the socket connects without a session param.
    return "";
  }
}
