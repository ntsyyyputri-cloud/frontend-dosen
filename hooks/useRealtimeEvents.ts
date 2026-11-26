"use client";

import { useEffect, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function useRealtimeEvents(
  eventNames: string[],
  onEvent: (eventName: string, data: Record<string, any>) => void
) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const eventKey = eventNames.join(",");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("gradia_token");
    if (!token) return;

    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const connect = () => {
      if (closed) return;
      const url = `${API_BASE_URL}/realtime/stream?token=${encodeURIComponent(token)}`;
      es = new EventSource(url);

      const names = eventKey ? eventKey.split(",") : [];
      names.forEach((name) => {
        es?.addEventListener(name, (ev: MessageEvent) => {
          try {
            const parsed = ev.data ? JSON.parse(ev.data) : {};
            onEventRef.current(name, parsed);
          } catch {
            onEventRef.current(name, {});
          }
        });
      });

      es.onerror = () => {
        es?.close();
        es = null;
        if (!closed) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, [eventKey]);
}
