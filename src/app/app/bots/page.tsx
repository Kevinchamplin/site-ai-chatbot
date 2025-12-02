import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export const metadata = {
  title: "Bots | site-ai-chatbot",
};

export default async function BotsPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  const bots = await prisma.bot.findMany({
    where: { userId: user.id },
    include: { tokens: true, documents: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Bots</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Create bots, get embed tokens, and see what content is attached to each one.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="space-y-3">
          {bots.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You don&apos;t have any bots yet. Use the form on the right to create your first one.
            </p>
          ) : (
            bots.map((bot) => {
              const primaryToken = bot.tokens[0]?.token;
              const docCount = bot.documents.length;

              return (
                <article
                  key={bot.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{bot.name}</h3>
                      {bot.description && (
                        <p className="mt-1 text-xs text-zinc-400">{bot.description}</p>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                      Embed snippet
                    </p>
                    {primaryToken ? (
                      <pre className="overflow-x-auto rounded-md bg-zinc-950/80 p-2 text-[11px] text-zinc-200">
                        {`<script src="https://your-domain.com/embed.js" data-bot-token="${primaryToken}"></script>`}
                      </pre>
                    ) : (
                      <p className="text-xs text-zinc-500">No embed token yet.</p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Slug: {bot.slug}</span>
                    <span>Documents: {docCount}</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
        <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold text-zinc-100">Create a bot</h3>
          <p className="text-xs text-zinc-400">
            Start with a simple name and description. You&apos;ll connect data sources and
            tweak behavior later.
          </p>
          <form action="/api/bots" method="post" className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-zinc-200">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-medium text-zinc-200">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                placeholder="What should this bot help your visitors with?"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-50 px-3 text-xs font-medium text-zinc-950 hover:bg-zinc-200"
            >
              Create bot
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
