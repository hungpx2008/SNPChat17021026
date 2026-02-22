import { useEffect, useRef } from "react";

/**
 * SSE hook that listens for real-time events on a chat session.
 * When backend Celery tasks complete and publish via Redis Pub/Sub,
 * the SSE endpoint streams `message_ready` events to the frontend.
 *
 * Replaces the old polling loop (30 × 2s = 60s).
 */
export function useSessionStream(
  sessionId: string | null,
  enabled: boolean,
  onMessageReady: () => void,
) {
  const onMessageReadyRef = useRef(onMessageReady);
  onMessageReadyRef.current = onMessageReady;

  useEffect(() => {
    if (!sessionId || !enabled) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const url = `${backendUrl}/sessions/${sessionId}/stream`;

    let es: EventSource;
    try {
      es = new EventSource(url);
    } catch {
      // EventSource not supported or URL invalid — fall back silently
      return;
    }

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "message_ready") {
          onMessageReadyRef.current();
        }
      } catch {
        // Ignore malformed events (heartbeats etc.)
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects on error.
      // No action needed unless we want to surface connectivity issues.
    };

    return () => {
      es.close();
    };
  }, [sessionId, enabled]);
}
