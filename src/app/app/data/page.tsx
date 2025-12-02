import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export const metadata = {
  title: "Data sources | site-ai-chatbot",
};

export default async function DataPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  const bots = await prisma.bot.findMany({
    where: { userId: user.id },
    include: { documents: true },
    orderBy: { createdAt: "desc" },
  });

  const docs = bots.flatMap((bot) =>
    bot.documents.map((doc) => ({
      ...doc,
      botName: bot.name,
    })),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Data sources</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Connect content that your bots can learn from. This is an early skeleton for
          uploads, URLs, and crawled pages.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-100">Attached documents</h3>
          {docs.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No documents yet. Once you attach uploads or URLs to a bot, they&apos;ll show
              up here.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2"
                >
                  <div>
                    <p className="text-zinc-100">{doc.title}</p>
                    <p className="text-[11px] text-zinc-500">
                      {doc.sourceType} • {doc.sourceRef} • Bot: {doc.botName}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Quick text upload</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Attach a small .txt file to a bot. This is a minimal ingestion flow used for
              the current retrieval demo.
            </p>
          </div>
          {bots.length === 0 ? (
            <p className="text-xs text-zinc-500">
              Create a bot first on the Bots page before uploading data.
            </p>
          ) : (
            <form
              action="/api/data/upload"
              method="post"
              encType="multipart/form-data"
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label htmlFor="botId" className="font-medium text-zinc-200">
                  Bot
                </label>
                <select
                  id="botId"
                  name="botId"
                  className="h-8 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100 outline-none focus:border-zinc-500"
                >
                  {bots.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="file" className="font-medium text-zinc-200">
                  Text or PDF file (.txt, .pdf)
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".txt,.pdf,application/pdf"
                  required
                  className="block w-full text-xs text-zinc-300 file:mr-2 file:rounded-md file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-100 hover:file:bg-zinc-700"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-8 items-center justify-center rounded-md bg-zinc-50 px-3 text-[11px] font-medium text-zinc-950 hover:bg-zinc-200"
              >
                Upload and chunk
              </button>
            </form>
          )}
        </section>
        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Planned connectors</h3>
            <p className="mt-1 text-xs text-zinc-400">
              This is a roadmap view so recruiters can see how the product will grow.
              Implementations will plug into this layout.
            </p>
          </div>
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="rounded-md border border-zinc-800/80 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">File uploads</p>
              <p className="mt-1 text-zinc-400">
                PDF and text uploads, chunked and embedded into a vector store per bot.
              </p>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">Website URLs</p>
              <p className="mt-1 text-zinc-400">
                Add URLs to crawl and keep in sync. Great for marketing sites and docs.
              </p>
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-950/60 p-3">
              <p className="font-medium text-zinc-100">Knowledge packs</p>
              <p className="mt-1 text-zinc-400">
                Curated Q&A packs for onboarding, support, or product-specific flows.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
