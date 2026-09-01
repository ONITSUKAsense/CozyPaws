import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, ChatSourceProduct } from "../types/chat";
import { streamChat } from "../api/chat";

interface ChatState {
  sessionId: string;
  open: boolean;
  messages: ChatMessage[];
  streaming: boolean;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  resetSession: () => void;
}

const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const patchAssistant = (id: string, patch: Partial<ChatMessage>) => (state: ChatState) => ({
  messages: state.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessionId: "",
      open: false,
      messages: [],
      streaming: false,

      toggleOpen: () => set((s) => ({ open: !s.open })),
      setOpen: (open) => set({ open }),

      resetSession: () => set({ sessionId: "", messages: [], streaming: false }),

      sendMessage: async (text) => {
        const trimmed = text.trim();
        if (!trimmed || get().streaming) return;

        const userMsg: ChatMessage = {
          id: genId(),
          role: "user",
          content: trimmed,
          createdAt: Date.now(),
        };
        const assistantMsg: ChatMessage = {
          id: genId(),
          role: "assistant",
          content: "",
          streaming: true,
          createdAt: Date.now(),
        };

        set((s) => ({
          messages: [...s.messages, userMsg, assistantMsg],
          streaming: true,
        }));

        try {
          await streamChat(
            trimmed,
            get().sessionId || undefined,
            {
              onMeta: (meta) => set({ sessionId: meta.sessionId }),
              onSources: (products: ChatSourceProduct[]) =>
                set(patchAssistant(assistantMsg.id, { sources: products })),
              onTool: (tool) =>
                set(
                  patchAssistant(assistantMsg.id, {
                    toolCalls: [...(get().messages.find((m) => m.id === assistantMsg.id)?.toolCalls ?? []), tool],
                  })
                ),
              onToken: (delta) =>
                set(
                  patchAssistant(assistantMsg.id, {
                    content: get().messages.find((m) => m.id === assistantMsg.id)?.content + delta,
                  })
                ),
              onError: (code, message) =>
                set(patchAssistant(assistantMsg.id, { error: `[${code}] ${message}` })),
            },
            undefined
          );
        } catch (e) {
          set(
            patchAssistant(assistantMsg.id, {
              error: (e as Error).message,
              streaming: false,
            })
          );
        } finally {
          set((s) => ({
            messages: s.messages.map((m) =>
              m.id === assistantMsg.id ? { ...m, streaming: false } : m
            ),
            streaming: false,
          }));
        }
      },
    }),
    {
      name: "cozypaws-chat",
      partialize: (s) => ({ sessionId: s.sessionId, messages: s.messages }),
    }
  )
);
