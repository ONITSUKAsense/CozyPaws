import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles, Wrench, ShoppingBag } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { useTranslation } from "../../i18n/LanguageContext";
import type { ChatMessage } from "../../types/chat";

function formatPrice(n: number) {
  return `¥${n.toFixed(2)}`;
}

function ToolCallChip({ tool }: { tool: NonNullable<ChatMessage["toolCalls"]>[number] }) {
  const { t } = useTranslation();
  return (
    <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
        <Wrench className="w-3.5 h-3.5" />
        {t("chat.toolCall")}：{tool.name}
      </div>
      {tool.input && <div className="mt-1 text-amber-600 truncate">{tool.input}</div>}
    </div>
  );
}

function SourceCard({ p }: { p: NonNullable<ChatMessage["sources"]>[number] }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#EFFDF0] border border-green-200 px-3 py-2">
      <ShoppingBag className="w-4 h-4 shrink-0 text-[#E86A10]" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-800 truncate">{p.name}</div>
        <div className="text-xs text-gray-500">
          {p.categoryName && <span>{p.categoryName} · </span>}
          {formatPrice(p.price)}
        </div>
      </div>
      <a
        href={`/product/${p.id}`}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 text-xs text-[#E86A10] font-medium hover:underline"
      >
        {t("chat.view")}
      </a>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const { t } = useTranslation();
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#E86A10] text-white rounded-br-sm"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
        }`}
      >
        {msg.content || (msg.streaming ? "" : "…")}
        {msg.streaming && (
          <span className="inline-block w-2 h-4 ml-0.5 align-middle animate-pulse bg-gray-400" />
        )}
        {msg.error && <div className="mt-1 text-xs text-red-500">{msg.error}</div>}
        {msg.toolCalls?.map((t, i) => <ToolCallChip key={i} tool={t} />)}
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {t("chat.sources")}
            </div>
            {msg.sources.slice(0, 3).map((p) => (
              <SourceCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { t } = useTranslation();
  const { open, toggleOpen, messages, streaming, sendMessage, resetSession } = useChatStore();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const onSubmit = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#E86A10] text-white shadow-lg hover:bg-[#d55f0a] transition-colors flex items-center justify-center"
        aria-label={t("chat.title")}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl bg-[#F7FBF7] border border-gray-200 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#E86A10] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-900">{t("chat.title")}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 在线
                </div>
              </div>
            </div>
            <button
              onClick={resetSession}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title={t("chat.newChat")}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500 bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-3">
                {t("chat.welcome")}
              </div>
            )}
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder={t("chat.placeholder")}
                disabled={streaming}
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-[#E86A10] disabled:opacity-60"
              />
              <button
                onClick={onSubmit}
                disabled={streaming || !input.trim()}
                className="w-9 h-9 rounded-full bg-[#E86A10] text-white flex items-center justify-center hover:bg-[#d55f0a] disabled:opacity-40 transition-colors shrink-0"
                aria-label={t("chat.send")}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
