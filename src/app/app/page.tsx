import { ChatPanel } from "./ChatPanel";

export const metadata = {
  title: "Dashboard | site-ai-chatbot",
};

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-zinc-400">
          This is your workspace for managing AI bots, embeds, and training data.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Next up
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            We&apos;ll add bot creation, data sources, analytics, and the embeddable widget
            next so you can deploy this for real customers.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Status
          </p>
          <p className="mt-2 text-sm text-zinc-200">Dev environment: local only.</p>
          <p className="mt-1 text-xs text-zinc-500">
            Connect a Postgres + vector store and OpenAI API key to go live.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Embed
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            Soon you&apos;ll get a single JavaScript snippet and token to drop this chat
            widget into any site.
          </p>
        </div>
      </div>
      <ChatPanel />
    </div>
  );
}
