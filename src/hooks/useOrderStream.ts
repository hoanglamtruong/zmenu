"use client";

import { useEffect, useRef } from "react";

export type OrderStreamPayload = {
  order_id?: string;
  tenant_id?: string;
  status?: string;
  [key: string]: unknown;
};

export function useOrderStream(
  tenantId: string,
  orderId: string,
  onChange: (payload: OrderStreamPayload) => void
) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!tenantId) return;
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const url = `/api/orders/stream?tenant_id=${encodeURIComponent(tenantId)}`;
    const es = new EventSource(url);

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data) as OrderStreamPayload;
        if (orderId && payload.order_id && payload.order_id !== orderId) return;
        onChangeRef.current(payload);
      } catch {
        // ignore malformed
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects with exponential backoff
    };

    return () => {
      es.close();
    };
  }, [tenantId, orderId]);
}
