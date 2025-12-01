import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <aside className="hidden w-60 flex-col border-r border-zinc-800 bg-zinc-950/80 px-4 py-5 md:flex">
        <div className="mb-6">
          <Link href="/app" className="text-sm font-semibold tracking-tight">
            site-ai-chatbot
          </Link>
          <p className="mt-1 text-xs text-zinc-500">AI chatbots for any site.</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <Link
            href="/app"
            className="rounded-md px-2 py-1.5 text-zinc-200 hover:bg-zinc-800/80"
          >
            Overview
          </Link>
          <Link
            href="/app/bots"
            className="rounded-md px-2 py-1.5 text-zinc-400 hover:bg-zinc-800/80"
          >
            Bots
          </Link>
          <Link
            href="/app/data"
            className="rounded-md px-2 py-1.5 text-zinc-400 hover:bg-zinc-800/80"
          >
            Data sources
          </Link>
          <Link
            href="/app/settings"
            className="rounded-md px-2 py-1.5 text-zinc-400 hover:bg-zinc-800/80"
          >
            Settings
          </Link>
        </nav>
        <form action="/api/auth/logout" method="post" className="mt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 ring-1 ring-zinc-700 hover:bg-zinc-800"
          >
            Log out
          </button>
        </form>
      </aside>
      <main className="flex-1 px-4 py-5 md:px-8 md:py-6">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-lg font-semibold tracking-tight">
              {user.name || user.email}
            </h1>
          </div>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
}
