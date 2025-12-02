import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export const metadata = {
  title: "Analytics | site-ai-chatbot",
};

export default async function AnalyticsPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  const [botCount, docCount] = await Promise.all([
    prisma.bot.count({ where: { userId: user.id } }),
    prisma.document.count({ where: { bot: { userId: user.id } } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-zinc-400">
          A lightweight overview of your bots and data footprint. This is a shell for a
          richer analytics story.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Bots
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{botCount}</p>
          <p className="mt-1 text-xs text-zinc-400">
            Total bots you&apos;ve created in this workspace.
          </p>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Documents
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{docCount}</p>
          <p className="mt-1 text-xs text-zinc-400">
            Connected documents across all bots.
          </p>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Engagement (planned)
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            Future metrics like conversations, resolved sessions, and CTR on suggested
            links will surface here.
          </p>
        </section>
      </div>
    </div>
  );
}
