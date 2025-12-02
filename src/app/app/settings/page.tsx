import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";

export const metadata = {
  title: "Settings | site-ai-chatbot",
};

export default async function SettingsPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Account details and high-level defaults for your bots and embeds.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold text-zinc-100">Account</h3>
          <dl className="mt-2 space-y-2 text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-400">Name</dt>
              <dd className="font-medium text-zinc-100">{user.name || "(not set)"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-400">Email</dt>
              <dd className="font-medium text-zinc-100">{user.email}</dd>
            </div>
          </dl>
        </section>
        <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <h3 className="text-sm font-semibold text-zinc-100">Embed defaults</h3>
          <p className="mt-1 text-xs text-zinc-400">
            This is a UI shell for theme and behavior settings that will be applied to new
            bots and embeds.
          </p>
          <ul className="mt-2 space-y-2 text-xs text-zinc-300">
            <li className="flex items-center justify-between">
              <span>Theme</span>
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-200">
                Dark (coming soon)
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Position</span>
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-200">
                Bottom-right
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Sound</span>
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-200">
                Disabled (coming soon)
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
