"use client";

import { useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: historyPayload }),
      });

      if (!res.ok) {
        setError("Chat backend error. Configure OPENAI_API_KEY on the server.");
        setIsSending(false);
        return;
      }

      const data = (await res.json()) as { reply?: string };
      const assistantText = data.reply ?? "(no response)";

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("Network error while talking to /api/chat.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-6 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Live chat preview
            </p>
            <p className="text-xs text-zinc-400">
              This is wired to /api/chat and uses your OPENAI_API_KEY.
            </p>
          </div>
        </div>
        <div className="mt-2 flex-1 space-y-2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm">
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Start a conversation to see how the assistant responds.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="flex gap-2">
                  <span className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    {m.role === "user" ? "You" : "Bot"}
                  </span>
                  <p className="text-sm text-zinc-100">{m.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <form onSubmit={handleSend} className="flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
          placeholder="Ask something about your product, FAQs, or content..."
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-50 px-3 text-xs font-medium text-zinc-950 disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
