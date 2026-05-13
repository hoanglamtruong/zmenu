import { NextRequest } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHANNEL = "order_change";
const KEEPALIVE_MS = 25_000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = searchParams.get("tenant_id");

  if (!tenantSlug) {
    return new Response("tenant_id is required", { status: 400 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  const encoder = new TextEncoder();

  let closed = false;
  let keepalive: ReturnType<typeof setInterval> | null = null;

  const cleanup = async () => {
    if (closed) return;
    closed = true;
    if (keepalive) {
      clearInterval(keepalive);
      keepalive = null;
    }
    try {
      await client.query(`UNLISTEN ${CHANNEL}`);
    } catch {
      // ignore
    }
    try {
      await client.end();
    } catch {
      // ignore
    }
  };

  const stream = new ReadableStream({
    async start(controller) {
      const writeRaw = (chunk: string) => {
        if (closed) return false;
        try {
          controller.enqueue(encoder.encode(chunk));
          return true;
        } catch {
          return false;
        }
      };

      const writeEvent = (event: string | null, data: string) => {
        const lines: string[] = [];
        if (event) lines.push(`event: ${event}`);
        for (const line of data.split("\n")) lines.push(`data: ${line}`);
        lines.push("", "");
        return writeRaw(lines.join("\n"));
      };

      try {
        await client.connect();

        const tenantRes = await client.query<{ id: string }>(
          "SELECT id FROM tenants WHERE slug = $1",
          [tenantSlug]
        );
        if (tenantRes.rows.length === 0) {
          writeEvent("error", JSON.stringify({ code: "tenant_not_found" }));
          try {
            controller.close();
          } catch {
            // ignore
          }
          await cleanup();
          return;
        }
        const tenantPgId = tenantRes.rows[0].id;

        client.on("notification", (msg) => {
          if (closed) return;
          if (msg.channel !== CHANNEL || !msg.payload) return;
          try {
            const payload = JSON.parse(msg.payload) as {
              tenant_id?: string;
            };
            if (payload.tenant_id && payload.tenant_id !== tenantPgId) return;
            writeEvent(null, msg.payload);
          } catch {
            // skip malformed
          }
        });

        client.on("error", () => {
          void cleanup();
          try {
            controller.close();
          } catch {
            // ignore
          }
        });

        await client.query(`LISTEN ${CHANNEL}`);
        writeEvent("ready", JSON.stringify({ tenant: tenantSlug }));

        keepalive = setInterval(() => {
          if (!writeRaw(`: keepalive\n\n`)) {
            void cleanup();
          }
        }, KEEPALIVE_MS);
      } catch (err) {
        writeEvent(
          "error",
          JSON.stringify({ code: "init_failed", message: String(err) })
        );
        try {
          controller.close();
        } catch {
          // ignore
        }
        await cleanup();
      }
    },
    async cancel() {
      await cleanup();
    },
  });

  request.signal.addEventListener("abort", () => {
    void cleanup();
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
