import type { ChatSourceProduct } from "../types/chat";

export interface ChatStreamHandlers {
  onMeta?: (meta: { sessionId: string; responseMessageId: string }) => void;
  onSources?: (products: ChatSourceProduct[]) => void;
  onTool?: (tool: { name: string; input: string; outputSummary: string }) => void;
  onToken?: (delta: string) => void;
  onError?: (code: string, message: string) => void;
}

interface SSEBlock {
  type: string;
  data: string;
}

function parseSSEBlock(block: string): SSEBlock {
  let type = "message";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) type = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  return { type, data };
}

/**
 * POST /ai/v1/chat and stream Server-Sent Events.
 * Uses fetch + ReadableStream because EventSource cannot send a POST body.
 */
export async function streamChat(
  message: string,
  sessionId: string | undefined,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch("/ai/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId || null }),
    signal,
  });

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? `请求失败 (HTTP ${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      if (!block.trim()) continue;

      const { type, data } = parseSSEBlock(block);
      if (!data) continue;
      let json: Record<string, unknown>;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }

      switch (type) {
        case "meta":
          handlers.onMeta?.({
            sessionId: String(json.session_id ?? ""),
            responseMessageId: String(json.response_message_id ?? ""),
          });
          break;
        case "sources":
          handlers.onSources?.((json.products as ChatSourceProduct[]) ?? []);
          break;
        case "tool":
          handlers.onTool?.(json as { name: string; input: string; outputSummary: string });
          break;
        case "token":
          handlers.onToken?.(String(json.delta ?? ""));
          break;
        case "error":
          handlers.onError?.(String(json.code ?? "unknown"), String(json.message ?? ""));
          return;
        case "done":
          return;
      }
    }
  }
}
