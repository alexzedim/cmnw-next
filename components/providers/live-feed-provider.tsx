"use client";

import type { ReactNode } from "react";
import type { FeedEvent } from "@/types/feed";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getWsFeedUrl } from "@/lib/api/origins";
import { getClientSessionId } from "@/lib/session/client-session";
import { isFeedEvent } from "@/types/feed";

const MAX_MESSAGES = 50;

export type LiveFeedStatus = "connecting" | "open" | "closed";

type LiveFeedContextValue = {
  messages: FeedEvent[];
  status: LiveFeedStatus;
  clear: () => void;
};

const LiveFeedContext = createContext<LiveFeedContextValue | undefined>(
  undefined
);

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

export const LiveFeedProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<FeedEvent[]>([]);
  const [status, setStatus] = useState<LiveFeedStatus>("closed");

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualCloseRef = useRef(false);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    manualCloseRef.current = false;
    let socket: WebSocket;

    try {
      socket = new WebSocket(getWsFeedUrl(getClientSessionId()));
    } catch {
      scheduleReconnect();

      return;
    }

    socketRef.current = socket;
    setStatus("connecting");

    socket.onopen = () => {
      reconnectAttemptRef.current = 0;
      setStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (!isFeedEvent(parsed)) return;
        setMessages((prev) => {
          const next = [parsed, ...prev];

          return next.length > MAX_MESSAGES
            ? next.slice(0, MAX_MESSAGES)
            : next;
        });
      } catch {
        // ignore malformed payloads
      }
    };

    socket.onclose = () => {
      setStatus("closed");
      socketRef.current = null;
      if (!manualCloseRef.current) {
        scheduleReconnect();
      }
    };

    socket.onerror = () => {
      // onclose will follow and trigger reconnect
    };
  }, []);

  const scheduleReconnect = useCallback(() => {
    clearReconnectTimer();
    const attempt = reconnectAttemptRef.current + 1;

    reconnectAttemptRef.current = attempt;
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** (attempt - 1),
      RECONNECT_MAX_MS
    );

    reconnectTimerRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [clearReconnectTimer, connect]);

  useEffect(() => {
    connect();

    return () => {
      manualCloseRef.current = true;
      clearReconnectTimer();
      const socket = socketRef.current;

      if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
      socketRef.current = null;
    };
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  const value = useMemo(
    () => ({ messages, status, clear }),
    [clear, messages, status]
  );

  return (
    <LiveFeedContext.Provider value={value}>
      {children}
    </LiveFeedContext.Provider>
  );
};

export const useLiveFeed = (): LiveFeedContextValue => {
  const context = useContext(LiveFeedContext);

  if (!context) {
    throw new Error("useLiveFeed must be used within a LiveFeedProvider");
  }

  return context;
};
